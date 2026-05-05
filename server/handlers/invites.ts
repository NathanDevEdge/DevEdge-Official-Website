import { sql } from '@vercel/postgres';
import { verifyToken } from '../middleware/auth.js';
import { Resend } from 'resend';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ── Create & send invite ──────────────────────────────────────────────────────

export async function handleCreateInvite(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin' && !user.is_super_admin) {
    return res.status(403).json({ error: 'Admins only' });
  }

  const { email, name, role = 'user', org_id } = req.body || {};
  if (!email || !name) return res.status(400).json({ error: 'Missing email or name' });

  const validRoles = ['admin', 'user'];
  if (!validRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const targetOrgId = user.is_super_admin && org_id ? org_id : user.organisation_id;

  try {
    const { rows: existing } = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const { rows: pending } = await sql`
      SELECT id FROM invites
      WHERE email = ${email} AND organisation_id = ${targetOrgId}
        AND accepted_at IS NULL AND expires_at > NOW()
    `;
    if (pending.length > 0) {
      return res.status(409).json({ error: 'A pending invite already exists for this email' });
    }

    const token = generateToken();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await sql`
      INSERT INTO invites (token, email, name, role, organisation_id, invited_by, expires_at)
      VALUES (${token}, ${email}, ${name}, ${role}, ${targetOrgId}, ${user.id}, ${expiresAt.toISOString()})
    `;

    const { rows: orgRows } = await sql`SELECT name FROM organisations WHERE id = ${targetOrgId}`;
    const orgName = orgRows[0]?.name ?? 'DevEdge';

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const acceptUrl = `${APP_URL}/portal/accept-invite?token=${token}`;
        await resend.emails.send({
          from: 'DevEdge <noreply@devedge.com.au>',
          to: [email],
          subject: `You've been invited to the ${orgName} portal`,
          html: inviteEmailHtml({ name, orgName, inviterName: user.name, acceptUrl }),
        });
      } catch (e) {
        console.error('Invite email failed:', e);
      }
    }

    return res.status(201).json({ success: true, message: 'Invite sent' });
  } catch (err: any) {
    console.error('Create invite error:', err);
    return res.status(500).json({ error: 'Failed to send invite' });
  }
}

// ── Validate invite token (public) ───────────────────────────────────────────

export async function handleValidateInvite(req: any, res: any) {
  const token = req.query?.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const { rows } = await sql`
      SELECT i.email, i.name, i.role, o.name AS org_name
      FROM invites i
      JOIN organisations o ON i.organisation_id = o.id
      WHERE i.token = ${token} AND i.accepted_at IS NULL AND i.expires_at > NOW()
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid or expired invite link' });
    return res.status(200).json({ success: true, invite: rows[0] });
  } catch (err: any) {
    console.error('Validate invite error:', err);
    return res.status(500).json({ error: 'Failed to validate invite' });
  }
}

// ── Accept invite & create account (public) ───────────────────────────────────

export async function handleAcceptInvite(req: any, res: any) {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const { rows } = await sql`
      SELECT * FROM invites
      WHERE token = ${token} AND accepted_at IS NULL AND expires_at > NOW()
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid or expired invite link' });

    const invite = rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await sql`
      INSERT INTO users (email, name, password_hash, role, organisation_id)
      VALUES (${invite.email}, ${invite.name}, ${passwordHash}, ${invite.role}, ${invite.organisation_id})
    `;
    await sql`UPDATE invites SET accepted_at = NOW() WHERE id = ${invite.id}`;

    return res.status(200).json({ success: true, message: 'Account created. You can now sign in.' });
  } catch (err: any) {
    if (err.message?.includes('unique')) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    console.error('Accept invite error:', err);
    return res.status(500).json({ error: 'Failed to create account' });
  }
}

// ── Resend invite email ───────────────────────────────────────────────────────

export async function handleResendInvite(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin' && !user.is_super_admin) {
    return res.status(403).json({ error: 'Admins only' });
  }

  const { invite_id } = req.body || {};
  if (!invite_id) return res.status(400).json({ error: 'Missing invite_id' });

  try {
    const { rows } = await sql`
      SELECT i.*, o.name AS org_name
      FROM invites i
      JOIN organisations o ON i.organisation_id = o.id
      WHERE i.id = ${invite_id} AND i.accepted_at IS NULL
    `;
    if (rows.length === 0) return res.status(404).json({ error: 'Invite not found' });

    const invite = rows[0];

    if (!user.is_super_admin && invite.organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const newToken = generateToken();
    const newExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await sql`
      UPDATE invites SET token = ${newToken}, expires_at = ${newExpiry.toISOString()}
      WHERE id = ${invite_id}
    `;

    if (RESEND_API_KEY) {
      try {
        const resend = new Resend(RESEND_API_KEY);
        const acceptUrl = `${APP_URL}/portal/accept-invite?token=${newToken}`;
        await resend.emails.send({
          from: 'DevEdge <noreply@devedge.com.au>',
          to: [invite.email],
          subject: `Reminder: You've been invited to the ${invite.org_name} portal`,
          html: inviteEmailHtml({ name: invite.name, orgName: invite.org_name, inviterName: user.name, acceptUrl }),
        });
      } catch (e) {
        console.error('Resend invite email failed:', e);
      }
    }

    return res.status(200).json({ success: true, message: 'Invite resent' });
  } catch (err: any) {
    console.error('Resend invite error:', err);
    return res.status(500).json({ error: 'Failed to resend invite' });
  }
}

// ── Cancel invite ─────────────────────────────────────────────────────────────

export async function handleCancelInvite(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });
  if (user.role !== 'admin' && !user.is_super_admin) {
    return res.status(403).json({ error: 'Admins only' });
  }

  const { invite_id } = req.body || {};
  if (!invite_id) return res.status(400).json({ error: 'Missing invite_id' });

  try {
    const { rows } = await sql`SELECT organisation_id FROM invites WHERE id = ${invite_id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Invite not found' });

    if (!user.is_super_admin && rows[0].organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await sql`DELETE FROM invites WHERE id = ${invite_id}`;
    return res.status(200).json({ success: true, message: 'Invite cancelled' });
  } catch (err: any) {
    console.error('Cancel invite error:', err);
    return res.status(500).json({ error: 'Failed to cancel invite' });
  }
}

// ── Email template ────────────────────────────────────────────────────────────

function inviteEmailHtml({
  name, orgName, inviterName, acceptUrl,
}: {
  name: string; orgName: string; inviterName: string; acceptUrl: string;
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're Invited — DevEdge</title>
</head>
<body style="margin:0;padding:0;background-color:#F5E6D5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5E6D5;">
  <tr><td align="center" style="padding:48px 20px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

      <!-- Brand -->
      <tr><td style="padding-bottom:36px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:8px;background-color:#C97B3A;">&nbsp;</td>
            <td style="width:8px;">&nbsp;</td>
            <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#1A1008;letter-spacing:-0.01em;">DevEdge</td>
          </tr>
        </table>
      </td></tr>

      <!-- Card -->
      <tr><td style="background-color:#FBEFD9;border:1px solid #D4B896;padding:52px 48px;">

        <!-- Overline -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="width:24px;height:1px;background-color:#C97B3A;vertical-align:middle;">&nbsp;</td>
            <td style="padding-left:12px;vertical-align:middle;font-family:monospace,'Courier New';font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C97B3A;">
              Client Portal &middot; Invitation
            </td>
          </tr>
        </table>

        <!-- Heading -->
        <h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:44px;font-weight:900;color:#1A1008;margin:0 0 4px 0;line-height:1.05;letter-spacing:-0.025em;">
          You're<br>invited.
        </h1>
        <p style="font-family:monospace,'Courier New';font-size:11px;color:#7A5C3A;letter-spacing:0.06em;margin:0 0 36px 0;">${orgName}</p>

        <!-- Body -->
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 8px 0;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 36px 0;">
          <strong>${inviterName}</strong> has invited you to access the <strong>${orgName}</strong> client portal on DevEdge. Click below to set your password and get started.
        </p>

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
          <tr>
            <td style="background-color:#C97B3A;">
              <a href="${acceptUrl}" style="display:inline-block;padding:15px 36px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.07em;text-transform:uppercase;">
                Accept Invitation &rarr;
              </a>
            </td>
          </tr>
        </table>

        <!-- Divider -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="border-top:1px solid #D4B896;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>

        <p style="font-family:monospace,'Courier New';font-size:10px;color:#7A5C3A;margin:0 0 8px 0;letter-spacing:0.03em;">
          This link expires in 48 hours. If you weren't expecting this, you can safely ignore it.
        </p>
        <p style="font-family:monospace,'Courier New';font-size:10px;color:#C97B3A;margin:0;word-break:break-all;letter-spacing:0.02em;">${acceptUrl}</p>

      </td></tr>

      <!-- Footer -->
      <tr><td style="padding-top:28px;">
        <p style="font-family:monospace,'Courier New';font-size:10px;color:#7A5C3A;letter-spacing:0.15em;text-transform:uppercase;margin:0;">
          DevEdge &middot; devedge.com.au
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}
