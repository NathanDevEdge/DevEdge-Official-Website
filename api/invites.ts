import {
  handleCreateInvite,
  handleValidateInvite,
  handleAcceptInvite,
  handleResendInvite,
  handleCancelInvite,
} from '../server/handlers/invites.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') return handleValidateInvite(req, res);

  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'create') return handleCreateInvite(req, res);
    if (action === 'accept') return handleAcceptInvite(req, res);
    if (action === 'resend') return handleResendInvite(req, res);
    return res.status(400).json({ error: 'Missing or invalid action' });
  }

  if (req.method === 'DELETE') return handleCancelInvite(req, res);

  return res.status(405).json({ error: 'Method not allowed' });
}
