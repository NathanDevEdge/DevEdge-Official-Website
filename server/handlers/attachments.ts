import { pool } from '../db.js';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export async function handleGetAttachments(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const ticketId = parseInt(req.query?.ticket_id);
  if (!ticketId) return res.status(400).json({ error: 'Missing ticket_id' });

  try {
    const { rows: tRows } = await pool.query(
      `SELECT organisation_id FROM tickets WHERE id = $1`,
      [ticketId]
    );
    if (tRows.length === 0) return res.status(404).json({ error: 'Ticket not found' });
    if (!user.is_super_admin && tRows[0].organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { rows } = await pool.query(
      `SELECT a.id, a.original_name, a.mime_type, a.size, a.created_at, u.name AS uploader_name
       FROM ticket_attachments a
       JOIN users u ON a.uploaded_by = u.id
       WHERE a.ticket_id = $1
       ORDER BY a.created_at ASC`,
      [ticketId]
    );
    return res.status(200).json({ success: true, attachments: rows });
  } catch (err: any) {
    console.error('Get attachments error:', err);
    return res.status(500).json({ error: 'Failed to fetch attachments' });
  }
}

export async function handleUploadAttachment(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const ticketId = parseInt(req.body?.ticket_id);
  if (!ticketId) return res.status(400).json({ error: 'Missing ticket_id' });
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  try {
    const { rows: tRows } = await pool.query(
      `SELECT organisation_id FROM tickets WHERE id = $1`,
      [ticketId]
    );
    if (tRows.length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: 'Ticket not found' });
    }
    if (!user.is_super_admin && tRows[0].organisation_id !== user.organisation_id) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { rows } = await pool.query(
      `INSERT INTO ticket_attachments (ticket_id, uploaded_by, filename, original_name, mime_type, size)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, original_name, mime_type, size, created_at`,
      [ticketId, user.id, req.file.filename, req.file.originalname, req.file.mimetype, req.file.size]
    );
    return res.status(201).json({ success: true, attachment: { ...rows[0], uploader_name: user.name } });
  } catch (err: any) {
    if (req.file?.path) fs.unlinkSync(req.file.path);
    console.error('Upload attachment error:', err);
    return res.status(500).json({ error: 'Failed to save attachment' });
  }
}

export async function handleServeAttachment(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = parseInt(req.params?.id);
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const { rows } = await pool.query(
      `SELECT a.filename, a.original_name, a.mime_type, t.organisation_id
       FROM ticket_attachments a
       JOIN tickets t ON a.ticket_id = t.id
       WHERE a.id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Attachment not found' });
    const att = rows[0];

    if (!user.is_super_admin && att.organisation_id !== user.organisation_id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const filePath = path.join(uploadDir, att.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found on disk' });

    res.setHeader('Content-Type', att.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${att.original_name}"`);
    return res.sendFile(filePath);
  } catch (err: any) {
    console.error('Serve attachment error:', err);
    return res.status(500).json({ error: 'Failed to serve file' });
  }
}

export async function handleDeleteAttachment(req: any, res: any) {
  const user = verifyToken(req.headers.authorization);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const id = parseInt(req.params?.id);
  if (!id) return res.status(400).json({ error: 'Missing id' });

  try {
    const { rows } = await pool.query(
      `SELECT a.filename, a.uploaded_by, t.organisation_id
       FROM ticket_attachments a
       JOIN tickets t ON a.ticket_id = t.id
       WHERE a.id = $1`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Attachment not found' });
    const att = rows[0];

    const canDelete =
      user.is_super_admin ||
      (user.role === 'admin' && att.organisation_id === user.organisation_id) ||
      att.uploaded_by === user.id;

    if (!canDelete) return res.status(403).json({ error: 'Forbidden' });

    await pool.query(`DELETE FROM ticket_attachments WHERE id = $1`, [id]);

    const filePath = path.join(uploadDir, att.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    return res.status(200).json({ success: true, message: 'Attachment deleted' });
  } catch (err: any) {
    console.error('Delete attachment error:', err);
    return res.status(500).json({ error: 'Failed to delete attachment' });
  }
}
