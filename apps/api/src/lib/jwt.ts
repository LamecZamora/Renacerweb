import jwt from 'jsonwebtoken';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? 'dev-access';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh';

export type JwtPayload = { sub: string };

export const signAccess = (userId: string) =>
  jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: '15m' });

export const signRefresh = (userId: string) =>
  jwt.sign({ sub: userId }, REFRESH_SECRET, { expiresIn: '30d' });

export const verifyAccess = (token: string): JwtPayload =>
  jwt.verify(token, ACCESS_SECRET) as JwtPayload;

export const verifyRefresh = (token: string): JwtPayload =>
  jwt.verify(token, REFRESH_SECRET) as JwtPayload;
