import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { pageMetadata } from '@/lib/seo';
import { LegalPage } from '@/components/site/legal-page';

export async function generateMetadata() {
  const page = await getPublishedPage('terms-and-conditions');
  return pageMetadata(page, { path: '/terms-and-conditions', fallbackTitle: 'Terms & Conditions' });
}

export default async function TermsPage() {
  const page = await getPublishedPage('terms-and-conditions');
  if (!page) notFound();

  return <LegalPage page={page} />;
}
