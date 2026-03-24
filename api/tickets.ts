import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret_dev_edge_change_in_production';
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_AC8DJyDu_N9eHMTT2dpY67KFCfUpTh3tP";

function verifyUser(req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        return jwt.verify(token, JWT_SECRET) as any;
    } catch (err) {
        return null;
    }
}

export default async function handler(req: any, res: any) {
    const user = verifyUser(req);
    if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const resend = new Resend(RESEND_API_KEY);

    if (req.method === 'GET') {
        try {
            let tickets;
            if (user.role === 'admin') {
                const { rows } = await sql`
                    SELECT t.*, u.name as client_name, u.email as client_email
                    FROM tickets t
                    JOIN users u ON t.client_id = u.id
                    ORDER BY t.created_at DESC
                `;
                tickets = rows;
            } else {
                const { rows } = await sql`
                    SELECT * FROM tickets WHERE client_id = ${user.id} ORDER BY created_at DESC
                `;
                tickets = rows;
            }
            return res.status(200).json({ success: true, tickets });
        } catch (error) {
            console.error("Fetch tickets error:", error);
            return res.status(500).json({ error: "Failed to fetch tickets" });
        }
    }

    if (req.method === 'POST') {
        if (user.role !== 'client') return res.status(403).json({ error: "Admins cannot create tickets" });
        
        const { title, description } = req.body || {};
        if (!title || !description) return res.status(400).json({ error: "Missing title or description" });

        try {
            const { rows } = await sql`
                INSERT INTO tickets (client_id, title, description, status)
                VALUES (${user.id}, ${title}, ${description}, 'open')
                RETURNING id
            `;
            
            // Email Admin
            if (RESEND_API_KEY) {
                try {
                    await resend.emails.send({
                        from: 'Portal Notifications <noreply@devedge.com.au>',
                        to: ['info@developeredge.net', 'nathan@developeredge.net'],
                        subject: `New Ticket: ${title} from ${user.name}`,
                        html: `<p><strong>Client:</strong> ${user.name} (${user.email})</p>
                               <p><strong>Title:</strong> ${title}</p>
                               <p><strong>Description:</strong></p>
                               <p>${description.replace(/\n/g, '<br>')}</p>`,
                    });
                } catch (e) {
                    console.error("Email send failed:", e);
                }
            }

            return res.status(201).json({ success: true, message: "Ticket created", ticket: rows[0] });
        } catch (error) {
            console.error("Create ticket error:", error);
            return res.status(500).json({ error: "Failed to create ticket" });
        }
    }

    if (req.method === 'PATCH') {
        if (user.role !== 'admin') return res.status(403).json({ error: "Only admins can update tickets" });

        const { id, status } = req.body || {};
        if (!id || !status) return res.status(400).json({ error: "Missing id or status" });

        try {
            const { rows } = await sql`
                UPDATE tickets SET status = ${status}, updated_at = CURRENT_TIMESTAMP
                WHERE id = ${id}
                RETURNING *
            `;
            
            if (rows.length === 0) return res.status(404).json({ error: "Ticket not found" });

            const ticket = rows[0];

            // Fetch client email to notify
            const clientResult = await sql`SELECT name, email FROM users WHERE id = ${ticket.client_id}`;
            if (clientResult.rows.length > 0) {
                const client = clientResult.rows[0];
                if (RESEND_API_KEY) {
                    try {
                        await resend.emails.send({
                            from: 'Portal Notifications <noreply@devedge.com.au>',
                            to: [client.email],
                            subject: `Ticket Update: ${ticket.title}`,
                            html: `<p>Hi ${client.name},</p>
                                   <p>Your ticket "<strong>${ticket.title}</strong>" has been updated to: <strong>${status.replace('_', ' ').toUpperCase()}</strong>.</p>
                                   <p>Thank you!</p>`,
                        });
                    } catch (e) {
                        console.error("Email send failed:", e);
                    }
                }
            }

            return res.status(200).json({ success: true, message: "Ticket updated", ticket });
        } catch (error) {
            console.error("Update ticket error:", error);
            return res.status(500).json({ error: "Failed to update ticket" });
        }
    }

    if (req.method === 'DELETE') {
        if (user.role !== 'admin') return res.status(403).json({ error: "Only admins can delete tickets" });
        const { id } = req.body || {};
        try {
            await sql`DELETE FROM tickets WHERE id = ${id}`;
            return res.status(200).json({ success: true, message: "Ticket deleted" });
        } catch (e) {
             console.error("Delete ticket error:", e);
             return res.status(500).json({ error: "Failed to delete ticket" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
