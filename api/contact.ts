import { Resend } from "resend";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, phone, service, message } = req.body || {};

    if (!name || !email || !service || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY environment variable is not set.");
      return res.status(500).json({ error: "Email service not configured." });
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
      return res.status(500).json({ error: "Email delivery failed", detail: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Contact handler error:", err);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
