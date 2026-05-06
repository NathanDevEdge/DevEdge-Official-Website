import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function setup() {
  console.log('Setting up database schema...\n');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS organisations (
      id          SERIAL PRIMARY KEY,
      name        VARCHAR(255) NOT NULL,
      is_super_org BOOLEAN NOT NULL DEFAULT FALSE,
      created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ organisations');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id              SERIAL PRIMARY KEY,
      organisation_id INTEGER REFERENCES organisations(id) ON DELETE CASCADE,
      name            VARCHAR(255) NOT NULL,
      email           VARCHAR(255) UNIQUE NOT NULL,
      password_hash   VARCHAR(255) NOT NULL,
      role            VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'user')),
      created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ users');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id              SERIAL PRIMARY KEY,
      organisation_id INTEGER REFERENCES organisations(id) ON DELETE CASCADE,
      client_id       INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title           VARCHAR(255) NOT NULL,
      description     TEXT NOT NULL,
      status          VARCHAR(50) NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open', 'confirmed', 'in_progress', 'in_review', 'closed')),
      priority        VARCHAR(50) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
      created_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ tickets');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS invites (
      id              SERIAL PRIMARY KEY,
      token           TEXT NOT NULL UNIQUE,
      email           TEXT NOT NULL,
      name            TEXT NOT NULL,
      role            TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
      organisation_id INTEGER NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
      invited_by      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at      TIMESTAMP NOT NULL,
      accepted_at     TIMESTAMP,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ invites');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id         SERIAL PRIMARY KEY,
      token      TEXT NOT NULL UNIQUE,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      expires_at TIMESTAMP NOT NULL,
      used_at    TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ password_resets\n');

  // Seed DevEdge super org
  const { rows: existingOrgs } = await pool.query(
    `SELECT id FROM organisations WHERE name = 'DevEdge'`
  );
  let orgId: number;
  if (existingOrgs.length === 0) {
    const { rows } = await pool.query(
      `INSERT INTO organisations (name, is_super_org) VALUES ('DevEdge', TRUE) RETURNING id`
    );
    orgId = rows[0].id;
    console.log('✓ DevEdge organisation seeded');
  } else {
    orgId = existingOrgs[0].id;
    console.log('✓ DevEdge organisation already exists');
  }

  // Seed admin user
  const { rows: existingAdmin } = await pool.query(
    `SELECT id FROM users WHERE email = 'admin@devedge.com.au'`
  );
  if (existingAdmin.length === 0) {
    const password = 'DevEdge2025!';
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (organisation_id, name, email, password_hash, role)
       VALUES ($1, 'Admin', 'admin@devedge.com.au', $2, 'admin')`,
      [orgId, hash]
    );
    console.log('✓ Admin user seeded\n');
    console.log('─────────────────────────────────');
    console.log('  Email:    admin@devedge.com.au');
    console.log('  Password: DevEdge2025!');
    console.log('─────────────────────────────────\n');
  } else {
    console.log('✓ Admin user already exists');
  }

  console.log('Database ready.');
  await pool.end();
  process.exit(0);
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
