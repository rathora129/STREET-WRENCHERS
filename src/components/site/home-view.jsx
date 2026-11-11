'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ArrowUpRight, BadgeCheck, CalendarCheck, Gauge, ShieldCheck } from 'lucide-react';
import { media } from '@/styles/theme';
import { MODULE_DEFINITIONS } from '@/data/modules';
import { Section, Container, Grid, Split, Row } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, SectionHead } from '@/components/ui/type';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { Accordion } from '@/components/ui/accordion';
import { SmartImage } from '@/components/ui/smart-image';
import { HeroSlider } from '@/components/site/hero-slider';
import { TestimonialMarquee, TestimonialsEmpty } from '@/components/site/testimonial-marquee';
import { ServiceCard, PackageCard, AmcCard, BrandTile, BlogCard } from '@/components/site/cards';
import { GalleryGrid } from '@/components/site/gallery-grid';
import { Carousel } from '@/components/ui/carousel';
import { ModulePromo } from '@/components/site/module-promo';
import { ContactSection } from '@/components/site/contact-section';

const sectionMap = (page) =>
  Object.fromEntries((page?.sections || []).map((section) => [section.key, section]));

const IntroCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const BulletRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  margin-top: 6px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 11.5px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg { color: ${({ theme }) => theme.colors.brand}; }
`;

const Points = styled.div`
  display: grid;
  gap: 1px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.line};
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const Point = styled.div`
  background: ${({ theme }) => theme.colors.coal};
  padding: clamp(20px, 2.6vw, 30px);
  display: flex;
  flex-direction: column;
  gap: 10px;

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  p {
    font-size: 13px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.muted};
  }

  span.num {
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    color: ${({ theme }) => theme.colors.brand};
    letter-spacing: 0.16em;
  }
`;

const Steps = styled.ol`
  display: grid;
  gap: 18px;
  grid-template-columns: 1fr;
  counter-reset: step;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const Step = styled.li`
  position: relative;
  padding-top: 26px;
  border-top: 1px solid ${({ theme }) => theme.colors.lineStrong};

  span.step {
    position: absolute;
    top: -1px;
    left: 0;
    transform: translateY(-50%);
    background: ${({ theme }) => theme.colors.ink};
    padding-right: 10px;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 11px;
    color: ${({ theme }) => theme.colors.brand};
    letter-spacing: 0.12em;
  }

  h3 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 17px;
    letter-spacing: -0.01em;
    margin-bottom: 8px;
  }

  p {
    font-size: 13px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

const Banner = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px 40px;
  align-items: center;
  justify-content: space-between;
  padding: clamp(22px, 3vw, 32px);
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: linear-gradient(120deg, #121215 0%, #0c0c0f 100%);

  p {
    max-width: 62ch;
    color: ${({ theme }) => theme.colors.smoke};
    font-size: 14px;
    line-height: 1.7;
  }
`;

const TextLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};

  svg { transition: transform 160ms ease; }
  &:hover svg { transform: translate(2px, -2px); }
`;

const GalleryWrap = styled.div`
  margin-top: 8px;
`;

const FaqSplit = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 60px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: 0.85fr 1.15fr;
  }
`;

const MapNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: rgba(255, 255, 255, 0.02);
  font-size: 12.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.muted};

  svg { color: ${({ theme }) => theme.colors.brand}; flex: none; margin-top: 2px; }
`;

function ModuleSection({ moduleKey, config, even }) {
  const definition = MODULE_DEFINITIONS[moduleKey];
  if (!definition || !config) return null;
  const module = { ...definition, ...config, status: config.status || 'HIDDEN' };
  if (!['ACTIVE', 'COMING_SOON'].includes(module.status)) return null;

  return (
    <Section $tone={even ? 'coal' : undefined} $compact>
      <Container>
        <Reveal>
          <ModulePromo module={module} flip={!even} compact />
        </Reveal>
      </Container>
    </Section>
  );
}

export function HomeView({ data }) {
  const { page, banners, services, packages, plans, brands, media, testimonials, faqs, blogs, settings } = data;
  const sections = sectionMap(page);
  const hero = sections.hero || {};
  const intro = sections.intro || {};
  const servicesSection = sections.services || {};
  const packagesSection = sections.packages || {};
  const amcSection = sections.amc || {};
  const brandsSection = sections.brands || {};
  const why = sections.why || {};
  const process = sections.process || {};
  const gallery = sections.gallery || {};
  const testimonialsSection = sections.testimonials || {};
  const blogSection = sections.blog || {};
  const faqsSection = sections.faqs || {};
  const contact = sections.contact || {};

  const whyPoints = why.data?.points || [];
  const steps = process.data?.steps || [];

  return (
    <>
      <HeroSlider banners={banners} section={hero} options={settings.banner} />

      <Section $tone="coal" $compact>
        <Container>
          <Split $ratio="1.05fr 0.95fr">
            <IntroCopy>
              <div>
                {intro.eyebrow ? <Eyebrow>{intro.eyebrow}</Eyebrow> : null}
                <Heading $width="20ch">{intro.heading || 'Care that matches the way Dubai drives.'}</Heading>
              </div>
              <Intro style={{ whiteSpace: 'pre-line' }}>{intro.body}</Intro>
              <BulletRow>
                <span><BadgeCheck size={14} aria-hidden="true" /> Multi-brand workshop</span>
                <span><Gauge size={14} aria-hidden="true" /> Diagnostics-led</span>
                <span><ShieldCheck size={14} aria-hidden="true" /> Approval before extra work</span>
              </BulletRow>
              <Row $gap="12px">
                <Button href={intro.ctaHref || '/about'}>{intro.ctaLabel || 'About the workshop'}</Button>
                <Button href="/book" variant="outline">Book a service</Button>
              </Row>
            </IntroCopy>
            <Reveal delay={0.08}>
              <SmartImage
                src={intro.image || '/assets/images/hero/workshop.jpg'}
                alt={intro.imageAlt || 'Vehicle being inspected in a workshop'}
                ratio="4 / 3"
                sizes="(max-width: 820px) 100vw, 45vw"
              />
            </Reveal>
          </Split>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead
            eyebrow={servicesSection.eyebrow || 'Services'}
            title={servicesSection.heading || 'One team for the systems that matter.'}
            intro={servicesSection.subheading}
            action={
              <Button href={servicesSection.ctaHref || '/services'} variant="outline">
                {servicesSection.ctaLabel || 'View all services'}
              </Button>
            }
          />
          {services.length ? (
            <Grid $cols={1} $md={2} $lg={3}>
              {services.map((service, index) => (
                <Reveal key={service.id} delay={Math.min(index * 0.05, 0.25)}>
                  <ServiceCard service={service} />
                </Reveal>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="Services are being prepared"
              text="Published services will appear here as they are added in the dashboard."
            />
          )}
        </Container>
      </Section>

      <Section $tone="charcoal">
        <Container>
          <SectionHead
            eyebrow={packagesSection.eyebrow || 'Servicing'}
            title={packagesSection.heading || 'Minor or major. Start with what your car needs.'}
            intro={packagesSection.subheading}
          />
          {packages.length ? (
            <Grid $cols={1} $md={2} $lg={2}>
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
          ) : (
            <EmptyState title="Packages are being prepared" text="Service packages will appear here once published." />
          )}
          <div style={{ marginTop: 26 }}>
            <TextLink href="/services">
              Compare all services <ArrowUpRight size={13} aria-hidden="true" />
            </TextLink>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHead
            eyebrow={amcSection.eyebrow || 'Annual maintenance'}
            title={amcSection.heading || 'Keep the whole year covered.'}
            intro={amcSection.subheading}
            action={
              <Button href={amcSection.ctaHref || '/amc'} variant="outline">
                {amcSection.ctaLabel || 'Explore AMC plans'}
              </Button>
            }
          />
          {plans.length ? (
            <Grid $cols={1} $md={2} $lg={3}>
              {plans.map((plan) => (
                <Reveal key={plan.id}>
                  <AmcCard plan={plan} featured={plan.isFeatured} />
                </Reveal>
              ))}
            </Grid>
          ) : (
            <EmptyState title="AMC plans are being finalised" text="Annual maintenance plans will be listed here once published." />
          )}
          <Banner style={{ marginTop: 28 }}>
            <p>
              Reference pricing is shown for each plan. Final coverage, eligibility and pricing are confirmed with
              you before purchase.
            </p>
            <Button href="/contact" variant="outline" size="sm">Ask about coverage</Button>
          </Banner>
        </Container>
      </Section>

      <Section $tone="coal" $compact>
        <Container>
          <SectionHead
            eyebrow={brandsSection.eyebrow || 'All makes'}
            title={brandsSection.heading || 'The makes Dubai drives.'}
            intro={brandsSection.subheading}
            action={
              <Button href={brandsSection.ctaHref || '/brands'} variant="outline">
                {brandsSection.ctaLabel || 'View car brands'}
              </Button>
            }
          />
          <Carousel
            label="Car brands"
            items={brands}
            itemWidth="clamp(232px, 24vw, 272px)"
            gap="14px"
            renderItem={(brand) => <BrandTile brand={brand} />}
          />
        </Container>
      </Section>

      {whyPoints.length ? (
        <Section>
          <Container>
            <SectionHead
              eyebrow={why.eyebrow || 'Why Street Wrenchers'}
              title={why.heading || 'A workshop that explains before it repairs.'}
            />
            <Points>
              {whyPoints.map((point, index) => (
                <Point key={point.title}>
                  <span className="num">{String(index + 1).padStart(2, '0')}</span>
                  <strong>{point.title}</strong>
                  <p>{point.text}</p>
                </Point>
              ))}
            </Points>
          </Container>
        </Section>
      ) : null}

      {steps.length ? (
        <Section $tone="charcoal">
          <Container>
            <SectionHead
              eyebrow={process.eyebrow || 'How it works'}
              title={process.heading || 'How a visit works.'}
              action={<Button href="/book">Book a service</Button>}
            />
            <Steps>
              {steps.map((step) => (
                <Step key={step.step || step.title}>
                  <span className="step">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </Step>
              ))}
            </Steps>
          </Container>
        </Section>
      ) : null}

      {media.length ? (
        <Section>
          <Container>
            <SectionHead
              eyebrow={gallery.eyebrow || 'Gallery'}
              title={gallery.heading || 'A closer look at the work.'}
              intro={gallery.subheading}
              action={
                <Button href={gallery.ctaHref || '/gallery'} variant="outline">
                  {gallery.ctaLabel || 'Open gallery'}
                </Button>
              }
            />
            <GalleryWrap>
              <GalleryGrid layout="carousel" items={media.slice(0, 8)} />
            </GalleryWrap>
          </Container>
        </Section>
      ) : null}

      <Section $tone="coal">
        <Container>
          <SectionHead
            eyebrow={testimonialsSection.eyebrow || 'Reviews'}
            title={testimonialsSection.heading || 'What drivers say.'}
            intro={testimonials.length ? testimonialsSection.subheading : null}
          />
          {testimonials.length ? (
            <TestimonialMarquee items={testimonials} />
          ) : (
            <TestimonialsEmpty />
          )}
        </Container>
      </Section>

      <ModuleSection moduleKey="CAR_RENTAL" config={settings.modules?.CAR_RENTAL} even={false} />
      <ModuleSection moduleKey="CAR_SALES" config={settings.modules?.CAR_SALES} even />

      <Section>
        <Container>
          <SectionHead
            eyebrow={blogSection.eyebrow || 'Journal'}
            title={blogSection.heading || 'Notes from the workshop.'}
            intro={blogSection.subheading}
            action={
              <Button href={blogSection.ctaHref || '/blog'} variant="outline">
                {blogSection.ctaLabel || 'Read the journal'}
              </Button>
            }
          />
          {blogs.length ? (
            <Grid $cols={1} $md={2} $lg={3}>
              {blogs.map((post) => (
                <Reveal key={post.id}>
                  <BlogCard post={post} />
                </Reveal>
              ))}
            </Grid>
          ) : (
            <EmptyState
              title="The journal is being prepared"
              text="Practical maintenance guidance from the workshop will be published here. In the meantime, send us your questions directly."
              action={<Button href="/contact" variant="outline" size="sm">Ask the workshop</Button>}
            />
          )}
        </Container>
      </Section>

      {faqs.length ? (
        <Section $tone="charcoal">
          <Container>
            <FaqSplit>
              <div>
                {faqsSection.eyebrow ? <Eyebrow>{faqsSection.eyebrow}</Eyebrow> : null}
                <Heading $width="18ch">{faqsSection.heading || 'Straight answers.'}</Heading>
                {faqsSection.subheading ? <Intro style={{ marginTop: 16 }}>{faqsSection.subheading}</Intro> : null}
                <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  <Button href={faqsSection.ctaHref || '/faqs'} variant="outline">
                    {faqsSection.ctaLabel || 'See all FAQs'}
                  </Button>
                </div>
                <MapNote style={{ marginTop: 26 }}>
                  <CalendarCheck size={16} aria-hidden="true" />
                  <span>Bookings are confirmed by the team. Submitting a request does not lock a slot until we confirm it with you.</span>
                </MapNote>
              </div>
              <Accordion items={faqs} />
            </FaqSplit>
          </Container>
        </Section>
      ) : null}

      <Section id="contact">
        <Container>
          <ContactSection
            heading={contact.heading || 'Ready when your car is.'}
            body={contact.body}
            settings={settings}
          />
        </Container>
      </Section>
    </>
  );
}
