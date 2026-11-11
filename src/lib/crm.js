import { prisma } from './prisma';
import { advanceLeadStatus } from './lead-status';

export { advanceLeadStatus } from './lead-status';

export async function syncCustomerStats(customerId) {
  if (!customerId) return;

  const [totalBookings, completed] = await Promise.all([
    prisma.booking.count({ where: { customerId, status: { not: 'CANCELLED' } } }),
    prisma.booking.aggregate({
      where: { customerId, status: 'COMPLETED' },
      _sum: { priceEstimate: true },
      _max: { preferredDate: true },
    }),
  ]);

  await prisma.customer
    .update({
      where: { id: customerId },
      data: {
        totalBookings,
        totalSpent: completed._sum.priceEstimate ?? 0,
        ...(completed._max.preferredDate ? { lastVisitAt: completed._max.preferredDate } : {}),
      },
    })
    .catch(() => {});
}

export async function syncLeadForBooking(bookingId) {
  if (!bookingId) return;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: { status: true, lead: { select: { id: true, status: true } } },
  });
  if (!booking?.lead) return;

  const next = advanceLeadStatus(booking.lead.status, booking.status);
  if (next) {
    await prisma.lead.update({ where: { id: booking.lead.id }, data: { status: next } });
  }
}
