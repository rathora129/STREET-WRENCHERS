import { DEFAULT_MODULES } from './modules.js';

export const DEFAULT_SETTINGS = {
  business: {
    name: 'Street Wrenchers',
    tagline: 'Precision. Performance. Reliability.',
    description:
      'Multi-brand automotive service centre in Dubai, UAE, covering scheduled maintenance, mechanical and engine repair, AC, brakes, detailing, PPF and annual maintenance plans.',
    addressLine: 'Dubai, United Arab Emirates',
    city: 'Dubai',
    country: 'United Arab Emirates',
    phone: '',
    whatsapp: '',
    email: '',
    hours: '',
    mapQuery: 'Dubai, United Arab Emirates',
    currency: 'AED',
    timezone: 'Asia/Dubai',
  },
  whatsapp: {
    enabled: false,
    showFloatingButton: false,
    countryCode: '971',
    number: '',
    defaultMessage: 'Hello Street Wrenchers, I would like to enquire about your services.',
    serviceMessage: 'Hello Street Wrenchers, I would like to enquire about {service}.',
    amcMessage: 'Hello Street Wrenchers, I would like to know more about your AMC plans.',
    rentalMessage: 'Hello Street Wrenchers, I would like to enquire about car rental.',
    salesMessage: 'Hello Street Wrenchers, I would like to enquire about buying or selling a car.',
  },
  modules: DEFAULT_MODULES,
  analytics: {
    ga4Id: '',
    gtmId: '',
    metaPixelId: '',
    googleAdsId: '',
  },
  seo: {
    defaultTitle: 'Street Wrenchers — Premium Auto Care in Dubai',
    titleTemplate: '%s | Street Wrenchers',
    defaultDescription:
      'Multi-brand automotive service centre in Dubai, UAE — scheduled maintenance, mechanical and engine repair, AC, brakes, detailing, PPF and annual maintenance plans.',
    ogImage: '/assets/banners/og-default.jpg',
    robots: 'index,follow',
  },
  booking: {
    minNoticeHours: 0,
    maxDaysAhead: 60,
    pickupEnabled: true,
    pickupNote: 'Pickup and drop-off availability is confirmed by the team when your booking is accepted.',
  },
  tracking: {
    templatePickupScheduled:
      'Hi {name}, your booking {reference} for {service} is scheduled for {date} at {time}. You can follow progress here: {trackingUrl}',
    templateVehiclePickedUp:
      'Hi {name}, we have collected your {vehicle} for booking {reference}. Follow progress here: {trackingUrl}',
    templateReceivedAtWorkshop:
      'Hi {name}, your {vehicle} has arrived at the workshop for booking {reference}. Follow progress here: {trackingUrl}',
    templateInitialInspection:
      'Hi {name}, the initial inspection has started on your {vehicle} for booking {reference}. Follow progress here: {trackingUrl}',
    templateEstimateApproval:
      'Hi {name}, an estimate is being prepared for booking {reference}. The team will contact you before any additional work is carried out. Follow progress here: {trackingUrl}',
    templateServiceInProgress:
      'Hi {name}, work is in progress on your {vehicle} for booking {reference}. Follow progress here: {trackingUrl}',
    templateQualityInspection:
      'Hi {name}, your {vehicle} is in quality inspection for booking {reference}. Follow progress here: {trackingUrl}',
    templateReadyForDelivery:
      'Hi {name}, your {vehicle} is ready for delivery for booking {reference}. Follow progress here: {trackingUrl}',
    templateOutForDelivery:
      'Hi {name}, your {vehicle} is out for delivery for booking {reference}. Follow progress here: {trackingUrl}',
    templateDelivered:
      'Hi {name}, booking {reference} is complete and your {vehicle} has been handed back. Thank you for choosing Street Wrenchers.',
  },
  banner: {
    autoplay: true,
    intervalSeconds: 7,
    transition: 'fade',
    transitionMs: 800,
  },
};
