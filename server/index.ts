import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath as _fileURLToPath } from "url";
config({ path: resolve(dirname(_fileURLToPath(import.meta.url)), "../.env") });

import express from "express";
import { createServer } from "http";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ── Auth ─────────────────────────────────────────────────────────────────────
  app.post("/api/auth", handleLogin);
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
  app.post("/api/invites", async (req, res) => {
    const { action } = req.body || {};
    if (action === "create") return handleCreateInvite(req, res);
    if (action === "accept") return handleAcceptInvite(req, res);
    if (action === "resend") return handleResendInvite(req, res);
    return res.status(400).json({ error: "Missing or invalid action" });
  });
  app.delete("/api/invites", handleCancelInvite);

  // ── Password reset ────────────────────────────────────────────────────────────
  app.get("/api/password-reset", handleValidateResetToken);
  app.post("/api/password-reset", async (req, res) => {
    const { action } = req.body || {};
    if (action === "forgot") return handleForgotPassword(req, res);
    if (action === "reset")  return handleResetPassword(req, res);
    return res.status(400).json({ error: "Missing or invalid action" });
  });

  // ── Contact ──────────────────────────────────────────────────────────────────
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, phone, service, message } = req.body;
      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: "Missing required fields" });
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
              <tr><td style="padding:8px 0;color:#7A5C3A;width:100px"><strong>Name</strong></td><td>${name}</td></tr>
              <tr><td style="padding:8px 0;color:#7A5C3A"><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
              ${phone ? `<tr><td style="padding:8px 0;color:#7A5C3A"><strong>Phone</strong></td><td><a href="tel:${phone}">${phone}</a></td></tr>` : ""}
              <tr><td style="padding:8px 0;color:#7A5C3A"><strong>Service</strong></td><td>${service}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #D4B896;margin:16px 0">
            <p style="color:#1A1008;white-space:pre-wrap">${message.replace(/\n/g, "<br>")}</p>
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
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3002);
  server.listen(port, () => {
    console.log(`Express API server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
