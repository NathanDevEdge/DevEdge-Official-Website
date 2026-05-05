import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // ── Contact API route ───────────────────────────────────────────────────────
  // Must be declared BEFORE the static/wildcard handlers so it isn't swallowed.
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const RESEND_API_KEY = process.env.RESEND_API_KEY;

      if (!RESEND_API_KEY) {
        // Dev fallback: log to console when no key is configured
        console.log("\n─── New Contact Form Submission ───────────────────");
        console.log(`Name:    ${name}`);
        console.log(`Email:   ${email}`);
        console.log(`Service: ${service}`);
        console.log(`Message: ${message}`);
        console.log("───────────────────────────────────────────────────\n");
        return res.status(200).json({ success: true, message: "Logged (no API key)" });
      }

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
              <tr><td style="padding:8px 0;color:#7A5C3A"><strong>Service</strong></td><td>${service}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #D4B896;margin:16px 0">
            <p style="color:#1A1008;white-space:pre-wrap">${message.replace(/\n/g, "<br>")}</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend error:", error);
        return res.status(500).json({ error: "Email delivery failed", detail: error.message });
      }

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Contact route error:", err);
      return res.status(500).json({ error: "Failed to process request" });
    }
  });

  // ── Static file serving (production only) ──────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  // In dev, Vite serves the frontend — Express only handles /api/*
  const port = process.env.PORT || (process.env.NODE_ENV === "production" ? 3000 : 3002);

  server.listen(port, () => {
    console.log(`Express API server running on http://localhost:${port}/`);
    if (!process.env.RESEND_API_KEY) {
      console.warn("⚠️  RESEND_API_KEY not set — emails will be logged to console only.");
    }
  });
}

startServer().catch(console.error);
