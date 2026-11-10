import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getPage } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ModulePage } from '@/components/site/module-page';

const MODULE_KEY = 'BUY_A_CAR';
const PUBLIC = ['ACTIVE', 'COMING_SOON'];

export async function generateMetadata() {
  const module = await getModule(MODULE_KEY);
  const page = await getPage('buy-a-car');
  const visible = module && PUBLIC.includes(module.status);

  return buildMetadata({
    title: page?.metaTitle || 'Buy a Car in Dubai',
    description: page?.metaDescription || module?.description,
    path: '/buy-a-car',
    robots: visible ? 'index,follow' : 'noindex,nofollow',
  });
}

export default async function BuyCarPage() {
  const [module, page] = await Promise.all([getModule(MODULE_KEY), getPage('buy-a-car')]);
  if (!module || !PUBLIC.includes(module.status)) notFound();

  return (
    <>
      <ModulePage module={module} page={page} kind="buy" />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Buy a Car', href: '/buy-a-car' },
        ])}
      />
    </>
  );
}
