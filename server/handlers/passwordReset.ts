import { pool } from '../db.js';
import { Resend } from 'resend';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function handleForgotPassword(req: any, res: any) {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const { rows } = await pool.query(
      `SELECT id, name FROM users WHERE email = $1`,
      [email]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const token = generateToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(`DELETE FROM password_resets WHERE user_id = $1`, [user.id]);
      await pool.query(
        `INSERT INTO password_resets (token, user_id, expires_at) VALUES ($1, $2, $3)`,
        [token, user.id, expiresAt.toISOString()]
      );

      if (RESEND_API_KEY) {
        try {
          const resend = new Resend(RESEND_API_KEY);
          const resetUrl = `${APP_URL}/portal/reset-password?token=${token}`;
          await resend.emails.send({
            from: 'DevEdge <noreply@devedge.com.au>',
            to: [email],
            subject: 'Reset your DevEdge portal password',
            html: resetEmailHtml({ name: user.name, resetUrl }),
          });
        } catch (e) {
          console.error('Reset email failed:', e);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a reset link has been sent.',
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}

export async function handleValidateResetToken(req: any, res: any) {
  const token = req.query?.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const { rows } = await pool.query(
      `SELECT pr.id, u.email
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.token = $1 AND pr.used_at IS NULL AND pr.expires_at > NOW()`,
      [token]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid or expired reset link' });
    return res.status(200).json({ success: true, email: rows[0].email });
  } catch (err: any) {
    console.error('Validate reset token error:', err);
    return res.status(500).json({ error: 'Failed to validate token' });
  }
}

export async function handleResetPassword(req: any, res: any) {
  const { token, password } = req.body || {};
  if (!token || !password) return res.status(400).json({ error: 'Missing token or password' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  try {
    const { rows } = await pool.query(
      `SELECT pr.id, pr.user_id
       FROM password_resets pr
       WHERE pr.token = $1 AND pr.used_at IS NULL AND pr.expires_at > NOW()`,
      [token]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Invalid or expired reset link' });

    const reset = rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(`UPDATE users SET password_hash = $1 WHERE id = $2`, [passwordHash, reset.user_id]);
    await pool.query(`UPDATE password_resets SET used_at = NOW() WHERE id = $1`, [reset.id]);

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
}

function resetEmailHtml({ name, resetUrl }: { name: string; resetUrl: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Reset your password — DevEdge</title>
</head>
<body style="margin:0;padding:0;background-color:#F5E6D5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5E6D5;">
  <tr><td align="center" style="padding:48px 20px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
      <tr><td style="padding-bottom:36px;">
        <table role="presentation" cellpadding="0" cellspacing="0">
          <tr>
            <td style="width:8px;background-color:#C97B3A;">&nbsp;</td>
            <td style="width:8px;">&nbsp;</td>
            <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;font-weight:700;color:#1A1008;letter-spacing:-0.01em;">DevEdge</td>
          </tr>
        </table>
      </td></tr>
      <tr><td style="background-color:#FBEFD9;border:1px solid #D4B896;padding:52px 48px;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="width:24px;height:1px;background-color:#C97B3A;vertical-align:middle;">&nbsp;</td>
            <td style="padding-left:12px;vertical-align:middle;font-family:monospace,'Courier New';font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#C97B3A;">Client Portal &middot; Security</td>
          </tr>
        </table>
        <h1 style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:44px;font-weight:900;color:#1A1008;margin:0 0 4px 0;line-height:1.05;letter-spacing:-0.025em;">Reset your<br>password.</h1>
        <p style="font-family:monospace,'Courier New';font-size:11px;color:#7A5C3A;letter-spacing:0.06em;margin:0 0 36px 0;">DevEdge Client Portal</p>
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 8px 0;">Hi ${name},</p>
        <p style="font-size:15px;line-height:1.7;color:#3D2810;margin:0 0 36px 0;">We received a request to reset the password for your DevEdge portal account. Click below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
          <tr>
            <td style="background-color:#C97B3A;">
              <a href="${resetUrl}" style="display:inline-block;padding:15px 36px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.07em;text-transform:uppercase;">Reset Password &rarr;</a>
            </td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr><td style="border-top:1px solid #D4B896;font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
        <p style="font-family:monospace,'Courier New';font-size:10px;color:#7A5C3A;margin:0 0 8px 0;letter-spacing:0.03em;">If you didn't request this, your account is safe — just ignore this email.</p>
        <p style="font-family:monospace,'Courier New';font-size:10px;color:#C97B3A;margin:0;word-break:break-all;letter-spacing:0.02em;">${resetUrl}</p>
      </td></tr>
      <tr><td style="padding-top:28px;">
        <p style="font-family:monospace,'Courier New';font-size:10px;color:#7A5C3A;letter-spacing:0.15em;text-transform:uppercase;margin:0;">DevEdge &middot; devedge.com.au</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;
}
