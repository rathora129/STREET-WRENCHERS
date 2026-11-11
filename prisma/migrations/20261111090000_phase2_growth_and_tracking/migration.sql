-- CreateEnum
CREATE TYPE "BookingStage" AS ENUM ('PICKUP_SCHEDULED', 'VEHICLE_PICKED_UP', 'RECEIVED_AT_WORKSHOP', 'INITIAL_INSPECTION', 'ESTIMATE_APPROVAL', 'SERVICE_IN_PROGRESS', 'QUALITY_INSPECTION', 'READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY', 'DELIVERED');

-- AlterTable
ALTER TABLE "AmcPlan" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "ogImage" TEXT;

-- AlterTable
ALTER TABLE "Banner" ADD COLUMN     "eyebrow" TEXT,
ADD COLUMN     "overlayOpacity" INTEGER NOT NULL DEFAULT 35,
ADD COLUMN     "secondaryHref" TEXT,
ADD COLUMN     "secondaryLabel" TEXT;

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "currentStage" "BookingStage" NOT NULL DEFAULT 'PICKUP_SCHEDULED',
ADD COLUMN     "expectedDeliveryAt" TIMESTAMP(3),
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "trackingEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "trackingToken" TEXT;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "icon" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN     "image" TEXT,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "BookingStageEvent" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "stage" "BookingStage" NOT NULL,
    "internalNote" TEXT,
    "customerNote" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingStageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingStageEvent_bookingId_createdAt_idx" ON "BookingStageEvent"("bookingId", "createdAt");

-- CreateIndex
CREATE INDEX "BookingStageEvent_stage_createdAt_idx" ON "BookingStageEvent"("stage", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_trackingToken_key" ON "Booking"("trackingToken");

-- CreateIndex
CREATE INDEX "Booking_currentStage_idx" ON "Booking"("currentStage");

-- AddForeignKey
ALTER TABLE "BookingStageEvent" ADD CONSTRAINT "BookingStageEvent_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

