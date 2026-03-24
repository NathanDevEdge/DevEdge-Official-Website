import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret_dev_edge_change_in_production';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { email, password } = req.body || {};
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        try {
            const { rows } = await sql`SELECT * FROM users WHERE email = ${email}`;
            const user = rows[0];

            if (!user) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role, name: user.name },
                JWT_SECRET,
                { expiresIn: '7d' }
            );

            return res.status(200).json({
                success: true,
                token,
                user: { id: user.id, email: user.email, role: user.role, name: user.name }
            });
        } catch (err: any) {
            console.error("Login error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    } 
    
    if (req.method === 'GET') {
        // Validate token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            return res.status(200).json({ success: true, user: decoded });
        } catch (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
    }

    return res.status(405).json({ error: "Method not allowed" });
}
