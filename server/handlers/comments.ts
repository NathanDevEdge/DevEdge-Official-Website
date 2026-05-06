import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function handleGetComments(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const ticketId = parseInt(req.query?.ticket_id);
  if (!ticketId) return res.status(400).json({ error: 'Missing ticket_id' });

  try {
    // Verify access to ticket
    const { rows: tRows } = await pool.query(
      `SELECT organisation_id FROM tickets WHERE id = $1`,
      [ticketId]
    );
    if (tRows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    if (!user.is_super_admin && tRows[0].organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const orgId = tRows[0].organisation_id;

    // Return mentionable users when requested
    if (req.query?.mentionables === '1') {
      const { rows } = await pool.query(
        `SELECT u.id, u.name FROM users u
         JOIN organisations o ON u.organisation_id = o.id
         WHERE u.organisation_id = $1 OR o.is_super_org = TRUE
         ORDER BY u.name`,
        [orgId]
      );
      return res.status(200).json({ success: true, users: rows });
    }

    const { rows } = await pool.query(
      `SELECT c.id, c.content, c.created_at, u.name AS author_name, u.id AS author_id
       FROM ticket_comments c
       JOIN users u ON c.author_id = u.id
       WHERE c.ticket_id = $1
       ORDER BY c.created_at ASC`,
      [ticketId]
    );
    return res.status(200).json({ success: true, comments: rows });
  } catch (err: any) {
    console.error('Get comments error:', err);
    return res.status(500).json({ error: 'Failed to fetch comments' });
  }
}

export async function handleCreateComment(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { ticket_id, content } = req.body || {};
  if (!ticket_id || !content?.trim()) {
    return res.status(400).json({ error: 'Missing ticket_id or content' });
  }

  try {
    // Verify access to ticket
    const { rows: tRows } = await pool.query(
      `SELECT t.*, u.name AS client_name FROM tickets t JOIN users u ON t.client_id = u.id WHERE t.id = $1`,
      [ticket_id]
    );
    if (tRows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    const ticket = tRows[0];

    if (!user.is_super_admin && ticket.organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Insert comment
    const { rows } = await pool.query(
      `INSERT INTO ticket_comments (ticket_id, author_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`,
      [ticket_id, user.id, content.trim()]
    );
    const comment = { ...rows[0], author_name: user.name, author_id: user.id };

    // Detect @mentions and send notifications
    if (RESEND_API_KEY) {
      await notifyMentions(content, ticket, user, ticket.organisation_id);
    }

    return res.status(201).json({ success: true, comment });
  } catch (err: any) {
    console.error('Create comment error:', err);
    return res.status(500).json({ error: 'Failed to create comment' });
  }
}

async function notifyMentions(
  content: string,
  ticket: any,
  author: any,
  orgId: number,
) {
  // Extract @Name mentions
  const mentions = Array.from(new Set(
    (content.match(/@([A-Za-z][A-Za-z0-9_-]*)/g) || []).map((m: string) => m.slice(1))
  ));
  if (mentions.length === 0) return;

  // Fetch all org members + DevEdge super users
  const { rows: orgUsers } = await pool.query(
    `SELECT u.id, u.name, u.email, u.role
     FROM users u
     JOIN organisations o ON u.organisation_id = o.id
     WHERE u.organisation_id = $1 OR o.is_super_org = TRUE`,
    [orgId]
  );

  const resend = new Resend(RESEND_API_KEY!);

  for (const mention of mentions) {
    const mentionLower = mention.toLowerCase();
    const matched = orgUsers.filter((u: any) =>
      u.name.toLowerCase().startsWith(mentionLower) ||
      u.name.toLowerCase().split(' ').some((part: string) => part.startsWith(mentionLower))
    );

    for (const mentioned of matched) {
      if (mentioned.id === author.id) continue; // don't notify yourself
      const portalPath = mentioned.role === 'admin' ? 'admin' : 'portal';
      const ticketUrl = `${APP_URL}/${portalPath}?ticket=${ticket.id}`;
      try {
        await resend.emails.send({
          from: 'DevEdge Portal <noreply@devedge.com.au>',
          to: [mentioned.email],
          subject: `${author.name} mentioned you on: ${ticket.title}`,
          html: mentionEmailHtml({
            mentionedName: mentioned.name,
            authorName: author.name,
            ticketTitle: ticket.title,
            commentContent: content,
            ticketUrl,
          }),
        });
      } catch (e) {
        console.error('Mention email failed:', e);
      }
    }
  }
}

function mentionEmailHtml({
  mentionedName, authorName, ticketTitle, commentContent, ticketUrl,
}: {
  mentionedName: string; authorName: string; ticketTitle: string;
  commentContent: string; ticketUrl: string;
}): string {
  const safeContent = commentContent.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background-color:#F5E6D5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5E6D5;">
  <tr><td align="center" style="padding:48px 20px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr><td style="padding-bottom:36px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:8px;background-color:#C97B3A;">&nbsp;</td>
            <td style="width:8px;">&nbsp;</td>
            <td style="font-size:15px;font-weight:700;color:#1A1008;">DevEdge</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background-color:#FBEFD9;border:1px solid #D4B896;padding:48px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr>
            <td style="width:24px;height:1px;background-color:#C97B3A;vertical-align:middle;">&nbsp;</td>
            <td style="padding-left:12px;font-family:monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C97B3A;">Client Portal · Mention</td>
          </tr>
        </table>
        <h1 style="font-size:36px;font-weight:900;color:#1A1008;margin:0 0 24px 0;line-height:1.1;">You were<br>mentioned.</h1>
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 8px 0;">Hi ${mentionedName},</p>
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 24px 0;"><strong>${authorName}</strong> mentioned you in a comment on ticket <strong>"${ticketTitle}"</strong>:</p>
        <div style="background-color:#F5E6D5;border-left:3px solid #C97B3A;padding:16px 20px;margin:0 0 32px 0;">
          <p style="font-size:14px;line-height:1.7;color:#3D2810;margin:0;">${safeContent}</p>
        </div>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
          <tr>
            <td style="background-color:#C97B3A;">
              <a href="${ticketUrl}" style="display:inline-block;padding:14px 32px;font-size:12px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.07em;text-transform:uppercase;">View Ticket &rarr;</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr><td style="border-top:1px solid #D4B896;">&nbsp;</td></tr>
        </table>
        <p style="font-family:monospace;font-size:10px;color:#7A5C3A;margin:0;letter-spacing:0.03em;">If you weren't expecting this, you can safely ignore it.</p>
      </td></tr>
      <tr><td style="padding-top:24px;">
        <p style="font-family:monospace;font-size:10px;color:#7A5C3A;letter-spacing:0.15em;text-transform:uppercase;margin:0;">DevEdge · devedge.com.au</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
