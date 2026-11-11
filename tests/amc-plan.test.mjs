import test from 'node:test';
import assert from 'node:assert/strict';
import { amcPlanSchema } from '../src/lib/validation/resources.js';

const base = {
  name: 'Essential Care',
  description: 'Scheduled maintenance cover for one year of city driving.',
  price: 1299,
  durationMonths: 12,
};

test('AMC plan accepts keywords as an array', () => {
  const result = amcPlanSchema.safeParse({ ...base, keywords: ['maintenance', 'dubai'] });
  assert.equal(result.success, true);
  assert.deepEqual(result.data.keywords, ['maintenance', 'dubai']);
});

test('AMC plan accepts keywords as a comma-separated string', () => {
  const result = amcPlanSchema.safeParse({ ...base, keywords: ' maintenance , dubai , ' });
  assert.equal(result.success, true);
  assert.deepEqual(result.data.keywords, ['maintenance', 'dubai']);
});

test('AMC plan defaults keywords to an empty array', () => {
  const result = amcPlanSchema.safeParse(base);
  assert.equal(result.success, true);
  assert.deepEqual(result.data.keywords, []);
});

test('AMC plan accepts brand and model identifier lists', () => {
  const result = amcPlanSchema.safeParse({ ...base, brandIds: 'brand_1, brand_2', modelIds: ['model_1'] });
  assert.equal(result.success, true);
  assert.deepEqual(result.data.brandIds, ['brand_1', 'brand_2']);
  assert.deepEqual(result.data.modelIds, ['model_1']);
});

test('AMC plan coerces a numeric price and rejects a missing description', () => {
  const valid = amcPlanSchema.safeParse({ ...base, price: '1499' });
  assert.equal(valid.success, true);
  assert.equal(valid.data.price, 1499);

  const invalid = amcPlanSchema.safeParse({ ...base, description: '' });
  assert.equal(invalid.success, false);
});
