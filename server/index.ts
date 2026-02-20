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

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Contact API route
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, service, message } = req.body;

      if (!name || !email || !service || !message) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // We'll use resend here if an API key is provided, otherwise log it
      const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_AC8DJyDu_N9eHMTT2dpY67KFCfUpTh3tP";

      if (RESEND_API_KEY) {
        const resend = new Resend(RESEND_API_KEY);

        await resend.emails.send({
          from: 'Contact Form <onboarding@resend.dev>',
          to: ['info@devedge.com.au'], // Replace with actual client email
          subject: `New Lead: ${service} inquiry from ${name}`,
          html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Service:</strong> ${service}</p>
                 <p><strong>Message:</strong></p>
                 <p>${message.replace(/\n/g, '<br>')}</p>`
        });
      } else {
        console.log("--- New Lead Received (No RESEND_API_KEY provided) ---");
        console.log(`Name: ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Service: ${service}`);
        console.log(`Message: ${message}`);
        console.log("------------------------------------------------------");
      }

      res.status(200).json({ success: true, message: "Message received" });
    } catch (error) {
      console.error("Error processing contact form:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
