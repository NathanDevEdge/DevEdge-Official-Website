import { sql } from '@vercel/postgres';
async function run() {
  const { rows } = await sql`
    SELECT table_name FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name
  `;
  console.log('Tables in this database:');
  rows.forEach(r => console.log(' -', r.table_name));
  console.log('\nConnecting to:', process.env.POSTGRES_URL?.split('@')[1]?.split('/')[0]);
}
run().catch(console.error);
