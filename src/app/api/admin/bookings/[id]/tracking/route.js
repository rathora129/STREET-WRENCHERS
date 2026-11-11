import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { ApiError, ok, readJson, requireOwner, route } from '@/lib/http';
import { createTrackingToken, trackingUrlFor } from '@/lib/tracking';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

const trackingActionSchema = z.object({
  action: z.enum(['generate', 'revoke']),
});

export const POST = route(async (request, { params }) => {
  await requireOwner();
  const { id } = await params;
  const { action } = await readJson(request, trackingActionSchema);

  const booking = await prisma.booking.findUnique({
    where: { id },
    select: { id: true, reference: true, trackingToken: true, trackingEnabled: true },
  });
  if (!booking) throw new ApiError(404, 'Booking not found');

  if (action === 'revoke') {
    await prisma.booking.update({
      where: { id },
      data: { trackingToken: null, trackingEnabled: false },
    });
    return ok({ enabled: false, trackingUrl: null, token: null }, NO_STORE);
  }

  const token = createTrackingToken();
  await prisma.booking.update({
    where: { id },
    data: { trackingToken: token, trackingEnabled: true },
  });

  return ok(
    {
      enabled: true,
      token,
      trackingUrl: trackingUrlFor(token),
    },
    NO_STORE,
  );
});
