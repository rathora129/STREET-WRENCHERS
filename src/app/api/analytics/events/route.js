import { prisma } from '@/lib/prisma';
import { analyticsEventSchema } from '@/lib/validation/resources';
import { created, readJson, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = route(async (request) => {
  const payload = await readJson(request, analyticsEventSchema);

  const event = await prisma.analyticsEvent.create({
    data: {
      type: payload.type,
      path: payload.path.slice(0, 600),
      sessionId: payload.sessionId || null,
      campaignId: payload.campaignId || null,
      source: payload.source || null,
      medium: payload.medium || null,
      value: payload.value ?? null,
      metadata: payload.metadata ?? undefined,
    },
    select: { id: true },
  });

  return created(event);
});
