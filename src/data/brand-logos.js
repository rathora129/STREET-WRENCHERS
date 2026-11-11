/**
 * Genuine manufacturer marks used when a brand has no dashboard-uploaded logo.
 * Assets live in /public/assets/brands and are stored as monochrome SVGs so they
 * stay consistent on the dark cards. Dashboard `logo` and `image` values always win.
 */
const BRAND_LOGOS = {
  toyota: '/assets/brands/toyota.svg',
  nissan: '/assets/brands/nissan.svg',
  mitsubishi: '/assets/brands/mitsubishi.svg',
  honda: '/assets/brands/honda.svg',
  hyundai: '/assets/brands/hyundai.svg',
  kia: '/assets/brands/kia.svg',
  ford: '/assets/brands/ford.svg',
  chevrolet: '/assets/brands/chevrolet.svg',
  'mercedes-benz': '/assets/brands/mercedes-benz.svg',
  bmw: '/assets/brands/bmw.svg',
  audi: '/assets/brands/audi.svg',
  volkswagen: '/assets/brands/volkswagen.svg',
  'land-rover': '/assets/brands/land-rover.svg',
  porsche: '/assets/brands/porsche.svg',
  lexus: '/assets/brands/lexus.svg',
  mazda: '/assets/brands/mazda.svg',
  tesla: '/assets/brands/tesla.svg',
  volvo: '/assets/brands/volvo.svg',
  mini: '/assets/brands/mini.svg',
  jeep: '/assets/brands/jeep.svg',
};

export function localBrandLogo(slug) {
  return BRAND_LOGOS[slug] || null;
}

export default BRAND_LOGOS;
