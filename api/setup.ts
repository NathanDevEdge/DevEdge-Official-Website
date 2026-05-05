import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Organisations table
        await sql`
            CREATE TABLE IF NOT EXISTS organisations (
                id         SERIAL PRIMARY KEY,
                name       VARCHAR(255) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Users table — scoped to an organisation
        await sql`
            CREATE TABLE IF NOT EXISTS users (
                id              SERIAL PRIMARY KEY,
                organisation_id INTEGER REFERENCES organisations(id),
                name            VARCHAR(255) NOT NULL,
                email           VARCHAR(255) UNIQUE NOT NULL,
                password_hash   VARCHAR(255) NOT NULL,
                role            VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
                created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Tickets table — scoped to an organisation, submitted by a user
        await sql`
            CREATE TABLE IF NOT EXISTS tickets (
                id              SERIAL PRIMARY KEY,
                organisation_id INTEGER REFERENCES organisations(id),
                client_id       INTEGER REFERENCES users(id),
                title           VARCHAR(255) NOT NULL,
                description     TEXT NOT NULL,
                status          VARCHAR(50) NOT NULL DEFAULT 'open'
                                    CHECK (status IN ('open', 'confirmed', 'in_progress', 'in_review', 'closed')),
                created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Seed: DevEdge org + admin user
        const { rows: existingOrgs } = await sql`
            SELECT id FROM organisations WHERE name = 'DevEdge';
        `;

        let orgId: number;

        if (existingOrgs.length === 0) {
            const { rows } = await sql`
                INSERT INTO organisations (name) VALUES ('DevEdge') RETURNING id;
            `;
            orgId = rows[0].id;
        } else {
            orgId = existingOrgs[0].id;
        }

        const { rows: existingAdmin } = await sql`
            SELECT id FROM users WHERE email = 'admin@devedge.com.au';
        `;

        if (existingAdmin.length === 0) {
            const defaultPassword = 'DevEdge2025!';
            const hash = await bcrypt.hash(defaultPassword, 10);
            await sql`
                INSERT INTO users (organisation_id, name, email, password_hash, role)
                VALUES (${orgId}, 'Admin', 'admin@devedge.com.au', ${hash}, 'admin');
            `;
            return res.status(200).json({
                success: true,
                message: 'Schema created and default admin provisioned.',
                admin: { email: 'admin@devedge.com.au', password: defaultPassword },
            });
        }

        return res.status(200).json({ success: true, message: 'Schema verified. Admin already exists.' });

    } catch (error: any) {
        console.error('Setup error:', error);
        return res.status(500).json({ error: 'Setup failed.', details: error.message });
    }
}
