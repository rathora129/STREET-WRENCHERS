const LEAD_STATUS_FOR_BOOKING = {
  PENDING: 'NEW',
  CONFIRMED: 'CONTACTED',
  IN_PROGRESS: 'QUALIFIED',
  COMPLETED: 'CONVERTED',
  CANCELLED: 'LOST',
};

const LEAD_RANK = {
  LOST: -1,
  NEW: 0,
  CONTACTED: 1,
  QUALIFIED: 2,
  FOLLOW_UP: 2,
  CONVERTED: 3,
};

export function advanceLeadStatus(current, bookingStatus) {
  const target = LEAD_STATUS_FOR_BOOKING[bookingStatus];
  if (!target || current === target) return null;

  if (bookingStatus === 'CANCELLED') {
    return current === 'CONVERTED' ? null : 'LOST';
  }

  return (LEAD_RANK[target] ?? 0) > (LEAD_RANK[current] ?? 0) ? target : null;
}
