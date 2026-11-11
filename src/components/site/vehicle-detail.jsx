'use client';

import styled from 'styled-components';
import { Check, Gauge, Fuel, Cog, Users, Calendar, Palette, Car } from 'lucide-react';
import { media } from '@/styles/theme';
import { glassCard } from '@/styles/glass';
import { Section, Container, Grid, Panel } from '@/components/ui/layout';
import { Eyebrow, Heading, Intro, Prose } from '@/components/ui/type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/site/page-hero';
import { GalleryGrid } from '@/components/site/gallery-grid';
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
    color: ${({ theme }) => theme.colors.muted};
    margin-top: 6px;
    line-height: 1.6;
  }
`;

const Specs = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  ${glassCard}
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;

  div {
    background: rgba(14, 14, 18, 0.34);
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  dt {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
  }

  dd {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.smoke};
  }
`;

const Features = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  li {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 12px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    border-radius: ${({ theme }) => theme.radii.pill};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.muted};
  }

  svg { color: ${({ theme }) => theme.colors.brand}; }
`;

const SubHead = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: clamp(19px, 2.2vw, 24px);
  letter-spacing: -0.02em;
  margin-bottom: 14px;
`;

export function VehicleDetail({ vehicle, kind = 'rental' }) {
  const isRental = kind === 'rental';
  const title = isRental ? vehicle.name : vehicle.title;
  const gallery = [vehicle.image, ...(vehicle.gallery || [])].filter(Boolean);
  const defaultMessage = `I am interested in the ${title} (${vehicle.year}). Please share availability and next steps.`;

  const specs = isRental
    ? [
        { label: 'Year', value: vehicle.year, icon: Calendar },
        { label: 'Category', value: vehicle.category, icon: Car },
        { label: 'Transmission', value: vehicle.transmission, icon: Cog },
        { label: 'Fuel', value: vehicle.fuelType, icon: Fuel },
        { label: 'Seats', value: vehicle.seats, icon: Users },
        { label: 'Availability', value: vehicle.availability === 'AVAILABLE' ? 'Available' : 'On request', icon: Check },
      ]
    : [
        { label: 'Year', value: vehicle.year, icon: Calendar },
        { label: 'Mileage', value: vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : null, icon: Gauge },
        { label: 'Condition', value: vehicle.condition === 'NEW' ? 'New' : 'Pre-owned', icon: Check },
        { label: 'Transmission', value: vehicle.transmission, icon: Cog },
        { label: 'Fuel', value: vehicle.fuelType, icon: Fuel },
        { label: 'Body type', value: vehicle.bodyType, icon: Car },
        { label: 'Colour', value: vehicle.color, icon: Palette },
      ];

  return (
    <>
      <PageHero
        eyebrow={isRental ? 'Car rental' : 'Car sales'}
        heading={title}
        subheading={
          isRental
            ? `${vehicle.brand} ${vehicle.model} · ${vehicle.year} · ${vehicle.transmission} · ${vehicle.fuelType}`
            : `${vehicle.brandName || vehicle.brand?.name || ''} ${vehicle.model} · ${vehicle.year}${vehicle.mileage ? ` · ${vehicle.mileage.toLocaleString()} km` : ''}`
        }
        image={vehicle.image || '/assets/images/hero/workshop.jpg'}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: isRental ? 'Car Rental' : 'Car Sales', href: isRental ? '/rental' : '/car-sales' },
          { label: title, href: isRental ? `/rental/${vehicle.slug}` : `/car-sales/${vehicle.slug}` },
        ]}
      />

      <Section $tone="coal">
        <Container>
          <Layout>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
              <div>
                <Eyebrow>Overview</Eyebrow>
                <Prose style={{ whiteSpace: 'pre-line' }}>{vehicle.description}</Prose>
              </div>

              <div>
                <SubHead>Vehicle details</SubHead>
                <Specs>
                  {specs.filter((spec) => spec.value).map((spec) => {
                    const Icon = spec.icon;
                    return (
                      <div key={spec.label}>
                        <dt>
                          <Icon size={12} aria-hidden="true" /> {spec.label}
                        </dt>
                        <dd>{spec.value}</dd>
                      </div>
                    );
                  })}
                </Specs>
              </div>

              {vehicle.features?.length ? (
                <div>
                  <SubHead>Features</SubHead>
                  <Features>
                    {vehicle.features.map((feature) => (
                      <li key={feature}>
                        <Check size={13} aria-hidden="true" /> {feature}
                      </li>
                    ))}
                  </Features>
                </div>
              ) : null}

              {gallery.length > 1 ? (
                <div>
                  <SubHead>Gallery</SubHead>
                  <GalleryGrid
                    items={gallery.map((url, index) => ({ url, alt: `${title} — view ${index + 1}` }))}
                    columns={2}
                    largeColumns={3}
                  />
                </div>
              ) : null}
            </div>

            <Side>
              <Panel $pad="clamp(20px, 2.6vw, 28px)" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Badge $tone={isRental ? 'brand' : 'success'}>{isRental ? 'Rental' : 'For sale'}</Badge>
                <Price>
                  <span>{isRental ? 'Daily rate' : 'Asking price'}</span>
                  <strong>AED {isRental ? vehicle.dailyRate : vehicle.price}</strong>
                  <em>
                    {isRental
                      ? [
                          vehicle.weeklyRate ? `Weekly AED ${vehicle.weeklyRate}` : null,
                          vehicle.monthlyRate ? `Monthly AED ${vehicle.monthlyRate}` : null,
                          vehicle.deposit ? `Deposit AED ${vehicle.deposit}` : null,
                        ]
                          .filter(Boolean)
                          .join(' · ') || 'Weekly and monthly rates confirmed with the team.'
                      : vehicle.negotiable
                        ? 'Asking price. Negotiable — discuss with the team.'
                        : 'Asking price.'}
                  </em>
                </Price>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Button href="#enquire">{isRental ? 'Enquire about this vehicle' : 'Arrange a viewing'}</Button>
                  <Button href={isRental ? '/rental' : '/car-sales'} variant="outline">
                    {isRental ? 'Back to rental' : 'Back to car sales'}
                  </Button>
                </div>
                <Intro style={{ fontSize: 12.5 }}>
                  {isRental
                    ? 'Availability and rental requirements are confirmed by the team. No payment is taken online.'
                    : 'Vehicle condition, viewing and handover are arranged with the team. No payment is taken online.'}
                </Intro>
              </Panel>
            </Side>
          </Layout>
        </Container>
      </Section>

      <Section id="enquire" $tone="charcoal">
        <Container>
          <Grid $cols={1} $md={2} $lg={2}>
            <div>
              <Eyebrow>Enquire</Eyebrow>
              <Heading $width="18ch">{isRental ? 'Check availability.' : 'See the car in person.'}</Heading>
              <Intro style={{ marginTop: 16 }}>
                Send your details and the team will respond with availability, requirements and next steps.
              </Intro>
            </div>
            <Panel $pad="clamp(22px, 3vw, 34px)">
              <EnquiryForm
                type={isRental ? 'RENTAL' : 'CAR_SALES'}
                source={isRental ? 'rental-detail' : 'car-sales-detail'}
                defaultMessage={defaultMessage}
                messageLabel="Your message"
                submitLabel={isRental ? 'Send rental enquiry' : 'Send vehicle enquiry'}
              />
            </Panel>
          </Grid>
        </Container>
      </Section>
    </>
  );
}
