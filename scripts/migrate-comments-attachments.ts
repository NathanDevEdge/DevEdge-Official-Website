import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  console.log('Running comments & attachments migration...\n');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ticket_comments (
      id         SERIAL PRIMARY KEY,
      ticket_id  INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      author_id  INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content    TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ ticket_comments');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS ticket_attachments (
      id            SERIAL PRIMARY KEY,
      ticket_id     INTEGER NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
      uploaded_by   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename      TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type     TEXT NOT NULL,
      size          INTEGER NOT NULL,
      created_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✓ ticket_attachments\n');

  console.log('Migration complete.');
  await pool.end();
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
