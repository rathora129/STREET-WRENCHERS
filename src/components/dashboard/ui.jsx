'use client';

import { useEffect } from 'react';
import styled, { css } from 'styled-components';
import { X } from 'lucide-react';
import { media } from '@/styles/theme';

export const PageHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 24px;
`;

export const HeadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  max-width: 720px;

  .eyebrow {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.brand};
  }

  h1 {
    font-size: clamp(1.55rem, 2.5vw, 2.15rem);
    letter-spacing: -0.035em;
  }

  p {
    font-size: 13px;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export const HeadActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: ${({ $small }) => ($small ? '32px' : '40px')};
  padding-inline: ${({ $small }) => ($small ? '11px' : '16px')};
  border-radius: 7px;
  border: 1px solid transparent;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease;
  cursor: pointer;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const DashButton = styled.button`
  ${buttonBase}
  background: ${({ $variant, theme }) =>
    $variant === 'primary'
      ? theme.colors.brand
      : $variant === 'danger'
        ? 'rgba(229,72,77,0.12)'
        : $variant === 'ghost'
          ? 'transparent'
          : theme.colors.surface};
  color: ${({ $variant, theme }) =>
    $variant === 'primary'
      ? '#ffffff'
      : $variant === 'danger'
        ? '#ff9a9d'
        : $variant === 'ghost'
          ? theme.colors.muted
          : theme.colors.white};
  border-color: ${({ $variant, theme }) =>
    $variant === 'danger'
      ? 'rgba(229,72,77,0.32)'
      : $variant === 'ghost'
        ? 'transparent'
        : $variant === 'primary'
          ? theme.colors.brand
          : theme.colors.lineStrong};

  &:hover:not(:disabled) {
    background: ${({ $variant, theme }) =>
      $variant === 'primary'
        ? theme.colors.brandBright
        : $variant === 'danger'
          ? 'rgba(229,72,77,0.2)'
          : $variant === 'ghost'
            ? theme.colors.surface
            : theme.colors.surfaceRaised};
    color: ${({ $variant, theme }) => ($variant === 'ghost' ? theme.colors.white : undefined)};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 2px;
  }
`;

export const Panel = styled.section`
  background: ${({ theme }) => theme.colors.charcoal};
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

export const PanelHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px 18px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 15px;
    font-weight: 600;
  }

  a, button { font-size: 11.5px; color: ${({ theme }) => theme.colors.brand}; }
`;

export const PanelBody = styled.div`
  padding: ${({ $flush }) => ($flush ? '0' : '18px')};
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  ${media.md} {
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
  }
`;

export const StatCard = styled.div`
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 7px;
  transition: border-color 180ms ease, background 180ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.lineStrong};
    background: ${({ theme }) => theme.colors.surfaceRaised};
  }

  .top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    color: ${({ theme }) => theme.colors.dim};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .value {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    letter-spacing: -0.04em;
    color: ${({ theme }) => theme.colors.white};
  }

  .hint {
    font-size: 11.5px;
    color: ${({ theme }) => theme.colors.dim};
  }

  svg { color: ${({ theme }) => theme.colors.brand}; }
`;

export const TwoCol = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  ${media.lg} {
    grid-template-columns: ${({ $wide }) => ($wide === 'right' ? 'minmax(0, 1fr) minmax(0, 1.4fr)' : 'minmax(0, 1.4fr) minmax(0, 1fr)')};
  }
`;

export const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.coal};
`;

export const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 190px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.dim};
    pointer-events: none;
  }

  input {
    width: 100%;
    height: 38px;
    padding: 0 12px 0 36px;
    border-radius: 7px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: ${({ theme }) => theme.colors.ink};
    color: ${({ theme }) => theme.colors.white};
    font-size: 12.5px;

    &::placeholder { color: ${({ theme }) => theme.colors.dim}; }
    &:focus { outline: none; border-color: ${({ theme }) => theme.colors.brand}; }
    &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 1px; }
  }
`;

export const FilterSelect = styled.select`
  height: 38px;
  min-width: 130px;
  padding: 0 30px 0 12px;
  border-radius: 7px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.smoke};
  font-size: 12px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='10' height='7' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2396938d' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;

  option { background: #101014; }
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.brand}; }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.colors.brand}; outline-offset: 1px; }
`;

export const TableWrap = styled.div`
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: ${({ $min }) => $min || '760px'};
    font-size: 12.5px;
  }

  thead th {
    text-align: left;
    padding: 10px 14px;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.dim};
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    white-space: nowrap;
    background: ${({ theme }) => theme.colors.charcoal};
  }

  tbody td {
    padding: 12px 14px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
    color: ${({ theme }) => theme.colors.smoke};
    vertical-align: middle;
    line-height: 1.45;
  }

  tbody tr:last-child td { border-bottom: 0; }
  tbody tr:hover td { background: rgba(255, 255, 255, 0.018); }

  .primary {
    display: block;
    color: ${({ theme }) => theme.colors.white};
    font-weight: 500;
  }

  .sub {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    color: ${({ theme }) => theme.colors.dim};
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 6px;
    justify-content: flex-end;
  }

  .numeric { font-variant-numeric: tabular-nums; }
`;

export const RowLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 30px;
  padding-inline: 9px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    border-color: rgba(255, 255, 255, 0.2);
  }
`;

export const RowButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 30px;
  padding-inline: 9px;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: transparent;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 11px;

  &:hover {
    color: ${({ $danger, theme }) => ($danger ? '#ff9a9d' : theme.colors.white)};
    border-color: ${({ $danger }) => ($danger ? 'rgba(229,72,77,0.4)' : 'rgba(255,255,255,0.2)')};
  }
`;

export const ToneBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'success'
        ? 'rgba(52,185,129,0.32)'
        : $tone === 'warning'
          ? 'rgba(240,180,41,0.32)'
          : $tone === 'danger'
            ? 'rgba(229,72,77,0.32)'
            : $tone === 'info'
              ? 'rgba(90,162,234,0.32)'
              : 'rgba(255,255,255,0.14)'};
  background: ${({ $tone }) =>
    $tone === 'success'
      ? 'rgba(52,185,129,0.09)'
      : $tone === 'warning'
        ? 'rgba(240,180,41,0.09)'
        : $tone === 'danger'
          ? 'rgba(229,72,77,0.09)'
          : $tone === 'info'
            ? 'rgba(90,162,234,0.09)'
            : 'rgba(255,255,255,0.04)'};
  color: ${({ $tone }) =>
    $tone === 'success'
      ? '#77d9b2'
      : $tone === 'warning'
        ? '#f4cc6c'
        : $tone === 'danger'
          ? '#ff9a9d'
          : $tone === 'info'
            ? '#9cc6f2'
            : '#b9b5ae'};
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  font-size: 11.5px;
  color: ${({ theme }) => theme.colors.dim};

  .controls { display: flex; align-items: center; gap: 8px; }
`;

export const StateBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 48px 24px;
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};

  h3 { font-size: 16px; color: ${({ theme }) => theme.colors.white}; }
  p { font-size: 12.5px; max-width: 42ch; line-height: 1.7; color: ${({ theme }) => theme.colors.smoke}; }
  svg { color: ${({ theme }) => theme.colors.dim}; }
`;

export const Notice = styled.div`
  padding: 11px 14px;
  border-radius: 7px;
  border: 1px solid
    ${({ $tone }) =>
      $tone === 'success' ? 'rgba(52,185,129,0.34)' : $tone === 'error' ? 'rgba(229,72,77,0.34)' : 'rgba(242,106,13,0.34)'};
  background: ${({ $tone }) =>
    $tone === 'success' ? 'rgba(52,185,129,0.08)' : $tone === 'error' ? 'rgba(229,72,77,0.08)' : 'rgba(242,106,13,0.08)'};
  color: ${({ $tone }) => ($tone === 'success' ? '#8fe3c0' : $tone === 'error' ? '#ffabae' : '#ffbd90')};
  font-size: 12px;
  line-height: 1.55;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(4px);

  ${media.md} {
    padding: 48px 24px;
    align-items: flex-start;
  }
`;

export const ModalCard = styled.div`
  width: 100%;
  max-width: ${({ $wide }) => ($wide ? '980px' : '760px')};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: 0 32px 90px rgba(0, 0, 0, 0.65);
  overflow: hidden;
`;

export const ModalHead = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.charcoal};

  h2 {
    font-family: ${({ theme }) => theme.fonts.display};
    font-size: 17px;
    letter-spacing: -0.02em;
  }

  p { margin-top: 3px; font-size: 11.5px; color: ${({ theme }) => theme.colors.dim}; }

  button {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.line};
    background: transparent;
    color: ${({ theme }) => theme.colors.muted};

    &:hover { color: ${({ theme }) => theme.colors.white}; }
  }
`;

export const ModalBody = styled.div`
  padding: 20px;
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;

  ${media.md} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .span-2 {
    ${media.md} { grid-column: 1 / -1; }
  }
`;

export const FieldBlock = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;

  span.label {
    font-size: 11px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.smoke};
  }

  span.label em {
    font-style: normal;
    color: ${({ theme }) => theme.colors.brand};
    margin-left: 3px;
  }

  span.help {
    font-size: 10.5px;
    color: ${({ theme }) => theme.colors.dim};
    line-height: 1.5;
  }

  span.error {
    font-size: 11px;
    color: #ff9a9d;
  }
`;

const control = `
  width: 100%;
  min-height: 40px;
  padding: 9px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.12);
  background: #0c0c0f;
  color: #f6f5f2;
  font-size: 12.5px;
  line-height: 1.5;

  &::placeholder { color: #8a867f; }
  &:focus { outline: none; border-color: #f26a0d; }
  &:focus-visible { outline: 2px solid #f26a0d; outline-offset: 1px; }
  &:disabled { opacity: 0.6; }
`;

export const Control = styled.input`
  ${control}
`;

export const TextControl = styled.textarea`
  ${control}
  min-height: ${({ rows }) => (rows ? `${Math.min(rows, 14) * 22 + 20}px` : '100px')};
  resize: vertical;
`;

export const SelectControl = styled.select`
  ${control}
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='10' height='7' viewBox='0 0 12 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%2396938d' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 32px;
  cursor: pointer;

  option { background: #101014; }
`;

export const CheckControl = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 9px 0;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.smoke};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    margin-top: 1px;
    accent-color: ${({ theme }) => theme.colors.brand};
    flex: none;
  }
`;

export const ModalFooter = styled.footer`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.coal};
`;

export function Modal({ open, onClose, title, description, wide, children, footer }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ModalBackdrop role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose?.();
    }}>
      <ModalCard $wide={wide}>
        <ModalHead>
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button type="button" onClick={onClose} aria-label="Close dialog">
            <X size={16} />
          </button>
        </ModalHead>
        <ModalBody>{children}</ModalBody>
        {footer ? <ModalFooter>{footer}</ModalFooter> : null}
      </ModalCard>
    </ModalBackdrop>
  );
}

export function formatDateCell(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatDateTimeCell(value) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(value));
}

export const Spinner = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.16);
  border-top-color: #f26a0d;
  animation: sw-spin 700ms linear infinite;

  @keyframes sw-spin {
    to { transform: rotate(360deg); }
  }
`;
