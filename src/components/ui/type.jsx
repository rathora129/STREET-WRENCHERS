'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';

export const Eyebrow = styled.p`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 18px;
  color: ${({ theme }) => theme.colors.brand};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.26em;
  text-transform: uppercase;

  &::before {
    content: '';
    display: block;
    width: 26px;
    height: 1px;
    background: currentColor;
    opacity: 0.7;
  }
`;

export const Display = styled.h1`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ $size }) => ($size === 'xl' ? 'clamp(3rem, 8vw, 6.6rem)' : $size === 'sm' ? 'clamp(2rem, 4vw, 3rem)' : 'clamp(2.4rem, 5.6vw, 4.4rem)')};
  font-weight: 600;
  line-height: ${({ $size }) => ($size === 'xl' ? '0.96' : '1.04')};
  letter-spacing: -0.035em;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.smoke : theme.colors.white)};
  max-width: ${({ $width }) => $width || '17ch'};
`;

export const Heading = styled.h2`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: ${({ $size }) => ($size === 'lg' ? 'clamp(2.2rem, 5vw, 3.8rem)' : 'clamp(1.8rem, 3.4vw, 2.9rem)')};
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.03em;
  max-width: ${({ $width }) => $width || '20ch'};
`;

export const Intro = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.7;
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
  gap: 22px;
  margin-bottom: clamp(30px, 4vw, 52px);

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
        {intro ? <Intro style={{ marginTop: '18px' }}>{intro}</Intro> : null}
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
