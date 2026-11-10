import { prisma } from '@/lib/prisma';
import { ok, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const GET = route(async () => {
  const owner = await requireOwner();
  const sessions = await prisma.session.findMany({
    where: { ownerId: owner.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      userAgent: true,
      ipAddress: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return ok(
    sessions.map((session) => ({
      ...session,
      current: session.id === owner.sessionId,
      active: !session.revokedAt && session.expiresAt > new Date(),
    })),
    NO_STORE,
  );
});

export const DELETE = route(async () => {
  const owner = await requireOwner();
  const result = await prisma.session.updateMany({
    where: { ownerId: owner.id, id: { not: owner.sessionId }, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return ok({ revoked: result.count }, NO_STORE);
});
