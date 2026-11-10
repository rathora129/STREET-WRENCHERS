import { notFound } from 'next/navigation';
import { getPublishedPage, getGalleryMedia } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container } from '@/components/ui/layout';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { GalleryGrid } from '@/components/site/gallery-grid';
import { CtaBand } from '@/components/site/cta-band';

export async function generateMetadata() {
  const page = await getPublishedPage('gallery');
  return pageMetadata(page, { path: '/gallery', fallbackTitle: 'Workshop Gallery' });
}

export default async function GalleryPage() {
  const [page, media] = await Promise.all([getPublishedPage('gallery'), getGalleryMedia()]);
  if (!page) notFound();

  const hero = page.sections?.find((section) => section.type === 'PAGE_HERO');

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow || 'Gallery'}
        heading={hero?.heading || 'Inside the workshop.'}
        subheading={hero?.subheading}
        image={hero?.image || '/assets/images/gallery/interior-detailing.jpg'}
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Gallery', href: '/gallery' }]}
      />

      <Section $tone="coal">
        <Container>
          {media.length ? (
            <GalleryGrid items={media} columns={2} largeColumns={3} priority />
          ) : (
            <EmptyState
              title="Gallery images are being prepared"
              text="Workshop photography will appear here once it is uploaded through the media library."
              action={<Button href="/contact" variant="outline" size="sm">Contact the team</Button>}
            />
          )}
        </Container>
      </Section>

      <CtaBand
        heading="Want to see the workshop in person?"
        subheading="Book a service and the team will walk you through the work before it starts."
        ctaLabel="Book a service"
        ctaHref="/book"
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Gallery', href: '/gallery' },
        ])}
      />
    </>
  );
}
