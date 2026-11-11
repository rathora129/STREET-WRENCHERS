'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { ArrowUpRight, Car, Fuel, ShieldCheck } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassCard } from '@/styles/glass';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';
import { AmcCard } from '@/components/site/cards';
import { localBrandLogo } from '@/data/brand-logos';
import { brandShowcase } from '@/data/brand-showcase';

const ModelCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  min-height: 100%;

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 17px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.white};
  }
`;

const ModelMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.muted};
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radii.pill};
    padding: 4px 9px;
  }

  svg { color: ${({ theme }) => theme.colors.brand}; }
`;

const ModelLink = styled.a`
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
`;

const BrandPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const LogoPlate = styled.div`
  width: 100%;
  min-height: 118px;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid rgba(255, 255, 255, 0.09);
  background:
    radial-gradient(circle at 50% 0%, rgba(242, 106, 13, 0.12), transparent 70%),
    linear-gradient(150deg, rgba(255, 255, 255, 0.065), rgba(255, 255, 255, 0.015));
  display: grid;
  place-items: center;
  padding: 22px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);

  img {
    max-width: 72%;
    max-height: 74px;
    object-fit: contain;
    filter: ${({ $local }) => ($local ? 'brightness(0) invert(1)' : 'none')};
  }
`;

const LogoMark = styled.div`
  width: 66px;
  height: 66px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.brand};
  background: rgba(242, 106, 13, 0.12);
  border: 1px solid rgba(242, 106, 13, 0.26);
`;

const Facts = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: center;
    gap: 9px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.smoke};
    line-height: 1.55;
  }

  svg { flex: none; color: ${({ theme }) => theme.colors.brand}; }
`;

const Note = styled.p`
  font-size: 11.5px;
  line-height: 1.7;
  color: ${({ theme }) => theme.colors.muted};
`;

function yearRange(model) {
  if (model.yearFrom && model.yearTo) return `${model.yearFrom}–${model.yearTo}`;
  if (model.yearFrom) return `${model.yearFrom} onwards`;
  if (model.yearTo) return `Up to ${model.yearTo}`;
  return null;
}

export function BrandDetail({ brand }) {
  const models = brand.models || [];
  const plans = brand.amcPlans || [];
  const bookHref = `/book?brand=${encodeURIComponent(brand.name)}`;
  const [failedLogo, setFailedLogo] = useState(null);
  const logoSrc = [brand.logo, localBrandLogo(brand.slug)].filter(Boolean).find((src) => src !== failedLogo);

  return (
    <>
      <PageHero
        eyebrow={brand.country ? `Brand coverage · ${brand.country}` : 'Brand coverage'}
        heading={`${brand.name} service in Dubai.`}
        subheading={`Scheduled maintenance, diagnostics and repair for ${brand.name} vehicles. Select your model and the team will confirm the exact scope before work starts.`}
        image={brand.image || brandShowcase(brand.slug)?.src || '/assets/images/hero/workshop.jpg'}
        imageAlt={`${brand.name} servicing`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Brands', href: '/brands' },
          { label: brand.name, href: `/brands/${brand.slug}` },
        ]}
      />

      <Section $tone="coal">
        <Container>
          <Grid $cols={1} $md={1} $lg={3} style={{ alignItems: 'start' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <Eyebrow>Models covered</Eyebrow>
              <Heading $size="sm" $width="26ch">
                {models.length ? `${brand.name} models we look after.` : `${brand.name} coverage.`}
              </Heading>
              <Intro style={{ marginTop: 14 }}>
                {models.length
                  ? 'Model availability below is maintained by the workshop. If your exact variant is not listed, ask the team — coverage is confirmed before you book.'
                  : 'The workshop has not listed individual models for this brand yet. Send your model and year and the team will confirm coverage.'}
              </Intro>

              {models.length ? (
                <Grid $cols={1} $md={2} style={{ marginTop: 26 }}>
                  {models.map((model) => {
                    const years = yearRange(model);
                    return (
                      <Reveal key={model.id}>
                        <ModelCard>
                          <strong>{model.name}</strong>
                          <ModelMeta>
                            {years ? (
                              <span>
                                <Car size={12} aria-hidden="true" /> {years}
                              </span>
                            ) : null}
                            {model.fuelTypes?.length ? (
                              <span>
                                <Fuel size={12} aria-hidden="true" /> {model.fuelTypes.join(' · ')}
                              </span>
                            ) : null}
                          </ModelMeta>
                          <ModelLink href={`${bookHref}&model=${encodeURIComponent(model.name)}`}>
                            Book this model <ArrowUpRight size={13} aria-hidden="true" />
                          </ModelLink>
                        </ModelCard>
                      </Reveal>
                    );
                  })}
                </Grid>
              ) : null}
            </div>

            <BrandPanel $pad="clamp(20px, 2.6vw, 28px)">
              {logoSrc ? (
                <LogoPlate $local={logoSrc !== brand.logo}>
                  <img
                    src={logoSrc}
                    alt={`${brand.name} logo`}
                    loading="lazy"
                    onError={() => setFailedLogo(logoSrc)}
                  />
                </LogoPlate>
              ) : (
                <LogoPlate>
                  <LogoMark>
                    <Car size={30} strokeWidth={1.6} aria-hidden="true" />
                  </LogoMark>
                </LogoPlate>
              )}
              <div>
                <Badge $tone="brand">{brand.name}</Badge>
                <Heading $size="sm" style={{ marginTop: 12 }}>
                  Workshop care for your {brand.name}.
                </Heading>
              </div>
              <Facts>
                <li>
                  <Car size={15} aria-hidden="true" /> {models.length} {models.length === 1 ? 'model' : 'models'} listed
                  for this brand
                </li>
                <li>
                  <ShieldCheck size={15} aria-hidden="true" /> Work beyond the booked scope is quoted for approval
                  first
                </li>
              </Facts>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Button href={bookHref}>Book for this brand</Button>
                <Button href="/contact" variant="outline">Ask about your model</Button>
              </div>
              <Note>
                Prices are confirmed after inspection unless a starting price is shown on the service. No work is
                started without your approval.
              </Note>
            </BrandPanel>
          </Grid>
        </Container>
      </Section>

      {plans.length ? (
        <Section $tone="charcoal">
          <Container>
            <SectionHead
              eyebrow="Maintenance plans"
              title="Plans that include this brand."
              intro="Plan pricing and coverage are set by the workshop and confirmed at enquiry."
              action={<Button href="/amc" variant="outline">All AMC plans</Button>}
            />
            <Grid $cols={1} $md={2} $lg={3}>
              {plans.map((plan) => (
                <Reveal key={plan.id}>
                  <AmcCard plan={plan} featured={plan.isFeatured} />
                </Reveal>
              ))}
            </Grid>
          </Container>
        </Section>
      ) : null}

      <CtaBand
        heading={`Book ${brand.name} service.`}
        subheading="Choose your model when booking. The team confirms the work, timing and price with you."
        ctaLabel="Book a service"
        ctaHref={bookHref}
        secondaryLabel="See all brands"
        secondaryHref="/brands"
      />
    </>
  );
}
