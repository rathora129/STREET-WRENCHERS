import { notFound } from 'next/navigation';
import { getPublishedPage, getBookingData } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container } from '@/components/ui/layout';
import { PageHero } from '@/components/site/page-hero';
import { BookingWizard } from '@/components/forms/booking-wizard';

export async function generateMetadata() {
  const page = await getPublishedPage('book');
  return pageMetadata(page, { path: '/book', fallbackTitle: 'Book a Car Service in Dubai' });
}

export default async function BookPage({ searchParams }) {
  const [{ service: serviceSlug }, page, bookingData] = await Promise.all([
    searchParams,
    getPublishedPage('book'),
    getBookingData(),
  ]);

  if (!page) notFound();

  const hero = page.sections?.find((section) => section.type === 'PAGE_HERO');

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Booking'}
        heading={hero?.heading || 'Book your service in a few steps.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/gallery/workshop-lift.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Book a Service', href: '/book' }]}
      />

      <Section $tone="coal">
        <Container>
          <BookingWizard
            brands={bookingData.brands}
            services={bookingData.services}
            bookingSettings={bookingData.bookingSettings}
            initialServiceSlug={typeof serviceSlug === 'string' ? serviceSlug : ''}
          />
        </Container>
      </Section>

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Book a Service', href: '/book' },
        ])}
      />
    </>
  );
}
