import { prisma } from '@/lib/prisma';
import { ok, requireOwner, route } from '@/lib/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

function dayKey(date) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Dubai' }).format(new Date(date));
}

export const GET = route(async (request) => {
  await requireOwner();

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(7, Number(url.searchParams.get('days')) || 30));
  const start = new Date(Date.now() - (days - 1) * 24 * 60 * 60 * 1000);
  start.setUTCHours(0, 0, 0, 0);

  const [events, leads, bookings, campaigns] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: start } },
      select: { type: true, path: true, createdAt: true, campaignId: true, source: true, medium: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.lead.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, source: true, utmSource: true, status: true },
    }),
    prisma.booking.findMany({
      where: { createdAt: { gte: start } },
      select: { createdAt: true, status: true },
    }),
    prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        _count: { select: { leads: true, events: true } },
      },
    }),
  ]);

  const daily = new Map();
  for (let index = days - 1; index >= 0; index -= 1) {
    const date = dayKey(Date.now() - index * 24 * 60 * 60 * 1000);
    daily.set(date, { date, pageViews: 0, whatsappClicks: 0, bookingStarts: 0, bookings: 0, leads: 0 });
  }

  const pages = new Map();
  const types = {};

  for (const event of events) {
    const date = dayKey(event.createdAt);
    const bucket = daily.get(date);
    types[event.type] = (types[event.type] || 0) + 1;
    if (event.type === 'PAGE_VIEW' && event.path) {
      pages.set(event.path, (pages.get(event.path) || 0) + 1);
    }
    if (bucket) {
      if (event.type === 'PAGE_VIEW') bucket.pageViews += 1;
      if (event.type === 'WHATSAPP_CLICK') bucket.whatsappClicks += 1;
      if (event.type === 'BOOKING_START') bucket.bookingStarts += 1;
    }
  }

  for (const booking of bookings) {
    const bucket = daily.get(dayKey(booking.createdAt));
    if (bucket) bucket.bookings += 1;
  }

  const sources = new Map();
  for (const lead of leads) {
    const bucket = daily.get(dayKey(lead.createdAt));
    if (bucket) bucket.leads += 1;
    const source = lead.utmSource || lead.source || 'Direct';
    sources.set(source, (sources.get(source) || 0) + 1);
  }

  const bookingStatuses = bookings.reduce((accumulator, booking) => {
    accumulator[booking.status] = (accumulator[booking.status] || 0) + 1;
    return accumulator;
  }, {});

  const leadStatuses = leads.reduce((accumulator, lead) => {
    accumulator[lead.status] = (accumulator[lead.status] || 0) + 1;
    return accumulator;
  }, {});

  return ok(
    {
      rangeDays: days,
      totals: {
        pageViews: types.PAGE_VIEW || 0,
        whatsappClicks: types.WHATSAPP_CLICK || 0,
        bookingStarts: types.BOOKING_START || 0,
        bookingSubmissions: types.BOOKING_SUBMIT || 0,
        leadSubmissions: types.LEAD_SUBMIT || 0,
        leads: leads.length,
        bookings: bookings.length,
      },
      daily: Array.from(daily.values()),
      topPages: Array.from(pages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count })),
      leadSources: Array.from(sources.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([source, count]) => ({ source, count })),
      bookingStatuses,
      leadStatuses,
      campaigns: campaigns.map((campaign) => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        source: campaign.source,
        medium: campaign.medium,
        campaignId: campaign.campaignId,
        leads: campaign._count.leads,
        events: campaign._count.events,
      })),
    },
    NO_STORE,
  );
});
