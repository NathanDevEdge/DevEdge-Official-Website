import { sql } from '@vercel/postgres';
import { verifyToken } from '../middleware/auth.js';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

export async function handleGetTickets(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    let tickets;

    if (user.is_super_admin) {
      // Super admin: all tickets across all orgs, optionally filtered by org
      const orgFilter = req.query?.org_id ? parseInt(req.query.org_id) : null;
      if (orgFilter) {
        const { rows } = await sql`
          SELECT t.*, u.name AS client_name, u.email AS client_email, o.name AS org_name
          FROM tickets t
          JOIN users u ON t.client_id = u.id
          JOIN organisations o ON t.organisation_id = o.id
          WHERE t.organisation_id = ${orgFilter}
          ORDER BY t.created_at DESC
        `;
        tickets = rows;
      } else {
        const { rows } = await sql`
          SELECT t.*, u.name AS client_name, u.email AS client_email, o.name AS org_name
          FROM tickets t
          JOIN users u ON t.client_id = u.id
          JOIN organisations o ON t.organisation_id = o.id
          ORDER BY t.created_at DESC
        `;
        tickets = rows;
      }
    } else {
      // Admin or user: org-scoped
      const { rows } = await sql`
        SELECT t.*, u.name AS client_name, u.email AS client_email
        FROM tickets t
        JOIN users u ON t.client_id = u.id
        WHERE t.organisation_id = ${user.organisation_id}
        ORDER BY t.created_at DESC
      `;
      tickets = rows;
    }

    return res.status(200).json({ success: true, tickets });
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

  // Super admin can specify an org to submit on behalf of; everyone else uses their own org
  const targetOrgId = user.is_super_admin && org_id ? org_id : user.organisation_id;

  try {
    const { rows } = await sql`
      INSERT INTO tickets (organisation_id, client_id, title, description, status, priority)
      VALUES (${targetOrgId}, ${user.id}, ${title}, ${description}, 'open', ${priority})
      RETURNING id
    `;

    // Notify DevEdge admins
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

  const { id, status } = req.body || {};
  if (!id || !status) return res.status(400).json({ error: 'Missing id or status' });

  const validStatuses = ['open', 'confirmed', 'in_progress', 'in_review', 'closed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  try {
    // Fetch the ticket first to check permissions
    const { rows: ticketRows } = await sql`SELECT * FROM tickets WHERE id = ${id}`;
    if (ticketRows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    const ticket = ticketRows[0];

    // Permission checks
    if (!user.is_super_admin) {
      // Must be in the same org
      if (ticket.organisation_id !== user.organisation_id) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      // Regular users can only edit their own tickets
      if (user.role === 'user' && ticket.client_id !== user.id) {
        return res.status(403).json({ error: 'You can only update your own tickets' });
      }
    }

    const { rows } = await sql`
      UPDATE tickets
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;

    const updated = rows[0];

    // Notify the ticket submitter of the status change
    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const { rows: clientRows } = await sql`SELECT name, email FROM users WHERE id = ${updated.client_id}`;
        if (clientRows.length > 0) {
          const client = clientRows[0];
          await resend.emails.send({
            from: 'Portal Notifications <noreply@devedge.com.au>',
            to: [client.email],
            subject: `Ticket Update: ${updated.title}`,
            html: `
              <p>Hi ${client.name},</p>
              <p>Your ticket "<strong>${updated.title}</strong>" has been updated to:
              <strong>${status.replace(/_/g, ' ').toUpperCase()}</strong>.</p>
              <p>Thank you!</p>
            `,
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
    const { rows } = await sql`SELECT organisation_id FROM tickets WHERE id = ${id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Ticket not found' });

    if (!user.is_super_admin && rows[0].organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await sql`DELETE FROM tickets WHERE id = ${id}`;
    return res.status(200).json({ success: true, message: 'Ticket deleted' });
  } catch (err: any) {
    console.error('Delete ticket error:', err);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
}
