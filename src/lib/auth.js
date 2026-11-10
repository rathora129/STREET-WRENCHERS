import crypto from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { hashPassword, verifyPassword } from './password';

export { hashPassword, verifyPassword };

export const SESSION_COOKIE = 'sw_session';
const SESSION_TTL_DAYS = 7;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

export async function createSession(ownerId, { userAgent = '', ipAddress = '' } = {}) {
  const token = crypto.randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      ownerId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: userAgent.slice(0, 255) || null,
      ipAddress: ipAddress.slice(0, 64) || null,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  return { token, expiresAt };
}

export async function destroyCurrentSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session
      .updateMany({ where: { tokenHash: hashToken(token) }, data: { revokedAt: new Date() } })
      .catch(() => {});
  }

  cookieStore.set(SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export const getCurrentOwner = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session
    .findUnique({ where: { tokenHash: hashToken(token) }, include: { owner: true } })
    .catch(() => null);

  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;

  return {
    id: session.owner.id,
    name: session.owner.name,
    email: session.owner.email,
    role: session.owner.role,
    sessionId: session.id,
    expiresAt: session.expiresAt,
  };
});

export async function pruneSessions() {
  await prisma.session
    .deleteMany({ where: { OR: [{ expiresAt: { lt: new Date() } }, { revokedAt: { not: null } }] } })
    .catch(() => {});
}
