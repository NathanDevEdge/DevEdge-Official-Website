import { Resend } from 'resend';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, service, message } = req.body || {};

        if (!name || !email || !service || !message) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_AC8DJyDu_N9eHMTT2dpY67KFCfUpTh3tP";

        if (RESEND_API_KEY) {
            const resend = new Resend(RESEND_API_KEY);

            await resend.emails.send({
                from: 'Contact Form <onboarding@resend.dev>',
                to: ['info@developeredge.net', 'nathan@developeredge.net'],
                subject: `New Lead: ${service} inquiry from ${name}`,
                html: `<p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Service:</strong> ${service}</p>
               <p><strong>Message:</strong></p>
               <p>${message.replace(/\n/g, '<br>')}</p>`
            });
        }

        res.status(200).json({ success: true, message: "Message received" });
    } catch (error) {
        console.error("Error processing contact form:", error);
        res.status(500).json({ error: "Failed to process request" });
    }
}
