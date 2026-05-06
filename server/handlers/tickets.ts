import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function handleGetTickets(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    let result;

    if (user.is_super_admin) {
      const orgFilter = req.query?.org_id ? parseInt(req.query.org_id) : null;
      if (orgFilter) {
        result = await pool.query(
          `SELECT t.*, u.name AS client_name, u.email AS client_email, o.name AS org_name
           FROM tickets t
           JOIN users u ON t.client_id = u.id
           JOIN organisations o ON t.organisation_id = o.id
           WHERE t.organisation_id = $1
           ORDER BY t.created_at DESC`,
          [orgFilter]
        );
      } else {
        result = await pool.query(
          `SELECT t.*, u.name AS client_name, u.email AS client_email, o.name AS org_name
           FROM tickets t
           JOIN users u ON t.client_id = u.id
           JOIN organisations o ON t.organisation_id = o.id
           ORDER BY t.created_at DESC`
        );
      }
    } else {
      result = await pool.query(
        `SELECT t.*, u.name AS client_name, u.email AS client_email
         FROM tickets t
         JOIN users u ON t.client_id = u.id
         WHERE t.organisation_id = $1
         ORDER BY t.created_at DESC`,
        [user.organisation_id]
      );
    }

    return res.status(200).json({ success: true, tickets: result.rows });
  } catch (err: any) {
    console.error('Get tickets error:', err);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
}

export async function handleCreateTicket(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, org_id, priority = 'medium' } = req.body || {};
  if (!title || !description) {
    return res.status(400).json({ error: 'Missing title or description' });
  }

  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (!validPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }

  const targetOrgId = user.is_super_admin && org_id ? org_id : user.organisation_id;

  try {
    const { rows } = await pool.query(
      `INSERT INTO tickets (organisation_id, client_id, title, description, status, priority)
       VALUES ($1, $2, $3, $4, 'open', $5)
       RETURNING id`,
      [targetOrgId, user.id, title, description, priority]
    );

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        await resend.emails.send({
          from: 'Portal Notifications <noreply@devedge.com.au>',
          to: ['info@developeredge.net', 'nathan@developeredge.net'],
          subject: `New Ticket: ${title} from ${user.name}`,
          html: `
            <p><strong>Submitted by:</strong> ${user.name} (${user.email})</p>
            <p><strong>Title:</strong> ${title}</p>
            <p><strong>Description:</strong></p>
            <p>${description.replace(/\n/g, '<br>')}</p>
          `,
        });
      } catch (e) {
        console.error('Email send failed:', e);
      }
    }

    return res.status(201).json({ success: true, message: 'Ticket created', ticket: rows[0] });
  } catch (err: any) {
    console.error('Create ticket error:', err);
    return res.status(500).json({ error: 'Failed to create ticket' });
  }
}

export async function handleUpdateTicket(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id, status, title, description, priority } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const validStatuses = ['open', 'confirmed', 'in_progress', 'in_review', 'closed'];
  const validPriorities = ['low', 'medium', 'high', 'critical'];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ error: 'Invalid priority value' });
  }
  if (!status && !title && !description && !priority) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  try {
    const { rows: ticketRows } = await pool.query(
      `SELECT * FROM tickets WHERE id = $1`,
      [id]
    );
    if (ticketRows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    const ticket = ticketRows[0];

    if (!user.is_super_admin) {
      if (ticket.organisation_id !== user.organisation_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      if (user.role === 'user' && ticket.client_id !== user.id) {
        return res.status(403).json({ error: 'You can only update your own tickets' });
      }
    }

    // Build dynamic update query
    const setClauses: string[] = ['updated_at = CURRENT_TIMESTAMP'];
    const values: any[] = [];
    if (status)      { values.push(status);      setClauses.push(`status = $${values.length}`); }
    if (title)       { values.push(title);        setClauses.push(`title = $${values.length}`); }
    if (description) { values.push(description);  setClauses.push(`description = $${values.length}`); }
    if (priority)    { values.push(priority);     setClauses.push(`priority = $${values.length}`); }
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE tickets SET ${setClauses.join(', ')} WHERE id = $${values.length} RETURNING *`,
      values
    );
    const updated = rows[0];

    // Only email the client on status changes (not field edits)
    if (status && RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const { rows: clientRows } = await pool.query(
          `SELECT name, email FROM users WHERE id = $1`,
          [updated.client_id]
        );
        if (clientRows.length > 0) {
          const client = clientRows[0];
          await resend.emails.send({
            from: 'Portal Notifications <noreply@devedge.com.au>',
            to: [client.email],
            subject: `Ticket Update: ${updated.title}`,
            html: `<p>Hi ${client.name},</p><p>Your ticket "<strong>${updated.title}</strong>" has been updated to: <strong>${status.replace(/_/g, ' ').toUpperCase()}</strong>.</p>`,
          });
        }
      } catch (e) {
        console.error('Email send failed:', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Ticket updated', ticket: updated });
  } catch (err: any) {
    console.error('Update ticket error:', err);
    return res.status(500).json({ error: 'Failed to update ticket' });
  }
}

export async function handleDeleteTicket(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role === 'user') return res.status(403).json({ error: 'Forbidden' });

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'Missing ticket id' });

  try {
    const { rows } = await pool.query(
      `SELECT organisation_id FROM tickets WHERE id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });

    if (!user.is_super_admin && rows[0].organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.query(`DELETE FROM tickets WHERE id = $1`, [id]);
    return res.status(200).json({ success: true, message: 'Ticket deleted' });
  } catch (err: any) {
    console.error('Delete ticket error:', err);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
}
