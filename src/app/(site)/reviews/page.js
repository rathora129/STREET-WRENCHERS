import { notFound } from 'next/navigation';
import { getPublishedPage, getPublishedTestimonials } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container, Grid } from '@/components/ui/layout';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';
import { TestimonialCard } from '@/components/site/cards';
import { TestimonialsEmpty } from '@/components/site/testimonial-marquee';
import { CtaBand } from '@/components/site/cta-band';

export async function generateMetadata() {
  const page = await getPublishedPage('reviews');
  return pageMetadata(page, { path: '/reviews', fallbackTitle: 'Customer Reviews' });
}

export default async function ReviewsPage() {
  const [page, testimonials] = await Promise.all([getPublishedPage('reviews'), getPublishedTestimonials()]);
  if (!page) notFound();

  const hero = page.sections?.find((section) => section.type === 'PAGE_HERO');

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Reviews'}
        heading={hero?.heading || 'Feedback from the drivers we work with.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/hero/detailing.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews' }]}
      />

      <Section $tone="coal">
        <Container>
          {testimonials.length ? (
            <Grid $cols={1} $md={2} $lg={3}>
              {testimonials.map((testimonial) => (
                <Reveal key={testimonial.id}>
                  <TestimonialCard testimonial={testimonial} />
                </Reveal>
              ))}
            </Grid>
          ) : (
            <TestimonialsEmpty onReviewsPage />
          )}
        </Container>
      </Section>

      <CtaBand
        heading="Experience the workshop for yourself."
        subheading="Book a service and the team will confirm the scope and timing with you."
        ctaLabel="Book a service"
        ctaHref="/book"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Reviews', href: '/reviews' },
        ])}
      />
      {testimonials.length ? (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: testimonials.map((testimonial, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Review',
                reviewBody: testimonial.quote,
                author: { '@type': 'Person', name: testimonial.name },
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: testimonial.rating,
                  bestRating: 5,
                },
              },
            })),
          }}
        />
      ) : null}
    </>
  );
}
