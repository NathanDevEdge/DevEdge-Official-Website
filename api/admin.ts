import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret_dev_edge_change_in_production';

function verifyAdmin(req: any) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role === 'admin') return decoded;
        return null;
    } catch (err) {
        return null;
    }
}

export default async function handler(req: any, res: any) {
    const admin = verifyAdmin(req);
    if (!admin) {
        return res.status(401).json({ error: "Unauthorized. Admin access required." });
    }

    if (req.method === 'GET') {
        try {
            const { rows } = await sql`SELECT id, name, email, created_at FROM users WHERE role = 'client' ORDER BY created_at DESC`;
            return res.status(200).json({ success: true, clients: rows });
        } catch (error) {
            console.error("Fetch clients error", error);
            return res.status(500).json({ error: "Failed to fetch clients" });
        }
    }

    if (req.method === 'POST') {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const hash = await bcrypt.hash(password, 10);
            await sql`
                INSERT INTO users (name, email, password_hash, role)
                VALUES (${name}, ${email}, ${hash}, 'client')
            `;
            return res.status(201).json({ success: true, message: "Client created successfully" });
        } catch (error: any) {
            if (error.code === '23505') { // Postgres unique violation
                return res.status(400).json({ error: "Email already exists" });
            }
            console.error("Create client error", error);
            return res.status(500).json({ error: "Failed to create client" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
