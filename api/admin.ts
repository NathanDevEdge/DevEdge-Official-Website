import {
  handleGetAdmin,
  handleCreateOrg,
  handleCreateUser,
  handleUpdateUserRole,
  handleDeleteUser,
} from '../server/handlers/admin.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') return handleGetAdmin(req, res);

  if (req.method === 'POST') {
    const { action } = req.body || {};
    if (action === 'create_org')  return handleCreateOrg(req, res);
    if (action === 'create_user') return handleCreateUser(req, res);
    if (action === 'update_role') return handleUpdateUserRole(req, res);
    return res.status(400).json({ error: 'Missing or invalid action' });
  }

  if (req.method === 'DELETE') return handleDeleteUser(req, res);

  return res.status(405).json({ error: 'Method not allowed' });
}
