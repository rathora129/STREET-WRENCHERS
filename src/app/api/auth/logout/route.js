import { destroyCurrentSession } from '@/lib/auth';
import { ok, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = route(async () => {
  await destroyCurrentSession();
  return ok({ signedOut: true });
});
