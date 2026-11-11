import test from 'node:test';
import assert from 'node:assert/strict';

process.env.VERCEL = '1';
const { isPooledConnectionString, resolveRuntimeUrl } = await import('../src/lib/prisma.js');

test.afterEach(() => {
  delete process.env.PRISMA_CONNECTION_LIMIT;
  delete process.env.PRISMA_POOL_TIMEOUT;
});

test('detects transaction-mode poolers by host and port', () => {
  assert.equal(
    isPooledConnectionString('postgresql://user:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'),
    true,
  );
  assert.equal(
    isPooledConnectionString('postgresql://user:pass@ep-cool-1-pooler.eu-central-1.aws.neon.tech/neondb'),
    true,
  );
  assert.equal(isPooledConnectionString('postgresql://user:pass@db.example.com:6432/app'), true);
  assert.equal(isPooledConnectionString('postgresql://user:pass@db.example.com:5432/app'), false);
  assert.equal(isPooledConnectionString('prisma+postgres://accelerate.prisma-data.net/?api_key=x'), true);
  assert.equal(isPooledConnectionString('not a url'), false);
});

test('caps the runtime pool and enables pgbouncer on pooled connections', () => {
  const resolved = new URL(
    resolveRuntimeUrl('postgresql://user:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'),
  );
  assert.equal(resolved.searchParams.get('connection_limit'), '1');
  assert.equal(resolved.searchParams.get('pool_timeout'), '10');
  assert.equal(resolved.searchParams.get('pgbouncer'), 'true');
  assert.equal(resolved.pathname, '/postgres');
  assert.equal(resolved.username, 'user');
});

test('caps the runtime pool on direct connections too', () => {
  const resolved = new URL(resolveRuntimeUrl('postgresql://user:pass@db.example.com:5432/app'));
  assert.equal(resolved.searchParams.get('connection_limit'), '1');
  assert.equal(resolved.searchParams.get('pool_timeout'), '10');
  assert.equal(resolved.searchParams.has('pgbouncer'), false);
});

test('respects parameters already present on the connection string', () => {
  const resolved = new URL(
    resolveRuntimeUrl(
      'postgresql://user:pass@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?connection_limit=7&pool_timeout=30&pgbouncer=false',
    ),
  );
  assert.equal(resolved.searchParams.get('connection_limit'), '7');
  assert.equal(resolved.searchParams.get('pool_timeout'), '30');
  assert.equal(resolved.searchParams.get('pgbouncer'), 'false');
});

test('honours explicit pool limit environment overrides', () => {
  process.env.PRISMA_CONNECTION_LIMIT = '3';
  process.env.PRISMA_POOL_TIMEOUT = '20';
  const resolved = new URL(resolveRuntimeUrl('postgresql://user:pass@db.example.com:5432/app'));
  assert.equal(resolved.searchParams.get('connection_limit'), '3');
  assert.equal(resolved.searchParams.get('pool_timeout'), '20');
});

test('leaves Accelerate and malformed values untouched', () => {
  const accelerate = 'prisma+postgres://accelerate.prisma-data.net/?api_key=abc';
  assert.equal(resolveRuntimeUrl(accelerate), accelerate);
  assert.equal(resolveRuntimeUrl('not a url'), 'not a url');
  assert.equal(resolveRuntimeUrl(''), '');
  assert.equal(resolveRuntimeUrl(undefined), undefined);
});
