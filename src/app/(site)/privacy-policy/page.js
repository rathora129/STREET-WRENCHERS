import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/site/legal-page';

export async function generateMetadata() {
  const page = await getPublishedPage('privacy-policy');
  return pageMetadata(page, { path: '/privacy-policy', fallbackTitle: 'Privacy Policy' });
}

export default async function PrivacyPage() {
  const page = await getPublishedPage('privacy-policy');
  if (!page) notFound();

  return <LegalPage page={page} />;
}
