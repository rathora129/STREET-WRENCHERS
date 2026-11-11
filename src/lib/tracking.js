import crypto from 'node:crypto';
import { SITE_URL } from './site';

export {
  BOOKING_STAGES,
  STAGE_KEYS,
  STAGE_TEMPLATE_FIELDS,
  stageMeta,
  stageIndex,
  isFinalStage,
  bookingStatusForStage,
  fillTrackingTemplate,
  buildTrackingMessage,
} from './booking-stages';

export function createTrackingToken() {
  return crypto.randomBytes(32).toString('base64url');
}

export function isValidTrackingToken(token) {
  return typeof token === 'string' && /^[A-Za-z0-9_-]{43}$/.test(token);
}

export function trackingUrlFor(token) {
  return `${SITE_URL}/track/${token}`;
}
