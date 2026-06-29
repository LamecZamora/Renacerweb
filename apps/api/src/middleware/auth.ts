import type { Request, Response, NextFunction } from 'express';
import { verifyAccess } from '../lib/jwt.js';

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: { code: 'NO_TOKEN', message: 'Falta el token de acceso' } });
  }
  try {
    const { sub } = verifyAccess(header.slice(7));
    req.userId = sub;
    next();
  } catch {
    return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Token inválido o expirado' } });
  }
}
