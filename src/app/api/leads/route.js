import { prisma } from '@/lib/prisma';
import { publicLeadSchema } from '@/lib/validation/resources';
import { rateLimit } from '@/lib/rate-limit';
import { clientIp, created, readJson, route, tooManyRequests } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const POST = route(async (request) => {
  const gate = rateLimit(`lead:${clientIp(request)}`, { limit: 20, windowMs: 10 * 60 * 1000 });
  if (!gate.allowed) return tooManyRequests(gate.retryAfter);

  const payload = await readJson(request, publicLeadSchema);

  let campaignId = null;
  if (payload.utmCampaign) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        OR: [{ campaignId: payload.utmCampaign }, { slug: payload.utmCampaign }],
      },
      select: { id: true },
    });
    campaignId = campaign?.id || null;
  }

  if (payload.amcPlanId) {
    const plan = await prisma.amcPlan.findFirst({
      where: { id: payload.amcPlanId, isPublished: true },
      select: { id: true },
    });
    if (!plan) payload.amcPlanId = null;
  }

  const phone = payload.phone.replace(/[^\d+]/g, '');

  const lead = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone },
      create: { name: payload.name, phone, email: payload.email || null },
      update: { name: payload.name, ...(payload.email ? { email: payload.email } : {}) },
      select: { id: true },
    });

    return tx.lead.create({
      data: {
        name: payload.name,
        phone,
        email: payload.email || null,
        type: payload.type,
        vehicleBrand: payload.vehicleBrand || null,
        vehicleModel: payload.vehicleModel || null,
        vehicleYear: payload.vehicleYear || null,
        message: payload.message || null,
        source: payload.source || 'website',
        utmSource: payload.utmSource || null,
        utmMedium: payload.utmMedium || null,
        utmCampaign: payload.utmCampaign || null,
        utmTerm: payload.utmTerm || null,
        utmContent: payload.utmContent || null,
        landingPage: payload.landingPage || null,
        amcPlanId: payload.amcPlanId || null,
        campaignId,
        customerId: customer.id,
      },
      select: { id: true, type: true, createdAt: true },
    });
  });

  return created(lead);
});
