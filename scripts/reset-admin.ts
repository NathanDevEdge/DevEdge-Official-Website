import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';

const NEW_PASSWORD = 'DevEdge2025!';
const ADMIN_EMAIL  = 'admin@devedge.com.au';

async function resetAdmin() {
  const hash = await bcrypt.hash(NEW_PASSWORD, 10);

  const { rowCount } = await sql`
    UPDATE users
    SET password_hash = ${hash}
    WHERE email = ${ADMIN_EMAIL}
  `;

  if (rowCount === 0) {
    console.error(`No user found with email: ${ADMIN_EMAIL}`);
    process.exit(1);
  }

  console.log('✓ Admin password reset successfully');
  console.log(`  Email:    ${ADMIN_EMAIL}`);
  console.log(`  Password: ${NEW_PASSWORD}`);
  console.log('\n  Change this password after logging in.');
  process.exit(0);
}

resetAdmin().catch((err) => {
  console.error('Reset failed:', err.message);
  process.exit(1);
});
