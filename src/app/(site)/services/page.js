import { Fragment } from 'react';
import { notFound } from 'next/navigation';
import { getPublishedPage, getServicesWithCategories, getPublishedPackages } from '@/services/content';
import { pageMetadata, breadcrumbSchema, JsonLd } from '@/lib/seo';
import { Section, Container, Grid } from '@/components/ui/layout';
import { SectionHead } from '@/components/ui/type';
import { Reveal } from '@/components/ui/reveal';
import { EmptyState } from '@/components/ui/empty-state';
import { ServiceCard, PackageCard } from '@/components/site/cards';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';
import { CategoryStrip } from '@/components/site/category-strip';

export async function generateMetadata() {
  const page = await getPublishedPage('services');
  return pageMetadata(page, { path: '/services', fallbackTitle: 'Car Services in Dubai' });
}

export default async function ServicesPage() {
  const [page, { categories, services }, packages] = await Promise.all([
    getPublishedPage('services'),
    getServicesWithCategories(),
    getPublishedPackages(),
  ]);

  if (!page) notFound();

  const orderedSections = page.sections || [];
  const hero = orderedSections.find((section) => section.type === 'PAGE_HERO');
  const cta = orderedSections.find((section) => section.type === 'CTA');

  const listing = (
    <>
      <Section key="category-strip" $tone="coal" $compact>
        <Container>
          {categories.length ? (
            <CategoryStrip categories={categories} />
          ) : null}
        </Container>
      </Section>

      {categories.map((category, categoryIndex) => {
        const group = services.filter((service) => service.categoryId === category.id);
        if (!group.length) return null;
        return (
          <Section key={category.id} id={category.slug} $tone={categoryIndex % 2 ? 'charcoal' : undefined}>
            <Container>
              <SectionHead
                eyebrow={category.name}
                title={category.description || category.name}
                intro={`${group.length} ${group.length === 1 ? 'service' : 'services'} in this category.`}
                titleWidth="24ch"
              />
              <Grid $cols={1} $md={2} $lg={3}>
                {group.map((service) => (
                  <Reveal key={service.id}>
                    <ServiceCard service={service} />
                  </Reveal>
                ))}
              </Grid>
            </Container>
          </Section>
        );
      })}

      {!services.length ? (
        <Section>
          <Container>
            <EmptyState
              title="Services are being prepared"
              text="Published services will appear here. Contact the workshop to discuss your requirements in the meantime."
            />
          </Container>
        </Section>
      ) : null}

      {packages.length ? (
        <Section $tone="charcoal">
          <Container>
            <SectionHead
              eyebrow="Servicing packages"
              title="Minor or major. Start with what your car needs."
              intro="Package pricing shown is the starting price. Additional work is quoted for approval before it begins."
            />
            <Grid $cols={1} $md={2}>
              {packages.map((pack) => (
                <Reveal key={pack.id}>
                  <PackageCard
                    pack={pack}
                    featured={pack.isFeatured}
                    href={pack.service?.slug ? `/services/${pack.service.slug}` : '/book'}
                  />
                </Reveal>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}
    </>
  );

  const heroBlock = (
    <PageHero
      key="hero"
      eyebrow={hero?.eyebrow || 'Services'}
      heading={hero?.heading || 'Service, diagnostics and detailing for every make.'}
      subheading={hero?.subheading}
      image={hero?.image || '/assets/images/gallery/workshop-lift.jpg'}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Services', href: '/services' }]}
    />
  );

  const ctaBlock = (
    <CtaBand
      key="cta"
      heading={cta?.heading || 'Not sure which service you need?'}
      subheading={cta?.subheading}
      ctaLabel={cta?.ctaLabel || 'Talk to the workshop'}
      ctaHref={cta?.ctaHref || '/contact'}
      secondaryLabel="Book a service"
      secondaryHref="/book"
    />
  );

  const rendered = [];
  for (const section of orderedSections) {
    if (section.type === 'PAGE_HERO') {
      rendered.push(heroBlock, <Fragment key="listing">{listing}</Fragment>);
    } else if (section.type === 'CTA') {
      rendered.push(ctaBlock);
    }
  }
  if (!hero) rendered.unshift(<Fragment key="listing">{listing}</Fragment>);

  return (
    <>
      {rendered}

      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
        ])}
      />
    </>
  );
}
