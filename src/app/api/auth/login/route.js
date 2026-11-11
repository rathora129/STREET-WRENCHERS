import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession, pruneSessions } from '@/lib/auth';
import { loginSchema } from '@/lib/validation/resources';
import { rateLimit, resetRateLimit } from '@/lib/rate-limit';
import { ApiError, clientIp, ok, readJson, route, tooManyRequests } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const WINDOW_MS = 15 * 60 * 1000;

export const POST = route(async (request) => {
  const { email, password } = await readJson(request, loginSchema);
  const address = clientIp(request);
  const normalisedEmail = email.toLowerCase().trim();

  const byIp = rateLimit(`login:ip:${address}`, { limit: 20, windowMs: WINDOW_MS });
  const byPair = rateLimit(`login:pair:${address}:${normalisedEmail}`, { limit: 8, windowMs: WINDOW_MS });
  if (!byIp.allowed || !byPair.allowed) {
    return tooManyRequests(Math.max(byIp.retryAfter, byPair.retryAfter));
  }

  const owner = await prisma.owner.findUnique({ where: { email: normalisedEmail } });
  const valid = owner ? await verifyPassword(password, owner.passwordHash) : false;

  if (!owner || !valid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  resetRateLimit(`login:pair:${address}:${normalisedEmail}`);
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
