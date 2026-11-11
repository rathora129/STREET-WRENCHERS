'use client';

import styled, { css } from 'styled-components';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { media } from '@/styles/theme';

const base = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $size }) => ($size === 'lg' ? '54px' : $size === 'sm' ? '40px' : '48px')};
  padding-inline: ${({ $size }) => ($size === 'lg' ? '26px' : $size === 'sm' ? '16px' : '22px')};
  border-radius: ${({ theme }) => theme.radii.xs};
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: ${({ $size }) => ($size === 'sm' ? '11px' : '12px')};
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background ${({ theme }) => theme.transitions.fast}, color ${({ theme }) => theme.transitions.fast},
    border-color ${({ theme }) => theme.transitions.fast}, transform ${({ theme }) => theme.transitions.fast};
  cursor: pointer;

  svg {
    flex: none;
    transition: transform ${({ theme }) => theme.transitions.fast};
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .btn-arrow {
    margin-left: 1px;
  }

  ${media.hover} {
    &:hover .btn-arrow {
      transform: translate(2px, -2px);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brandBright};
    outline-offset: 3px;
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
    box-shadow: 0 10px 26px rgba(242, 106, 13, 0.18);

    ${media.hover} {
      &:hover {
        background: ${({ theme }) => theme.colors.brandBright};
        border-color: ${({ theme }) => theme.colors.brandBright};
        box-shadow: 0 14px 34px rgba(242, 106, 13, 0.28);
      }
    }
  `,
  outline: css`
    background: rgba(20, 20, 24, 0.46);
    color: ${({ theme }) => theme.colors.white};
    border-color: rgba(255, 255, 255, 0.18);
    -webkit-backdrop-filter: blur(10px) saturate(130%);
    backdrop-filter: blur(10px) saturate(130%);

    @supports not ((backdrop-filter: blur(2px)) or (-webkit-backdrop-filter: blur(2px))) {
      background: rgba(18, 18, 22, 0.92);
    }

    ${media.hover} {
      &:hover {
        border-color: rgba(242, 106, 13, 0.5);
        background: rgba(242, 106, 13, 0.09);
        box-shadow: 0 0 30px rgba(242, 106, 13, 0.08);
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
  leftIcon,
  external = false,
  children,
  ...rest
}) {
  const content = (
    <>
      {leftIcon ? <span className="btn-icon">{leftIcon}</span> : null}
      <span>{children}</span>
      {icon ? <ArrowUpRight className="btn-arrow" size={15} strokeWidth={2} aria-hidden="true" /> : null}
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
