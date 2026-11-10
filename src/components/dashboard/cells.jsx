'use client';

import { ToneBadge } from './ui';

const TONES = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
  CANCELLED: 'danger',
  NEW: 'warning',
  CONTACTED: 'info',
  QUALIFIED: 'success',
  FOLLOW_UP: 'warning',
  CONVERTED: 'success',
  LOST: 'danger',
  ACTIVE: 'success',
  PAUSED: 'warning',
  DRAFT: 'neutral',
  PUBLISHED: 'success',
  HIDDEN: 'neutral',
  COMING_SOON: 'warning',
  AVAILABLE: 'success',
  RENTED: 'info',
  MAINTENANCE: 'warning',
  USED: 'neutral',
  SOLD: 'danger',
};

export function labelize(value) {
  return String(value || '—')
    .replaceAll('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function StatusBadge({ status }) {
  return <ToneBadge $tone={TONES[status] || 'neutral'}>{labelize(status)}</ToneBadge>;
}

export function YesNo({ value, yes = 'Yes', no = 'No' }) {
  return <ToneBadge $tone={value ? 'success' : 'neutral'}>{value ? yes : no}</ToneBadge>;
}

export function MainCell({ primary, sub }) {
  return (
    <>
      <span className="primary">{primary}</span>
      {sub ? <span className="sub">{sub}</span> : null}
    </>
  );
}
