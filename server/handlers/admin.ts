import { sql } from '@vercel/postgres';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleware/auth.js';

export async function handleGetAdmin(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  try {
    if (user.is_super_admin) {
      const { rows: orgs } = await sql`
        SELECT o.*,
          COUNT(DISTINCT u.id)::int  AS user_count,
          COUNT(DISTINCT t.id)::int  AS ticket_count
        FROM organisations o
        LEFT JOIN users   u ON u.organisation_id = o.id
        LEFT JOIN tickets t ON t.organisation_id = o.id
        WHERE o.is_super_org = FALSE
        GROUP BY o.id
        ORDER BY o.name ASC
      `;

      const { rows: users } = await sql`
        SELECT u.id, u.name, u.email, u.role, u.organisation_id, u.created_at
        FROM users u
        JOIN organisations o ON u.organisation_id = o.id
        WHERE o.is_super_org = FALSE
        ORDER BY u.name ASC
      `;

      const { rows: invites } = await sql`
        SELECT i.id, i.email, i.name, i.role, i.organisation_id, i.expires_at, i.created_at
        FROM invites i
        JOIN organisations o ON i.organisation_id = o.id
        WHERE i.accepted_at IS NULL AND i.expires_at > NOW()
          AND o.is_super_org = FALSE
        ORDER BY i.created_at DESC
      `;

      return res.status(200).json({ success: true, orgs, users, invites });
    } else {
      const { rows: clients } = await sql`
        SELECT id, name, email, role, created_at
        FROM users
        WHERE organisation_id = ${user.organisation_id}
        ORDER BY name ASC
      `;

      const { rows: invites } = await sql`
        SELECT id, email, name, role, organisation_id, expires_at, created_at
        FROM invites
        WHERE organisation_id = ${user.organisation_id}
          AND accepted_at IS NULL AND expires_at > NOW()
        ORDER BY created_at DESC
      `;

      return res.status(200).json({ success: true, clients, invites });
    }
  } catch (err: any) {
    console.error('Get admin error:', err);
    return res.status(500).json({ error: 'Failed to fetch data' });
  }
}

export async function handleCreateOrg(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (!user.is_super_admin) return res.status(403).json({ error: 'Super admin only' });

  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Missing organisation name' });

  try {
    const { rows } = await sql`
      INSERT INTO organisations (name, is_super_org)
      VALUES (${name}, FALSE)
      RETURNING *
    `;
    return res.status(201).json({ success: true, org: rows[0] });
  } catch (err: any) {
    console.error('Create org error:', err);
    return res.status(500).json({ error: 'Failed to create organisation' });
  }
}

export async function handleCreateUser(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin') return res.status(403).json({ error: 'Admins only' });

  const { name, email, password, role, org_id } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing name, email, or password' });
  }

  const targetOrgId = user.is_super_admin && org_id ? org_id : user.organisation_id;
  const targetRole  = user.is_super_admin ? (role || 'user') : 'user';

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await sql`
      INSERT INTO users (organisation_id, name, email, password_hash, role)
      VALUES (${targetOrgId}, ${name}, ${email}, ${hash}, ${targetRole})
      RETURNING id, name, email, role, organisation_id, created_at
    `;
    return res.status(201).json({ success: true, user: rows[0] });
  } catch (err: any) {
    if (err.message?.includes('unique')) {
      return res.status(409).json({ error: 'Email already in use' });
    }
    console.error('Create user error:', err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}

export async function handleUpdateUserRole(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin' && !user.is_super_admin) {
    return res.status(403).json({ error: 'Admins only' });
  }

  const { user_id, role } = req.body || {};
  if (!user_id || !role) return res.status(400).json({ error: 'Missing user_id or role' });

  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  try {
    const { rows } = await sql`SELECT id, organisation_id FROM users WHERE id = ${user_id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const target = rows[0];

    if (target.id === user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    if (!user.is_super_admin && target.organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await sql`UPDATE users SET role = ${role} WHERE id = ${user_id}`;
    return res.status(200).json({ success: true, message: 'Role updated' });
  } catch (err: any) {
    console.error('Update user role error:', err);
    return res.status(500).json({ error: 'Failed to update role' });
  }
}

export async function handleDeleteUser(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (!user.is_super_admin) return res.status(403).json({ error: 'Super admin only' });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing user id' });

  try {
    await sql`DELETE FROM users WHERE id = ${id}`;
    return res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err: any) {
    console.error('Delete user error:', err);
    return res.status(500).json({ error: 'Failed to delete user' });
  }
}
