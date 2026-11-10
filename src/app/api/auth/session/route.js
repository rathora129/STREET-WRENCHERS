import { getCurrentOwner } from '@/lib/auth';
import { ApiError, ok, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = route(async () => {
  const owner = await getCurrentOwner();
  if (!owner) throw new ApiError(401, 'Not signed in');
  return ok(owner);
});
