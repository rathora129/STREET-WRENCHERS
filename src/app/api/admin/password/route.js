import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/password';
import { ApiError, ok, readJson, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password').max(200),
    newPassword: z
      .string()
      .min(10, 'Use at least 10 characters')
      .max(200)
      .regex(/[A-Za-z]/, 'Include at least one letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm the new password').max(200),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export const PUT = route(async (request) => {
  const owner = await requireOwner();
  const data = await readJson(request, passwordSchema);

  const record = await prisma.owner.findUnique({ where: { id: owner.id } });
  if (!record) throw new ApiError(404, 'Owner account not found');

  const valid = await verifyPassword(data.currentPassword, record.passwordHash);
  if (!valid) throw new ApiError(400, 'Your current password is incorrect');

  await prisma.owner.update({
    where: { id: owner.id },
    data: { passwordHash: await hashPassword(data.newPassword) },
  });

  await prisma.session.updateMany({
    where: { ownerId: owner.id, id: { not: owner.sessionId }, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return ok({ updated: true, otherSessionsRevoked: true }, NO_STORE);
});
