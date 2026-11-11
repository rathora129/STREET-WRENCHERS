import fs from 'node:fs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const base = 'http://127.0.0.1:3200';
const out = [];
const log = (line) => { out.push(line); console.log(line); };
const fail = (msg) => { console.error('FAIL:', msg); process.exitCode = 1; };

const testPhone = '+9715099' + String(Date.now()).slice(-5);
const service = await prisma.service.findFirst({
  where: { isPublished: true, price: { not: null } },
  select: { id: true, name: true },
});
if (!service) throw new Error('No published service with price');

const owner = await prisma.owner.findFirst({ select: { email: true } });
const password = fs.readFileSync('.owner-password.local', 'utf8').trim();

const d = new Date(Date.now() + 5 * 24 * 3600 * 1000);
const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// 1. Public booking acceptance
const bookingRes = await fetch(base + '/api/bookings', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    customerName: 'Stage11 QA Customer',
    phone: testPhone,
    brandName: 'Toyota',
    modelName: 'Corolla',
    year: 2021,
    fuelType: 'Petrol',
    serviceId: service.id,
    date,
    time: '09:00',
    pickupRequired: false,
    notes: 'Stage 11 acceptance booking',
    source: 'stage11-qa',
  }),
});
const bookingJson = await bookingRes.json();
log(`POST /api/bookings -> ${bookingRes.status} ref=${bookingJson?.data?.reference} tokenLen=${bookingJson?.data?.trackingUrl?.length}`);
if (bookingRes.status !== 201) fail('booking creation failed');

const reference = bookingJson.data.reference;
const publicTrackingUrl = bookingJson.data.trackingUrl;
const publicToken = publicTrackingUrl.split('/track/')[1];

// 2. Public tracking page (before owner updates)
let res = await fetch(`${base}/track/${publicToken}`);
let html = await res.text();
log(`GET /track/{public token} -> ${res.status} hasRef=${html.includes(reference)} noindex=${html.includes('noindex')} cache=${res.headers.get('cache-control')}`);
if (res.status !== 200) fail('public tracking page not 200');

// 3. Login
const loginRes = await fetch(base + '/api/auth/login', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ email: owner.email, password }),
});
const loginJson = await loginRes.json();
const cookie = (loginRes.headers.getSetCookie() || []).map((c) => c.split(';')[0]).join('; ');
log(`POST /api/auth/login -> ${loginRes.status} cookieSet=${Boolean(cookie)} role=${loginJson?.data?.role}`);
if (loginRes.status !== 200 || !cookie) fail('owner login failed');

const auth = { cookie, 'content-type': 'application/json' };

// 4. Overview
res = await fetch(base + '/api/admin/overview', { headers: auth });
const overview = await res.json();
log(`GET /api/admin/overview -> ${res.status} counts=${Object.keys(overview?.data?.counts || {}).length} stages=${overview?.data?.stageBreakdown?.length} noStore=${res.headers.get('cache-control')}`);
if (res.status !== 200) fail('overview fetch failed');
if (overview?.data?.counts?.pending < 1) fail('new booking not counted as pending');

// 5. Generate tracking token
const booking = await prisma.booking.findUnique({ where: { reference }, select: { id: true, customerId: true, trackingToken: true } });
res = await fetch(`${base}/api/admin/bookings/${booking.id}/tracking`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify({ action: 'generate' }),
});
const trackJson = await res.json();
const token = trackJson?.data?.token;
log(`POST tracking generate -> ${res.status} tokenLen=${token?.length} enabled=${trackJson?.data?.enabled} noStore=${res.headers.get('cache-control')}`);
if (res.status !== 200 || !token) fail('tracking generate failed');

// 6. Stage update with internal + customer notes
res = await fetch(`${base}/api/admin/bookings/${booking.id}/stage`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify({
    stage: 'INITIAL_INSPECTION',
    internalNote: 'QA-INTERNAL-SECRET-987',
    customerNote: 'QA visible inspection note',
  }),
});
const stageJson = await res.json();
const wa = stageJson?.data?.whatsappUrl || '';
log(`POST stage INITIAL_INSPECTION -> ${res.status} whatsappLink=${wa.startsWith('https://wa.me/')} messageHasRef=${stageJson?.data?.message?.includes(reference)} messageHasTracking=${stageJson?.data?.message?.includes('/track/')}`);
if (res.status !== 200) fail('stage update failed');

// 7. Dashboard tracking page privacy
res = await fetch(`${base}/track/${token}`);
html = await res.text();
const leaks = ['QA-INTERNAL-SECRET-987', booking.id, testPhone, 'internalNote', 'customerId'];
log(`GET /track/{owner token} -> ${res.status} ref=${html.includes(reference)} customerNote=${html.includes('QA visible inspection note')} stage=${html.includes('Initial inspection')} leaks=${leaks.filter((l) => html.includes(l)).join('|') || 'none'}`);
if (res.status !== 200) fail('owner-generated tracking page not 200');
if (leaks.some((l) => html.includes(l))) fail('tracking page leaked internal data');

// 8. Invalid stage validation
res = await fetch(`${base}/api/admin/bookings/${booking.id}/stage`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify({ stage: 'NOT_A_STAGE' }),
});
log(`POST stage invalid -> ${res.status}`);
if (res.status !== 422) fail('invalid stage was not rejected');

// 9. Revoke
res = await fetch(`${base}/api/admin/bookings/${booking.id}/tracking`, {
  method: 'POST',
  headers: auth,
  body: JSON.stringify({ action: 'revoke' }),
});
const revokeJson = await res.json();
log(`POST tracking revoke -> ${res.status} enabled=${revokeJson?.data?.enabled} token=${revokeJson?.data?.token}`);
if (res.status !== 200) fail('revoke failed');
res = await fetch(`${base}/track/${token}`);
log(`GET /track/{revoked token} -> ${res.status}`);
if (res.status !== 404) fail('revoked token still resolves');

// 10. Password endpoint method protection
res = await fetch(base + '/api/admin/password', { method: 'PUT', headers: { 'content-type': 'application/json' }, body: '{}' });
log(`PUT /api/admin/password (anon) -> ${res.status}`);
if (res.status !== 401) fail('password endpoint not protected');

// 11. Logout then reuse cookie
res = await fetch(base + '/api/auth/logout', { method: 'POST', headers: auth });
log(`POST /api/auth/logout -> ${res.status}`);
res = await fetch(base + '/api/admin/overview', { headers: { cookie } });
log(`GET overview with logged-out cookie -> ${res.status}`);
if (res.status !== 401) fail('session not revoked after logout');

// 12. Cleanup test records created by this script
await prisma.bookingStageEvent.deleteMany({ where: { bookingId: booking.id } });
await prisma.lead.deleteMany({ where: { bookingId: booking.id } });
await prisma.booking.delete({ where: { id: booking.id } });
if (booking.customerId) {
  const left = await prisma.booking.count({ where: { customerId: booking.customerId } });
  if (left === 0) await prisma.customer.delete({ where: { id: booking.customerId } }).catch(() => {});
}
log('cleanup: removed Stage 11 QA booking, its events, lead and unused customer');

console.log('DONE');
