'use client';

import styled from 'styled-components';
import { Check, X } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, Prose, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { EnquiryForm } from '@/components/forms/enquiry-form';

const Layout = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 52px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 1fr) 350px;
  }
`;

const Side = styled.aside`
  position: static;
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${media.lg} {
    position: sticky;
    top: calc(${({ theme }) => theme.layout.header} + 24px);
  }
`;

const Price = styled.div`
  padding-bottom: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  span {
    display: block;
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    margin-bottom: 6px;
  }

  strong {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(32px, 4vw, 42px);
    letter-spacing: -0.03em;
  }

  em {
    display: block;
    font-style: normal;
    font-size: 12px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 6px;
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 9px;

  li {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    font-size: 13.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.smoke};
  }

  svg { flex: none; margin-top: 2px; }
`;

const Includes = styled(List)`
  svg { color: ${({ theme }) => theme.colors.brand}; }
`;

const Excludes = styled(List)`
  svg { color: ${({ theme }) => theme.colors.danger}; }
`;

const SubHead = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(19px, 2.2vw, 24px);
  letter-spacing: -0.02em;
  margin-bottom: 14px;
`;

const Facts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;

  span {
    padding: 6px 10px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 11px;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export function AmcDetail({ plan }) {
  return (
    <>
      <PageHero
        eyebrow="Annual maintenance"
        heading={`${plan.name} plan`}
        subheading={plan.tagline || plan.description}
        image="/assets/images/hero/engine.jpg"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'AMC Plans', href: '/amc' },
          { label: plan.name, href: `/amc/${plan.slug}` },
        ]}
      />

      <Section $tone="coal">
        <Container>
          <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
              <div>
                <Eyebrow>The plan</Eyebrow>
                <Prose style={{ whiteSpace: 'pre-line' }}>{plan.description}</Prose>
                <Facts style={{ marginTop: 18 }}>
                  <Badge>{plan.durationMonths} months</Badge>
                  {plan.kmLimit ? <Badge>{plan.kmLimit.toLocaleString()} km</Badge> : <Badge>KM limit confirmed at enquiry</Badge>}
                  <Badge $tone="warning">Reference pricing</Badge>
                </Facts>
              </div>

              <Grid $cols={1} $md={2}>
                <div>
                  <SubHead>What is included</SubHead>
                  <Includes>
                    {(plan.inclusions || []).map((item) => (
                      <li key={item}>
                        <Check size={14} aria-hidden="true" /> {item}
                      </li>
                    ))}
                  </Includes>
                </div>
                <div>
                  <SubHead>What is not included</SubHead>
                  {(plan.exclusions || []).length ? (
                    <Excludes>
                      {plan.exclusions.map((item) => (
                        <li key={item}>
                          <X size={14} aria-hidden="true" /> {item}
                        </li>
                      ))}
                    </Excludes>
                  ) : (
                    <Intro>Exclusions are confirmed with you before purchase.</Intro>
                  )}
                </div>
              </Grid>

              {plan.benefits?.length ? (
                <div>
                  <SubHead>Benefits</SubHead>
                  <Chips>
                    {plan.benefits.map((benefit) => (
                      <span key={benefit}>{benefit}</span>
                    ))}
                  </Chips>
                </div>
              ) : null}

              {plan.brands?.length || plan.models?.length ? (
                <div>
                  <SubHead>Compatibility</SubHead>
                  <Intro style={{ marginBottom: 14 }}>
                    Plan compatibility is confirmed against your vehicle before purchase.
                  </Intro>
                  <Chips>
                    {(plan.brands || []).map((brand) => (
                      <span key={brand.id}>{brand.name}</span>
                    ))}
                    {(plan.models || []).map((model) => (
                      <span key={model.id}>{model.brand?.name ? `${model.brand.name} ${model.name}` : model.name}</span>
                    ))}
                  </Chips>
                </div>
              ) : null}
            </div>

            <Side>
              <Panel $pad="clamp(20px, 2.6vw, 28px)" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Badge $tone="brand">{plan.name}</Badge>
                <Price>
                  <span>Plan price</span>
                  <strong>AED {plan.price}</strong>
                  <em>
                    per {plan.billingPeriod === 'YEAR' ? 'year' : String(plan.billingPeriod).toLowerCase()}
                    {plan.priceNote ? ` · ${plan.priceNote}` : ''}
                  </em>
                </Price>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Button href="#enquiry">Enquire about this plan</Button>
                  <Button href="/amc" variant="outline">Compare plans</Button>
                </div>
                <Intro style={{ fontSize: 12.5 }}>
                  Plans are confirmed with you before purchase. This website does not take payment.
                </Intro>
              </Panel>
            </Side>
          </Layout>
        </Container>
      </Section>

      <Section id="enquiry" $tone="charcoal">
        <Container>
          <Grid $cols={1} $md={2} $lg={2}>
            <div>
              <Eyebrow>Enquire</Eyebrow>
              <Heading $width="18ch">Ask about the {plan.name} plan.</Heading>
              <Intro style={{ marginTop: 16 }}>
                Send your vehicle details and the team will confirm eligibility, coverage and final pricing.
                Submitting this form is an enquiry, not a purchase.
              </Intro>
            </div>
            <Panel $pad="clamp(22px, 3vw, 34px)">
              <EnquiryForm
                type="AMC"
                source={`amc-${plan.slug}`}
                amcPlanId={plan.id}
                showVehicle
                messageLabel={`What would you like to know about the ${plan.name} plan?`}
                submitLabel="Request plan details"
                successTitle="Enquiry received"
                successBody={`The team will review your details and confirm ${plan.name} plan eligibility, coverage and pricing with you.`}
              />
            </Panel>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
