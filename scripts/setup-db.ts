import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

async function setup() {
    console.log('Setting up database schema...\n');

    await sql`
        CREATE TABLE IF NOT EXISTS organisations (
            id         SERIAL PRIMARY KEY,
            name       VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    console.log('✓ organisations table');

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
    console.log('✓ users table');

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
    console.log('✓ tickets table');

    // Seed DevEdge org
    const { rows: existingOrgs } = await sql`SELECT id FROM organisations WHERE name = 'DevEdge';`;
    let orgId: number;
    if (existingOrgs.length === 0) {
        const { rows } = await sql`INSERT INTO organisations (name) VALUES ('DevEdge') RETURNING id;`;
        orgId = rows[0].id;
        console.log('✓ DevEdge organisation seeded');
    } else {
        orgId = existingOrgs[0].id;
        console.log('✓ DevEdge organisation already exists');
    }

    // Seed admin user
    const { rows: existingAdmin } = await sql`SELECT id FROM users WHERE email = 'admin@devedge.com.au';`;
    if (existingAdmin.length === 0) {
        const password = 'DevEdge2025!';
        const hash = await bcrypt.hash(password, 10);
        await sql`
            INSERT INTO users (organisation_id, name, email, password_hash, role)
            VALUES (${orgId}, 'Admin', 'admin@devedge.com.au', ${hash}, 'admin');
        `;
        console.log('✓ Admin user seeded');
        console.log('\n─────────────────────────────────');
        console.log('  Email:    admin@devedge.com.au');
        console.log('  Password: DevEdge2025!');
        console.log('─────────────────────────────────\n');
    } else {
        console.log('✓ Admin user already exists');
    }

    console.log('\nDatabase ready.');
    process.exit(0);
}

setup().catch((err) => {
    console.error('Setup failed:', err.message);
    process.exit(1);
});
