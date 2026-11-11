'use client';

import styled from 'styled-components';
import { media } from '@/styles/theme';
import { glassPanel } from '@/styles/glass';

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.container};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;

export const Narrow = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.layout.narrow};
  margin-inline: auto;
  padding-inline: ${({ theme }) => theme.layout.gutter};
`;

export const Section = styled.section`
  position: relative;
  padding-block: ${({ $compact }) => ($compact ? 'clamp(38px, 4.4vw, 60px)' : 'clamp(52px, 6vw, 88px)')};
  background: ${({ $tone, theme }) => {
    if ($tone === 'coal') return theme.colors.coal;
    if ($tone === 'charcoal') return theme.colors.charcoal;
    if ($tone === 'wash') return 'linear-gradient(180deg, #0b0b0e 0%, #100c08 55%, #08080a 100%)';
    return theme.colors.ink;
  }};
  overflow: ${({ $clip }) => ($clip === false ? 'visible' : 'hidden')};
`;

export const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.line};
  margin: 0;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ $gap }) => $gap || '16px'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ $gap }) => $gap || 'clamp(16px, 2vw, 26px)'};
  grid-template-columns: repeat(${({ $cols }) => $cols || 1}, minmax(0, 1fr));

  ${media.md} {
    grid-template-columns: repeat(${({ $md }) => $md ?? 2}, minmax(0, 1fr));
  }

  ${media.lg} {
    grid-template-columns: repeat(${({ $lg }) => $lg ?? 3}, minmax(0, 1fr));
  }
`;

export const Split = styled.div`
  display: grid;
  gap: clamp(28px, 5vw, 72px);
  align-items: center;

  ${media.lg} {
    grid-template-columns: ${({ $ratio }) => $ratio || '1fr 1fr'};
  }
`;

export const Panel = styled.div`
  ${glassPanel}
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ $pad }) => $pad || 'clamp(22px, 3vw, 34px)'};
`;

export const PageLoader = styled.div`
  min-height: 60vh;
  display: grid;
  place-items: center;
  color: ${({ theme }) => theme.colors.muted};
  letter-spacing: 0.2em;
  font-size: 12px;
  text-transform: uppercase;
`;
