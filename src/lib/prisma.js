import { Prisma, PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// Serverless instances each own a private Prisma pool, so the per-instance pool
// must stay small or a traffic burst exhausts the PostgreSQL role's connection limit.
const SERVERLESS = Boolean(
  process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.NETLIFY ||
    process.env.FUNCTIONS_WORKER_RUNTIME,
);

const POOLED_HOST_PATTERN = /(^|[.-])pooler[.-]|pgbouncer|proxy/i;
const POOLED_PORTS = new Set(['6432', '6543']);

export function isPooledConnectionString(raw) {
  if (!raw) return false;
  if (raw.startsWith('prisma+postgres://')) return true;
  try {
    const url = new URL(raw);
    return POOLED_HOST_PATTERN.test(url.hostname) || POOLED_PORTS.has(url.port);
  } catch {
    return false;
  }
}

// Adds pool parameters Prisma needs for the current runtime without overriding
// anything the operator already set explicitly on the connection string.
export function resolveRuntimeUrl(raw) {
  if (!raw) return raw;
  if (raw.startsWith('prisma+postgres://')) return raw;

  let url;
  try {
    url = new URL(raw);
  } catch {
    return raw;
  }

  const pooled = isPooledConnectionString(raw);
  const params = url.searchParams;

  if (!params.has('connection_limit')) {
    const configured = process.env.PRISMA_CONNECTION_LIMIT;
    const fallback = SERVERLESS || pooled ? '1' : '5';
    params.set('connection_limit', configured && /^\d+$/.test(configured) ? configured : fallback);
  }

  if (!params.has('pool_timeout')) {
    const configured = process.env.PRISMA_POOL_TIMEOUT;
    params.set('pool_timeout', configured && /^\d+$/.test(configured) ? configured : '10');
  }

  // Transaction-mode poolers (Neon, Supabase etc.) require this so Prisma stops
  // issuing named prepared statements that the pooler cannot route.
  if (pooled && !params.has('pgbouncer')) params.set('pgbouncer', 'true');

  return url.toString();
}

function describeConnectionLimit(url) {
  try {
    return new URL(url).searchParams.get('connection_limit') || 'default';
  } catch {
    return 'default';
  }
}

function createPrismaClient() {
  const url = resolveRuntimeUrl(process.env.DATABASE_URL);

  if (process.env.NODE_ENV === 'production') {
    console.info(
      `[prisma] runtime pool: mode=${isPooledConnectionString(process.env.DATABASE_URL) ? 'pooled' : 'direct'} ` +
        `connection_limit=${describeConnectionLimit(url)}`,
    );
  }

  return new PrismaClient({
    ...(url ? { datasourceUrl: url } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
}

// One client per runtime instance. Cached on globalThis so dev hot reloads and
// repeated module evaluation cannot open a second pool in the same process.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;

const CONNECTION_ERROR_CODES = new Set([
  'P1000', // authentication failed
  'P1001', // cannot reach the database server
  'P1002', // database server timed out
  'P1008', // operation timed out
  'P1010', // access denied for user
  'P1011', // TLS error
  'P1017', // server closed the connection
  'P2024', // timed out fetching a connection from the pool
  'P2028', // transaction API error / timeout
  'P2037', // too many connections for role
]);

export class DatabaseUnavailableError extends Error {
  constructor(message = 'The database is temporarily unavailable.', options) {
    super(message, options);
    this.name = 'DatabaseUnavailableError';
  }
}

export function isDatabaseUnavailable(error) {
  if (error instanceof DatabaseUnavailableError) return true;
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientRustPanicError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return CONNECTION_ERROR_CODES.has(error.code);
  }
  return false;
}
