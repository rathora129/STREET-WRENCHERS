import { cache } from 'react';
import { z } from 'zod';
import { prisma, isDatabaseUnavailable } from './prisma';
import { MODULE_KEYS } from '@/data/modules';
import { DEFAULT_SETTINGS } from '@/data/settings-defaults';

export { DEFAULT_SETTINGS };

const optionalText = z.string().max(4000).optional();

export const SETTINGS_SCHEMAS = {
  business: z.object({
    name: z.string().trim().min(2).max(160),
    tagline: optionalText,
    description: optionalText,
    addressLine: optionalText,
    city: optionalText,
    country: optionalText,
    phone: optionalText,
    whatsapp: optionalText,
    email: z.union([z.string().trim().email().max(200), z.literal('')]).optional(),
    hours: optionalText,
    mapQuery: optionalText,
    currency: z.string().trim().max(8).optional(),
    timezone: z.string().trim().max(80).optional(),
  }),
  whatsapp: z.object({
    enabled: z.boolean(),
    showFloatingButton: z.boolean(),
    countryCode: z.string().trim().max(8),
    number: z.string().trim().max(30),
    defaultMessage: optionalText,
    serviceMessage: optionalText,
    amcMessage: optionalText,
    rentalMessage: optionalText,
    salesMessage: optionalText,
  }),
  modules: z.object(
    Object.fromEntries(
      MODULE_KEYS.map((key) => [
        key,
        z.object({
          status: z.enum(['ACTIVE', 'COMING_SOON', 'HIDDEN', 'DRAFT']),
          headline: z.string().trim().max(240).optional(),
          description: z.string().trim().max(2000).optional(),
          image: z.string().trim().max(600).optional(),
          launchDate: z.string().trim().max(40).optional(),
        }),
      ]),
    ),
  ),
  analytics: z.object({
    ga4Id: z.string().trim().max(80).optional(),
    gtmId: z.string().trim().max(80).optional(),
    metaPixelId: z.string().trim().max(80).optional(),
    googleAdsId: z.string().trim().max(80).optional(),
  }),
  seo: z.object({
    defaultTitle: z.string().trim().max(240),
    titleTemplate: z.string().trim().max(240),
    defaultDescription: z.string().trim().max(500),
    ogImage: z.string().trim().max(600),
    robots: z.string().trim().max(120),
  }),
  booking: z.object({
    minNoticeHours: z.coerce.number().int().min(0).max(720),
    maxDaysAhead: z.coerce.number().int().min(1).max(365),
    pickupEnabled: z.boolean(),
    pickupNote: optionalText,
  }),
  tracking: z.object({
    templatePickupScheduled: optionalText,
    templateVehiclePickedUp: optionalText,
    templateReceivedAtWorkshop: optionalText,
    templateInitialInspection: optionalText,
    templateEstimateApproval: optionalText,
    templateServiceInProgress: optionalText,
    templateQualityInspection: optionalText,
    templateReadyForDelivery: optionalText,
    templateOutForDelivery: optionalText,
    templateDelivered: optionalText,
  }),
  banner: z.object({
    autoplay: z.boolean(),
    intervalSeconds: z.coerce.number().int().min(3).max(20),
    transition: z.enum(['fade', 'slide']),
    transitionMs: z.coerce.number().int().min(200).max(2000),
  }),
};

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  if (!isPlainObject(base) || !isPlainObject(override)) return override ?? base;
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value === undefined) continue;
    result[key] = isPlainObject(value) && isPlainObject(base[key]) ? deepMerge(base[key], value) : value;
  }
  return result;
}

export const getSettings = cache(async () => {
  let stored = {};
  try {
    const rows = await prisma.setting.findMany();
    stored = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  } catch (error) {
    if (isDatabaseUnavailable(error)) throw error;
    console.error('[settings] unable to read database settings', error.message);
  }

  const merged = {};
  for (const [group, defaults] of Object.entries(DEFAULT_SETTINGS)) {
    merged[group] = deepMerge(defaults, stored[group] || {});
  }
  return merged;
});

export async function getSettingGroup(group) {
  const settings = await getSettings();
  return settings[group];
}

export async function saveSettingGroup(group, value) {
  const schema = SETTINGS_SCHEMAS[group];
  if (!schema) throw new Error(`Unknown settings group: ${group}`);
  const parsed = schema.parse(value);

  const existing = await prisma.setting.findUnique({ where: { key: group } });
  const merged = deepMerge(DEFAULT_SETTINGS[group], parsed);

  await prisma.setting.upsert({
    where: { key: group },
    create: { key: group, value: merged, group },
    update: { value: merged },
  });

  return merged;
}

export { whatsappLink, buildWhatsappMessage } from './whatsapp';
