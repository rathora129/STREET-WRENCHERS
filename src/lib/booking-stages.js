export const BOOKING_STAGES = [
  {
    key: 'PICKUP_SCHEDULED',
    label: 'Pickup scheduled',
    customerLabel: 'Pickup scheduled',
    description: 'The workshop has scheduled collection of your vehicle.',
  },
  {
    key: 'VEHICLE_PICKED_UP',
    label: 'Vehicle picked up',
    customerLabel: 'Vehicle picked up',
    description: 'Your vehicle has been collected and is on its way to the workshop.',
  },
  {
    key: 'RECEIVED_AT_WORKSHOP',
    label: 'Received at workshop',
    customerLabel: 'Received at workshop',
    description: 'Your vehicle has arrived at the workshop.',
  },
  {
    key: 'INITIAL_INSPECTION',
    label: 'Initial inspection',
    customerLabel: 'Initial inspection',
    description: 'The team is inspecting your vehicle and confirming the work required.',
  },
  {
    key: 'ESTIMATE_APPROVAL',
    label: 'Estimate & approval',
    customerLabel: 'Estimate & approval',
    description: 'An estimate is being prepared or is awaiting your approval.',
  },
  {
    key: 'SERVICE_IN_PROGRESS',
    label: 'Service in progress',
    customerLabel: 'Service in progress',
    description: 'The approved work is being carried out on your vehicle.',
  },
  {
    key: 'QUALITY_INSPECTION',
    label: 'Quality inspection',
    customerLabel: 'Quality inspection',
    description: 'The work has been completed and is being checked before handover.',
  },
  {
    key: 'READY_FOR_DELIVERY',
    label: 'Ready for delivery',
    customerLabel: 'Ready for delivery',
    description: 'Your vehicle is ready and the team is arranging handover.',
  },
  {
    key: 'OUT_FOR_DELIVERY',
    label: 'Out for delivery',
    customerLabel: 'Out for delivery',
    description: 'Your vehicle is on its way back to you.',
  },
  {
    key: 'DELIVERED',
    label: 'Delivered',
    customerLabel: 'Delivered',
    description: 'Your vehicle has been handed back. The booking is complete.',
  },
];

export const STAGE_KEYS = BOOKING_STAGES.map((stage) => stage.key);
const STAGE_INDEX = Object.fromEntries(BOOKING_STAGES.map((stage, index) => [stage.key, index]));

export const STAGE_TEMPLATE_FIELDS = {
  PICKUP_SCHEDULED: 'templatePickupScheduled',
  VEHICLE_PICKED_UP: 'templateVehiclePickedUp',
  RECEIVED_AT_WORKSHOP: 'templateReceivedAtWorkshop',
  INITIAL_INSPECTION: 'templateInitialInspection',
  ESTIMATE_APPROVAL: 'templateEstimateApproval',
  SERVICE_IN_PROGRESS: 'templateServiceInProgress',
  QUALITY_INSPECTION: 'templateQualityInspection',
  READY_FOR_DELIVERY: 'templateReadyForDelivery',
  OUT_FOR_DELIVERY: 'templateOutForDelivery',
  DELIVERED: 'templateDelivered',
};

export function stageMeta(key) {
  return BOOKING_STAGES.find((stage) => stage.key === key) || BOOKING_STAGES[0];
}

export function stageIndex(key) {
  return STAGE_INDEX[key] ?? 0;
}

export function isFinalStage(key) {
  return key === 'DELIVERED';
}

export function bookingStatusForStage(stage) {
  if (stage === 'DELIVERED') return 'COMPLETED';
  if (stage === 'PICKUP_SCHEDULED') return 'CONFIRMED';
  return 'IN_PROGRESS';
}

export function fillTrackingTemplate(template, vars) {
  const safe = template || '';
  return safe.replace(/\{(name|reference|service|vehicle|date|time|trackingUrl|stage)\}/g, (match, key) => {
    const value = vars[key];
    return value === undefined || value === null || value === '' ? match : String(value);
  });
}

export function buildTrackingMessage({ template, booking, stage, trackingUrl }) {
  return fillTrackingTemplate(template, {
    name: booking.customerName?.split(/\s+/)[0] || 'there',
    reference: booking.reference,
    service: booking.serviceName,
    vehicle: [booking.brandName || booking.brand?.name, booking.modelName].filter(Boolean).join(' ') || 'vehicle',
    date: booking.preferredDate
      ? new Date(booking.preferredDate).toLocaleDateString('en-AE', { timeZone: 'Asia/Dubai' })
      : '',
    time: booking.preferredTime,
    trackingUrl,
    stage: stageMeta(stage).customerLabel,
  });
}
