import express from "express";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { escapeHtml, escapeHtmlMultiline } from "./lib/escapeHtml.js";
import { LEGACY_SERVICE_REDIRECTS } from "../client/src/data/services.js";
import { LEGACY_BLOG_REDIRECTS } from "../client/src/data/blogRedirects.js";

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

  // ── Client portal moved to portal.devedge.com.au ──────────────────────────────
  // Old portal pages redirect; the old portal API is switched off so nothing new
  // lands here after tickets were migrated to the new portal.
  const NEW_PORTAL = "https://portal.devedge.com.au";
  app.use((req, res, next) => {
    if (/^\/(portal|admin|login)(\/|$)/i.test(req.path)) return res.redirect(301, NEW_PORTAL);
    if (/^\/api\/(auth|tickets|admin|invites|password-reset|comments|attachments)(\/|$)/i.test(req.path)) {
      return res.status(410).json({ error: `The client portal has moved to ${NEW_PORTAL}` });
    }
    next();
  });

  app.use("/api", limiter(15, 300));
  const contactLimiter = limiter(60, 5);

  // The old portal's API routes have been removed entirely (the portal lives at
  // portal.devedge.com.au). The guard above answers 410 for any spelling of them.

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

  // ── Free Tools: "email me new tools" ──────────────────────────────────────────
  app.post("/api/tools-signup", contactLimiter, async (req, res) => {
    const { email, source } = req.body || {};
    if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }
    const from = typeof source === "string" ? source.slice(0, 80) : "unknown";
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.log(`New tools signup: ${email} (from ${from})`);
      return res.status(200).json({ success: true, message: "Logged (no API key)" });
    }
    try {
      const { Resend } = await import("resend");
      const { error } = await new Resend(RESEND_API_KEY).emails.send({
        from: "DevEdge Website <noreply@devedge.com.au>",
        to: ["info@devedge.com.au"],
        replyTo: email,
        subject: `Free Tools signup: ${email}`,
        html: `<div style="font-family:sans-serif"><p><strong>${escapeHtml(email)}</strong> asked to be emailed when a new free tool goes live.</p><p style="color:#7A5C3A">Signed up from: ${escapeHtml(from)}</p></div>`,
      });
      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ error: "Signup failed" });
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Tools signup error:", err);
      return res.status(500).json({ error: "Signup failed" });
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

    // The blog moved from /blog to /insights (Nov 2026). Retired post slugs go straight to
    // their replacements; every other /blog URL keeps its path under /insights.
    app.get(["/insights/:slug", "/blog/:slug"], (req, res, next) => {
      const target = LEGACY_BLOG_REDIRECTS[req.params.slug];
      if (target) return res.redirect(301, target);
      next();
    });
    app.get(/^\/blog(\/.*)?$/i, (req, res) => {
      const rest = (req.path.slice("/blog".length) || "").replace(/\/+$/, "");
      const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
      res.redirect(301, `/insights${rest}${query}`);
    });

    // Tool embeds (/embed/<tool>) are made to sit in iframes on other sites: allow framing
    // anywhere, and keep them out of search results (the tool page is the one that ranks).
    // nginx must not add X-Frame-Options to these either: see the /embed/ block in nginx.conf.
    app.use((req, res, next) => {
      if (/^\/embed(\/|$)/.test(req.path)) {
        res.setHeader("X-Robots-Tag", "noindex");
        res.setHeader("Content-Security-Policy", "frame-ancestors *");
        res.removeHeader("X-Frame-Options");
      }
      next();
    });

    // Keep the client portal and admin out of search results
    app.use((req, res, next) => {
      if (/^\/(portal|admin|login|lab)(\/|$)/.test(req.path)) {
        res.setHeader("X-Robots-Tag", "noindex, nofollow");
      }
      next();
    });

    // Pre-rendered public pages (scripts/prerender.mjs): one file per route
    const pagesDir = path.join(staticPath, "__pages");
    const prerendered = new Set(
      fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).map((f) => f.replace(/\.html$/, "")) : [],
    );
    const isAppOnly = (p: string) => /^\/(portal|admin|login|lab)(\/|$)/.test(p);

    app.use((req, res, next) => (req.path.startsWith("/__pages") ? res.status(404).end() : next()));
    app.use(
      express.static(staticPath, {
        index: false,
        // Hashed build assets and fonts never change under the same name: cache for a year
        setHeaders: (res, filePath) => {
          if (/[\\/](assets|fonts)[\\/]/.test(filePath)) {
            res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          }
        },
      }),
    );

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
    next(err);
  });

  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3002);
  server.listen(port, () => {
    console.log(`Express API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
