import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession, pruneSessions } from '@/lib/auth';
import { loginSchema } from '@/lib/validation/resources';
import { ApiError, clientIp, ok, readJson, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = route(async (request) => {
  const { email, password } = await readJson(request, loginSchema);

  const owner = await prisma.owner.findUnique({ where: { email: email.toLowerCase().trim() } });
  const valid = owner ? await verifyPassword(password, owner.passwordHash) : false;

  if (!owner || !valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  await pruneSessions();
  await createSession(owner.id, {
    userAgent: request.headers.get('user-agent') || '',
    ipAddress: clientIp(request),
  });

  return ok({
    id: owner.id,
    name: owner.name,
    email: owner.email,
    role: owner.role,
  });
});
