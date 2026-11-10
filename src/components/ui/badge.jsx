'use client';

import styled from 'styled-components';

const tones = {
  neutral: `
    background: rgba(255,255,255,0.06);
    border-color: rgba(255,255,255,0.12);
    color: #cbc8c2;
  `,
  brand: `
    background: rgba(242,106,13,0.12);
    border-color: rgba(242,106,13,0.35);
    color: #ff8a3d;
  `,
  success: `
    background: rgba(52,185,129,0.12);
    border-color: rgba(52,185,129,0.35);
    color: #5fd3a5;
  `,
  warning: `
    background: rgba(240,180,41,0.12);
    border-color: rgba(240,180,41,0.35);
    color: #f4c85a;
  `,
  danger: `
    background: rgba(229,72,77,0.12);
    border-color: rgba(229,72,77,0.35);
    color: #ff7b7f;
  `,
};

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  line-height: 1.2;
  white-space: nowrap;
  ${({ $tone }) => tones[$tone] || tones.neutral}
`;
