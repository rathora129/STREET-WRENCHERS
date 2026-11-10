import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { slugify, readingMinutes } from '@/lib/utils';
import {
  categorySchema,
  serviceSchema,
  packageSchema,
  amcPlanSchema,
  brandSchema,
  vehicleModelSchema,
  customerSchema,
  bookingUpdateSchema,
  leadUpdateSchema,
  pageSchema,
  pageSectionSchema,
  bannerSchema,
  blogSchema,
  testimonialSchema,
  faqSchema,
  campaignSchema,
  mediaSchema,
  rentalVehicleSchema,
  saleVehicleSchema,
  redirectSchema,
} from '@/lib/validation/resources';

const optional = (schema) => schema.partial();

async function uniqueSlug(delegate, base, where = null, excludeId = null) {
  const root = slugify(base) || 'item';
  let candidate = root;
  let counter = 2;

  for (let attempt = 0; attempt < 200; attempt += 1) {
    const record = await delegate.findFirst({
      where: {
        slug: candidate,
        ...(where ? where : {}),
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    if (!record) return candidate;
    candidate = `${root}-${counter}`;
    counter += 1;
  }

  return `${root}-${Date.now().toString(36)}`;
}


async function resolveSlug(delegate, data, { mode, id, keys = ['name'], where = null }) {
  const present = keys.some((key) => Object.prototype.hasOwnProperty.call(data, key)) ||
    Object.prototype.hasOwnProperty.call(data, 'slug');
  if (mode === 'update' && !present) return undefined;
  const base = data.slug || keys.map((key) => data[key]).find(Boolean) || 'item';
  return uniqueSlug(delegate, base, where, mode === 'update' ? id : null);
}

function cleanJson(data) {
  const next = { ...data };
  for (const key of ['schema', 'data']) {
    if (key in next) {
      const value = next[key];
      if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
        delete next[key];
      } else if (typeof value === 'string') {
        try {
          next[key] = JSON.parse(value);
        } catch {
          delete next[key];
        }
      }
    }
  }
  return next;
}

function connectList(value) {
  return (value || []).map((id) => ({ id }));
}

export const RESOURCES = {
  categories: {
    delegate: 'serviceCategory',
    label: 'Service category',
    createSchema: categorySchema,
    updateSchema: optional(categorySchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { _count: { select: { services: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name', 'description'],
      filters: { isActive: 'boolean' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.serviceCategory, data, context);
      if (slug) next.slug = slug;
      return next;
    },
  },

  services: {
    delegate: 'service',
    label: 'Service',
    createSchema: serviceSchema,
    updateSchema: optional(serviceSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { category: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name', 'shortDescription', 'description'],
      filters: {
        categoryId: 'id',
        isPublished: 'boolean',
        isFeatured: 'boolean',
      },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.service, data, context);
      if (slug) next.slug = slug;
      return next;
    },
  },

  packages: {
    delegate: 'servicePackage',
    label: 'Service package',
    createSchema: packageSchema,
    updateSchema: optional(packageSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { service: { select: { id: true, name: true, slug: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name', 'description', 'tier'],
      filters: { serviceId: 'id', isPublished: 'boolean', isFeatured: 'boolean' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.servicePackage, data, context);
      if (slug) next.slug = slug;
      if (context.mode === 'create' && (next.price === null || next.price === undefined)) next.price = 0;
      return next;
    },
  },

  amc: {
    delegate: 'amcPlan',
    label: 'AMC plan',
    createSchema: amcPlanSchema,
    updateSchema: optional(amcPlanSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: {
        brands: { select: { id: true, name: true } },
        models: { select: { id: true, name: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name', 'tagline', 'description'],
      filters: { isPublished: 'boolean', isFeatured: 'boolean' },
    },
    transform: async (data, context) => {
      const { brandIds, modelIds, ...rest } = cleanJson(data);
      const next = { ...rest };
      const slug = await resolveSlug(prisma.amcPlan, data, context);
      if (slug) next.slug = slug;
      if (context.mode === 'create' && (next.price === null || next.price === undefined)) next.price = 0;
      if (brandIds !== undefined) {
        next.brands = context.mode === 'update' ? { set: connectList(brandIds) } : { connect: connectList(brandIds) };
      }
      if (modelIds !== undefined) {
        next.models = context.mode === 'update' ? { set: connectList(modelIds) } : { connect: connectList(modelIds) };
      }
      return next;
    },
  },

  brands: {
    delegate: 'brand',
    label: 'Car brand',
    createSchema: brandSchema,
    updateSchema: optional(brandSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { _count: { select: { models: true, bookings: true } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name', 'country'],
      filters: { isActive: 'boolean', isFeatured: 'boolean' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.brand, data, context);
      if (slug) next.slug = slug;
      return next;
    },
  },

  models: {
    delegate: 'vehicleModel',
    label: 'Vehicle model',
    createSchema: vehicleModelSchema,
    updateSchema: optional(vehicleModelSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { brand: { select: { id: true, name: true } } },
      orderBy: [{ brand: { name: 'asc' } }, { sortOrder: 'asc' }, { name: 'asc' }],
      search: ['name'],
      filters: { brandId: 'id', isActive: 'boolean' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      let brandId = data.brandId;
      if (context.mode === 'update' && !brandId) {
        const existing = await prisma.vehicleModel.findUnique({ where: { id: context.id }, select: { brandId: true } });
        brandId = existing?.brandId;
      }
      const slug = await resolveSlug(prisma.vehicleModel, data, {
        ...context,
        where: brandId ? { brandId } : null,
      });
      if (slug) next.slug = slug;
      return next;
    },
  },

  customers: {
    delegate: 'customer',
    label: 'Customer',
    createSchema: customerSchema,
    updateSchema: optional(customerSchema),
    canCreate: true,
    canDelete: false,
    list: {
      include: { _count: { select: { bookings: true, leads: true } } },
      orderBy: [{ createdAt: 'desc' }],
      search: ['name', 'phone', 'email', 'notes'],
      filters: {},
    },
    transform: async (data) => cleanJson(data),
  },

  bookings: {
    delegate: 'booking',
    label: 'Booking',
    createSchema: null,
    updateSchema: bookingUpdateSchema,
    canCreate: false,
    canDelete: false,
    list: {
      include: {
        service: { select: { id: true, name: true, slug: true } },
        package: { select: { id: true, name: true } },
        customer: { select: { id: true, name: true, phone: true } },
        lead: { select: { id: true, status: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
      search: ['reference', 'customerName', 'phone', 'email', 'brandName', 'modelName', 'serviceName'],
      filters: { status: 'enum' },
    },
    transform: async (data) => cleanJson(data),
  },

  leads: {
    delegate: 'lead',
    label: 'Lead',
    createSchema: null,
    updateSchema: leadUpdateSchema,
    canCreate: false,
    canDelete: true,
    list: {
      include: {
        amcPlan: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true, campaignId: true } },
        customer: { select: { id: true, name: true } },
        booking: { select: { id: true, reference: true, status: true } },
        _count: { select: { activities: true } },
      },
      orderBy: [{ createdAt: 'desc' }],
      search: ['name', 'phone', 'email', 'message', 'vehicleBrand', 'vehicleModel', 'utmCampaign'],
      filters: { status: 'enum', type: 'enum', campaignId: 'id' },
    },
    transform: async (data) => cleanJson(data),
  },

  pages: {
    delegate: 'page',
    label: 'Page',
    createSchema: pageSchema,
    updateSchema: optional(pageSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { _count: { select: { sections: true, faqs: true } } },
      orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
      search: ['title', 'slug'],
      filters: { status: 'enum', template: 'string' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.page, data, { ...context, keys: ['title'] });
      if (slug) next.slug = slug;
      if (next.status === 'PUBLISHED' && !next.publishedAt) next.publishedAt = new Date();
      return next;
    },
  },

  sections: {
    delegate: 'pageSection',
    label: 'Page section',
    createSchema: pageSectionSchema,
    updateSchema: optional(pageSectionSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { page: { select: { id: true, title: true, slug: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      search: ['key', 'heading', 'subheading', 'body'],
      filters: { pageId: 'id', isVisible: 'boolean', type: 'string' },
    },
    transform: async (data) => cleanJson(data),
  },

  banners: {
    delegate: 'banner',
    label: 'Banner',
    createSchema: bannerSchema,
    updateSchema: optional(bannerSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      search: ['title', 'subtitle', 'placement'],
      filters: { isActive: 'boolean', placement: 'string' },
    },
    transform: async (data) => cleanJson(data),
  },

  blog: {
    delegate: 'blog',
    label: 'Blog post',
    createSchema: blogSchema,
    updateSchema: optional(blogSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      search: ['title', 'excerpt', 'category', 'content'],
      filters: { status: 'enum', category: 'string' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.blog, data, { ...context, keys: ['title'] });
      if (slug) next.slug = slug;
      if (data.content && !data.readMinutes) next.readMinutes = readingMinutes(data.content);
      if (next.status === 'PUBLISHED' && !next.publishedAt) next.publishedAt = new Date();
      return next;
    },
  },

  testimonials: {
    delegate: 'testimonial',
    label: 'Testimonial',
    createSchema: testimonialSchema,
    updateSchema: optional(testimonialSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      search: ['name', 'vehicle', 'quote', 'source'],
      filters: { isPublished: 'boolean' },
    },
    transform: async (data) => cleanJson(data),
  },

  faqs: {
    delegate: 'faq',
    label: 'FAQ',
    createSchema: faqSchema,
    updateSchema: optional(faqSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: {
        service: { select: { id: true, name: true } },
        page: { select: { id: true, title: true, slug: true } },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      search: ['question', 'answer', 'category'],
      filters: { isPublished: 'boolean', serviceId: 'id', pageId: 'id', category: 'string' },
    },
    transform: async (data) => cleanJson(data),
  },

  campaigns: {
    delegate: 'campaign',
    label: 'Campaign',
    createSchema: campaignSchema,
    updateSchema: optional(campaignSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { _count: { select: { leads: true, events: true } } },
      orderBy: [{ createdAt: 'desc' }],
      search: ['name', 'slug', 'source', 'medium', 'campaignId'],
      filters: { status: 'enum', source: 'string', medium: 'string' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.campaign, data, context);
      if (slug) next.slug = slug;
      if (!next.campaignId && (slug || context.mode === 'create')) next.campaignId = slug;
      return next;
    },
  },

  rental: {
    delegate: 'rentalVehicle',
    label: 'Rental vehicle',
    createSchema: rentalVehicleSchema,
    updateSchema: optional(rentalVehicleSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      search: ['name', 'brand', 'model', 'category'],
      filters: { isPublished: 'boolean', availability: 'enum' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.rentalVehicle, data, context);
      if (slug) next.slug = slug;
      if (context.mode === 'create' && (next.dailyRate === null || next.dailyRate === undefined)) next.dailyRate = 0;
      return next;
    },
  },

  sales: {
    delegate: 'saleVehicle',
    label: 'Vehicle for sale',
    createSchema: saleVehicleSchema,
    updateSchema: optional(saleVehicleSchema),
    canCreate: true,
    canDelete: true,
    list: {
      include: { brand: { select: { id: true, name: true } } },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      search: ['title', 'brandName', 'model', 'bodyType', 'color'],
      filters: { isPublished: 'boolean', isSold: 'boolean', condition: 'enum', brandId: 'id' },
    },
    transform: async (data, context) => {
      const next = cleanJson(data);
      const slug = await resolveSlug(prisma.saleVehicle, data, { ...context, keys: ['title'] });
      if (slug) next.slug = slug;
      if (context.mode === 'create' && (next.price === null || next.price === undefined)) next.price = 0;
      return next;
    },
  },

  redirects: {
    delegate: 'redirect',
    label: 'Redirect',
    createSchema: redirectSchema,
    updateSchema: optional(redirectSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ createdAt: 'desc' }],
      search: ['fromPath', 'toPath', 'note'],
      filters: { isActive: 'boolean' },
    },
    transform: async (data) => cleanJson(data),
  },

  media: {
    delegate: 'media',
    label: 'Media item',
    createSchema: mediaSchema,
    updateSchema: optional(mediaSchema),
    canCreate: true,
    canDelete: true,
    list: {
      orderBy: [{ createdAt: 'desc' }],
      search: ['filename', 'alt', 'folder', 'publicId'],
      filters: { folder: 'string' },
    },
    transform: async (data) => cleanJson(data),
  },
};

export function getResource(name) {
  return RESOURCES[name] || null;
}

export function buildWhere(config, searchParams) {
  const clauses = [];
  const term = searchParams.get('q')?.trim();

  if (term && config.list.search?.length) {
    clauses.push({
      OR: config.list.search.map((field) => ({
        [field]: { contains: term, mode: 'insensitive' },
      })),
    });
  }

  for (const [key, kind] of Object.entries(config.list.filters || {})) {
    const raw = searchParams.get(key);
    if (raw === null || raw === '' || raw === 'ALL') continue;
    if (kind === 'boolean') clauses.push({ [key]: raw === 'true' });
    else clauses.push({ [key]: raw });
  }

  return clauses.length ? { AND: clauses } : {};
}

export function serialize(value) {
  if (value === null || value === undefined) return value;
  if (Prisma.Decimal.isDecimal(value)) return Number(value);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, serialize(item)]));
  }
  return value;
}
