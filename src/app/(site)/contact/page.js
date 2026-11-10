import { notFound } from 'next/navigation';
import { getPublishedPage } from '@/services/content';
import { getSettings } from '@/lib/settings';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container } from '@/components/ui/layout';
import { PageHero } from '@/components/site/page-hero';
import { ContactSection } from '@/components/site/contact-section';
import { CtaBand } from '@/components/site/cta-band';

export async function generateMetadata() {
  const page = await getPublishedPage('contact');
  return pageMetadata(page, { path: '/contact', fallbackTitle: 'Contact Street Wrenchers' });
}

export default async function ContactPage() {
  const [page, settings] = await Promise.all([getPublishedPage('contact'), getSettings()]);
  if (!page) notFound();

  const hero = page.sections?.find((section) => section.type === 'PAGE_HERO');

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Contact'}
        heading={hero?.heading || 'Tell us what your car needs.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/hero/workshop.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact' }]}
      />

      <Section $tone="coal">
        <Container>
          <ContactSection heading="Talk to the workshop." settings={settings} />
        </Container>
      </Section>

      <CtaBand
        heading="Prefer to book online?"
        subheading="Choose your vehicle, service and preferred time. The team confirms every booking."
        ctaLabel="Book a service"
        ctaHref="/book"
        secondaryLabel="See AMC plans"
        secondaryHref="/amc"
      />

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Contact', href: '/contact' },
        ])}
      />
    </>
  );
}
