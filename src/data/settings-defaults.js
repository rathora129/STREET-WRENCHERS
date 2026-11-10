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
};
