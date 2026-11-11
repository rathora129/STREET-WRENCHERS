import { notFound } from 'next/navigation';
import { getBrandBySlug } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { BrandDetail } from '@/components/site/brand-detail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return buildMetadata({ title: 'Brand not found', path: `/brands/${slug}`, robots: 'noindex,nofollow' });
  }

  const models = brand.models?.map((model) => model.name).slice(0, 6) || [];
  return buildMetadata({
    title: `${brand.name} Service & Repair in Dubai`,
    description: `${brand.name} servicing, diagnostics and repair in Dubai${
      models.length ? ` for ${models.join(', ')}` : ''
    }. Book online and confirm the scope with the workshop.`,
    path: `/brands/${brand.slug}`,
    image: brand.image || undefined,
  });
}

export default async function BrandPage({ params }) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const modelList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${brand.name} models serviced`,
    itemListElement: (brand.models || []).map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: `${brand.name} ${model.name}`,
    })),
  };

  return (
    <>
      <BrandDetail brand={brand} />
      {(brand.models || []).length ? <JsonLd data={modelList} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/brands' },
          { label: brand.name, href: `/brands/${brand.slug}` },
        ])}
      />
    </>
  );
}
