'use client';

import styled from 'styled-components';
import { Check, Clock, MessageCircle, ShieldCheck } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, Prose, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { Accordion } from '@/components/ui/accordion';
import { SmartImage } from '@/components/ui/smart-image';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';
import { ServiceCard, PackageCard } from '@/components/site/cards';
import { GalleryGrid } from '@/components/site/gallery-grid';

const Layout = styled.div`
  display: grid;
  gap: clamp(26px, 4vw, 56px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) 360px;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(30px, 4vw, 48px);
`;

const Side = styled.aside`
  position: static;

  ${media.lg} {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.header} + 24px);
  }
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  span.label {
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(30px, 4vw, 40px);
    letter-spacing: -0.03em;
    line-height: 1.1;
  }

  em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.muted};
    font-size: 12.5px;
    line-height: 1.6;
  }
`;

const MiniList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;

  li {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    font-size: 13px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

const Checklist = styled.ul`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.smoke};
    padding: 12px 14px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radii.sm};
    background: rgba(255, 255, 255, 0.015);
  }

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

const BenefitGrid = styled.div`
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

  div {
    background: ${({ theme }) => theme.colors.coal};
    padding: 20px;
    font-size: 13.5px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.smoke};
  }

  span {
    display: block;
    font-family: ${({ theme }) => theme.fonts.mono};
    font-size: 10px;
    color: ${({ theme }) => theme.colors.brand};
    letter-spacing: 0.14em;
    margin-bottom: 8px;
  }
`;

const SubHead = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(20px, 2.4vw, 26px);
  letter-spacing: -0.02em;
  margin-bottom: 16px;
`;

const Note = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 11.5px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.dim};

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

export function ServiceDetail({ service, related, whatsappUrl }) {
  const heroImage = service.image || '/assets/images/gallery/workshop-lift.jpg';

  return (
    <>
      <PageHero
        eyebrow={service.category?.name || 'Service'}
        heading={service.name}
        subheading={service.shortDescription}
        image={heroImage}
        imageAlt={service.name}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Services', href: '/services' },
          { label: service.name, href: `/services/${service.slug}` },
        ]}
      />

      <Section $tone="coal">
        <Container>
          <Layout>
            <Body>
              <div>
                <Eyebrow>What is included</Eyebrow>
                <Prose style={{ whiteSpace: 'pre-line' }}>{service.description}</Prose>
              </div>

              {service.inclusions?.length ? (
                <div>
                  <SubHead>What this service covers</SubHead>
                  <Checklist>
                    {service.inclusions.map((item) => (
                      <li key={item}>
                        <Check size={15} aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </Checklist>
                </div>
              ) : null}

              {service.benefits?.length ? (
                <div>
                  <SubHead>Why it matters</SubHead>
                  <BenefitGrid>
                    {service.benefits.map((benefit, index) => (
                      <div key={benefit}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        {benefit}
                      </div>
                    ))}
                  </BenefitGrid>
                </div>
              ) : null}

              {service.gallery?.length ? (
                <div>
                  <SubHead>From the workshop</SubHead>
                  <GalleryGrid
                    items={service.gallery.map((url, index) => ({ url, alt: `${service.name} — view ${index + 1}` }))}
                    columns={2}
                    largeColumns={3}
                  />
                </div>
              ) : null}
            </Body>

            <Side>
              <Panel $pad="clamp(20px, 2.6vw, 28px)" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <Badge $tone="brand">{service.category?.name || 'Workshop service'}</Badge>
                <PriceBox>
                  <span className="label">{service.price ? 'Starting from' : 'Pricing'}</span>
                  <strong>{service.price ? `AED ${service.price}` : 'Quoted'}</strong>
                  <em>
                    {service.price
                      ? service.priceNote || 'Starting price. Final scope confirmed after inspection.'
                      : 'Quoted after inspection so you know the scope before work begins.'}
                  </em>
                </PriceBox>

                {service.duration ? (
                  <Note>
                    <Clock size={14} aria-hidden="true" /> Estimated duration: {service.duration}
                  </Note>
                ) : null}

                {service.inclusions?.length ? (
                  <MiniList>
                    {service.inclusions.slice(0, 4).map((item) => (
                      <li key={item}>
                        <Check size={13} aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </MiniList>
                ) : null}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Button href={`/book?service=${service.slug}`}>Book this service</Button>
                  {whatsappUrl ? (
                    <Button href={whatsappUrl} external variant="outline" icon={false}>
                      <MessageCircle size={15} style={{ marginRight: 2 }} aria-hidden="true" />
                      WhatsApp the team
                    </Button>
                  ) : null}
                </div>

                <Note>
                  <ShieldCheck size={14} aria-hidden="true" />
                  Any work beyond the booked scope is quoted for your approval before it is carried out.
                </Note>
              </Panel>
            </Side>
          </Layout>
        </Container>
      </Section>

      {service.packages?.length ? (
        <Section $tone="charcoal">
          <Container>
            <SectionHead
              eyebrow="Packages"
              title="Choose the level that fits."
              intro="Package prices are starting prices. Anything additional is quoted for approval."
            />
            <Grid $cols={1} $md={2}>
              {service.packages.map((pack) => (
                <Reveal key={pack.id}>
                  <PackageCard pack={pack} featured={pack.isFeatured} href={`/book?service=${service.slug}`} />
                </Reveal>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}

      {service.faqs?.length ? (
        <Section>
          <Container>
            <Grid $cols={1} $md={2} $lg={2}>
              <div>
                <Eyebrow>Questions</Eyebrow>
                <Heading $width="18ch">Good to know.</Heading>
                <Intro style={{ marginTop: 16 }}>
                  If your question is not covered, send it to the team and we will respond with specifics.
                </Intro>
                <div style={{ marginTop: 22 }}>
                  <Button href="/contact" variant="outline">Ask the workshop</Button>
                </div>
              </div>
              <Accordion items={service.faqs} />
            </Grid>
          </Container>
        </Section>
      ) : null}

      {related?.length ? (
        <Section $tone="coal">
          <Container>
            <SectionHead
              eyebrow="Related"
              title="Other work we handle."
              action={<Button href="/services" variant="outline">All services</Button>}
            />
            <Grid $cols={1} $md={2} $lg={3}>
              {related.map((item) => (
                <Reveal key={item.id}>
                  <ServiceCard service={item} />
                </Reveal>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        heading="Book this service."
        subheading="Choose a vehicle, date and time. The team will confirm the details with you."
        ctaLabel="Book a service"
        ctaHref={`/book?service=${service.slug}`}
        secondaryLabel="Contact us"
        secondaryHref="/contact"
      />
    </>
  );
}
