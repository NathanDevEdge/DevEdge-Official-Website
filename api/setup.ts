import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Create Users Table
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'client')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Create Tickets Table
        await sql`
            CREATE TABLE IF NOT EXISTS tickets (
                id SERIAL PRIMARY KEY,
                client_id INTEGER REFERENCES users(id),
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Check if admin exists
        const { rows } = await sql`SELECT * FROM users WHERE email = 'admin@devedge.com.au'`;
        if (rows.length === 0) {
            const defaultPassword = 'AdminPassword123!';
            const hash = await bcrypt.hash(defaultPassword, 10);
            await sql`
                INSERT INTO users (name, email, password_hash, role)
                VALUES ('Admin', 'admin@devedge.com.au', ${hash}, 'admin')
            `;
            return res.status(200).json({ 
                success: true, 
                message: "Tables created and default admin added.",
                adminEmail: 'admin@devedge.com.au',
                adminPassword: defaultPassword
            });
        }

        return res.status(200).json({ success: true, message: "Tables verified. Admin already exists." });
    } catch (error: any) {
        console.error("Setup error:", error);
        return res.status(500).json({ error: "Failed to set up database.", details: error.message });
    }
}
