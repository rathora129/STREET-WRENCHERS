import { prisma } from '@/lib/prisma';
import { ApiError, ok, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const DELETE = route(async (request, { params }) => {
  const owner = await requireOwner();
  const { id } = await params;

  const session = await prisma.session.findFirst({ where: { id, ownerId: owner.id } });
  if (!session) throw new ApiError(404, 'Session not found');
  if (session.id === owner.sessionId) {
    throw new ApiError(400, 'Use the sign out button to end your current session');
  }

  await prisma.session.update({ where: { id }, data: { revokedAt: new Date() } });
  return ok({ revoked: true, id }, NO_STORE);
});
