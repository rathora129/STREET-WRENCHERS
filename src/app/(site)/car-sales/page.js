import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getPage, getPublishedSaleVehicles } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ModulePage } from '@/components/site/module-page';

const MODULE_KEY = 'CAR_SALES';
const PUBLIC = ['ACTIVE', 'COMING_SOON'];

export async function generateMetadata() {
  const module = await getModule(MODULE_KEY);
  const page = await getPage('car-sales');
  const visible = module && PUBLIC.includes(module.status);

  return buildMetadata({
    title: page?.metaTitle || 'Cars for Sale in Dubai',
    description: page?.metaDescription || module?.description,
    path: '/car-sales',
    robots: visible ? 'index,follow' : 'noindex,nofollow',
  });
}

export default async function CarSalesPage() {
  const [module, page] = await Promise.all([getModule(MODULE_KEY), getPage('car-sales')]);
  if (!module || !PUBLIC.includes(module.status)) notFound();

  const vehicles = module.status === 'ACTIVE' ? await getPublishedSaleVehicles() : [];

  return (
    <>
      <ModulePage module={module} page={page} vehicles={vehicles} kind="sales" />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Car Sales', href: '/car-sales' },
        ])}
      />
    </>
  );
}
