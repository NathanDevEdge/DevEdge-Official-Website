import { pool } from '../db.js';
import bcrypt from 'bcryptjs';
import { verifyToken, signToken } from '../middleware/auth.js';

export async function handleLogin(req: any, res: any) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT u.*, o.is_super_org
       FROM users u
       JOIN organisations o ON u.organisation_id = o.id
       WHERE u.email = $1`,
      [email]
    );
    const user = rows[0];

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const is_super_admin = user.role === 'admin' && user.is_super_org === true;

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      organisation_id: user.organisation_id,
      is_super_admin,
    };

    const token = signToken(payload);
    return res.status(200).json({ success: true, token, user: payload });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function handleValidateToken(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  return res.status(200).json({ success: true, user });
}
