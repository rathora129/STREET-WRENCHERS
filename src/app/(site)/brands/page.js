import { notFound } from 'next/navigation';
import { getPublishedPage, getBrands } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { BrandDirectory } from '@/components/site/brand-directory';

export async function generateMetadata() {
  const page = await getPublishedPage('brands');
  return pageMetadata(page, { path: '/brands', fallbackTitle: 'Car Brands We Service in Dubai' });
}

export default async function BrandsPage() {
  const [page, brands] = await Promise.all([getPublishedPage('brands'), getBrands()]);
  if (!page) notFound();

  return (
    <>
      <BrandDirectory page={page} brands={brands} />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Car Brands', href: '/brands' },
        ])}
      />
    </>
  );
}
