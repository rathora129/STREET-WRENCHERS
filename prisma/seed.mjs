import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '@prisma/client';
import sharp from 'sharp';
import { hashPassword } from '../src/lib/password.js';
import { DEFAULT_SETTINGS } from '../src/data/settings-defaults.js';
import {
  categories,
  services,
  packages,
  amcPlans,
  brands,
  vehicleModels,
  banners,
  mediaItems,
  pages,
  faqs,
} from '../src/data/seed-content.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REFRESH = process.argv.includes('--refresh');

function loadEnvFile(filename) {
  const file = path.join(ROOT, filename);
  if (!fs.existsSync(file)) return;
  const contents = fs.readFileSync(file, 'utf8');
  for (const line of contents.split('\n')) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^["']|["']$/g, '');
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Configure .env (or .env.local) before seeding.');
  process.exit(1);
}

const prisma = new PrismaClient();

async function ensureUnique(delegate, where, createData, updateData) {
  const existing = await delegate.findUnique({ where });
  if (existing) {
    if (REFRESH && updateData) return delegate.update({ where, data: updateData });
    return existing;
  }
  return delegate.create({ data: createData });
}

async function seedOwner() {
  const email = (process.env.OWNER_EMAIL || '').trim().toLowerCase();
  const password = process.env.OWNER_PASSWORD || '';
  const name = (process.env.OWNER_NAME || 'Street Wrenchers Owner').trim();
  const reset = String(process.env.OWNER_RESET_PASSWORD || '').toLowerCase() === 'true';

  if (!email || !password) {
    console.warn('⚠ Owner seed skipped: set OWNER_EMAIL and OWNER_PASSWORD.');
    return;
  }
  if (password.length < 12) {
    console.warn('⚠ OWNER_PASSWORD is shorter than 12 characters. Use a stronger password for production.');
  }

  const existing = await prisma.owner.findUnique({ where: { email } });

  if (!existing) {
    await prisma.owner.create({
      data: { name, email, passwordHash: await hashPassword(password), role: 'OWNER' },
    });
    console.log(`✓ Owner created: ${email}`);
    return;
  }

  if (reset) {
    await prisma.owner.update({
      where: { email },
      data: { name, passwordHash: await hashPassword(password) },
    });
    console.log(`✓ Owner password reset: ${email}`);
  } else {
    console.log(`✓ Owner exists: ${email} (password unchanged)`);
  }
}

async function seedSettings() {
  let created = 0;
  for (const [group, value] of Object.entries(DEFAULT_SETTINGS)) {
    const existing = await prisma.setting.findUnique({ where: { key: group } });
    if (!existing) {
      await prisma.setting.create({ data: { key: group, group, value } });
      created += 1;
    } else if (REFRESH) {
      await prisma.setting.update({ where: { key: group }, data: { value } });
    }
  }
  console.log(`✓ Settings ready (${created} created)`);
}

async function seedCatalogue() {
  const categoryMap = new Map();

  for (const category of categories) {
    const record = await ensureUnique(
      prisma.serviceCategory,
      { slug: category.slug },
      { ...category, description: category.description || null },
      { ...category, description: category.description || null },
    );
    categoryMap.set(category.slug, record.id);
  }
  console.log(`✓ Categories: ${categoryMap.size}`);

  const serviceMap = new Map();
  for (const service of services) {
    const { categorySlug, ...data } = service;
    const payload = {
      ...data,
      categoryId: categoryMap.get(categorySlug),
      price: data.price ?? null,
      duration: data.duration || null,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
    };
    const record = await ensureUnique(prisma.service, { slug: service.slug }, payload, payload);
    serviceMap.set(service.slug, record.id);
  }
  console.log(`✓ Services: ${serviceMap.size}`);

  for (const pack of packages) {
    const { serviceSlug, ...data } = pack;
    const payload = {
      ...data,
      serviceId: serviceMap.get(serviceSlug) || null,
      priceNote: data.priceNote || null,
      description: data.description || null,
    };
    await ensureUnique(prisma.servicePackage, { slug: pack.slug }, payload, payload);
  }
  console.log(`✓ Packages: ${packages.length}`);

  for (const plan of amcPlans) {
    const payload = {
      ...plan,
      priceNote: plan.priceNote || null,
      tagline: plan.tagline || null,
    };
    await ensureUnique(prisma.amcPlan, { slug: plan.slug }, payload, payload);
  }
  console.log(`✓ AMC plans: ${amcPlans.length}`);

  const brandMap = new Map();
  for (const brand of brands) {
    const payload = { ...brand, logo: null };
    const record = await ensureUnique(prisma.brand, { slug: brand.slug }, payload, payload);
    brandMap.set(brand.slug, record.id);
  }

  let modelCount = 0;
  for (const model of vehicleModels) {
    const { brandSlug, ...data } = model;
    const brandId = brandMap.get(brandSlug);
    if (!brandId) continue;
    const payload = { ...data, brandId };
    await ensureUnique(
      prisma.vehicleModel,
      { brandId_slug: { brandId, slug: model.slug } },
      payload,
      payload,
    );
    modelCount += 1;
  }
  console.log(`✓ Brands: ${brandMap.size}, models: ${modelCount}`);
}

async function seedPages() {
  let sectionCount = 0;

  for (const page of pages) {
    const { sections, ...pageData } = page;
    const payload = {
      ...pageData,
      publishedAt: new Date(),
    };

    const record = await ensureUnique(prisma.page, { slug: page.slug }, payload, payload);

    for (const section of sections) {
      const sectionData = {
        ...section,
        pageId: record.id,
        data: section.data ?? undefined,
      };
      const existing = await prisma.pageSection.findUnique({
        where: { pageId_key: { pageId: record.id, key: section.key } },
      });

      if (!existing) {
        await prisma.pageSection.create({ data: sectionData });
        sectionCount += 1;
      } else if (REFRESH) {
        await prisma.pageSection.update({
          where: { pageId_key: { pageId: record.id, key: section.key } },
          data: sectionData,
        });
      }
    }
  }
  console.log(`✓ Pages: ${pages.length}, new sections: ${sectionCount}`);
}

async function seedBanners() {
  let created = 0;
  for (const banner of banners) {
    const existing = await prisma.banner.findFirst({ where: { title: banner.title } });
    const payload = { ...banner, placement: 'home-hero', isActive: true };
    if (!existing) {
      await prisma.banner.create({ data: payload });
      created += 1;
    } else if (REFRESH) {
      await prisma.banner.update({ where: { id: existing.id }, data: payload });
    }
  }
  console.log(`✓ Banners: ${banners.length} (${created} new)`);
}

async function seedMedia() {
  let created = 0;

  for (const item of mediaItems) {
    const existing = await prisma.media.findFirst({ where: { url: item.url } });
    if (existing && !REFRESH) continue;

    let width = null;
    let height = null;
    let size = null;
    let mimeType = 'image/jpeg';

    try {
      const filePath = path.join(ROOT, 'public', item.url);
      const metadata = await sharp(filePath).metadata();
      width = metadata.width || null;
      height = metadata.height || null;
      mimeType = `image/${metadata.format || 'jpeg'}`;
      size = fs.statSync(filePath).size;
    } catch {
      // Artwork may not be generated yet; the record still points at the expected path.
    }

    const payload = {
      url: item.url,
      filename: path.basename(item.url),
      alt: item.alt,
      folder: item.folder,
      width,
      height,
      size,
      mimeType,
    };

    if (existing) {
      await prisma.media.update({ where: { id: existing.id }, data: payload });
    } else {
      await prisma.media.create({ data: payload });
      created += 1;
    }
  }
  console.log(`✓ Media: ${mediaItems.length} (${created} new)`);
}

async function seedFaqs() {
  let created = 0;
  for (const faq of faqs) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: { ...faq, isPublished: true } });
      created += 1;
    } else if (REFRESH) {
      await prisma.faq.update({ where: { id: existing.id }, data: faq });
    }
  }
  console.log(`✓ FAQs: ${faqs.length} (${created} new)`);
}

async function main() {
  console.log(`\nStreet Wrenchers seed${REFRESH ? ' (refresh mode)' : ''}\n`);

  await seedOwner();
  await seedSettings();
  await seedCatalogue();
  await seedPages();
  await seedBanners();
  await seedMedia();
  await seedFaqs();

  const [serviceCount, pageCount, mediaCount] = await Promise.all([
    prisma.service.count(),
    prisma.page.count(),
    prisma.media.count(),
  ]);

  console.log(`\nDatabase seeded — ${serviceCount} services, ${pageCount} pages, ${mediaCount} media records.\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
