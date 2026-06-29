import { Router } from 'express';
import argon2 from 'argon2';
import { z } from 'zod';
import { prisma } from '../../lib/prisma.js';
import { signAccess, signRefresh, verifyRefresh } from '../../lib/jwt.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().min(2),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Datos inválidos', details: parsed.error.flatten() } });
  }
  const { email, password, displayName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: { code: 'EMAIL_TAKEN', message: 'Ese correo ya está registrado' } });
  }

  const passwordHash = await argon2.hash(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      displayName,
      profile: { create: {} },
    },
  });

  return res.status(201).json({
    data: {
      user: { id: user.id, email: user.email, displayName: user.displayName },
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    },
  });
});

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: { code: 'VALIDATION', message: 'Datos inválidos' } });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash || !(await argon2.verify(user.passwordHash, password))) {
    return res.status(401).json({ error: { code: 'BAD_CREDENTIALS', message: 'Correo o contraseña incorrectos' } });
  }

  return res.json({
    data: {
      user: { id: user.id, email: user.email, displayName: user.displayName },
      accessToken: signAccess(user.id),
      refreshToken: signRefresh(user.id),
    },
  });
});

authRouter.post('/refresh', (req, res) => {
  const token = z.object({ refreshToken: z.string() }).safeParse(req.body);
  if (!token.success) return res.status(400).json({ error: { code: 'VALIDATION', message: 'Falta refreshToken' } });
  try {
    const { sub } = verifyRefresh(token.data.refreshToken);
    return res.json({ data: { accessToken: signAccess(sub), refreshToken: signRefresh(sub) } });
  } catch {
    return res.status(401).json({ error: { code: 'BAD_TOKEN', message: 'Refresh token inválido' } });
  }
});
