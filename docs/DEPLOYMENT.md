# Deployment guide

Street Wrenchers deploys as **one Next.js project** with **one PostgreSQL database**. Do not split the public site, dashboard or API into separate deployments.

## 1. Provision PostgreSQL

Use any managed PostgreSQL 14+ service (Neon, Supabase, RDS, Cloud SQL). Create a database dedicated to Street Wrenchers.

Collect two connection strings:

- **Pooled URL** — used by the deployed app (`DATABASE_URL` on Vercel).
- **Direct URL** — used only for migrations and seeding. Pooled endpoints in transaction mode can reject migration statements.

Append `?sslmode=require` when your provider requires TLS. Keep both strings out of git and out of chat.

## 2. Configure Vercel

1. Import the repository into Vercel.
2. Set the project root to this directory if the repository contains other projects.
3. Framework preset: **Next.js**. Build command: `npm run build`. Install command: `npm install`.
4. `postinstall` runs `prisma generate` automatically.
5. Add environment variables for Production (and Preview if needed):

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Pooled production connection string |
| `NEXT_PUBLIC_SITE_URL` | Canonical https URL, e.g. `https://www.streetwrenchers.ae` |
| `OWNER_NAME` | Owner display name |
| `OWNER_EMAIL` | Owner login email |
| `OWNER_PASSWORD` | Strong unique password, 12+ characters — mark sensitive |
| `OWNER_RESET_PASSWORD` | `false` after the first seed |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary secret — mark sensitive |
| `CLOUDINARY_UPLOAD_FOLDER` | e.g. `street-wrenchers` |
| `NEXT_PUBLIC_GA4_ID` etc. | Optional marketing IDs |

Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never prefix a secret.

## 3. Apply migrations

Run migrations against the production database **before** the first deploy. Store the production credentials in an untracked file with restricted permissions rather than an inline shell command:

```bash
# .env.production.local — never commit
# DATABASE_URL="<direct production connection string>"
chmod 600 .env.production.local

set -a
. ./.env.production.local
set +a

npx prisma migrate deploy
```

## 4. Seed the owner and baseline content

The seed is idempotent and safe to re-run. It creates the owner only if `OWNER_EMAIL` and `OWNER_PASSWORD` are present, and does not overwrite an existing password unless `OWNER_RESET_PASSWORD=true`.

```bash
node --env-file=.env.production.local prisma/seed.mjs
```

Include `OWNER_EMAIL`, `OWNER_PASSWORD` and `OWNER_NAME` in that restricted file, or set them as environment variables for the single command.

After seeding, confirm you can sign in at `/login`, then set `OWNER_RESET_PASSWORD=false` in Vercel.

## 5. Deploy

Deploy through the Git integration or:

```bash
vercel --prod
```

No separate API or dashboard project is required.

## 6. Domain and HTTPS

1. Add the production domain in Vercel.
2. Point DNS as instructed by Vercel.
3. Set `NEXT_PUBLIC_SITE_URL` to the final canonical origin and redeploy so metadata, sitemap and canonical URLs are correct.
4. Confirm HTTPS is active. The session cookie is marked `Secure` in production, so login only works over HTTPS.

## 7. Post-deploy checklist

- `/login` signs in and `/dashboard` loads real data.
- `/dashboard/settings` has the real business phone, email, address, hours and map query.
- `/dashboard/whatsapp` has the real number and floating button preference.
- `/dashboard/modules` reflects the intended state of rental, sales, buy-a-car and sell-your-car.
- A test media upload reaches Cloudinary (remove the test record afterwards).
- A test booking creates a booking and a linked lead, then change its status in the dashboard.
- Database redirects work for both top-level and nested paths.
- `/sitemap.xml` and `/robots.txt` return the production domain.
- `/login` and `/dashboard` are `noindex`.
- Analytics and marketing IDs are correct for the live domain.

## 8. Owner password rotation

Preferred method: **Dashboard → Security & Sessions → Change password**. This hashes the new password, revokes other sessions and keeps you signed in on the current one.

Fallback: set `OWNER_RESET_PASSWORD=true`, run the seed once with the new `OWNER_PASSWORD`, then set it back to `false`.

## 9. Media

Uploads go directly from the browser to Cloudinary using a signed request, then a `Media` row is written to PostgreSQL. Nothing is written to the Vercel filesystem. Keep the Cloudinary secret server-side and configure upload restrictions in the Cloudinary console if needed.

## 10. Operations notes

- **Redirects** are read from PostgreSQL per request. Changes apply immediately; no redeploy is needed.
- **Sessions** live in PostgreSQL, so they survive deployments. Revoke stale sessions from the security page.
- **Connection pooling**: use the pooled URL for the app. Serverless instances open many short-lived connections.
- **Region**: place the Vercel functions close to the database region to reduce latency.
- **Backups**: enable automated backups and point-in-time recovery in the database provider.
- **No cron or background worker** is required for current features.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| `DATABASE_URL is not set` during seed | The env file is not being loaded; pass `--env-file` or export the variable. |
| Migrations fail on a pooled URL | Use the provider's direct/unpooled connection string. |
| Login succeeds but the session does not persist | HTTPS, `NEXT_PUBLIC_SITE_URL`, cookie settings and proxy headers. |
| Upload returns `503` | Cloudinary variables are missing or the app was not redeployed after adding them. |
| Prisma client errors after deploy | `npm run build` should run `postinstall`; confirm `prisma generate` ran in the build log. |
| Images from Cloudinary are blocked | Add `res.cloudinary.com` to `images.remotePatterns` in `next.config.mjs` (already present). |
