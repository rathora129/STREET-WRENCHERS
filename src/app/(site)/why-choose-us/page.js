import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ContentPage } from '@/components/site/content-page';

export async function generateMetadata() {
  const page = await getPublishedPage('why-choose-us');
  return pageMetadata(page, { path: '/why-choose-us', fallbackTitle: 'Why Choose Street Wrenchers' });
}

export default async function WhyChooseUsPage() {
  const page = await getPublishedPage('why-choose-us');
  if (!page) notFound();

  return (
    <>
      <ContentPage page={page} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: page.title, href: '/why-choose-us' },
        ])}
      />
    </>
  );
}
