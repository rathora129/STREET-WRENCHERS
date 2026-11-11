'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';

export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 14px;
  color: ${({ theme }) => theme.colors.brand};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  line-height: 1.2;
  text-transform: uppercase;

  &::before {
    content: '';
    display: block;
    width: 24px;
    height: 1px;
    background: currentColor;
    opacity: 0.7;
  }
`;

export const Display = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ $size }) =>
    $size === 'xl'
      ? 'clamp(2.55rem, 1.9rem + 3.1vw, 4.6rem)'
      : $size === 'sm'
        ? 'clamp(1.9rem, 1.5rem + 1.5vw, 2.75rem)'
        : 'clamp(2.1rem, 1.6rem + 2.2vw, 3.4rem)'};
  font-weight: 600;
  line-height: ${({ $size }) => ($size === 'xl' ? '0.98' : '1.06')};
  letter-spacing: -0.032em;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.smoke : theme.colors.white)};
  max-width: ${({ $width }) => $width || '17ch'};
`;

export const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ $size }) =>
    $size === 'lg' ? 'clamp(1.85rem, 1.45rem + 1.6vw, 2.75rem)' : 'clamp(1.6rem, 1.35rem + 1.2vw, 2.3rem)'};
  font-weight: 600;
  line-height: 1.08;
  letter-spacing: -0.028em;
  max-width: ${({ $width }) => $width || '20ch'};
`;

export const Intro = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: clamp(14.5px, 0.88rem + 0.18vw, 16px);
  line-height: 1.65;
  max-width: 62ch;
`;

export const Prose = styled.div`
  color: ${({ theme }) => theme.colors.smoke};
  font-size: 16px;
  line-height: 1.8;

  p + p {
    margin-top: 1.1em;
  }

  h2, h3 {
    margin: 1.8em 0 0.7em;
    font-family: ${({ theme }) => theme.fonts.display};
    letter-spacing: -0.02em;
  }

  h2 { font-size: 1.7rem; }
  h3 { font-size: 1.3rem; }

  ul {
    margin: 1em 0;
    padding-left: 1.2em;
    list-style: disc;
  }

  li + li { margin-top: 0.35em; }

  strong { color: ${({ theme }) => theme.colors.white}; }
`;

export const SectionHeadRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2vw, 26px);
  margin-bottom: clamp(24px, 2.8vw, 38px);

  ${media.md} {
    flex-direction: ${({ $stacked }) => ($stacked ? 'column' : 'row')};
    align-items: ${({ $stacked }) => ($stacked ? 'flex-start' : 'flex-end')};
    justify-content: space-between;
  }
`;

export const TextBlock = styled.div`
  max-width: ${({ $width }) => $width || '640px'};
`;

export function SectionHead({ eyebrow, title, intro, action, stacked = false, titleWidth = '20ch', id }) {
  return (
    <SectionHeadRow $stacked={stacked}>
      <TextBlock>
        {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
        {title ? <Heading id={id} $width={titleWidth}>{title}</Heading> : null}
        {intro ? <Intro style={{ marginTop: '14px' }}>{intro}</Intro> : null}
      </TextBlock>
      {action ? <div>{action}</div> : null}
    </SectionHeadRow>
  );
}

export const Small = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13px;
  line-height: 1.6;
`;
