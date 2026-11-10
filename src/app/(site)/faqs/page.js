import { notFound } from 'next/navigation';
import { getPublishedPage, getPublishedFaqs } from '@/services/content';
import { pageMetadata, faqSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { FaqsView } from '@/components/site/faqs-view';

export async function generateMetadata() {
  const page = await getPublishedPage('faqs');
  return pageMetadata(page, { path: '/faqs', fallbackTitle: 'Frequently Asked Questions' });
}

export default async function FaqsPage() {
  const [page, faqs] = await Promise.all([getPublishedPage('faqs'), getPublishedFaqs()]);
  if (!page) notFound();

  return (
    <>
      <FaqsView page={page} faqs={faqs} />
      <JsonLd data={faqSchema(faqs)} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'FAQs', href: '/faqs' },
        ])}
      />
    </>
  );
}
