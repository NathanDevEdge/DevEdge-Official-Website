import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS organisations (
        id           SERIAL PRIMARY KEY,
        name         VARCHAR(255) NOT NULL,
        is_super_org BOOLEAN NOT NULL DEFAULT FALSE,
        created_at   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id              SERIAL PRIMARY KEY,
        organisation_id INTEGER REFERENCES organisations(id),
        name            VARCHAR(255) NOT NULL,
        email           VARCHAR(255) UNIQUE NOT NULL,
        password_hash   VARCHAR(255) NOT NULL,
        role            VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
        created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tickets (
        id              SERIAL PRIMARY KEY,
        organisation_id INTEGER REFERENCES organisations(id),
        client_id       INTEGER REFERENCES users(id),
        title           VARCHAR(255) NOT NULL,
        description     TEXT NOT NULL,
        status          VARCHAR(50) NOT NULL DEFAULT 'open'
                          CHECK (status IN ('open', 'confirmed', 'in_progress', 'in_review', 'closed')),
        priority        VARCHAR(20) NOT NULL DEFAULT 'medium'
                          CHECK (priority IN ('low', 'medium', 'high', 'critical')),
        created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS invites (
        id              SERIAL PRIMARY KEY,
        token           TEXT NOT NULL UNIQUE,
        email           TEXT NOT NULL,
        name            TEXT NOT NULL,
        role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
        organisation_id INTEGER NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
        invited_by      INTEGER NOT NULL REFERENCES users(id),
        expires_at      TIMESTAMP NOT NULL,
        accepted_at     TIMESTAMP,
        created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS password_resets (
        id         SERIAL PRIMARY KEY,
        token      TEXT NOT NULL UNIQUE,
        user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at TIMESTAMP NOT NULL,
        used_at    TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed DevEdge org as super org
    const { rows: existingOrgs } = await sql`
      SELECT id FROM organisations WHERE name = 'DevEdge'
    `;

    let orgId: number;
    if (existingOrgs.length === 0) {
      const { rows } = await sql`
        INSERT INTO organisations (name, is_super_org) VALUES ('DevEdge', TRUE) RETURNING id
      `;
      orgId = rows[0].id;
    } else {
      orgId = existingOrgs[0].id;
      await sql`UPDATE organisations SET is_super_org = TRUE WHERE id = ${orgId}`;
    }

    // Seed admin user
    const { rows: existingAdmin } = await sql`
      SELECT id FROM users WHERE email = 'admin@devedge.com.au'
    `;

    if (existingAdmin.length === 0) {
      const hash = await bcrypt.hash('DevEdge2025!', 10);
      await sql`
        INSERT INTO users (organisation_id, name, email, password_hash, role)
        VALUES (${orgId}, 'Admin', 'admin@devedge.com.au', ${hash}, 'admin')
      `;
      return res.status(200).json({
        success: true,
        message: 'Schema created and admin provisioned.',
        credentials: { email: 'admin@devedge.com.au', password: 'DevEdge2025!' },
      });
    }

    return res.status(200).json({ success: true, message: 'Schema verified. Admin already exists.' });

  } catch (error: any) {
    console.error('Setup error:', error);
    return res.status(500).json({ error: 'Setup failed.', details: error.message });
  }
}
