import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { ApiError, ok, readJsonBody, requireOwner, route } from '@/lib/http';
import { serialize } from '@/lib/admin/resources';
import { bookingStageSchema } from '@/lib/validation/resources';
import {
  STAGE_TEMPLATE_FIELDS,
  bookingStatusForStage,
  buildTrackingMessage,
  trackingUrlFor,
} from '@/lib/tracking';
import { clickToChatLink } from '@/lib/whatsapp';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const NO_STORE = { headers: { 'Cache-Control': 'no-store' } };

export const POST = route(async (request, { params }) => {
  const owner = await requireOwner();
  const { id } = await params;
  const { data, body } = await readJsonBody(request, bookingStageSchema);

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new ApiError(404, 'Booking not found');

  const hasExpectedDelivery = Object.prototype.hasOwnProperty.call(body, 'expectedDeliveryAt');
  const expectedDeliveryAt = data.expectedDeliveryAt || null;

  const { event, updated } = await prisma.$transaction(async (tx) => {
    const stageEvent = await tx.bookingStageEvent.create({
      data: {
        bookingId: booking.id,
        stage: data.stage,
        internalNote: data.internalNote || null,
        customerNote: data.customerNote || null,
        updatedBy: owner.name || owner.email || 'Owner',
      },
    });

    const record = await tx.booking.update({
      where: { id: booking.id },
      data: {
        currentStage: data.stage,
        status: bookingStatusForStage(data.stage),
        ...(hasExpectedDelivery ? { expectedDeliveryAt } : {}),
      },
      include: {
        service: { select: { id: true, name: true, slug: true } },
        package: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true, phone: true, email: true } },
        lead: { select: { id: true, status: true } },
        stageEvents: { orderBy: { createdAt: 'desc' } },
      },
    });

    return { event: stageEvent, updated: record };
  });

  const settings = await getSettings();
  const template = settings.tracking?.[STAGE_TEMPLATE_FIELDS[data.stage]] || '';
  const trackingUrl =
    updated.trackingEnabled && updated.trackingToken ? trackingUrlFor(updated.trackingToken) : null;
  const message = buildTrackingMessage({
    template,
    booking: updated,
    stage: data.stage,
    trackingUrl,
  });

  return ok(
    {
      booking: serialize(updated),
      event: serialize(event),
      whatsappUrl: clickToChatLink(updated.phone, message),
      message,
    },
    NO_STORE,
  );
});
