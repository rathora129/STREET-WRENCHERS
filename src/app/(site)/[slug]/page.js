import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ContentPage } from '@/components/site/content-page';
import { LegalPage } from '@/components/site/legal-page';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  return pageMetadata(page, { path: `/${slug}`, fallbackTitle: 'Page not found' });
}

export default async function CmsPage({ params }) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return (
    <>
      {page.template === 'legal' ? <LegalPage page={page} /> : <ContentPage page={page} />}
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: page.title, href: `/${page.slug}` },
        ])}
      />
    </>
  );
}
