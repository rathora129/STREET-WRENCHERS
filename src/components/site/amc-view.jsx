'use client';

import styled from 'styled-components';
import { Check, Minus } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Reveal } from '@/components/ui/reveal';
import { Accordion } from '@/components/ui/accordion';
import { PageHero } from '@/components/site/page-hero';
import { AmcCard } from '@/components/site/cards';
import { EnquiryForm } from '@/components/forms/enquiry-form';

const TableWrap = styled.div`
  overflow-x: auto;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const Table = styled.table`
  width: 100%;
  min-width: 680px;
  border-collapse: collapse;
  font-size: 13px;

  th, td {
    padding: 14px 16px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    vertical-align: top;
  }

  thead th {
    background: #101014;
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 15px;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.white};
  }

  thead th span {
    display: block;
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
    margin-top: 4px;
  }

  tbody th {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.muted};
    background: rgba(255, 255, 255, 0.015);
    width: 32%;
  }

  tbody tr:last-child th,
  tbody tr:last-child td { border-bottom: 0; }

  td { color: ${({ theme }) => theme.colors.smoke}; }

  ${media.md} {
    font-size: 13.5px;
  }
`;

const Cell = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  svg { color: ${({ $yes, theme }) => ($yes ? theme.colors.brand : theme.colors.dim)}; flex: none; }
`;

const FormSplit = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 52px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: 0.9fr 1.1fr;
  }
`;

const Rules = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;

  li {
    display: flex;
    gap: 9px;
    font-size: 13.5px;
    line-height: 1.65;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

const priced = (plan) =>
  `${plan.billingPeriod === 'YEAR' ? 'AED' : 'AED'} ${plan.price} / ${plan.billingPeriod === 'YEAR' ? 'year' : String(plan.billingPeriod).toLowerCase()}`;

export function AmcView({ page, plans = [], faqs = [] }) {
  const orderedSections = page?.sections || [];
  const hero = orderedSections.find((section) => section.type === 'PAGE_HERO');
  const plansSection = orderedSections.find((section) => section.key === 'plans');
  const includedRows = Array.from(new Set(plans.flatMap((plan) => plan.inclusions || [])));

  const heroBlock = (
    <PageHero
      key="hero"
      eyebrow={hero?.eyebrow || 'Annual maintenance'}
      heading={hero?.heading || 'Plan the year. Skip the surprises.'}
      subheading={hero?.subheading}
      image={hero?.image || '/assets/images/hero/engine.jpg'}
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AMC Plans', href: '/amc' }]}
    />
  );

  const plansBlock = (
    <Section key="plans" $tone="coal">
      <Container>
        <SectionHead
          eyebrow={plansSection?.eyebrow || 'Plans'}
          title={plansSection?.heading || 'Choose the level of cover that fits.'}
          intro={plansSection?.subheading}
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
          <Panel>
            <Heading $size="sm" $width="20ch">Plans are being finalised.</Heading>
            <Intro style={{ marginTop: 12 }}>
              Annual maintenance plans will be published here once confirmed. Contact the team to discuss coverage
              in the meantime.
            </Intro>
          </Panel>
        )}
      </Container>
    </Section>
  );

  const blockFor = (section) => {
    if (section.type === 'PAGE_HERO') return heroBlock;
    if (section.key === 'plans') return plansBlock;
    return null;
  };

  return (
    <>
      {orderedSections.map(blockFor).filter(Boolean)}

      {plans.length > 1 ? (
        <Section $tone="charcoal">
          <Container>
            <SectionHead
              eyebrow="Compare"
              title="Coverage at a glance."
              intro="The table lists the inclusions shown for each plan. Final coverage is confirmed with you before purchase."
            />
            <TableWrap>
              <Table>
                <thead>
                  <tr>
                    <th scope="col">Coverage</th>
                    {plans.map((plan) => (
                      <th key={plan.id} scope="col">
                        {plan.name}
                        <span>{priced(plan)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {includedRows.map((row) => (
                    <tr key={row}>
                      <th scope="row">{row}</th>
                      {plans.map((plan) => {
                        const has = plan.inclusions?.includes(row);
                        return (
                          <td key={plan.id}>
                            <Cell $yes={has}>
                              {has ? <Check size={14} aria-label="Included" /> : <Minus size={14} aria-label="Not listed" />}
                              {has ? 'Included' : 'Not listed'}
                            </Cell>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">KM limit</th>
                    {plans.map((plan) => (
                      <td key={plan.id}>{plan.kmLimit ? `${plan.kmLimit.toLocaleString()} km` : 'Confirmed at enquiry'}</td>
                    ))}
                  </tr>
                  <tr>
                    <th scope="row">Plan duration</th>
                    {plans.map((plan) => (
                      <td key={plan.id}>{plan.durationMonths} months</td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            </TableWrap>
            <div style={{ marginTop: 14 }}>
              <Badge $tone="warning">Reference pricing — coverage confirmed before purchase</Badge>
            </div>
          </Container>
        </Section>
      ) : null}

      <Section id="enquiry">
        <Container>
          <FormSplit>
            <div>
              <Eyebrow>AMC enquiry</Eyebrow>
              <Heading $width="20ch">Talk through the right plan.</Heading>
              <Intro style={{ marginTop: 16 }}>
                Tell us about your car and how you use it. The team will confirm eligibility, coverage and final
                pricing for the plan that fits.
              </Intro>
              <Rules>
                <li><Check size={15} aria-hidden="true" /> Plans are confirmed against your vehicle and usage.</li>
                <li><Check size={15} aria-hidden="true" /> Coverage and exclusions are shared before purchase.</li>
                <li><Check size={15} aria-hidden="true" /> No payment is taken through this website.</li>
              </Rules>
              {faqs.length ? (
                <div style={{ marginTop: 30 }}>
                  <Accordion items={faqs} />
                </div>
              ) : null}
            </div>
            <Panel $pad="clamp(22px, 3vw, 34px)">
              <EnquiryForm
                type="AMC"
                source="amc-page"
                showVehicle
                messageLabel="Which plan are you interested in, and what do you drive?"
                submitLabel="Request plan details"
                successTitle="AMC enquiry received"
                successBody="The team will review your vehicle details and confirm plan eligibility, coverage and pricing with you."
              />
            </Panel>
          </FormSplit>
        </Container>
      </Section>
    </>
  );
}
