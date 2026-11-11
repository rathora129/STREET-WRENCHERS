'use client';

import styled from 'styled-components';
import { Search } from 'lucide-react';
import { glassCard } from '@/styles/glass';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: clamp(28px, 4vw, 44px);
  ${glassCard}
  border-style: dashed;
  border-color: rgba(255, 255, 255, 0.22);
  border-radius: ${({ theme }) => theme.radii.md};
`;

const IconWrap = styled.div`
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandWash};
  color: ${({ theme }) => theme.colors.brand};
`;

const Title = styled.p`
  font-family: ${({ theme }) => theme.fonts.display};
  font-size: 18px;
  color: ${({ theme }) => theme.colors.white};
`;

const Text = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 14px;
  max-width: 52ch;
  line-height: 1.7;
`;

export function EmptyState({ title = 'Nothing published yet', text, action, icon: Icon = Search }) {
  return (
    <Wrap>
      <IconWrap>
        <Icon size={18} strokeWidth={1.7} aria-hidden="true" />
      </IconWrap>
      <Title>{title}</Title>
      {text ? <Text>{text}</Text> : null}
      {action ? <div style={{ marginTop: 8 }}>{action}</div> : null}
    </Wrap>
  );
}
