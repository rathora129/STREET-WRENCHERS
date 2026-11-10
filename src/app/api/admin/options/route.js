import { prisma } from '@/lib/prisma';
import { ok, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const GET = route(async () => {
  await requireOwner();

  const [categories, services, packages, brands, models, amcPlans, pages, campaigns] = await Promise.all([
    prisma.serviceCategory.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.service.findMany({
      select: { id: true, name: true, slug: true, categoryId: true, price: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.servicePackage.findMany({
      select: { id: true, name: true, slug: true, serviceId: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.brand.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.vehicleModel.findMany({
      select: { id: true, name: true, slug: true, brandId: true, brand: { select: { name: true } } },
      orderBy: [{ name: 'asc' }],
    }),
    prisma.amcPlan.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.page.findMany({
      select: { id: true, title: true, slug: true, template: true },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
    }),
    prisma.campaign.findMany({
      select: { id: true, name: true, slug: true, status: true },
      orderBy: [{ createdAt: 'desc' }],
    }),
  ]);

  return ok(
    {
      categories,
      services: services.map((service) => ({ ...service, price: service.price === null ? null : Number(service.price) })),
      packages,
      brands,
      models: models.map((model) => ({
        id: model.id,
        name: model.name,
        slug: model.slug,
        brandId: model.brandId,
        label: `${model.brand.name} — ${model.name}`,
      })),
      amcPlans,
      pages,
      campaigns,
    },
    NO_STORE,
  );
});
