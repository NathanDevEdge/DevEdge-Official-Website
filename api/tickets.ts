import {
  handleGetTickets,
  handleCreateTicket,
  handleUpdateTicket,
  handleDeleteTicket,
} from '../server/handlers/tickets.js';

export default async function handler(req: any, res: any) {
  if (req.method === 'GET')    return handleGetTickets(req, res);
  if (req.method === 'POST')   return handleCreateTicket(req, res);
  if (req.method === 'PATCH')  return handleUpdateTicket(req, res);
  if (req.method === 'DELETE') return handleDeleteTicket(req, res);
  return res.status(405).json({ error: 'Method not allowed' });
}
