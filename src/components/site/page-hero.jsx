'use client';

import { useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { media } from '@/styles/theme';
import { Container } from '@/components/ui/layout';
import { Eyebrow, Display, Intro } from '@/components/ui/type';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';

const Wrap = styled.section`
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: ${({ $compact }) => ($compact ? '380px' : 'clamp(440px, 62vh, 620px)')};
  padding-top: clamp(28px, 4vw, 48px);
  padding-bottom: clamp(36px, 6vw, 72px);
  overflow: hidden;
  isolation: isolate;
  background: #0a0a0c;
`;

const Media = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(8, 8, 10, 0.94) 0%, rgba(8, 8, 10, 0.62) 52%, rgba(8, 8, 10, 0.2) 100%),
      linear-gradient(180deg, rgba(8, 8, 10, 0.65) 0%, rgba(8, 8, 10, 0.25) 40%, rgba(8, 8, 10, 0.98) 100%);
  }

  img { object-fit: cover; }
`;

const Fallback = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 78% 18%, rgba(242, 106, 13, 0.22), transparent 55%),
    linear-gradient(140deg, #131316 0%, #08080a 70%);
`;

const Inner = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Title = styled(Display)`
  max-width: 20ch;
  text-wrap: balance;

  ${media.lg} {
    max-width: 22ch;
  }
`;

const Sub = styled(Intro)`
  max-width: 58ch;
  color: ${({ theme }) => theme.colors.smoke};
`;

export function PageHero({ eyebrow, heading, subheading, image, imageAlt = '', breadcrumbs }) {
  const [failed, setFailed] = useState(false);

  return (
    <Wrap>
      <Media aria-hidden="true">
        {image && !failed ? (
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            onError={() => setFailed(true)}
          />
        ) : (
          <Fallback />
        )}
      </Media>
      <Inner>
        {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
        {eyebrow ? <Eyebrow style={{ marginBottom: 0 }}>{eyebrow}</Eyebrow> : null}
        <Title $size="sm" $width="20ch">{heading}</Title>
        {subheading ? <Sub>{subheading}</Sub> : null}
      </Inner>
    </Wrap>
  );
}
