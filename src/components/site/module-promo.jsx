'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';
import { SmartImage } from '@/components/ui/smart-image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eyebrow, Heading, Intro } from '@/components/ui/type';
import { EnquiryForm } from '@/components/forms/enquiry-form';

const Wrap = styled.div`
  display: grid;
  gap: clamp(24px, 4vw, 48px);
  align-items: center;

  ${media.lg} {
    grid-template-columns: ${({ $flip }) => ($flip ? '1.05fr 1fr' : '1fr 1.05fr')};
  }
`;

const MediaCol = styled.div`
  position: relative;
  order: ${({ $flip }) => ($flip ? 2 : 1)};

  ${media.lg} {
    order: ${({ $flip }) => ($flip ? 2 : 1)};
  }
`;

const MediaBadge = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  order: ${({ $flip }) => ($flip ? 1 : 2)};

  ${media.lg} {
    order: ${({ $flip }) => ($flip ? 1 : 2)};
  }
`;

const Launch = styled.p`
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.brand};
`;

const FormWrap = styled.div`
  margin-top: 8px;
  padding-top: 22px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`;

const LEAD_TYPES = {
  CAR_RENTAL: 'RENTAL',
  CAR_SALES: 'CAR_SALES',
  BUY_A_CAR: 'BUY_CAR',
  SELL_YOUR_CAR: 'SELL_CAR',
};

export function ModulePromo({ module, compact = true, flip = false, showForm = false }) {
  if (!module || !['ACTIVE', 'COMING_SOON'].includes(module.status)) return null;

  const active = module.status === 'ACTIVE';
  const leadType = module.leadType || LEAD_TYPES[module.key] || 'CONTACT';
  const heading = module.headline || module.label;
  const description = module.description;

  return (
    <Wrap $flip={flip}>
      <MediaCol $flip={flip}>
        <MediaBadge>
          <Badge $tone={active ? 'success' : 'brand'}>{active ? 'Now available' : 'Coming soon'}</Badge>
        </MediaBadge>
        <SmartImage
          src={module.image}
          alt={module.label}
          ratio="4 / 3"
          sizes="(max-width: 820px) 100vw, 50vw"
        />
      </MediaCol>

      <Content $flip={flip}>
        <Eyebrow style={{ marginBottom: 0 }}>{module.label}</Eyebrow>
        <Heading $size="sm" $width="22ch">{heading}</Heading>
        {description ? <Intro style={{ margin: 0 }}>{description}</Intro> : null}
        {module.launchDate ? <Launch>Target launch — {module.launchDate}</Launch> : null}

        {active ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 6 }}>
            <Button href={module.publicPath}>{module.label === 'Car Rental' ? 'View the fleet' : 'Browse vehicles'}</Button>
            <Button href="/contact" variant="outline">Talk to the team</Button>
          </div>
        ) : showForm ? (
          <FormWrap>
            <FormTitle>Register your interest</FormTitle>
            <p style={{ fontSize: 13, color: '#96938d', margin: '6px 0 18px', lineHeight: 1.65 }}>
              Leave your details and the team will contact you when this module opens. No payment or commitment.
            </p>
            <EnquiryForm
              type={leadType}
              source={`module-${module.key.toLowerCase()}`}
              showVehicle={module.key === 'BUY_A_CAR' || module.key === 'SELL_YOUR_CAR'}
              messageLabel={
                module.key === 'BUY_A_CAR' || module.key === 'SELL_YOUR_CAR'
                  ? 'What are you looking for?'
                  : 'What do you need?'
              }
              submitLabel="Register interest"
              successTitle="You are on the list"
              successBody="The team will contact you when this module opens. In the meantime, you can reach us through the contact page."
            />
          </FormWrap>
        ) : (
          <div style={{ marginTop: 6 }}>
            <Button href={`${module.publicPath}#enquire`} variant="outline">
              Register interest
            </Button>
          </div>
        )}
      </Content>
    </Wrap>
  );
}

const FormTitle = styled.h4`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 17px;
  letter-spacing: -0.01em;
`;
