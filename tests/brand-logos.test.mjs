import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import BRAND_LOGOS, { localBrandLogo } from '../src/data/brand-logos.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seedSource = readFileSync(path.join(ROOT, 'src/data/seed-content.js'), 'utf8');
const seededBrands = [...seedSource.matchAll(/name: '([^']+)', slug: '([^']+)', country:/g)].map(
  ([, name, slug]) => ({ name, slug }),
);

test('every seeded brand has a genuine local logo', () => {
  assert.ok(seededBrands.length >= 20, 'expected seeded brand list');
  for (const brand of seededBrands) {
    const logo = localBrandLogo(brand.slug);
    assert.equal(typeof logo, 'string', `${brand.name} (${brand.slug}) has no logo entry`);
    const file = path.join(ROOT, 'public', logo);
    assert.ok(existsSync(file), `${brand.name} logo file missing at ${file}`);
    const svg = readFileSync(file, 'utf8');
    assert.match(svg, /<svg[\s>]/, `${brand.slug}.svg is not a valid SVG`);
  }
});

test('brand logo registry only maps to existing assets', () => {
  for (const [slug, logo] of Object.entries(BRAND_LOGOS)) {
    assert.ok(logo.startsWith('/assets/brands/'), `${slug} should resolve to a local brand asset`);
    assert.ok(existsSync(path.join(ROOT, 'public', logo)), `${slug} points at a missing file`);
  }
});

test('unknown brand slugs fall back to null', () => {
  assert.equal(localBrandLogo('not-a-brand'), null);
  assert.equal(localBrandLogo(), null);
});
