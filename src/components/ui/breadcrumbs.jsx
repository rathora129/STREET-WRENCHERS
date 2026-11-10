'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { ChevronRight } from 'lucide-react';

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.dim};

  a {
    color: ${({ theme }) => theme.colors.muted};
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.white};
    }
  }

  svg {
    opacity: 0.5;
  }
`;

export function Breadcrumbs({ items = [] }) {
  return (
    <Nav aria-label="Breadcrumb">
      {items.map((item, index) => {
        const last = index === items.length - 1;
        return (
          <span key={`${item.href}-${item.label}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {last || !item.href ? (
              <span style={{ color: '#cbc8c2' }} aria-current="page">{item.label}</span>
            ) : (
              <Link href={item.href}>{item.label}</Link>
            )}
            {!last ? <ChevronRight size={12} aria-hidden="true" /> : null}
          </span>
        );
      })}
    </Nav>
  );
}
