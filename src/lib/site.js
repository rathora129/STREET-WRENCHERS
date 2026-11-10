export const BUSINESS = {
  name: 'Street Wrenchers',
  legalName: 'Street Wrenchers',
  slogan: 'Precision. Performance. Reliability.',
  city: 'Dubai',
  country: 'United Arab Emirates',
  countryCode: 'AE',
  currency: 'AED',
  timezone: 'Asia/Dubai',
  language: 'en',
  description:
    'Multi-brand automotive service centre in Dubai, UAE — scheduled maintenance, mechanical and engine repair, AC, brakes, detailing, PPF and annual maintenance plans.',
};

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const LOGO_SRC = '/assets/brand/street-wrenchers-logo.png';

export const SITE_NAV = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'AMC Plans', href: '/amc' },
  { label: 'Brands', href: '/brands' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAV = [
  {
    title: 'Services',
    links: [
      { label: 'All Services', href: '/services' },
      { label: 'Minor Service', href: '/services/minor-service' },
      { label: 'Major Service', href: '/services/major-service' },
      { label: 'AC Repair', href: '/services/ac-repair' },
      { label: 'Detailing', href: '/services/car-wash-detailing' },
      { label: 'PPF & Ceramic Coating', href: '/services/ppf-ceramic-coating' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Why Choose Us', href: '/why-choose-us' },
      { label: 'AMC Plans', href: '/amc' },
      { label: 'Car Brands', href: '/brands' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Book a Service', href: '/book' },
      { label: 'Contact', href: '/contact' },
      { label: 'Blog', href: '/blog' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    ],
  },
];

export const BOOKING_TIMES = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
];

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Plug-in Hybrid', 'Electric'];
