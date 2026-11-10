import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings';
import { getNavModules } from '@/lib/modules';

const numberOrNull = (value) => (value === null || value === undefined ? null : Number(value));

export const mapService = (service) => ({
  ...service,
  price: numberOrNull(service.price),
  packages: service.packages?.map(mapPackage),
});

export const mapPackage = (pack) => ({
  ...pack,
  price: numberOrNull(pack.price),
  labourCharge: numberOrNull(pack.labourCharge),
});

export const mapAmcPlan = (plan) => ({
  ...plan,
  price: numberOrNull(plan.price),
});

export const mapVehicle = (vehicle) => ({
  ...vehicle,
  dailyRate: numberOrNull(vehicle.dailyRate),
  weeklyRate: numberOrNull(vehicle.weeklyRate),
  monthlyRate: numberOrNull(vehicle.monthlyRate),
  deposit: numberOrNull(vehicle.deposit),
  price: numberOrNull(vehicle.price),
});

export async function getSiteChrome() {
  const [settings, navModules] = await Promise.all([getSettings(), getNavModules()]);
  return { settings, navModules };
}

export async function getPublishedPage(slug) {
  const page = await getPage(slug);
  if (!page || page.status !== 'PUBLISHED') return null;
  return page;
}

export async function getPage(slug) {
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      sections: { where: { isVisible: true }, orderBy: { sortOrder: 'asc' } },
      faqs: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
    },
  });
  return page;
}

export async function getBanners(placement = 'home-hero') {
  return prisma.banner.findMany({
    where: { placement, isActive: true },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getFeaturedServices(take = 6) {
  const services = await prisma.service.findMany({
    where: { isPublished: true, isFeatured: true },
    include: { category: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    take,
  });
  return services.map(mapService);
}

export async function getServicesWithCategories() {
  const [categories, services] = await Promise.all([
    prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
  ]);

  return {
    categories: categories.filter((category) => services.some((service) => service.categoryId === category.id)),
    services: services.map(mapService),
  };
}

export async function getServiceBySlug(slug) {
  const service = await prisma.service.findFirst({
    where: { slug, isPublished: true },
    include: {
      category: true,
      packages: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
      faqs: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } },
    },
  });

  if (!service) return null;
  return mapService(service);
}

export async function getRelatedServices(service) {
  const services = await prisma.service.findMany({
    where: { isPublished: true, categoryId: service.categoryId, id: { not: service.id } },
    include: { category: true },
    take: 3,
    orderBy: { sortOrder: 'asc' },
  });

  if (services.length >= 3) return services.map(mapService);

  const fill = await prisma.service.findMany({
    where: { isPublished: true, id: { notIn: [service.id, ...services.map((item) => item.id)] } },
    include: { category: true },
    take: 3 - services.length,
    orderBy: { sortOrder: 'asc' },
  });

  return [...services, ...fill].map(mapService);
}

export async function getPublishedPackages() {
  const packs = await prisma.servicePackage.findMany({
    where: { isPublished: true },
    include: { service: { select: { name: true, slug: true } } },
    orderBy: { sortOrder: 'asc' },
  });
  return packs.map(mapPackage);
}

export async function getAmcPlans() {
  const plans = await prisma.amcPlan.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: 'asc' },
  });
  return plans.map(mapAmcPlan);
}

export async function getAmcPlanBySlug(slug) {
  const plan = await prisma.amcPlan.findFirst({
    where: { slug, isPublished: true },
    include: { brands: true, models: { include: { brand: true } } },
  });
  return plan ? mapAmcPlan(plan) : null;
}

export async function getBrands() {
  return prisma.brand.findMany({
    where: { isActive: true },
    include: {
      models: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getGalleryMedia() {
  return prisma.media.findMany({
    where: { folder: 'gallery' },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getPublishedBlogs({ take, skip = 0 } = {}) {
  return prisma.blog.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take,
    skip,
  });
}

export async function getPublishedBlogCount() {
  return prisma.blog.count({ where: { status: 'PUBLISHED' } });
}

export async function getBlogBySlug(slug) {
  return prisma.blog.findFirst({ where: { slug, status: 'PUBLISHED' } });
}

export async function getPublishedTestimonials() {
  return prisma.testimonial.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function getPublishedFaqs({ category } = {}) {
  return prisma.faq.findMany({
    where: { isPublished: true, ...(category ? { category } : {}) },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getHomeData() {
  const [
    page,
    banners,
    services,
    packages,
    plans,
    brands,
    media,
    testimonials,
    faqs,
    blogs,
    settings,
  ] = await Promise.all([
    getPage('home'),
    getBanners(),
    getFeaturedServices(6),
    getPublishedPackages(),
    getAmcPlans(),
    prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 12,
      include: { _count: { select: { models: true } } },
    }),
    getGalleryMedia(),
    getPublishedTestimonials(),
    getPublishedFaqs(),
    getPublishedBlogs({ take: 3 }),
    getSettings(),
  ]);

  return {
    page,
    banners,
    services,
    packages,
    plans,
    brands,
    media,
    testimonials,
    faqs: faqs.slice(0, 6),
    blogs,
    settings,
  };
}

export async function getBookingData() {
  const [brands, services, packages, settings] = await Promise.all([
    prisma.brand.findMany({
      where: { isActive: true },
      include: { models: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.service.findMany({
      where: { isPublished: true },
      include: { category: true, packages: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    getPublishedPackages(),
    getSettings(),
  ]);

  return {
    brands: brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      models: brand.models.map((model) => model.name),
    })),
    services: services.map(mapService),
    packages: packages.map(({ service, ...pack }) => ({
      ...pack,
      serviceName: service?.name || null,
    })),
    bookingSettings: settings.booking,
  };
}

export async function getPublishedRentalVehicles() {
  const vehicles = await prisma.rentalVehicle.findMany({
    where: { isPublished: true, availability: 'AVAILABLE' },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return vehicles.map(mapVehicle);
}

export async function getPublishedSaleVehicles() {
  const vehicles = await prisma.saleVehicle.findMany({
    where: { isPublished: true, isSold: false },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
  return vehicles.map(mapVehicle);
}

export async function getRentalVehicleBySlug(slug) {
  const vehicle = await prisma.rentalVehicle.findFirst({ where: { slug, isPublished: true } });
  return vehicle ? mapVehicle(vehicle) : null;
}

export async function getSaleVehicleBySlug(slug) {
  const vehicle = await prisma.saleVehicle.findFirst({
    where: { slug, isPublished: true, isSold: false },
    include: { brand: true },
  });
  return vehicle ? mapVehicle(vehicle) : null;
}

export async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    bookingsTotal,
    bookingsPending,
    bookingsToday,
    leadsNew,
    leadsTotal,
    customers,
    services,
    media,
    blogs,
    revenue,
    recentBookings,
    recentLeads,
    topServices,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count(),
    prisma.customer.count(),
    prisma.service.count(),
    prisma.media.count(),
    prisma.blog.count(),
    prisma.booking.aggregate({ where: { status: 'COMPLETED' }, _sum: { priceEstimate: true } }),
    prisma.booking.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.lead.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.booking.groupBy({ by: ['serviceName'], _count: { _all: true }, orderBy: { _count: { serviceName: 'desc' } }, take: 5 }),
  ]);

  return {
    bookingsTotal,
    bookingsPending,
    bookingsToday,
    leadsNew,
    leadsTotal,
    customers,
    services,
    media,
    blogs,
    completedValue: numberOrNull(revenue._sum.priceEstimate) || 0,
    recentBookings,
    recentLeads,
    topServices,
  };
}
