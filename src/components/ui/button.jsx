'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { media } from '@/styles/theme';

const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: ${({ $size }) => ($size === 'lg' ? '58px' : $size === 'sm' ? '42px' : '52px')};
  padding-inline: ${({ $size }) => ($size === 'lg' ? '30px' : $size === 'sm' ? '18px' : '24px')};
  border-radius: ${({ theme }) => theme.radii.xs};
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ $size }) => ($size === 'sm' ? '11px' : '12px')};
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast}, transform ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  svg {
    transition: transform ${({ theme }) => theme.transitions.fast};
    flex: none;
  }

  ${media.hover} {
    &:hover svg {
      transform: translate(3px, -3px);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand};
    color: #ffffff;
    border-color: ${({ theme }) => theme.colors.brand};

    ${media.hover} {
      &:hover {
        background: ${({ theme }) => theme.colors.brandBright};
        border-color: ${({ theme }) => theme.colors.brandBright};
      }
    }
  `,
  outline: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.white};
    border-color: ${({ theme }) => theme.colors.lineStrong};

    ${media.hover} {
      &:hover {
        border-color: ${({ theme }) => theme.colors.white};
        background: rgba(255, 255, 255, 0.04);
      }
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.smoke};
    border-color: transparent;
    padding-inline: 0;
    height: auto;

    ${media.hover} {
      &:hover {
        color: ${({ theme }) => theme.colors.white};
      }
    }
  `,
  light: css`
    background: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.ink};
    border-color: ${({ theme }) => theme.colors.white};

    ${media.hover} {
      &:hover {
        background: ${({ theme }) => theme.colors.smoke};
        border-color: ${({ theme }) => theme.colors.smoke};
      }
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
    border-color: ${({ theme }) => theme.colors.danger};
  `,
};

export const buttonStyles = css`
  ${base}
  ${({ $variant }) => variants[$variant || 'primary']}
`;

const StyledButton = styled.button`
  ${buttonStyles}
`;

const StyledLink = styled(Link)`
  ${buttonStyles}
`;

export function Button({
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  external = false,
  children,
  ...rest
}) {
  const content = (
    <>
      <span>{children}</span>
      {icon ? <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /> : null}
    </>
  );

  if (href && external) {
    return (
      <StyledButton as="a" href={href} target="_blank" rel="noopener noreferrer" $variant={variant} $size={size} {...rest}>
        {content}
      </StyledButton>
    );
  }

  if (href) {
    return (
      <StyledLink href={href} $variant={variant} $size={size} {...rest}>
        {content}
      </StyledLink>
    );
  }

  return (
    <StyledButton $variant={variant} $size={size} {...rest}>
      {content}
    </StyledButton>
  );
}
