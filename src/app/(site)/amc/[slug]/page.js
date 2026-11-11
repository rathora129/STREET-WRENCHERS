import { notFound } from 'next/navigation';
import { getAmcPlanBySlug } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { AmcDetail } from '@/components/site/amc-detail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const plan = await getAmcPlanBySlug(slug);

  if (!plan) {
    return buildMetadata({ title: 'Plan not found', path: `/amc/${slug}`, robots: 'noindex,nofollow' });
  }

  return buildMetadata({
    title: plan.metaTitle || `${plan.name} Annual Maintenance Plan`,
    description:
      plan.metaDescription ||
      `${plan.name} annual maintenance plan in Dubai${plan.tagline ? ` — ${plan.tagline}` : ''}. Coverage and pricing confirmed at enquiry.`,
    path: `/amc/${plan.slug}`,
    image: plan.ogImage || plan.image || '/assets/banners/og-default.jpg',
    keywords: plan.keywords || [],
  });
}

export default async function AmcDetailPage({ params }) {
  const { slug } = await params;
  const plan = await getAmcPlanBySlug(slug);
  if (!plan) notFound();

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${plan.name} Annual Maintenance Plan`,
    description: plan.description,
    brand: { '@type': 'Brand', name: 'Street Wrenchers' },
    offers: {
      '@type': 'Offer',
      price: Number(plan.price),
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      url: `/amc/${plan.slug}`,
    },
  };

  return (
    <>
      <AmcDetail plan={plan} />
      <JsonLd data={productSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'AMC Plans', href: '/amc' },
          { label: plan.name, href: `/amc/${plan.slug}` },
        ])}
      />
    </>
  );
}
