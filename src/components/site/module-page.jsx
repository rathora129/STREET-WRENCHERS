'use client';

import styled from 'styled-components';
import { Check } from 'lucide-react';
import { media } from '@/styles/theme';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, SectionHead } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Reveal } from '@/components/ui/reveal';
import { PageHero } from '@/components/site/page-hero';
import { ModulePromo } from '@/components/site/module-promo';
import { VehicleCard } from '@/components/site/vehicle-card';
import { EnquiryForm } from '@/components/forms/enquiry-form';
import { CtaBand } from '@/components/site/cta-band';

const NextSteps = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;

  li {
    display: flex;
    gap: 10px;
    font-size: 13.5px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg { flex: none; margin-top: 2px; color: ${({ theme }) => theme.colors.brand}; }
`;

const Split = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 52px);
  align-items: start;

  ${media.lg} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  }
`;

const formCopy = {
  rental: {
    type: 'RENTAL',
    messageLabel: 'Which vehicle or rental period do you need?',
    submitLabel: 'Send rental enquiry',
    successTitle: 'Rental enquiry received',
    successBody: 'The team will contact you with availability, requirements and pricing.',
  },
  sales: {
    type: 'CAR_SALES',
    messageLabel: 'Which vehicle are you interested in?',
    submitLabel: 'Send vehicle enquiry',
    successTitle: 'Vehicle enquiry received',
    successBody: 'The team will contact you with availability, viewing options and next steps.',
  },
  buy: {
    type: 'BUY_CAR',
    messageLabel: 'What car are you looking for? Include budget and preferred timing.',
    submitLabel: 'Send buyer request',
    successTitle: 'Buyer request received',
    successBody: 'The team will contact you to discuss your requirements and available options.',
  },
  sell: {
    type: 'SELL_CAR',
    messageLabel: 'Tell us about your car — model, year, mileage and condition.',
    submitLabel: 'Send valuation request',
    successTitle: 'Valuation request received',
    successBody: 'The team will review your vehicle details and contact you to discuss next steps.',
  },
};

export function ModulePage({ module, page, vehicles = [], kind = 'rental' }) {
  const hero = page?.sections?.find((section) => section.type === 'PAGE_HERO');
  const active = module.status === 'ACTIVE';
  const showsVehicles = kind === 'rental' || kind === 'sales';
  const copy = formCopy[kind];
  const heading = active
    ? hero?.heading || module.headline || module.label
    : module.headline || hero?.heading || module.label;


  return (
    <>
      <PageHero
        eyebrow={`${module.label}${active ? '' : ' — coming soon'}`}
        heading={heading}
        subheading={active ? hero?.subheading || module.description : module.description}
        image={module.image || hero?.image || '/assets/images/hero/workshop.jpg'}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: module.label, href: module.publicPath },
        ]}
      />

      {!active ? (
        <Section $tone="coal">
          <Container>
            <ModulePromo module={module} showForm={false} compact={false} />
            <NextSteps style={{ marginTop: 30 }}>
              <li><Check size={15} aria-hidden="true" /> Register your interest now — no payment or commitment.</li>
              <li><Check size={15} aria-hidden="true" /> The team will contact you when the module opens.</li>
              <li><Check size={15} aria-hidden="true" /> In the meantime, the workshop is open for service and repair bookings.</li>
            </NextSteps>
            <div style={{ marginTop: 24 }}>
              <Button href="/book" variant="outline">Book a service meanwhile</Button>
            </div>
          </Container>
        </Section>
      ) : showsVehicles ? (
        <>
          {vehicles.length ? (
            <Section $tone="coal">
              <Container>
                <SectionHead
                  eyebrow={kind === 'rental' ? 'Available vehicles' : 'Vehicles for sale'}
                  title={
                    kind === 'rental'
                      ? 'Choose a vehicle for your stay or project.'
                      : 'A handled selection of cars.'
                  }
                  intro={
                    kind === 'rental'
                      ? 'Rates shown are daily starting rates. Availability, deposit and requirements are confirmed with the team.'
                      : 'Prices shown are the asking price. Inspection and handover arrangements are confirmed with the team.'
                  }
                />
                <Grid $cols={1} $md={2} $lg={3}>
                  {vehicles.map((vehicle) => (
                    <Reveal key={vehicle.id}>
                      <VehicleCard vehicle={vehicle} kind={kind} />
                    </Reveal>
                  ))}
                </Grid>
              </Container>
            </Section>
          ) : (
            <Section $tone="coal">
              <Container>
                <EmptyState
                  title="Vehicles are being added"
                  text="Published vehicles will appear here. Send an enquiry and the team will let you know what is available."
                />
              </Container>
            </Section>
          )}
        </>
      ) : null}

      <Section id="enquire" $tone={active ? undefined : 'charcoal'}>
        <Container>
          <Split>
            <div>
              <Eyebrow>Enquire</Eyebrow>
              <Heading $width="20ch">{active ? 'Talk to the team.' : 'Be first to know.'}</Heading>
              <Intro style={{ marginTop: 16 }}>
                {active
                  ? 'Tell us what you need and the team will respond with availability and next steps. Enquiries are not automated bookings.'
                  : 'Leave your details and the team will contact you when this module opens. Nothing is charged and there is no commitment.'}
              </Intro>
              <div style={{ marginTop: 18 }}>
                <Badge $tone={active ? 'success' : 'brand'}>{active ? 'Available now' : 'Coming soon'}</Badge>
              </div>
              {module.launchDate ? (
                <p style={{ marginTop: 12, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f26a0d' }}>
                  Target launch — {module.launchDate}
                </p>
              ) : null}
              {active && vehicles.length ? (
                <Panel style={{ marginTop: 24 }}>
                  <Intro style={{ fontSize: 13.5 }}>
                    Already know the vehicle? Mention it in your message with your preferred dates so the team can
                    check availability.
                  </Intro>
                </Panel>
              ) : null}
            </div>
            <Panel $pad="clamp(22px, 3vw, 34px)">
              <EnquiryForm
                type={copy.type}
                source={`module-${module.key.toLowerCase()}`}
                showVehicle={module.key === 'BUY_A_CAR' || module.key === 'SELL_YOUR_CAR'}
                messageLabel={copy.messageLabel}
                submitLabel={copy.submitLabel}
                successTitle={copy.successTitle}
                successBody={copy.successBody}
              />
            </Panel>
          </Split>
        </Container>
      </Section>

      <CtaBand
        heading="Need work done on your car?"
        subheading="Servicing, diagnostics, repair and detailing are available now."
        ctaLabel="Book a service"
        ctaHref="/book"
        secondaryLabel="Explore services"
        secondaryHref="/services"
      />
    </>
  );
}
