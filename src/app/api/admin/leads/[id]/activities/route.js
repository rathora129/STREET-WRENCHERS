import { prisma } from '@/lib/prisma';
import { ApiError, created, ok, readJson, requireOwner, route } from '@/lib/http';
import { leadActivitySchema } from '@/lib/validation/resources';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const GET = route(async (request, { params }) => {
  await requireOwner();
  const { id } = await params;
  const activities = await prisma.leadActivity.findMany({
    where: { leadId: id },
    orderBy: { createdAt: 'desc' },
  });
  return ok(activities, NO_STORE);
});

export const POST = route(async (request, { params }) => {
  const owner = await requireOwner();
  const { id } = await params;
  const lead = await prisma.lead.findUnique({ where: { id }, select: { id: true } });
  if (!lead) throw new ApiError(404, 'Lead not found');

  const data = await readJson(request, leadActivitySchema);
  const activity = await prisma.leadActivity.create({
    data: { ...data, leadId: id, ownerId: owner.id },
  });

  return created(activity);
});
