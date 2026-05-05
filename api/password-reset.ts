import {
  handleForgotPassword,
  handleValidateResetToken,
  handleResetPassword,
} from '../server/handlers/passwordReset.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') return handleValidateResetToken(req, res);

  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'forgot') return handleForgotPassword(req, res);
    if (action === 'reset')  return handleResetPassword(req, res);
    return res.status(400).json({ error: 'Missing or invalid action' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
