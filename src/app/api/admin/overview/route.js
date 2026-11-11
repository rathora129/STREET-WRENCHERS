import { prisma } from '@/lib/prisma';
import { ok, requireOwner, route } from '@/lib/http';
import { serialize } from '@/lib/admin/resources';
import { getSettings } from '@/lib/settings';
import { MODULE_KEYS, MODULE_DEFINITIONS } from '@/data/modules';
import { BOOKING_STAGES } from '@/lib/booking-stages';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

const WORKSHOP_STAGES = [
  'VEHICLE_PICKED_UP',
  'RECEIVED_AT_WORKSHOP',
  'INITIAL_INSPECTION',
  'ESTIMATE_APPROVAL',
  'SERVICE_IN_PROGRESS',
  'QUALITY_INSPECTION',
];

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
    confirmedBookings,
    completedBookings,
    todayBookings,
    vehiclesInWorkshop,
    awaitingApproval,
    readyForDelivery,
    newLeads,
    totalCustomers,
    activeServices,
    publishedBlogs,
    revenue,
    recentBookings,
    recentLeads,
    upcoming,
    stageGroups,
    recentActivity,
    events,
    settings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { status: 'CONFIRMED' } }),
    prisma.booking.count({ where: { status: 'COMPLETED' } }),
    prisma.booking.count({ where: { preferredDate: { gte: start, lt: end }, status: { not: 'CANCELLED' } } }),
    prisma.booking.count({
      where: { status: { not: 'CANCELLED' }, currentStage: { in: WORKSHOP_STAGES } },
    }),
    prisma.booking.count({
      where: { status: { not: 'CANCELLED' }, currentStage: 'ESTIMATE_APPROVAL' },
    }),
    prisma.booking.count({
      where: { status: { not: 'CANCELLED' }, currentStage: 'READY_FOR_DELIVERY' },
    }),
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
    prisma.booking.groupBy({ by: ['currentStage'], _count: { _all: true } }),
    prisma.bookingStageEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: { booking: { select: { reference: true, customerName: true } } },
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

  const stageCounts = Object.fromEntries(stageGroups.map((row) => [row.currentStage, row._count._all]));
  const stageBreakdown = BOOKING_STAGES.map((stage) => ({
    key: stage.key,
    label: stage.label,
    count: stageCounts[stage.key] || 0,
  }));

  return ok(
    serialize({
      counts: {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        todayBookings,
        vehiclesInWorkshop,
        awaitingApproval,
        readyForDelivery,
        newLeads,
        totalCustomers,
        activeServices,
        publishedBlogs,
        completedRevenue: revenue._sum.priceEstimate,
        pageViews: eventCounts.PAGE_VIEW || 0,
        whatsappClicks: eventCounts.WHATSAPP_CLICK || 0,
      },
      stageBreakdown,
      recentActivity,
      recentBookings,
      recentLeads,
      upcoming,
      modules,
    }),
    NO_STORE,
  );
});
