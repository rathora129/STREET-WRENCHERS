import test from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit, resetRateLimit, resetAllRateLimits } from '../src/lib/rate-limit.js';

test.beforeEach(() => resetAllRateLimits());

test('allows requests up to the limit and blocks the next one', () => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    assert.equal(rateLimit('qa-key', { limit: 3, windowMs: 60_000 }).allowed, true);
  }
  const blocked = rateLimit('qa-key', { limit: 3, windowMs: 60_000 });
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfter > 0);
});

test('buckets are isolated per key', () => {
  rateLimit('ip-a', { limit: 1, windowMs: 60_000 });
  assert.equal(rateLimit('ip-a', { limit: 1, windowMs: 60_000 }).allowed, false);
  assert.equal(rateLimit('ip-b', { limit: 1, windowMs: 60_000 }).allowed, true);
});

test('resetting a key clears its counter', () => {
  rateLimit('reset-me', { limit: 1, windowMs: 60_000 });
  assert.equal(rateLimit('reset-me', { limit: 1, windowMs: 60_000 }).allowed, false);
  resetRateLimit('reset-me');
  assert.equal(rateLimit('reset-me', { limit: 1, windowMs: 60_000 }).allowed, true);
});

test('expired windows allow traffic again', async () => {
  rateLimit('expiring', { limit: 1, windowMs: 5 });
  assert.equal(rateLimit('expiring', { limit: 1, windowMs: 5 }).allowed, false);
  await new Promise((resolve) => setTimeout(resolve, 10));
  assert.equal(rateLimit('expiring', { limit: 1, windowMs: 5 }).allowed, true);
});
