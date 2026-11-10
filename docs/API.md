# API reference

All API routes run on the Node.js runtime and are dynamic. Requests and responses are JSON unless noted.

Successful responses use:

```json
{ "ok": true, "data": { } }
```

Errors use:

```json
{ "ok": false, "error": "Message", "details": [{ "field": "email", "message": "Invalid email" }] }
```

Common status codes: `400` malformed body, `401` no/expired owner session, `404` unknown record or route, `405` operation not allowed, `409` unique/relation conflict, `422` Zod validation failure, `500` unexpected error, `503` upload not configured.

## Authentication

Exactly one owner account exists. There is no registration endpoint.

The session is stored in the `sw_session` cookie: HTTP-only, `SameSite=Lax`, `Secure` in production, seven-day expiry. Sessions are database records and can be revoked.

### `POST /api/auth/login`

```json
{ "email": "owner@example.com", "password": "…" }
```

Sets the session cookie and returns the owner's non-sensitive profile. `401` for invalid credentials.

### `POST /api/auth/logout`

Revokes the current session and clears the cookie.

### `GET /api/auth/session`

Returns the current owner profile when a valid session exists, otherwise `401`.

All `/api/admin/*` routes require a valid session and return `401` without one.

## Public endpoints

### `POST /api/bookings`

Creates a booking, a matching `SERVICE_BOOKING` lead and upserts the customer in one transaction.

```json
{
  "customerName": "Aisha Khan",
  "phone": "+971500000000",
  "email": "aisha@example.com",
  "brandId": "brand_cuid",
  "brandName": "Toyota",
  "modelName": "Land Cruiser",
  "year": 2023,
  "fuelType": "Petrol",
  "serviceId": "service_cuid",
  "packageId": "package_cuid",
  "date": "2026-11-20",
  "time": "10:00",
  "pickupRequired": true,
  "pickupAddress": "Business Bay, Dubai",
  "notes": "AC not cooling",
  "source": "website",
  "utm": { "utm_source": "google", "utm_medium": "cpc", "utm_campaign": "winter-check" }
}
```

Rules enforced server-side:

- The service must be published; a package must be published and belong to the service.
- Time must be one of `08:00`–`19:00` on the hour.
- Date must respect the minimum notice and maximum days ahead from booking settings.
- Pickup requires an address.
- Phone is normalised and must contain at least five digits.

Returns `201` with `{ id, reference, status, serviceName, packageName, preferredDate, preferredTime }`.

### `POST /api/leads`

Creates a CRM lead for contact, WhatsApp, AMC, rental, car sales, buy/sell requests and marketing enquiries.

```json
{
  "name": "Omar Ali",
  "phone": "+971500000001",
  "email": "omar@example.com",
  "type": "CONTACT",
  "vehicleBrand": "Nissan",
  "vehicleModel": "Patrol",
  "vehicleYear": 2021,
  "message": "Please call me about an AMC plan.",
  "source": "website",
  "utmSource": "instagram",
  "utmMedium": "social",
  "utmCampaign": "amc-launch",
  "landingPage": "/amc"
}
```

`type` is one of `CONTACT`, `AMC`, `WHATSAPP`, `RENTAL`, `CAR_SALES`, `BUY_CAR`, `SELL_CAR`, `MARKETING`. If `utmCampaign` matches a campaign's `campaignId` or slug, the lead is linked to that campaign. Returns `201`.

### `POST /api/analytics/events`

First-party analytics event used by the site tracker.

```json
{
  "type": "PAGE_VIEW",
  "path": "/services",
  "sessionId": "browser-session-id",
  "source": "google",
  "medium": "cpc",
  "campaignId": "winter-check",
  "value": 1,
  "metadata": { "referrer": "https://example.com" }
}
```

Allowed types: `PAGE_VIEW`, `WHATSAPP_CLICK`, `BOOKING_START`, `BOOKING_SUBMIT`, `LEAD_SUBMIT`, `CAMPAIGN_CONVERSION`. Returns `201` with the event id.

## Admin resources

Generic REST CRUD is exposed for these URL segments:

| Segment | Prisma model | Create | Delete |
| --- | --- | --- | --- |
| `categories` | ServiceCategory | Yes | Yes |
| `services` | Service | Yes | Yes |
| `packages` | ServicePackage | Yes | Yes |
| `amc` | AmcPlan | Yes | Yes |
| `brands` | Brand | Yes | Yes |
| `models` | VehicleModel | Yes | Yes |
| `customers` | Customer | Yes | No |
| `bookings` | Booking | No | No |
| `leads` | Lead | No | Yes |
| `pages` | Page | Yes | Yes |
| `sections` | PageSection | Yes | Yes |
| `banners` | Banner | Yes | Yes |
| `blog` | Blog | Yes | Yes |
| `testimonials` | Testimonial | Yes | Yes |
| `faqs` | Faq | Yes | Yes |
| `campaigns` | Campaign | Yes | Yes |
| `rental` | RentalVehicle | Yes | Yes |
| `sales` | SaleVehicle | Yes | Yes |
| `redirects` | Redirect | Yes | Yes |
| `media` | Media | Yes | Yes |

### `GET /api/admin/{resource}`

Query parameters:

- `q` — case-insensitive search across the resource's configured fields.
- `page` — default `1`.
- `perPage` — default `20`, maximum `100`.
- Resource filters, for example `status`, `type`, `isPublished`, `isActive`, `categoryId`, `serviceId`, `brandId`, `campaignId`, `folder`, `placement`, `condition`.

Response:

```json
{
  "ok": true,
  "data": {
    "items": [],
    "pagination": { "page": 1, "perPage": 20, "total": 0, "totalPages": 1 }
  }
}
```

### `GET /api/admin/{resource}/{id}`

Returns one record including its configured relations and counts. `404` when missing.

### `POST /api/admin/{resource}`

Creates a record. The body is validated by the resource's Zod schema. Slugs are generated uniquely when omitted; AMC `brandIds`/`modelIds` accept arrays; page/blog publishing timestamps are handled automatically.

### `PATCH /api/admin/{resource}/{id}`

Partial update. Only fields present in the request body are written, so omitted fields (publishing flags, sort order, prices, slugs) are preserved.

### `DELETE /api/admin/{resource}/{id}`

Deletes when the resource allows it. `405` for bookings and customers.

### `GET /api/admin/options`

Returns select options for dashboard relation fields: categories, services, packages, brands, models (`Brand — Model`), AMC plans, pages and campaigns.

### `GET /api/admin/overview`

Dashboard summary: booking/lead/customer counts, today's bookings, new leads, published content, completed revenue, recent records, upcoming appointments, seven-day analytics counts and module statuses. All values are real database counts.

### `GET /api/admin/analytics?days=30`

`days` is clamped to 7–90. Returns daily buckets (page views, WhatsApp clicks, booking starts, bookings, leads), top pages, lead sources, booking/lead status mixes and campaign counts from first-party events.

### `GET /api/admin/export?resource=leads|bookings|customers`

CSV download with the same search/filter parameters as the list endpoint, limited to 5,000 rows. Not available for other resources.

### `GET /api/admin/settings/{group}` and `PUT`

Groups: `business`, `whatsapp`, `modules`, `analytics`, `seo`, `booking`. `GET` merges defaults with stored values. `PUT` validates the whole group and saves it.

### `GET /api/admin/sessions`, `DELETE /api/admin/sessions`, `DELETE /api/admin/sessions/{id}`

List sessions with `current`/`active` flags; revoke all other sessions; revoke one non-current session. The current session cannot be revoked from this endpoint.

### `POST /api/admin/password`

```json
{
  "currentPassword": "…",
  "newPassword": "…",
  "confirmPassword": "…"
}
```

New password must be at least 10 characters and include a letter and a number. On success, all other sessions are revoked.

### `GET` / `POST /api/admin/leads/{id}/activities`

List or add CRM activities. Add body: `{ "type": "CALL", "note": "Confirmed the appointment." }`. Activities record the acting owner.

### `POST /api/admin/upload`

Returns a short-lived Cloudinary signature and upload URL:

```json
{
  "cloudName": "…",
  "apiKey": "…",
  "timestamp": 1730000000,
  "folder": "street-wrenchers/pages",
  "signature": "…",
  "uploadUrl": "https://api.cloudinary.com/v1_1/{cloud}/auto/upload"
}
```

The browser then posts `file`, `api_key`, `timestamp`, `folder` and `signature` directly to Cloudinary. A `Media` record is created afterwards through `POST /api/admin/media`. Returns `503` with an actionable message if Cloudinary is not configured.

## Redirects

Redirects are matched by exact `fromPath` against the incoming request path, including nested paths. Active permanent rules (`301`/`308`) respond with a permanent 308; temporary rules (`302`/`307`) respond with a temporary 307. Existing query strings are preserved unless the target already contains one. Redirects are read per request from PostgreSQL, so changes in the dashboard apply immediately without a redeploy.
