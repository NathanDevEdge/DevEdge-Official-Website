import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { handleLogin, handleValidateToken } from "./handlers/auth.js";
import {
  handleGetTickets,
  handleCreateTicket,
  handleUpdateTicket,
  handleDeleteTicket,
} from "./handlers/tickets.js";
import {
  handleGetAdmin,
  handleCreateOrg,
  handleCreateUser,
  handleUpdateUserRole,
  handleDeleteUser,
} from "./handlers/admin.js";
import {
  handleCreateInvite,
  handleValidateInvite,
  handleAcceptInvite,
  handleResendInvite,
  handleCancelInvite,
} from "./handlers/invites.js";
import {
  handleForgotPassword,
  handleValidateResetToken,
  handleResetPassword,
} from "./handlers/passwordReset.js";
import { handleGetComments, handleCreateComment } from "./handlers/comments.js";
import { escapeHtml, escapeHtmlMultiline } from "./lib/escapeHtml.js";
import { LEGACY_SERVICE_REDIRECTS } from "../client/src/data/services.js";
import { LEGACY_BLOG_REDIRECTS } from "../client/src/data/blogRedirects.js";
import {
  upload,
  requireAuth,
  handleGetAttachments,
  handleUploadAttachment,
  handleServeAttachment,
  handleDeleteAttachment,
} from "./handlers/attachments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // nginx sits in front of the app, so trust exactly one proxy hop for client IPs
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "100kb" }));

  // ── Rate limits ──────────────────────────────────────────────────────────────
  const limiter = (windowMinutes: number, limit: number) =>
    rateLimit({
      windowMs: windowMinutes * 60 * 1000,
      limit,
      standardHeaders: "draft-7",
      legacyHeaders: false,
      message: { error: "Too many requests, please try again later." },
    });

  app.use("/api", limiter(15, 300));
  const loginLimiter = limiter(15, 10);
  const passwordResetLimiter = limiter(15, 5);
  const inviteLimiter = limiter(15, 20);
  const contactLimiter = limiter(60, 5);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  app.post("/api/auth", loginLimiter, handleLogin);
  app.get("/api/auth", handleValidateToken);

  // ── Tickets ──────────────────────────────────────────────────────────────────
  app.get("/api/tickets", handleGetTickets);
  app.post("/api/tickets", handleCreateTicket);
  app.patch("/api/tickets", handleUpdateTicket);
  app.delete("/api/tickets", handleDeleteTicket);

  // ── Admin ─────────────────────────────────────────────────────────────────────
  app.get("/api/admin", handleGetAdmin);
  app.post("/api/admin", async (req, res) => {
    const { action } = req.body || {};
    if (action === "create_org")   return handleCreateOrg(req, res);
    if (action === "create_user")  return handleCreateUser(req, res);
    if (action === "update_role")  return handleUpdateUserRole(req, res);
    return res.status(400).json({ error: "Missing or invalid action" });
  });
  app.delete("/api/admin", handleDeleteUser);

  // ── Invites ───────────────────────────────────────────────────────────────────
  app.get("/api/invites", handleValidateInvite);
  app.post("/api/invites", inviteLimiter, async (req, res) => {
    const { action } = req.body || {};
    if (action === "create") return handleCreateInvite(req, res);
    if (action === "accept") return handleAcceptInvite(req, res);
    if (action === "resend") return handleResendInvite(req, res);
    return res.status(400).json({ error: "Missing or invalid action" });
  });
  app.delete("/api/invites", handleCancelInvite);

  // ── Password reset ────────────────────────────────────────────────────────────
  app.get("/api/password-reset", handleValidateResetToken);
  app.post("/api/password-reset", passwordResetLimiter, async (req, res) => {
    const { action } = req.body || {};
    if (action === "forgot") return handleForgotPassword(req, res);
    if (action === "reset")  return handleResetPassword(req, res);
    return res.status(400).json({ error: "Missing or invalid action" });
  });

  // ── Comments ─────────────────────────────────────────────────────────────────
  app.get("/api/comments", handleGetComments);
  app.post("/api/comments", handleCreateComment);

  // ── Attachments ───────────────────────────────────────────────────────────────
  app.get("/api/attachments", handleGetAttachments);
  app.post("/api/attachments", requireAuth, upload.single("file"), handleUploadAttachment);
  app.get("/api/attachments/file/:id", handleServeAttachment);
  app.delete("/api/attachments/:id", handleDeleteAttachment);

  // ── Contact ──────────────────────────────────────────────────────────────────
  app.post("/api/contact", contactLimiter, async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body || {};
      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const fields = { name, email, phone: phone ?? "", service, message };
      if (Object.values(fields).some((v) => typeof v !== "string")) {
        return res.status(400).json({ error: "Invalid field types" });
      }
      if (name.length > 200 || email.length > 254 || fields.phone.length > 50 || service.length > 200 || message.length > 5000) {
        return res.status(400).json({ error: "One or more fields are too long" });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email address" });
      }

      const RESEND_API_KEY = process.env.RESEND_API_KEY;
      if (!RESEND_API_KEY) {
        console.log("\n─── New Contact Form Submission ───────────────────");
        console.log(`Name:    ${name}`);
        console.log(`Email:   ${email}`);
        if (phone) console.log(`Phone:   ${phone}`);
        console.log(`Service: ${service}`);
        console.log(`Message: ${message}`);
        console.log("───────────────────────────────────────────────────\n");
        return res.status(200).json({ success: true, message: "Logged (no API key)" });
      }

      const { Resend } = await import("resend");
      const resend = new Resend(RESEND_API_KEY);
      const { error } = await resend.emails.send({
        from: "DevEdge Contact <noreply@devedge.com.au>",
        to: ["info@devedge.com.au"],
        replyTo: email,
        subject: `New enquiry: ${service} from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#1A1008">New Contact Form Submission</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#7A5C3A;width:100px"><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
              <tr><td style="padding:8px 0;color:#7A5C3A"><strong>Email</strong></td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#7A5C3A"><strong>Phone</strong></td><td><a href="tel:${escapeHtml(phone)}">${escapeHtml(phone)}</a></td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#7A5C3A"><strong>Service</strong></td><td>${escapeHtml(service)}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #D4B896;margin:16px 0">
            <p style="color:#1A1008;white-space:pre-wrap">${escapeHtmlMultiline(message)}</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ error: "Email delivery failed" });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Contact route error:", err);
      return res.status(500).json({ error: "Failed to process request" });
    }
  });

  // ── Static (production only) ──────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");

    // Old service URLs → new ones (permanent, so search rankings carry over)
    app.get("/services/:slug", (req, res, next) => {
      const target = LEGACY_SERVICE_REDIRECTS[req.params.slug];
      if (target) return res.redirect(301, target);
      next();
    });

    app.get("/blog/:slug", (req, res, next) => {
      const target = LEGACY_BLOG_REDIRECTS[req.params.slug];
      if (target) return res.redirect(301, target);
      next();
    });

    // Keep the client portal and admin out of search results
    app.use((req, res, next) => {
      if (/^\/(portal|admin|login)(\/|$)/.test(req.path)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }
      next();
    });

    // Pre-rendered public pages (scripts/prerender.mjs): one file per route
    const pagesDir = path.join(staticPath, "__pages");
    const prerendered = new Set(
      fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).map((f) => f.replace(/\.html$/, "")) : [],
    );
    const isAppOnly = (p: string) => /^\/(portal|admin|login)(\/|$)/.test(p);

    app.use((req, res, next) => (req.path.startsWith("/__pages") ? res.status(404).end() : next()));
    app.use(express.static(staticPath, { index: false }));

    app.get("*", (req, res) => {
      // One canonical URL per page: drop trailing slashes
      if (req.path.length > 1 && req.path.endsWith("/")) {
        const query = req.originalUrl.slice(req.path.length);
        return res.redirect(301, req.path.replace(/\/+$/, "") + query);
      }

      const key = req.path === "/" ? "index" : req.path.slice(1).replace(/\//g, "__");
      if (prerendered.has(key) && key !== "404") {
        return res.sendFile(path.join(pagesDir, `${key}.html`));
      }

      // Portal / admin are client-side only
      if (isAppOnly(req.path) || prerendered.size === 0) {
        return res.sendFile(path.join(staticPath, "index.html"));
      }

      // Everything else is a real 404
      res.status(404).sendFile(path.join(pagesDir, "404.html"));
    });
  }

  // Malformed URLs from scanners (e.g. "/%c0") get a quiet 400 instead of a logged stack trace
  app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof URIError || err?.status === 400) {
      return res.status(400).json({ error: "Bad request" });
    }
    if (err?.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "File too large (max 10MB)" });
    }
    next(err);
  });

  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3002);
  server.listen(port, () => {
    console.log(`Express API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
