import { sql } from '@vercel/postgres';

async function migrate() {
  console.log('Running invite system migration...');

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
  console.log('✓ invites table ready');

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
  console.log('✓ password_resets table ready');

  console.log('\nMigration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
