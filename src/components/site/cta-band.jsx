'use client';

import styled from 'styled-components';
import { glassFeature } from '@/styles/glass';
import { Container } from '@/components/ui/layout';
import { Heading, Intro } from '@/components/ui/type';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/ui/reveal';

const Band = styled.section`
  position: relative;
  padding-block: clamp(40px, 6vw, 72px);
  overflow: hidden;
`;

const Panel = styled(Container)`
  position: relative;
  display: grid;
  gap: 26px;
  padding: clamp(28px, 4vw, 52px);
  ${glassFeature}
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  @media (min-width: 820px) {
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
  }
`;

const Text = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export function CtaBand({ heading, subheading, ctaLabel, ctaHref, secondaryLabel, secondaryHref }) {
  if (!heading) return null;

  return (
    <Band>
      <Reveal>
        <Panel>
          <Text>
            <Heading $size="sm" $width="24ch">{heading}</Heading>
            {subheading ? <Intro style={{ margin: 0 }}>{subheading}</Intro> : null}
          </Text>
          <Actions>
            {ctaHref ? <Button href={ctaHref} size="lg">{ctaLabel || 'Book a service'}</Button> : null}
            {secondaryHref ? (
              <Button href={secondaryHref} variant="outline" size="lg">
                {secondaryLabel}
              </Button>
            ) : null}
          </Actions>
        </Panel>
      </Reveal>
    </Band>
  );
}
