export const AED = 'AED';

export function toNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function formatPrice(value, { from = false, suffix = '' } = {}) {
  const number = toNumber(value);
  if (number === null) return 'Request a quote';
  const formatted = new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: AED,
    maximumFractionDigits: number % 1 === 0 ? 0 : 2,
  }).format(number);
  return `${from ? 'From ' : ''}${formatted}${suffix}`;
}

export function formatDate(value, options = {}) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-AE', {
    timeZone: 'Asia/Dubai',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value));
}

export function formatDateTime(value) {
  return formatDate(value, { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatNumber(value) {
  return new Intl.NumberFormat('en-AE').format(Number(value || 0));
}

export function slugify(value = '') {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function readingMinutes(content = '') {
  const words = String(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function normalizePhone(value = '') {
  return String(value).replace(/[^\d+]/g, '');
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

export function truncate(value = '', length = 160) {
  if (value.length <= length) return value;
  return `${value.slice(0, length).trimEnd()}…`;
}

export function parseTags(value) {
  if (Array.isArray(value)) return value.map((tag) => String(tag).trim()).filter(Boolean);
  if (!value) return [];
  return String(value)
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

export function toDateInputValue(value) {
  if (!value) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dubai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(value));
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  return `${part('year')}-${part('month')}-${part('day')}`;
}
