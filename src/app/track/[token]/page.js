import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { isValidTrackingToken } from '@/lib/tracking';
import { clickToChatLink } from '@/lib/whatsapp';
import { TrackingView } from '@/components/site/tracking-view';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata() {
  return {
    title: 'Vehicle service tracking',
    description: 'Private workshop progress for your vehicle.',
    robots: { index: false, follow: false, nocache: true },
  };
}

export default async function TrackPage({ params }) {
  const { token } = await params;

  if (!isValidTrackingToken(token)) notFound();

  const [booking, settings] = await Promise.all([
    prisma.booking.findFirst({
      where: { trackingToken: token, trackingEnabled: true },
      select: {
        reference: true,
        currentStage: true,
        status: true,
        brandName: true,
        modelName: true,
        year: true,
        fuelType: true,
        serviceName: true,
        packageName: true,
        preferredDate: true,
        preferredTime: true,
        expectedDeliveryAt: true,
        updatedAt: true,
        stageEvents: {
          orderBy: { createdAt: 'desc' },
          select: { stage: true, customerNote: true, createdAt: true },
        },
      },
    }),
    getSettings(),
  ]);

  if (!booking) notFound();

  const business = {
    name: settings.business?.name || 'Street Wrenchers',
    phone: settings.business?.phone || '',
    email: settings.business?.email || '',
    hours: settings.business?.hours || '',
  };

  const contactNumber = settings.business?.whatsapp || settings.whatsapp?.number || '';
  const whatsappUrl = clickToChatLink(
    contactNumber,
    `Hello ${business.name}, I have a question about booking ${booking.reference}.`,
  );

  const safeBooking = {
    reference: booking.reference,
    currentStage: booking.currentStage,
    status: booking.status,
    brandName: booking.brandName,
    modelName: booking.modelName,
    year: booking.year,
    fuelType: booking.fuelType,
    serviceName: booking.serviceName,
    packageName: booking.packageName,
    preferredDate: booking.preferredDate,
    preferredTime: booking.preferredTime,
    expectedDeliveryAt: booking.expectedDeliveryAt,
    updatedAt: booking.updatedAt,
    events: booking.stageEvents,
  };

  return <TrackingView booking={safeBooking} business={business} whatsappUrl={whatsappUrl} />;
}
