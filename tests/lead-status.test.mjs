import test from 'node:test';
import assert from 'node:assert/strict';
import { advanceLeadStatus } from '../src/lib/lead-status.js';

test('pending booking keeps a manual follow-up status', () => {
  assert.equal(advanceLeadStatus('FOLLOW_UP', 'PENDING'), null);
});

test('confirmation advances a new lead to contacted', () => {
  assert.equal(advanceLeadStatus('NEW', 'CONFIRMED'), 'CONTACTED');
  assert.equal(advanceLeadStatus('CONTACTED', 'CONFIRMED'), null);
});

test('work in progress advances a lead to qualified without downgrading', () => {
  assert.equal(advanceLeadStatus('CONTACTED', 'IN_PROGRESS'), 'QUALIFIED');
  assert.equal(advanceLeadStatus('QUALIFIED', 'CONFIRMED'), null);
});

test('completion converts the lead', () => {
  assert.equal(advanceLeadStatus('QUALIFIED', 'COMPLETED'), 'CONVERTED');
  assert.equal(advanceLeadStatus('FOLLOW_UP', 'COMPLETED'), 'CONVERTED');
});

test('cancellation loses the lead but never overwrites a conversion', () => {
  assert.equal(advanceLeadStatus('CONTACTED', 'CANCELLED'), 'LOST');
  assert.equal(advanceLeadStatus('CONVERTED', 'CANCELLED'), null);
});
