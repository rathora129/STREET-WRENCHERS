import { notFound } from 'next/navigation';
import { getServiceBySlug, getRelatedServices } from '@/services/content';
import { getSettings } from '@/lib/settings';
import { buildMetadata, serviceSchema, faqSchema, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { whatsappLink, buildWhatsappMessage } from '@/lib/whatsapp';
import { ServiceDetail } from '@/components/site/service-detail';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return buildMetadata({ title: 'Service not found', path: `/services/${slug}`, robots: 'noindex,nofollow' });
  }

  return buildMetadata({
    title: service.metaTitle || service.name,
    description: service.metaDescription || service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.ogImage || service.image || '/assets/banners/og-default.jpg',
    keywords: service.keywords || [],
  });
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const [related, settings] = await Promise.all([getRelatedServices(service), getSettings()]);
  const whatsapp = settings.whatsapp;
  const whatsappUrl = whatsapp.enabled
    ? whatsappLink(whatsapp, buildWhatsappMessage(whatsapp.serviceMessage, service.name))
    : null;

  return (
    <>
      <ServiceDetail service={service} related={related} whatsappUrl={whatsappUrl} />
      <JsonLd data={serviceSchema(service, settings)} />
      {service.faqs?.length ? <JsonLd data={faqSchema(service.faqs)} /> : null}
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.name, href: `/services/${service.slug}` },
        ])}
      />
    </>
  );
}
