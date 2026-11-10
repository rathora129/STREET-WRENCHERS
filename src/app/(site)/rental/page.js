import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getPage, getPublishedRentalVehicles } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ModulePage } from '@/components/site/module-page';

const MODULE_KEY = 'CAR_RENTAL';
const PUBLIC = ['ACTIVE', 'COMING_SOON'];

export async function generateMetadata() {
  const module = await getModule(MODULE_KEY);
  const page = await getPage('rental');
  const visible = module && PUBLIC.includes(module.status);

  return buildMetadata({
    title: page?.metaTitle || 'Car Rental in Dubai',
    description: page?.metaDescription || module?.description,
    path: '/rental',
    robots: visible ? 'index,follow' : 'noindex,nofollow',
  });
}

export default async function RentalPage() {
  const [module, page] = await Promise.all([getModule(MODULE_KEY), getPage('rental')]);
  if (!module || !PUBLIC.includes(module.status)) notFound();

  const vehicles = module.status === 'ACTIVE' ? await getPublishedRentalVehicles() : [];

  return (
    <>
      <ModulePage module={module} page={page} vehicles={vehicles} kind="rental" />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Car Rental', href: '/rental' },
        ])}
      />
    </>
  );
}
