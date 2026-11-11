# Street Wrenchers — Phase 2 final verification and critical fixes

**Date:** 12 November 2026
**Scope:** verification and bug-fix pass over the existing app, immediately before production deployment. No rebuild, no stack change, no database reset, JavaScript/JSX only, black/orange design preserved, existing records preserved.
**Environment verified:** local PostgreSQL (`127.0.0.1:5433`, database `street_wrenchers`) with the production build served on `127.0.0.1:3200`.
**Deployment:** not performed in this pass. Working-tree changes are uncommitted and unpushed.

---

## 1. Outcome

| Area | Result |
|---|---|
| Critical functional fixes | 3 fixed, 1 verified healthy (AMC keywords never reproduced as a bug) |
| Automated regression tests | **14 / 14 pass** |
| API + database integration suite | **51 / 52 pass** — the only failure is the expected password-rotation check |
| Browser/visual checks | **all pass** (hero, marquee, gallery/lightbox, tour, help, buttons, responsive) |
| Owner-protected admin API sweep | **22 / 22 endpoints return 401 anonymously** |
| Production build | **exit 0**, `.next/BUILD_ID` written |
| Production database bootstrap | **confirmed running** in Vercel build logs |
| Owner password rotation | **NOT DONE — critical owner action** |

---

## 2. Fixes applied in this pass

| # | Issue | Change | Verification |
|---|---|---|---|
| 1 | Invalid/expired/revoked session caused a redirect loop between `/login` and `/dashboard` | `src/middleware.js` no longer redirects `/login` → `/dashboard` on cookie presence. The login page already validates the session server-side before redirecting. | Forged, expired and revoked cookies redirect once to `/login?next=/dashboard`; `/login` returns 200 instead of looping; a valid session still redirects to `/dashboard`. |
| 2 | No login throttling | `src/lib/rate-limit.js` (fixed-window limiter). `POST /api/auth/login` limits 20 attempts / 15 min per IP and 8 / 15 min per IP+email pair; the pair counter resets on success. | First `429` on attempt 9 for the same IP+email; `Retry-After` returned. |
| 3 | Public form spam exposure | `POST /api/leads` 20 / 10 min per IP; `POST /api/bookings` 10 / 15 min per IP; `POST /api/analytics/events` 200 / 5 min per IP. | First `429` at attempt 20 (leads) and attempt 10 (bookings). |
| 4 | CRM inconsistency: enquiries did not reliably create/link customers | `POST /api/leads` now upserts the customer by normalized phone inside the same transaction and links the lead. Public response no longer exposes the customer ID. | Enquiry created one lead and linked it to exactly one customer record. |
| 5 | Completed bookings did not update customer lifetime value | `src/lib/crm.js`: `syncCustomerStats` recomputes `totalBookings`, `totalSpent` (sum of completed `priceEstimate`) and `lastVisitAt`. Called after public booking creation, stage updates and dashboard booking edits. | `COMPLETED` booking produced `totalSpent = 250` and a `lastVisitAt`; customer booking count updated. |
| 6 | Lead status could drift from booking status | `src/lib/lead-status.js` with monotonic transitions; `syncLeadForBooking` applied on booking creation, stage updates and dashboard edits. | All 10 stages accepted; `COMPLETED` converted the linked lead to `CONVERTED`; cancellation marks `LOST` and never downgrades a converted lead. |
| 7 | No customer history view | New `/dashboard/customers/[id]` page (bookings, enquiries, activity, 4 stat cards) and a “History” row action on the customer list. | Detail API returned related enquiries; browser showed History links for existing customers. |
| 8 | CSP missing | `next.config.mjs` now sends `Content-Security-Policy-Report-Only` (default-src self, explicit GTM/GA/Meta, Cloudinary images/media, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`). Report-only, so it cannot break the site while violations are collected. | Header present on every response; site renders and all visual checks pass under it. |
| 9 | AMC `keywords` mismatch reported in Phase 1 | Could not reproduce: `amcPlanSchema` already accepts arrays and comma strings, and Prisma create/update persisted `keywords` correctly. Added regression coverage; fixed the schema’s alias import (`@/lib/utils` → relative) so the schema can be exercised by Node tests. | Create with `["qa","verification"]` → `201`; update with `"qa, updated"` → `["qa","updated"]`; public page renders both. |
| 10 | Dashboard booking edits bypassed CRM sync | `PATCH /api/admin/[resource]/[id]` now runs customer-stat and lead-status sync when `resource === 'bookings'`. | Covered by the integration suite’s stage/status flow. |

### New regression tests

- `tests/amc-plan.test.mjs` — keywords array/string/default, brand/model lists, price coercion, description minimum.
- `tests/rate-limit.test.mjs` — allow/block, key isolation, reset, window expiry.
- `tests/lead-status.test.mjs` — follow-up preservation, forward-only transitions, completion conversion, cancellation protection.

`npm test` → **14 pass, 0 fail**.

---

## 3. Feature verification (priorities P1–P4)

| Feature | Expected | Actual | Result |
|---|---|---|---|
| AMC create / edit / unpublish / delete | Full CRUD, public page reflects changes | `201` create, `200` update (price 1499, 6 months, benefits), published page shows new price and benefit, unpublish `404`, delete `200` | Pass |
| AMC `keywords` | Stored and normalized | `["qa","verification"]`, then `["qa","updated"]` from comma string | Pass |
| Service create / icon+image / reorder / visibility | Public page and image/icon update, `404` when hidden | All pass; `sortOrder` persisted; hidden page `404` | Pass |
| Brand + model mapping | Brand page shows image and mapped model | Brand page `200`, image loads (`naturalWidth > 0`), model listed | Pass |
| Hero slider | Multiple slides, autoplay, dots, mobile swipe | 3 slides, auto-advance after interval, dot 3 selection, swipe changes slide | Pass |
| Testimonial loop | Continuous scroll, hover pause, resume, mobile swipe, reduced motion | Loop duplicates the group, transform advances, pause on hover, resumes on leave, swipe moves the track, reduced motion disables the loop | Pass |
| Gallery | Carousel and lightbox | 10 openable images, lightbox opens, next works, closes; “Workshop gallery” carousel present | Pass |
| Booking lifecycle | All stages pickup → delivery | 10/10 stages stored in order; final `COMPLETED` | Pass |
| Tracking privacy | Token-gated, no leaks, regenerate/revoke | No internal note/ID/phone leaks; old link `404` after regenerate; revoked link `404` | Pass |
| Enquiry → customer | One customer per phone, lead linked | Linked, no duplicate customer | Pass |
| Lifetime spend / last visit | Recomputed from completed bookings | `250` and latest completed date | Pass |
| Customer history | Bookings, enquiries, activity | Detail API and page both render | Pass |
| Dashboard walkthrough | First-time tour, dismiss and persist | Tour opens on first visit, skip closes it and stores `sw-dashboard-guide-v1` | Pass |
| Help centre | Topics | 16 topic anchors | Pass |
| Primary buttons | Orange background, pure white text | `rgb(242,106,13)` on `rgb(255,255,255)`, website and dashboard | Pass |
| Responsive | No horizontal overflow, mobile nav | 390 px: homepage and dashboard `scrollWidth = 390`, menu control present; hero swipe works | Pass |

---

## 4. Test evidence

### 4.1 Integration suite (52 checks)

51 pass. The single failure is intentional and expected:

```
FAIL owner password from committed file is no longer valid | expected=true actual=false
```

The password in `.owner-password.local` still authenticates against the owner record, so it has **not** been rotated. Everything else passed: session handling, anonymous protection, CSP/security headers, AMC and service CRUD, brand/model rendering, testimonials, hero, enquiry→customer, booking lifecycle, CRM totals, tracking privacy, and all three rate limits.

### 4.2 Browser suite

25 checks plus follow-up mobile-swipe and hover runs, all passing. Notable evidence:

- Hero auto-advance: slide 1 → slide 2 after the configured interval.
- Marquee transform advanced ~39 px per 1.5 s; froze while hovered; resumed after pointer leave.
- Gallery dialog opened, advanced to the next image and closed.
- First-time tour showed “Your daily overview” and persisted completion.
- 390 px layout had no horizontal overflow.

### 4.3 Security sweep

All 22 admin API entry points returned `401` without a session. Public form endpoints validate input (`422`) and are rate limited. Request bodies are capped at 256 KB (`413`).

---

## 5. Production readiness checklist

| # | Item | Status |
|---|---|---|
| 22 | Committed owner password rotated | **FAIL — still valid; see §6** |
| 23 | No Git history rewrite / force-push | Confirmed: none performed |
| 24 | Production database env mapping | Partially verified. Vercel build logs prove `DATABASE_URL` is present and used; `DIRECT_URL` is absent. Values were not dumped (safety rule); other variable names could not be audited without exposing production configuration. |
| 25 | Migrations ready and safe | `prisma validate` OK; 4 migrations; database up to date; no `DROP TABLE`, `DROP COLUMN`, `TRUNCATE`, `DELETE FROM` or column-type changes in any migration. Pending migration is additive only. |
| 26 | Vercel build runs the migration workflow | **Confirmed** in the latest production build log: `npm run vercel-build` → `node scripts/deploy-db.mjs` → `prisma migrate deploy` → `prisma generate` → seed → `next build`. Seed is idempotent and does not delete records. |
| 27a | Cloudinary | Local env has no Cloudinary credentials, so uploads correctly return `503` with a configuration message. Production needs `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` (and optionally `CLOUDINARY_UPLOAD_FOLDER`). Presence in Vercel could not be audited. |
| 27b | WhatsApp | Templates exist in settings, but `number` is empty, `enabled` is false and `showFloatingButton` is false. Click-to-chat and the floating button stay hidden until the owner saves a number under Dashboard → WhatsApp. No automatic messages are sent by design. |

Production site `https://streetwrencher.vercel.app` returned `200` (homepage and `/login`) at verification time. That deployment predates the fixes in this pass.

Additional advisory status: `npm audit --omit=dev` reports 6 advisories (5 high, 1 moderate) inherited from Next/PostCSS and Zod. Fixes require framework/library major upgrades and were not forced.

---

## 6. Remaining issues and owner approvals

1. **Rotate the owner password immediately.** `.owner-password.local` still authenticates and the file exists in four commits (`d931e00`, `8f17b03`, `911f848`, `71ffecd`) of the public `rathora129/STREET-WRENCHERS` repository. Removing it from the current tree (already staged) does not remove it from history. Changing the password without approval could lock the owner out, so it was not done. Recommended: rotate in production and locally, then regenerate sessions.
2. **Decide how to purge Git history.** Options: rewrite history with `git filter-repo` and force-push, or delete/recreate the repository. Both are destructive and require explicit approval. No history rewrite or force-push was performed.
3. **Commit and deploy the fixes.** All changes in this pass are uncommitted. Deployment needs approval; the latest production build does not include them.
4. **Configure production Cloudinary credentials** and confirm uploads from Dashboard → Media Library.
5. **Set the WhatsApp business number** in the dashboard so click-to-chat and the floating button activate.
6. **Enforce CSP later.** It is report-only with `'unsafe-inline'` for Next’s bootstrap script. Once reports are clean, move to a nonce-based enforced policy.
7. **Rate limiting is per serverless instance.** It resets on cold starts and is not shared across regions. For stronger guarantees, move the limiter to a shared store (e.g. Upstash/Redis) before heavy promotion.
8. **Repository hygiene.** `qa-stage11-temp.mjs` is still tracked in Git but deleted in the working tree; it should be removed in the next commit.
9. **Content.** 0 published testimonials and 0 blog posts; the site shows honest empty states. Add content before marketing.
10. **Production env audit.** Confirm `NEXT_PUBLIC_SITE_URL`, Cloudinary and marketing IDs in Vercel. Values must stay in Vercel, never in chat or Git.

---

## 7. Data safety and cleanup

- Only records created by this verification run were touched. Cleanup was scoped to unique `QA-P2-…` / `QAVIS-…` tags.
- Removed: 8 test testimonials (two batches), 2 test customers, 2 test leads, 1 test brand, 1 test model, test services, AMC plans, bookings and sessions. Post-cleanup counts for every test tag are 0.
- Preserved: all pre-existing records — 2 customers, 1 booking, 2 leads, 11 services, 3 AMC plans, 20 brands, 75 models, 18 pages, 10 media records, 3 banners, 8 FAQs.
- No database reset, drop, migration rollback or production data change occurred.
- Temporary QA scripts and browser profiles were deleted; the working tree contains no test script.

---

## 8. Deployment steps (owner approval required)

1. Rotate `OWNER_PASSWORD` in the environment and via Dashboard → Settings → Password (this also revokes stale sessions if desired).
2. Confirm in Vercel: `DATABASE_URL` (production host, never localhost), optional `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL`, Cloudinary keys, optional marketing IDs.
3. Commit the reviewed working-tree changes (including the staged `.owner-password.local` deletion and `.gitignore` entry) and push to the approved branch.
4. Deploy. The build runs `vercel-build`, applies the additive migrations, generates Prisma Client, seeds only missing baseline records and builds.
5. Smoke test: login, overview, create/edit a service, publish and open it, run one booking through stages, open the `/track/...` link in a private window, revoke it, and confirm `404`.
