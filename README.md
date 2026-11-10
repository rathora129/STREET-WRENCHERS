# Street Wrenchers

One Next.js application for the Street Wrenchers automotive service centre in Dubai: the public website, the service booking flow, the owner dashboard, CRM, CMS, SEO and marketing tools, all backed by PostgreSQL.

There is no second frontend and no separate backend. Everything deploys as a single Vercel project.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 App Router (React 19, JavaScript/JSX only) |
| Styling | styled-components 6 with a custom dark workshop theme |
| Motion | Framer Motion |
| Icons | Lucide React |
| Client state | Zustand (booking/site UI state) |
| Data fetching | TanStack Query 5 in the dashboard |
| Forms | Formik + Yup (public forms), controlled forms in the dashboard |
| API | Next.js Route Handlers, Node runtime, REST, Zod validation |
| Database | PostgreSQL 14+ with Prisma 6 |
| Auth | Custom owner auth: Node `crypto` scrypt, HTTP-only cookie, DB-backed sessions |
| Media | Cloudinary signed direct uploads (Vercel's filesystem is never used for uploads) |

## Requirements

- Node.js 20.9 or newer (verified on Node 24)
- PostgreSQL 14 or newer (verified on PostgreSQL 16)
- A Cloudinary account for media uploads (optional until you upload)

## Quick start

```bash
cp .env.example .env
# edit .env: DATABASE_URL, OWNER_EMAIL, OWNER_PASSWORD, NEXT_PUBLIC_SITE_URL
npm install
npm run db:generate
npm run db:deploy
npm run db:seed
npm run dev
```

- Website: http://localhost:3000
- Owner login: http://localhost:3000/login
- Dashboard: http://localhost:3000/dashboard

`db:deploy` applies the committed migrations. If you are creating new migrations during development, use `npm run db:migrate` instead.

The seed is idempotent. It creates the owner only when `OWNER_EMAIL` and `OWNER_PASSWORD` are set, and it will not change an existing password unless `OWNER_RESET_PASSWORD=true`. It also seeds the service catalogue, AMC plans, brands, CMS pages, banners and FAQs. Testimonials and blog posts intentionally start empty — add real ones from the dashboard.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. Use a pooled URL in production. |
| `DIRECT_URL` | No | Direct/unpooled URL used by `prisma migrate deploy` and the seed. Falls back to `DATABASE_URL`. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL used for SEO, sitemaps and UTM previews. |
| `OWNER_NAME` | No | Display name for the single owner account. |
| `OWNER_EMAIL` | Yes (seed) | Owner login email. |
| `OWNER_PASSWORD` | Yes (seed) | Owner password, 12+ characters. Stored only as a scrypt hash. |
| `OWNER_RESET_PASSWORD` | No | Set `true` once to rotate an existing owner password via the seed. |
| `CLOUDINARY_CLOUD_NAME` | Uploads | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Uploads | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | Uploads | Cloudinary API secret (server-only; signs uploads). |
| `CLOUDINARY_UPLOAD_FOLDER` | No | Default upload folder, e.g. `street-wrenchers`. |
| `NEXT_PUBLIC_GA4_ID` / `GTM_ID` / `META_PIXEL_ID` / `GOOGLE_ADS_ID` | No | Optional marketing IDs. The dashboard analytics settings group can also hold these. |

Uploads show a clear configuration error until the Cloudinary variables are set.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Production build (no database changes). |
| `npm run vercel-build` | Vercel build: `prisma migrate deploy`, generate, seed, then `next build`. |
| `npm start` | Run the production build locally. |
| `npm run db:generate` | Generate the Prisma client. |
| `npm run db:migrate` | Create/apply a development migration. |
| `npm run db:deploy` | Apply committed migrations (production). |
| `npm run db:bootstrap` | Run the guarded deploy script (migrations, generate, seed). |
| `npm run db:seed` | Seed catalogue, pages, brands and the owner. |
| `npm run db:setup` | `db:deploy` followed by `db:seed`. |
| `npm run db:studio` | Open Prisma Studio. |
| `npm run brand:assets` | Regenerate favicons/app icons from the brand logo. |

Vercel uses `vercel-build` automatically for production deployments. It applies pending migrations and the idempotent seed before building, so a fresh database is initialised on the first deploy. Preview deployments skip the database step. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Public website

All 28 required public pages are implemented in the `(site)` route group:

- `/` — dashboard-managed homepage with hero slider, intro, booking CTA, featured services, packages, AMC, brands, why-us, process, gallery, testimonials empty state, future-module promos, blog empty state, FAQs, contact and map.
- `/about`, `/services`, `/services/[slug]`, `/amc`, `/amc/[slug]`, `/brands`, `/why-choose-us`, `/gallery`, `/blog`, `/blog/[slug]`, `/reviews`, `/contact`, `/book`, `/faqs`, `/privacy-policy`, `/terms-and-conditions`.
- `/rental`, `/rental/[slug]`, `/car-sales`, `/car-sales/[slug]`, `/buy-a-car`, `/sell-your-car` — gated by the future module controls.
- CMS pages created in the dashboard resolve through `/[slug]`.
- Unmatched multi-segment paths still pass through the site layout so database redirects apply before a 404.

Business details (phone, email, address, hours, map query) are intentionally blank in the defaults. Set the real values in **Dashboard → Business Settings** before launch. The site does not invent contact details or testimonials.

## Owner dashboard

There is exactly one admin entry point, `/login`, and no public registration. Sessions are stored in PostgreSQL, use an HTTP-only `sw_session` cookie, expire after seven days and can be revoked from **Security & Sessions**.

Dashboard modules:

- Overview and first-party analytics
- Bookings with detail view, quick status updates, estimates, appointment/pickup edits and internal notes
- Leads & CRM with status, follow-up scheduling, internal notes, activity timeline and CSV export
- Customers
- Categories, services, packages, AMC plans, car brands, models
- Pages and page sections, banners, media library, blog, testimonials, FAQs
- Campaigns with UTM builder, SEO defaults, redirects, WhatsApp controls
- Car rental and car sales inventory, module controls
- Business settings, booking rules, security and sessions

Bookings use the five statuses `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`. Lead statuses are `NEW`, `CONTACTED`, `QUALIFIED`, `FOLLOW_UP`, `CONVERTED`, `LOST`.

## Modules and content controls

Each future module (`CAR_RENTAL`, `CAR_SALES`, `BUY_A_CAR`, `SELL_YOUR_CAR`) has a status of `ACTIVE`, `COMING_SOON`, `HIDDEN` or `DRAFT`. Status is enforced server-side and in navigation. `COMING_SOON` renders an enquiry page; `HIDDEN` and `DRAFT` return not-found for public routes.

Services, categories, packages, AMC plans, pages, blog posts and banners are fully manageable from the dashboard, including slugs, SEO fields, images and publishing state.

## Media

The dashboard uploads files directly to Cloudinary using a short-lived signature issued by `/api/admin/upload`. A media record is then created in PostgreSQL (`Media`). The app never writes to the Vercel filesystem.

## SEO

- Per-entity SEO fields (meta title/description, keywords, OG image)
- Database redirects applied at request time, including nested paths
- `app/sitemap.js` and `app/robots.js`
- Canonical URLs, Open Graph metadata and JSON-LD (LocalBusiness, breadcrumbs, service/FAQ where applicable)
- Noindex on `/login` and `/dashboard`

## Project structure

```
prisma/            schema, migrations, idempotent seed
public/assets/     logo, favicons, hero/gallery images, OG banner
src/app/(site)/    public website routes
src/app/login/     owner login
src/app/dashboard/ dashboard pages
src/app/api/       route handlers (public + admin)
src/components/    site, dashboard, forms, shared UI
src/lib/           auth, http, validation, settings, SEO, Prisma, admin registry
src/services/      server data access (content, redirects)
src/data/          defaults and seeded content definitions
src/hooks/         client hooks
src/store/         Zustand stores
src/styles/        theme and global styles
scripts/           brand asset generation
docs/              API and deployment documentation
```

## Documentation

- [API reference](docs/API.md)
- [Deployment guide](docs/DEPLOYMENT.md)

## Security notes

- No public registration; owner creation happens only through the environment-driven seed.
- Passwords are hashed with scrypt (`scrypt$N$r$p$salt$hash`); session tokens are stored as SHA-256 hashes.
- `sw_session` is HTTP-only, `SameSite=Lax`, and `Secure` in production.
- Every admin API and dashboard page requires an owner session; API routes also validate input with Zod.
- Keep `.env` files out of version control. Never paste production credentials into client code, logs or chat.
