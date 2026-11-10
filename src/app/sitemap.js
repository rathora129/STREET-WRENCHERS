import { prisma } from '@/lib/prisma';
import { SITE_URL } from '@/lib/site';
import { getPublicModules } from '@/lib/modules';

export const dynamic = 'force-dynamic';

const entry = (path, { lastModified, priority = 0.7, changeFrequency = 'weekly' } = {}) => ({
  url: `${SITE_URL}${path}`,
  lastModified: lastModified || new Date(),
  changeFrequency,
  priority,
});

export default async function sitemap() {
  const [pages, services, plans, blogs, modules] = await Promise.all([
    prisma.page.findMany({ where: { status: 'PUBLISHED' }, select: { slug: true, updatedAt: true } }),
    prisma.service.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.amcPlan.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
    }),
    getPublicModules(),
  ]);

  const entries = new Map();

  for (const page of pages) {
    const path = page.slug === 'home' ? '/' : `/${page.slug}`;
    entries.set(path, entry(path, { lastModified: page.updatedAt, priority: path === '/' ? 1 : 0.8 }));
  }

  for (const service of services) {
    const path = `/services/${service.slug}`;
    entries.set(path, entry(path, { lastModified: service.updatedAt, priority: 0.75 }));
  }

  for (const plan of plans) {
    const path = `/amc/${plan.slug}`;
    entries.set(path, entry(path, { lastModified: plan.updatedAt, priority: 0.7 }));
  }

  for (const post of blogs) {
    const path = `/blog/${post.slug}`;
    entries.set(path, entry(path, { lastModified: post.updatedAt, priority: 0.6, changeFrequency: 'monthly' }));
  }

  for (const module of modules) {
    entries.set(module.publicPath, entry(module.publicPath, { priority: 0.6 }));
  }

  const activeModuleKeys = modules.filter((module) => module.status === 'ACTIVE').map((module) => module.key);

  if (activeModuleKeys.includes('CAR_RENTAL')) {
    const vehicles = await prisma.rentalVehicle.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    for (const vehicle of vehicles) {
      entries.set(`/rental/${vehicle.slug}`, entry(`/rental/${vehicle.slug}`, { lastModified: vehicle.updatedAt, priority: 0.55 }));
    }
  }

  if (activeModuleKeys.includes('CAR_SALES')) {
    const vehicles = await prisma.saleVehicle.findMany({
      where: { isPublished: true, isSold: false },
      select: { slug: true, updatedAt: true },
    });
    for (const vehicle of vehicles) {
      entries.set(`/car-sales/${vehicle.slug}`, entry(`/car-sales/${vehicle.slug}`, { lastModified: vehicle.updatedAt, priority: 0.55 }));
    }
  }

  return Array.from(entries.values());
}
