import { notFound } from 'next/navigation';
import { getModule } from '@/lib/modules';
import { getPage } from '@/services/content';
import { buildMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { ModulePage } from '@/components/site/module-page';

const MODULE_KEY = 'SELL_YOUR_CAR';
const PUBLIC = ['ACTIVE', 'COMING_SOON'];

export async function generateMetadata() {
  const module = await getModule(MODULE_KEY);
  const page = await getPage('sell-your-car');
  const visible = module && PUBLIC.includes(module.status);

  return buildMetadata({
    title: page?.metaTitle || 'Sell Your Car in Dubai',
    description: page?.metaDescription || module?.description,
    path: '/sell-your-car',
    robots: visible ? 'index,follow' : 'noindex,nofollow',
  });
}

export default async function SellCarPage() {
  const [module, page] = await Promise.all([getModule(MODULE_KEY), getPage('sell-your-car')]);
  if (!module || !PUBLIC.includes(module.status)) notFound();

  return (
    <>
      <ModulePage module={module} page={page} kind="sell" />
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Sell Your Car', href: '/sell-your-car' },
        ])}
      />
    </>
  );
}
