import { z } from 'zod';
import { parseTags } from '../utils.js';

const requiredString = (max = 500, min = 1) => z.string().trim().min(min).max(max);
const optionalString = (max = 2000) =>
  z.preprocess((value) => (value === '' || value === undefined ? null : value), z.string().trim().max(max).nullable().optional());

const optionalEmail = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? null : String(value).trim().toLowerCase()),
  z.string().email('Enter a valid email address').max(200).nullable().optional(),
);

const nullableNumber = z.preprocess(
  (value) => {
    if (value === '' || value === null || value === undefined) return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : value;
  },
  z.number().finite().nullable(),
);

const optionalDate = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? null : new Date(value)),
  z.date().nullable(),
);

const stringList = z.preprocess((value) => (value === undefined ? [] : parseTags(value)), z.array(z.string().trim().max(500)).max(200));
const optionalStringList = z.preprocess(
  (value) => (value === null ? [] : value === undefined ? undefined : parseTags(value)),
  z.array(z.string().trim().max(500)).max(200).optional(),
);

const boolean = z.boolean();
const sortOrder = z.coerce.number().int().min(-9999).max(9999).default(0);

const seoFields = {
  metaTitle: optionalString(200),
  metaDescription: optionalString(400),
  keywords: stringList,
  ogImage: optionalString(600),
};

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export const categorySchema = z.object({
  name: requiredString(120, 2),
  slug: optionalString(140),
  description: optionalString(2000),
  icon: optionalString(80),
  image: optionalString(600),
  sortOrder,
  isActive: boolean.default(true),
});

export const serviceSchema = z.object({
  name: requiredString(160, 2),
  slug: optionalString(180),
  categoryId: requiredString(64, 3),
  shortDescription: requiredString(320, 10),
  description: requiredString(20000, 20),
  price: nullableNumber,
  priceNote: optionalString(200),
  duration: optionalString(80),
  icon: optionalString(80),
  image: optionalString(600),
  gallery: stringList,
  inclusions: stringList,
  benefits: stringList,
  isFeatured: boolean.default(false),
  isPublished: boolean.default(true),
  sortOrder,
  ...seoFields,
  schema: z.any().optional(),
});

export const packageSchema = z.object({
  serviceId: optionalString(64),
  name: requiredString(160, 2),
  slug: optionalString(180),
  tier: requiredString(40).default('CUSTOM'),
  description: optionalString(4000),
  price: nullableNumber,
  priceNote: optionalString(200),
  duration: optionalString(80),
  labourCharge: nullableNumber,
  warranty: optionalString(200),
  inclusions: stringList,
  exclusions: stringList,
  isFeatured: boolean.default(false),
  isPublished: boolean.default(true),
  sortOrder,
});

export const amcPlanSchema = z.object({
  name: requiredString(120, 2),
  slug: optionalString(140),
  tagline: optionalString(200),
  description: requiredString(12000, 20),
  price: nullableNumber,
  billingPeriod: requiredString(40).default('YEAR'),
  durationMonths: z.coerce.number().int().min(1).max(120),
  kmLimit: nullableNumber,
  icon: optionalString(80),
  image: optionalString(600),
  inclusions: stringList,
  exclusions: stringList,
  benefits: stringList,
  isFeatured: boolean.default(false),
  isPublished: boolean.default(true),
  sortOrder,
  ...seoFields,
  brandIds: optionalStringList,
  modelIds: optionalStringList,
});

export const brandSchema = z.object({
  name: requiredString(120, 2),
  slug: optionalString(140),
  logo: optionalString(600),
  image: optionalString(600),
  country: optionalString(120),
  isFeatured: boolean.default(false),
  isActive: boolean.default(true),
  sortOrder,
});

export const vehicleModelSchema = z.object({
  brandId: requiredString(64, 3),
  name: requiredString(140, 2),
  slug: optionalString(160),
  yearFrom: nullableNumber,
  yearTo: nullableNumber,
  fuelTypes: stringList,
  isActive: boolean.default(true),
  sortOrder: z.coerce.number().int().min(-9999).max(9999).default(0),
});

export const customerSchema = z.object({
  name: requiredString(160, 2),
  phone: requiredString(40, 5),
  email: optionalEmail,
  notes: optionalString(4000),
});

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const publicBookingSchema = z.object({
  customerName: requiredString(160, 2),
  phone: requiredString(40, 5),
  email: optionalEmail,
  brandId: optionalString(64),
  brandName: requiredString(120, 1),
  modelName: requiredString(120, 1),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  fuelType: requiredString(40, 2),
  registrationNumber: optionalString(40),
  serviceId: requiredString(64, 3),
  packageId: optionalString(64),
  date: z.string().regex(dateRegex, 'Choose a valid date'),
  time: z.string().regex(timeRegex, 'Choose a valid time'),
  pickupRequired: boolean.default(false),
  pickupAddress: optionalString(500),
  notes: optionalString(4000),
  source: optionalString(80),
  utm: z
    .object({
      utm_source: optionalString(200),
      utm_medium: optionalString(200),
      utm_campaign: optionalString(200),
      utm_term: optionalString(200),
      utm_content: optionalString(200),
    })
    .partial()
    .optional(),
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  adminNotes: optionalString(4000),
  priceEstimate: nullableNumber,
  preferredDate: optionalDate,
  preferredTime: z.string().regex(timeRegex).optional(),
  pickupRequired: boolean.optional(),
  pickupAddress: optionalString(500),
  customerName: requiredString(160, 2).optional(),
  phone: requiredString(40, 5).optional(),
  email: optionalEmail,
  registrationNumber: optionalString(40),
  expectedDeliveryAt: optionalDate,
  assignedTo: optionalString(160),
});

export const bookingStageSchema = z.object({
  stage: z.enum([
    'PICKUP_SCHEDULED',
    'VEHICLE_PICKED_UP',
    'RECEIVED_AT_WORKSHOP',
    'INITIAL_INSPECTION',
    'ESTIMATE_APPROVAL',
    'SERVICE_IN_PROGRESS',
    'QUALITY_INSPECTION',
    'READY_FOR_DELIVERY',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ]),
  customerNote: optionalString(2000),
  internalNote: optionalString(4000),
  expectedDeliveryAt: optionalDate,
});

export const publicLeadSchema = z.object({
  name: requiredString(160, 2),
  phone: requiredString(40, 5),
  email: optionalEmail,
  type: z
    .enum(['CONTACT', 'AMC', 'WHATSAPP', 'RENTAL', 'CAR_SALES', 'BUY_CAR', 'SELL_CAR', 'MARKETING'])
    .default('CONTACT'),
  vehicleBrand: optionalString(120),
  vehicleModel: optionalString(120),
  vehicleYear: nullableNumber,
  message: optionalString(4000),
  source: optionalString(80),
  utmSource: optionalString(200),
  utmMedium: optionalString(200),
  utmCampaign: optionalString(200),
  utmTerm: optionalString(200),
  utmContent: optionalString(200),
  landingPage: optionalString(600),
  amcPlanId: optionalString(64),
});

export const leadUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP', 'CONVERTED', 'LOST']).optional(),
  notes: optionalString(6000),
  followUpAt: optionalDate,
  name: requiredString(160, 2).optional(),
  phone: requiredString(40, 5).optional(),
  email: optionalEmail,
  type: z
    .enum(['SERVICE_BOOKING', 'CONTACT', 'AMC', 'WHATSAPP', 'RENTAL', 'CAR_SALES', 'BUY_CAR', 'SELL_CAR', 'MARKETING'])
    .optional(),
  vehicleBrand: optionalString(120),
  vehicleModel: optionalString(120),
  vehicleYear: nullableNumber,
});

export const leadActivitySchema = z.object({
  type: requiredString(80),
  note: requiredString(4000, 2),
});

export const pageSchema = z.object({
  title: requiredString(200, 2),
  slug: optionalString(220),
  template: requiredString(60).default('default'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('PUBLISHED'),
  metaTitle: optionalString(200),
  metaDescription: optionalString(400),
  keywords: stringList,
  canonical: optionalString(600),
  ogTitle: optionalString(200),
  ogDescription: optionalString(400),
  ogImage: optionalString(600),
  robots: requiredString(120).default('index,follow'),
  schema: z.any().optional(),
  publishedAt: optionalDate,
  sortOrder,
});

export const pageSectionSchema = z.object({
  pageId: optionalString(64),
  key: requiredString(80, 1),
  type: requiredString(60, 1),
  eyebrow: optionalString(200),
  heading: optionalString(400),
  subheading: optionalString(600),
  body: optionalString(20000),
  image: optionalString(600),
  imageAlt: optionalString(300),
  ctaLabel: optionalString(120),
  ctaHref: optionalString(600),
  secondaryLabel: optionalString(120),
  secondaryHref: optionalString(600),
  data: z.any().optional(),
  sortOrder,
  isVisible: boolean.default(true),
});

const sectionIdList = z
  .array(z.string().trim().min(1).max(64))
  .min(1)
  .max(500)
  .refine((ids) => new Set(ids).size === ids.length, 'Section ids must be unique');

export const sectionReorderSchema = z.object({
  pageId: z.string().trim().min(1).max(64),
  orderedIds: sectionIdList,
  previousIds: sectionIdList.optional(),
});

export const bannerSchema = z.object({
  title: requiredString(240, 2),
  eyebrow: optionalString(120),
  subtitle: optionalString(600),
  image: requiredString(600, 1),
  mobileImage: optionalString(600),
  ctaLabel: optionalString(120),
  ctaHref: optionalString(600),
  secondaryLabel: optionalString(120),
  secondaryHref: optionalString(600),
  overlayOpacity: z.coerce.number().int().min(0).max(90).default(35),
  placement: requiredString(80).default('home-hero'),
  sortOrder,
  isActive: boolean.default(true),
  startsAt: optionalDate,
  endsAt: optionalDate,
});

export const blogSchema = z.object({
  title: requiredString(240, 2),
  slug: optionalString(260),
  excerpt: requiredString(600, 10),
  content: requiredString(60000, 20),
  coverImage: optionalString(600),
  category: optionalString(120),
  tags: stringList,
  author: requiredString(160, 2).default('Street Wrenchers'),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  publishedAt: optionalDate,
  readMinutes: nullableNumber,
  ...seoFields,
});

export const testimonialSchema = z.object({
  name: requiredString(160, 2),
  vehicle: optionalString(160),
  rating: z.coerce.number().int().min(1).max(5),
  quote: requiredString(4000, 5),
  image: optionalString(600),
  reviewedAt: optionalDate,
  source: optionalString(120),
  isFeatured: boolean.default(false),
  isPublished: boolean.default(true),
  sortOrder,
});

export const faqSchema = z.object({
  question: requiredString(400, 3),
  answer: requiredString(8000, 3),
  category: optionalString(120),
  serviceId: optionalString(64),
  pageId: optionalString(64),
  sortOrder,
  isPublished: boolean.default(true),
});

export const campaignSchema = z.object({
  name: requiredString(200, 2),
  slug: optionalString(220),
  source: requiredString(120, 1),
  medium: requiredString(120, 1),
  campaignId: optionalString(200),
  landingPage: optionalString(600),
  startDate: optionalDate,
  endDate: optionalDate,
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED']).default('DRAFT'),
  notes: optionalString(4000),
  utmTerm: optionalString(200),
  utmContent: optionalString(200),
});

export const mediaSchema = z.object({
  url: requiredString(1200, 1),
  publicId: optionalString(400),
  filename: requiredString(400, 1),
  alt: optionalString(400),
  mimeType: optionalString(120),
  width: nullableNumber,
  height: nullableNumber,
  size: nullableNumber,
  folder: requiredString(80).default('library'),
});

export const rentalVehicleSchema = z.object({
  name: requiredString(200, 2),
  slug: optionalString(220),
  brand: requiredString(120, 1),
  model: requiredString(120, 1),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  category: requiredString(80, 1),
  transmission: requiredString(60, 1),
  fuelType: requiredString(60, 1),
  seats: z.coerce.number().int().min(1).max(60),
  dailyRate: nullableNumber,
  weeklyRate: nullableNumber,
  monthlyRate: nullableNumber,
  deposit: nullableNumber,
  description: requiredString(12000, 20),
  image: optionalString(600),
  gallery: stringList,
  features: stringList,
  availability: z.enum(['AVAILABLE', 'RENTED', 'MAINTENANCE']).default('AVAILABLE'),
  isPublished: boolean.default(false),
  sortOrder,
  metaTitle: optionalString(200),
  metaDescription: optionalString(400),
});

export const saleVehicleSchema = z.object({
  title: requiredString(240, 2),
  slug: optionalString(260),
  brandId: optionalString(64),
  brandName: requiredString(120, 1),
  model: requiredString(120, 1),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  mileage: nullableNumber,
  condition: z.enum(['NEW', 'USED']).default('USED'),
  price: nullableNumber,
  negotiable: boolean.default(true),
  transmission: optionalString(60),
  fuelType: optionalString(60),
  bodyType: optionalString(80),
  color: optionalString(80),
  description: requiredString(12000, 20),
  image: optionalString(600),
  gallery: stringList,
  features: stringList,
  isPublished: boolean.default(false),
  isSold: boolean.default(false),
  sortOrder,
  metaTitle: optionalString(200),
  metaDescription: optionalString(400),
});

export const redirectSchema = z.object({
  fromPath: requiredString(600, 1).refine((value) => value.startsWith('/'), 'Path must start with /'),
  toPath: requiredString(600, 1),
  statusCode: z.coerce.number().int().refine((code) => [301, 302, 307, 308].includes(code), 'Use 301, 302, 307 or 308'),
  isActive: boolean.default(true),
  note: optionalString(400),
});

export const moduleControlSchema = z.object({
  status: z.enum(['ACTIVE', 'COMING_SOON', 'HIDDEN', 'DRAFT']),
  headline: optionalString(240),
  description: optionalString(2000),
  image: optionalString(600),
  launchDate: optionalString(40),
});

export const analyticsEventSchema = z.object({
  type: z.enum(['PAGE_VIEW', 'WHATSAPP_CLICK', 'BOOKING_START', 'BOOKING_SUBMIT', 'LEAD_SUBMIT', 'CAMPAIGN_CONVERSION']),
  path: requiredString(600, 1),
  sessionId: optionalString(120),
  campaignId: optionalString(120),
  source: optionalString(120),
  medium: optionalString(120),
  value: nullableNumber,
  metadata: z.any().optional(),
});
