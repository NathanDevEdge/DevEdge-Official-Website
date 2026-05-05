import { handleLogin, handleValidateToken } from '../server/handlers/auth.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'POST') return handleLogin(req, res);
  if (req.method === 'GET')  return handleValidateToken(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}
