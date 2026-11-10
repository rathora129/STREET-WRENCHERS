import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ContentPage } from '@/components/site/content-page';

export async function generateMetadata() {
  const page = await getPublishedPage('about');
  return pageMetadata(page, { path: '/about', fallbackTitle: 'About Street Wrenchers' });
}

export default async function AboutPage() {
  const page = await getPublishedPage('about');
  if (!page) notFound();

  return (
    <>
      <ContentPage page={page} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: page.title, href: '/about' },
        ])}
      />
    </>
  );
}
