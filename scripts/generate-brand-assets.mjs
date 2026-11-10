/**
 * Derives favicons, app icons and the default social image from the official logo.
 * The source logo is never modified — all outputs are separate files.
 *
 * Usage: node scripts/generate-brand-assets.mjs
 */
import sharp from 'sharp';
import { mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'public/assets/brand/street-wrenchers-logo.png');
const ICONS = path.join(ROOT, 'public/assets/icons');
const BANNERS = path.join(ROOT, 'public/assets/banners');

const BRAND_ORANGE = '#f26a0d';
const INK = '#08080a';

const roundedMask = (size, radius) => Buffer.from(
  `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${radius}" fill="${INK}"/>
  </svg>`,
);

async function squareIcon(size) {
  const pad = Math.round(size * 0.1);
  const inner = size - pad * 2;
  const logo = await sharp(SRC)
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  return sharp(roundedMask(size, Math.round(size * 0.22)))
    .composite([{ input: logo, top: pad, left: pad }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  await access(SRC);
  await mkdir(ICONS, { recursive: true });
  await mkdir(BANNERS, { recursive: true });

  for (const size of [16, 32, 48, 180, 192, 512]) {
    await sharp(await squareIcon(size)).toFile(path.join(ICONS, `icon-${size}.png`));
  }

  await sharp(await squareIcon(180)).toFile(path.join(ICONS, 'apple-icon.png'));
  await sharp(await squareIcon(512)).toFile(path.join(ROOT, 'src/app/icon.png'));
  await sharp(await squareIcon(180)).toFile(path.join(ROOT, 'src/app/apple-icon.png'));

  const logo = await sharp(SRC).resize(420, 420, { fit: 'contain' }).png().toBuffer();
  const ogSvg = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0d0d10"/>
          <stop offset="60%" stop-color="#08080a"/>
          <stop offset="100%" stop-color="#120c08"/>
        </linearGradient>
        <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="${BRAND_ORANGE}"/>
          <stop offset="100%" stop-color="${BRAND_ORANGE}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bg)"/>
      <rect x="80" y="470" width="1040" height="2" fill="url(#bar)" opacity="0.55"/>
      <text x="80" y="400" font-family="Helvetica, Arial, sans-serif" font-size="64" font-weight="700" fill="#f6f5f2" letter-spacing="8">STREET WRENCHERS</text>
      <text x="82" y="446" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="${BRAND_ORANGE}" letter-spacing="7">PRECISION. PERFORMANCE. RELIABILITY.</text>
      <text x="80" y="566" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#96938d" letter-spacing="2">PREMIUM AUTO CARE — DUBAI, UAE</text>
    </svg>
  `);

  await sharp(ogSvg)
    .composite([{ input: logo, top: 60, left: 720 }])
    .jpeg({ quality: 88 })
    .toFile(path.join(BANNERS, 'og-default.jpg'));

  console.log('Brand assets generated: icons (16–512), apple icon, app icon, og-default.jpg');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
