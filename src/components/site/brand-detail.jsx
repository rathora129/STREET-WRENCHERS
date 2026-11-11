'use client';

import styled from 'styled-components';
import { ArrowUpRight, Car, Fuel, ShieldCheck } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';
import { AmcCard } from '@/components/site/cards';

const ModelCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.charcoal};
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
  min-height: 108px;
  border-radius: ${({ theme }) => theme.radii.sm};
  background: #f4f1ea;
  display: grid;
  place-items: center;
  padding: 20px;

  img {
    max-width: 70%;
    max-height: 72px;
    object-fit: contain;
  }
`;

const Initials = styled.span`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 40px;
  letter-spacing: 0.08em;
  color: #17171c;
  text-transform: uppercase;
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

function initials(name = '') {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('');
}

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

  return (
    <>
      <PageHero
        eyebrow={brand.country ? `Brand coverage · ${brand.country}` : 'Brand coverage'}
        heading={`${brand.name} service in Dubai.`}
        subheading={`Scheduled maintenance, diagnostics and repair for ${brand.name} vehicles. Select your model and the team will confirm the exact scope before work starts.`}
        image={brand.image || '/assets/images/hero/workshop.jpg'}
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
              {brand.logo ? (
                <LogoPlate>
                  <img src={brand.logo} alt={`${brand.name} logo`} loading="lazy" />
                </LogoPlate>
              ) : (
                <LogoPlate>
                  <Initials aria-hidden="true">{initials(brand.name)}</Initials>
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
