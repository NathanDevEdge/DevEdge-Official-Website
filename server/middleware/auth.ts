import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'development_jwt_secret_dev_edge_change_in_production';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  organisation_id: number;
  is_super_admin: boolean;
}

export function verifyToken(authHeader: string | undefined): AuthUser | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch {
    return null;
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}
