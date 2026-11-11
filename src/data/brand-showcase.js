/**
 * Genuine vehicle photography shown on the All Makes cards when a brand has no
 * dashboard-uploaded `image`. Every asset is a real, freely licensed photograph
 * (CC0 / public domain) sourced from Wikimedia Commons, cropped to 16:10 at
 * 1200×750 and encoded as WebP. Dashboard `image` values always take precedence.
 */
const BRAND_SHOWCASE = {
  toyota: {
    src: '/assets/brands/showcase/toyota.webp',
    alt: 'Toyota Land Cruiser 300 ZX',
    credit: 'TTTNIS / Wikimedia Commons (CC0)',
  },
  nissan: {
    src: '/assets/brands/showcase/nissan.webp',
    alt: 'Nissan Patrol Y62',
    credit: 'OSX / Wikimedia Commons (public domain)',
  },
  mitsubishi: {
    src: '/assets/brands/showcase/mitsubishi.webp',
    alt: 'Mitsubishi Pajero Exceed',
    credit: 'TTTNIS / Wikimedia Commons (public domain)',
  },
  honda: {
    src: '/assets/brands/showcase/honda.webp',
    alt: 'Honda Vezel Hybrid',
    credit: 'TTTNIS / Wikimedia Commons (CC0)',
  },
  hyundai: {
    src: '/assets/brands/showcase/hyundai.webp',
    alt: 'Hyundai Santa Fe',
    credit: 'crash71100 / Wikimedia Commons (CC0)',
  },
  kia: {
    src: '/assets/brands/showcase/kia.webp',
    alt: 'Kia Sorento',
    credit: 'crash71100 / Wikimedia Commons (CC0)',
  },
  ford: {
    src: '/assets/brands/showcase/ford.webp',
    alt: 'Ford Explorer ST',
    credit: 'HJUdall / Wikimedia Commons (CC0)',
  },
  chevrolet: {
    src: '/assets/brands/showcase/chevrolet.webp',
    alt: 'Chevrolet Tahoe RST',
    credit: 'HJUdall / Wikimedia Commons (CC0)',
  },
  'mercedes-benz': {
    src: '/assets/brands/showcase/mercedes-benz.webp',
    alt: 'Mercedes-Benz GLE 450d 4MATIC Coupé',
    credit: 'Oq10pass / Wikimedia Commons (CC0)',
  },
  bmw: {
    src: '/assets/brands/showcase/bmw.webp',
    alt: 'BMW X5 M50d (G05)',
    credit: 'Charles / Wikimedia Commons (CC0)',
  },
  audi: {
    src: '/assets/brands/showcase/audi.webp',
    alt: 'Audi Q5 quattro S Line',
    credit: 'HJUdall / Wikimedia Commons (CC0)',
  },
  volkswagen: {
    src: '/assets/brands/showcase/volkswagen.webp',
    alt: 'Volkswagen Golf GTi',
    credit: 'crash71100 / Wikimedia Commons (CC0)',
  },
  'land-rover': {
    src: '/assets/brands/showcase/land-rover.webp',
    alt: 'Range Rover Sport',
    credit: 'Guillaume Vachey / Wikimedia Commons (CC0)',
  },
  porsche: {
    src: '/assets/brands/showcase/porsche.webp',
    alt: 'Porsche Macan',
    credit: 'Wikimedia Commons (CC0)',
  },
  lexus: {
    src: '/assets/brands/showcase/lexus.webp',
    alt: 'Lexus ES (XZ10)',
    credit: 'Wikimedia Commons (CC0)',
  },
  mazda: {
    src: '/assets/brands/showcase/mazda.webp',
    alt: 'Mazda 6',
    credit: 'crash71100 / Wikimedia Commons (CC0)',
  },
  tesla: {
    src: '/assets/brands/showcase/tesla.webp',
    alt: 'Tesla Model Y Long Range',
    credit: 'HJUdall / Wikimedia Commons (CC0)',
  },
  volvo: {
    src: '/assets/brands/showcase/volvo.webp',
    alt: 'Volvo XC60 T5 Momentum',
    credit: 'HJUdall / Wikimedia Commons (CC0)',
  },
  mini: {
    src: '/assets/brands/showcase/mini.webp',
    alt: 'MINI Cooper S F56',
    credit: 'Retired electrician / Wikimedia Commons (CC0)',
  },
  jeep: {
    src: '/assets/brands/showcase/jeep.webp',
    alt: 'Jeep Wrangler Rubicon 4xe',
    credit: 'The White House / Wikimedia Commons (public domain)',
  },
};

export function brandShowcase(slug) {
  return BRAND_SHOWCASE[slug] || null;
}

export default BRAND_SHOWCASE;
