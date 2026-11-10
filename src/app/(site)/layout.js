import { headers } from 'next/headers';
import { permanentRedirect, redirect } from 'next/navigation';
import { getSiteChrome, getFeaturedServices } from '@/services/content';
import { resolveRedirect } from '@/services/redirects';
import { localBusinessSchema, JsonLd } from '@/lib/seo';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import { WhatsAppFloat } from '@/components/site/whatsapp-float';
import { AnalyticsScripts } from '@/components/site/analytics-scripts';
import { PageViewTracker } from '@/components/site/page-view-tracker';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get('x-sw-path');
  const search = requestHeaders.get('x-sw-search') || '';
  const rule = await resolveRedirect(pathname);

  if (rule) {
    const target = rule.toPath.includes('?') ? rule.toPath : `${rule.toPath}${search}`;
    if (target !== `${pathname}${search}`) {
      if ([301, 308].includes(rule.statusCode)) permanentRedirect(target);
      redirect(target);
    }
  }

  const [{ settings, navModules }, services] = await Promise.all([
    getSiteChrome(),
    getFeaturedServices(8),
  ]);

  return (
    <>
      <AnalyticsScripts analytics={settings.analytics} />
      <PageViewTracker />
      <Header settings={settings} navModules={navModules} services={services} />
      <main id="main">{children}</main>
      <Footer settings={settings} navModules={navModules} />
      <WhatsAppFloat settings={settings} />
      <JsonLd data={localBusinessSchema(settings)} />
    </>
  );
}
