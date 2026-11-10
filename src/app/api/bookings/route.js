import crypto from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { publicBookingSchema } from '@/lib/validation/resources';
import { ApiError, clientIp, created, readJson, route } from '@/lib/http';
import { getSettings } from '@/lib/settings';
import { BOOKING_TIMES } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DUBAI_OFFSET = '+04:00';

const normalisePhone = (value) => value.replace(/[^\d+]/g, '');
const formatReferenceDate = (date) =>
  `${String(date.getUTCFullYear()).slice(2)}${String(date.getUTCMonth() + 1).padStart(2, '0')}${String(
    date.getUTCDate(),
  ).padStart(2, '0')}`;

async function nextReference(date) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
    const reference = `SW-${formatReferenceDate(date)}-${suffix}`;
    const exists = await prisma.booking.findUnique({ where: { reference }, select: { id: true } });
    if (!exists) return reference;
  }
  throw new ApiError(500, 'Could not generate a booking reference. Please try again.');
}

export const POST = route(async (request) => {
  const payload = await readJson(request, publicBookingSchema);
  const settings = await getSettings();
  const bookingSettings = settings.booking;

  const service = await prisma.service.findFirst({
    where: { id: payload.serviceId, isPublished: true },
    select: { id: true, name: true, price: true },
  });
  if (!service) throw new ApiError(422, 'The selected service is not available');

  let pack = null;
  if (payload.packageId) {
    pack = await prisma.servicePackage.findFirst({
      where: { id: payload.packageId, isPublished: true },
      select: { id: true, name: true, price: true, serviceId: true },
    });
    if (!pack) throw new ApiError(422, 'The selected package is not available');
    if (pack.serviceId && pack.serviceId !== service.id) {
      throw new ApiError(422, 'The selected package does not belong to this service');
    }
  }

  if (!BOOKING_TIMES.includes(payload.time)) {
    throw new ApiError(422, 'Choose a valid appointment time');
  }

  const preferredDate = new Date(`${payload.date}T00:00:00${DUBAI_OFFSET}`);
  const appointment = new Date(`${payload.date}T${payload.time}:00${DUBAI_OFFSET}`);
  if (Number.isNaN(preferredDate.getTime()) || Number.isNaN(appointment.getTime())) {
    throw new ApiError(422, 'Choose a valid date and time');
  }

  const now = Date.now();
  const earliest = now + (bookingSettings.minNoticeHours || 0) * 60 * 60 * 1000;
  const latest = now + (bookingSettings.maxDaysAhead || 60) * 24 * 60 * 60 * 1000;

  if (appointment.getTime() < earliest) {
    throw new ApiError(
      422,
      bookingSettings.minNoticeHours
        ? `Bookings need at least ${bookingSettings.minNoticeHours} hours notice`
        : 'Choose a date from today onwards',
    );
  }
  if (preferredDate.getTime() > latest) {
    throw new ApiError(422, `Bookings can be made up to ${bookingSettings.maxDaysAhead} days ahead`);
  }

  if (payload.pickupRequired && !payload.pickupAddress) {
    throw new ApiError(422, 'Add a pickup address or switch pickup off', [
      { field: 'pickupAddress', message: 'Pickup address is required' },
    ]);
  }

  let brand = null;
  if (payload.brandId) {
    brand = await prisma.brand.findFirst({
      where: { id: payload.brandId, isActive: true },
      select: { id: true, name: true },
    });
  }

  const phone = normalisePhone(payload.phone);
  if (phone.length < 5) throw new ApiError(422, 'Enter a valid phone number');

  const priceEstimate = pack?.price ?? service.price ?? null;
  const reference = await nextReference(preferredDate);

  const booking = await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.upsert({
      where: { phone },
      create: {
        name: payload.customerName,
        phone,
        email: payload.email || null,
        totalBookings: 1,
        lastVisitAt: preferredDate,
      },
      update: {
        name: payload.customerName,
        email: payload.email || undefined,
        totalBookings: { increment: 1 },
        lastVisitAt: preferredDate,
      },
    });

    const record = await tx.booking.create({
      data: {
        reference,
        customerId: customer.id,
        customerName: payload.customerName,
        phone,
        email: payload.email || null,
        brandId: brand?.id || null,
        brandName: brand?.name || payload.brandName,
        modelName: payload.modelName,
        year: payload.year,
        fuelType: payload.fuelType,
        serviceId: service.id,
        serviceName: service.name,
        packageId: pack?.id || null,
        packageName: pack?.name || null,
        preferredDate,
        preferredTime: payload.time,
        pickupRequired: payload.pickupRequired,
        pickupAddress: payload.pickupRequired ? payload.pickupAddress : null,
        notes: payload.notes || null,
        priceEstimate,
        source: payload.source || 'website',
        utm: payload.utm || undefined,
        status: 'PENDING',
      },
    });

    await tx.lead.create({
      data: {
        name: payload.customerName,
        phone,
        email: payload.email || null,
        type: 'SERVICE_BOOKING',
        status: 'NEW',
        vehicleBrand: brand?.name || payload.brandName,
        vehicleModel: payload.modelName,
        vehicleYear: payload.year,
        message: [
          `Booking ${reference} — ${service.name}${pack ? ` (${pack.name})` : ''}`,
          `Preferred: ${payload.date} at ${payload.time}`,
          payload.pickupRequired ? `Pickup requested: ${payload.pickupAddress}` : null,
          payload.notes || null,
        ]
          .filter(Boolean)
          .join('\n'),
        source: payload.source || 'website',
        utmSource: payload.utm?.utm_source || null,
        utmMedium: payload.utm?.utm_medium || null,
        utmCampaign: payload.utm?.utm_campaign || null,
        utmTerm: payload.utm?.utm_term || null,
        utmContent: payload.utm?.utm_content || null,
        customerId: customer.id,
        bookingId: record.id,
      },
    });

    return record;
  });

  console.info('[booking] created', { reference, ip: clientIp(request) });

  return created({
    reference: booking.reference,
    id: booking.id,
    status: booking.status,
    serviceName: booking.serviceName,
    packageName: booking.packageName,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
  });
});
