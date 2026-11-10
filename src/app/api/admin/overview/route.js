import { prisma } from '@/lib/prisma';
import { ok, requireOwner, route } from '@/lib/http';
import { serialize } from '@/lib/admin/resources';
import { getSettings } from '@/lib/settings';
import { MODULE_KEYS, MODULE_DEFINITIONS } from '@/data/modules';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

function dubaiDayBounds() {
  const date = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date());
  const start = new Date(`${date}T00:00:00+04:00`);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export const GET = route(async () => {
  await requireOwner();
  const { start, end } = dubaiDayBounds();
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);

  const [
    totalBookings,
    pendingBookings,
    todayBookings,
    newLeads,
    totalCustomers,
    publishedServices,
    publishedBlogs,
    revenue,
    recentBookings,
    recentLeads,
    upcoming,
    events,
    settings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: { in: ['PENDING', 'CONFIRMED'] } } }),
    prisma.booking.count({ where: { preferredDate: { gte: start, lt: end } } }),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.customer.count(),
    prisma.service.count({ where: { isPublished: true } }),
    prisma.blog.count({ where: { status: 'PUBLISHED' } }),
    prisma.booking.aggregate({
      where: { status: 'COMPLETED', priceEstimate: { not: null } },
      _sum: { priceEstimate: true },
    }),
    prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { service: { select: { name: true } } },
    }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.booking.findMany({
      where: {
        status: { in: ['PENDING', 'CONFIRMED'] },
        preferredDate: { gte: start },
      },
      orderBy: [{ preferredDate: 'asc' }, { preferredTime: 'asc' }],
      take: 5,
      include: { service: { select: { name: true } } },
    }),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: weekAgo } },
      select: { type: true, createdAt: true },
    }),
    getSettings(),
  ]);

  const eventCounts = events.reduce((counts, event) => {
    counts[event.type] = (counts[event.type] || 0) + 1;
    return counts;
  }, {});

  const modules = MODULE_KEYS.map((key) => ({
    key,
    label: MODULE_DEFINITIONS[key].label,
    status: settings.modules[key]?.status || 'HIDDEN',
  }));

  return ok(
    serialize({
      counts: {
        totalBookings,
        pendingBookings,
        todayBookings,
        newLeads,
        totalCustomers,
        publishedServices,
        publishedBlogs,
        completedRevenue: revenue._sum.priceEstimate,
        pageViews: eventCounts.PAGE_VIEW || 0,
        whatsappClicks: eventCounts.WHATSAPP_CLICK || 0,
      },
      recentBookings,
      recentLeads,
      upcoming,
      modules,
    }),
    NO_STORE,
  );
});
