import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRISMA_CLI = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');

function loadEnvFile(filename) {
  const file = path.join(ROOT, filename);
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, raw] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = raw.replace(/^["']|["']$/g, '');
  }
}

function flag(name, fallback = false) {
  const value = process.env[name];
  if (value === undefined || value === '') return fallback;
  return !['0', 'false', 'no'].includes(value.toLowerCase());
}

function log(message) {
  console.log(`[db] ${message}`);
}

function fail(message) {
  console.error(`[db] ${message}`);
  process.exit(1);
}

function runPrisma(args, databaseUrl) {
  const result = spawnSync(process.execPath, [PRISMA_CLI, ...args], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });
  if (result.error) fail(`Could not start Prisma: ${result.error.message}`);
  if (result.status !== 0) fail(`\`prisma ${args.join(' ')}\` failed with exit code ${result.status}.`);
}

loadEnvFile('.env.production.local');
loadEnvFile('.env.local');
loadEnvFile('.env');

const isVercelProduction = process.env.VERCEL_ENV === 'production';
const forced = flag('RUN_DB_MIGRATIONS');
const skipped = flag('SKIP_DB_MIGRATIONS');

if (skipped) {
  log('SKIP_DB_MIGRATIONS is set — database bootstrap skipped.');
  process.exit(0);
}

if (!isVercelProduction && !forced) {
  log('Not a production Vercel build — database bootstrap skipped.');
  process.exit(0);
}

const usingDirectUrl = Boolean(process.env.DIRECT_URL);
const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  fail('DATABASE_URL is not configured. Set it (and optionally DIRECT_URL) before deploying.');
}

let hostname = '';
try {
  hostname = new URL(databaseUrl).hostname.toLowerCase();
} catch {
  fail('The database connection string is not a valid URL.');
}

if (isVercelProduction && ['localhost', '127.0.0.1', '0.0.0.0', '[::1]', '::1'].includes(hostname)) {
  fail('Refusing to run production migrations against a local database host.');
}

if (!fs.existsSync(PRISMA_CLI)) {
  fail('The Prisma CLI is not installed. Run `npm install` before building.');
}

log(`Using ${usingDirectUrl ? 'DIRECT_URL' : 'DATABASE_URL'} for migrations and seeding.`);
log('Applying pending migrations with `prisma migrate deploy`.');
runPrisma(['migrate', 'deploy'], databaseUrl);

log('Generating Prisma Client.');
runPrisma(['generate'], databaseUrl);

if (!flag('SEED_ON_DEPLOY', true)) {
  log('SEED_ON_DEPLOY is disabled — skipping seed.');
  process.exit(0);
}

log('Seeding baseline data (idempotent; existing records are kept).');
const seed = spawnSync(process.execPath, [path.join(ROOT, 'prisma', 'seed.mjs')], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, DATABASE_URL: databaseUrl, DIRECT_URL: databaseUrl },
});
if (seed.error) fail(`Could not start the seed: ${seed.error.message}`);
if (seed.status !== 0) fail(`The seed failed with exit code ${seed.status}.`);

log('Database bootstrap complete.');
