'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Strip = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Pill = styled(Link)`
  padding: 9px 14px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.muted};
  transition: border-color 160ms ease, color 160ms ease, background 160ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.white};
    background: rgba(242, 106, 13, 0.08);
  }
`;

export function CategoryStrip({ categories = [] }) {
  if (!categories.length) return null;
  return (
    <Strip aria-label="Service categories">
      {categories.map((category) => (
        <Pill key={category.id} href={`#${category.slug}`}>
          {category.name}
        </Pill>
      ))}
    </Strip>
  );
}
