import { notFound } from 'next/navigation';
import { getPublishedPage, getAmcPlans, getPublishedFaqs } from '@/services/content';
import { pageMetadata, faqSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { AmcView } from '@/components/site/amc-view';

export async function generateMetadata() {
  const page = await getPublishedPage('amc');
  return pageMetadata(page, { path: '/amc', fallbackTitle: 'Annual Maintenance Plans in Dubai' });
}

export default async function AmcPage() {
  const [page, plans, faqs] = await Promise.all([
    getPublishedPage('amc'),
    getAmcPlans(),
    getPublishedFaqs({ category: 'AMC' }),
  ]);

  if (!page) notFound();

  return (
    <>
      <AmcView page={page} plans={plans} faqs={faqs} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'AMC Plans', href: '/amc' },
        ])}
      />
    </>
  );
}
