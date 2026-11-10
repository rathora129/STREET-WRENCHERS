// Reference catalogue and page content used by the idempotent seed.
// Prices and plan coverage marked as reference information are editable in the dashboard.

export const categories = [
  { name: 'General Maintenance', slug: 'general-maintenance', icon: 'wrench', description: 'Scheduled servicing and routine upkeep.', sortOrder: 1 },
  { name: 'Mechanical Repairs', slug: 'mechanical-repairs', icon: 'cog', description: 'Diagnosis and repair of mechanical systems.', sortOrder: 2 },
  { name: 'Engine Services', slug: 'engine-services', icon: 'gauge', description: 'Engine diagnostics, repair and cooling.', sortOrder: 3 },
  { name: 'AC Services', slug: 'ac-services', icon: 'snowflake', description: 'Cooling performance, leaks and servicing.', sortOrder: 4 },
  { name: 'Electrical Services', slug: 'electrical-services', icon: 'zap', description: 'Starting, charging, lighting and electronics.', sortOrder: 5 },
  { name: 'Battery Services', slug: 'battery-services', icon: 'battery-charging', description: 'Testing, replacement and charging checks.', sortOrder: 6 },
  { name: 'Brake Services', slug: 'brake-services', icon: 'disc', description: 'Pads, discs, fluid and ABS diagnostics.', sortOrder: 7 },
  { name: 'Car Wash', slug: 'car-wash', icon: 'droplets', description: 'Exterior and interior cleaning.', sortOrder: 8 },
  { name: 'Detailing', slug: 'detailing', icon: 'sparkles', description: 'Deep cleaning and paint correction.', sortOrder: 9 },
  { name: 'PPF', slug: 'ppf', icon: 'shield', description: 'Paint protection film installation.', sortOrder: 10 },
  { name: 'Ceramic Coating', slug: 'ceramic-coating', icon: 'gem', description: 'Long-term paint protection.', sortOrder: 11 },
  { name: 'Denting & Painting', slug: 'denting-painting', icon: 'paintbrush', description: 'Dent removal and refinishing.', sortOrder: 12 },
  { name: 'EV Services', slug: 'ev-services', icon: 'plug-zap', description: 'Electric-vehicle maintenance and checks.', sortOrder: 13 },
];

export const services = [
  {
    name: 'Minor Service',
    slug: 'minor-service',
    categorySlug: 'general-maintenance',
    price: 250,
    duration: '',
    image: '/assets/images/gallery/workshop-lift.jpg',
    shortDescription:
      'Scheduled oil and filter service with a multi-point inspection to keep your car healthy between major intervals.',
    description:
      'Regular maintenance is the simplest way to protect reliability. Our minor service covers the essentials — fresh engine oil, a new oil filter and a structured inspection of the systems that work hardest in Dubai heat and stop-start traffic.\n\nEvery visit finishes with a written summary of what was checked and anything we recommend for the next interval. If something needs attention, you see it and approve it before any additional work is booked.',
    inclusions: [
      'Engine oil replacement',
      'Oil filter replacement',
      'Fluid level top-up',
      'Tyre pressure and condition check',
      'Multi-point visual inspection',
      'Battery health check',
      'Service reminder reset where applicable',
      'Written service summary',
    ],
    benefits: [
      'Keeps the engine protected between major intervals',
      'Catches wear items early',
      'Clear record of work completed',
      'Fixed starting price',
    ],
    isFeatured: true,
    sortOrder: 1,
    metaTitle: 'Minor Car Service in Dubai',
    metaDescription:
      'Minor car service in Dubai from AED 250 — engine oil and filter change, fluid top-up and a multi-point inspection at Street Wrenchers.',
  },
  {
    name: 'Major Service',
    slug: 'major-service',
    categorySlug: 'general-maintenance',
    price: 450,
    duration: '',
    image: '/assets/images/gallery/workshop-lift.jpg',
    shortDescription:
      'A deeper scheduled service covering filters, fluids, brakes, suspension and a diagnostic check.',
    description:
      'A major service is the full scheduled checkpoint for your car. Alongside engine oil and filters, we inspect the brake system, suspension, steering, cooling and battery, and scan for stored fault codes.\n\nThe aim is to find issues before they become breakdowns — and to give you a clear, prioritised list rather than an open-ended repair bill. Any work beyond the package is quoted for approval first.',
    inclusions: [
      'Engine oil and oil filter replacement',
      'Air filter replacement',
      'Cabin filter replacement',
      'Brake inspection',
      'Suspension and steering check',
      'Cooling system check',
      'Battery and charging test',
      'Diagnostic fault-code scan',
      'Fluid top-up',
      'Multi-point inspection',
    ],
    benefits: [
      'One comprehensive scheduled checkpoint',
      'Early detection of wear and faults',
      'Better protection for longer trips',
      'Prioritised recommendations',
    ],
    isFeatured: true,
    sortOrder: 2,
    metaTitle: 'Major Car Service in Dubai',
    metaDescription:
      'Major car service in Dubai from AED 450 — oil and filters, brake and suspension checks, battery test and diagnostic scan at Street Wrenchers.',
  },
  {
    name: 'Car Wash & Detailing',
    slug: 'car-wash-detailing',
    categorySlug: 'detailing',
    price: null,
    image: '/assets/images/gallery/interior-detailing.jpg',
    shortDescription:
      'Hand wash, interior detailing and paint decontamination for a finish that holds up in Dubai conditions.',
    description:
      'Dust, sun and daily commuting take a visible toll on paint and interiors. Our wash and detailing service starts with a careful hand wash and moves through interior cleaning, paint decontamination and — where the package calls for it — machine polishing.\n\nEvery detail is quoted after we inspect the vehicle, because paint condition and interior wear vary so much from car to car. You will know exactly which stages are included before work begins.',
    inclusions: [
      'Exterior hand wash',
      'Wheel and tyre cleaning',
      'Interior vacuum',
      'Dashboard and trim wipe-down',
      'Interior and exterior glass cleaning',
      'Paint decontamination on detail packages',
      'Machine polish on selected packages',
      'Final inspection',
    ],
    benefits: [
      'Protects paint and interior surfaces',
      'Removes embedded dust and contamination',
      'Improves resale presentation',
      'Packages tailored to the vehicle',
    ],
    isFeatured: true,
    sortOrder: 3,
    metaTitle: 'Car Wash & Detailing in Dubai',
    metaDescription:
      'Car wash and detailing in Dubai — hand washing, interior detailing and paint decontamination at Street Wrenchers. Quoted after inspection.',
  },
  {
    name: 'Engine Repair',
    slug: 'engine-repair',
    categorySlug: 'engine-services',
    price: null,
    image: '/assets/images/hero/engine.jpg',
    shortDescription:
      'Diagnostics-led engine repair for warning lights, overheating, oil leaks and performance loss.',
    description:
      'Engine problems rarely start as a breakdown. A warning light, a new noise, a coolant level that keeps dropping or a car that feels flat are all signals worth investigating early.\n\nWe begin with diagnostics and a physical inspection, then explain what we found and what the repair involves. You receive a quote before work starts, and we only replace parts when the diagnosis supports it.',
    inclusions: [
      'Diagnostic fault-code scan',
      'Compression and leak testing where required',
      'Cooling system inspection',
      'Oil leak trace',
      'Repair plan and written quote',
      'Post-repair road test',
    ],
    benefits: [
      'Diagnosis before parts',
      'Clear repair scope',
      'Early intervention on developing faults',
      'Post-repair verification',
    ],
    isFeatured: false,
    sortOrder: 4,
    metaTitle: 'Engine Repair in Dubai',
    metaDescription:
      'Engine diagnostics and repair in Dubai for warning lights, overheating, oil leaks and performance loss at Street Wrenchers.',
  },
  {
    name: 'AC Repair',
    slug: 'ac-repair',
    categorySlug: 'ac-services',
    price: null,
    image: '/assets/images/gallery/ac-service.jpg',
    shortDescription:
      'Cooling performance testing, leak detection and AC servicing for Dubai summers.',
    description:
      'An air-conditioning system that is merely “cold” is not necessarily working correctly. We measure vent temperature and system pressures, check for leaks and inspect the cabin filter, compressor and drive components.\n\nDepending on what we find, the fix may be a service and recharge or a component repair. Either way, the diagnosis and quote come first.',
    inclusions: [
      'Vent temperature test',
      'Refrigerant pressure check',
      'Leak detection',
      'Cabin filter inspection',
      'Compressor and clutch check',
      'System recharge where required',
    ],
    benefits: [
      'Restores cooling performance',
      'Finds leaks instead of repeatedly topping up',
      'Protects the compressor',
      'Cleaner cabin air',
    ],
    isFeatured: true,
    sortOrder: 5,
    metaTitle: 'Car AC Repair in Dubai',
    metaDescription:
      'Car AC repair and servicing in Dubai — cooling tests, leak detection and refrigerant service at Street Wrenchers.',
  },
  {
    name: 'Battery Services',
    slug: 'battery-services',
    categorySlug: 'battery-services',
    price: null,
    image: '/assets/images/gallery/workshop-lift.jpg',
    shortDescription:
      'Battery testing, terminal care, replacement and charging-system checks.',
    description:
      'Heat is as hard on batteries as cold. A slow crank or a warning light can point to the battery, the charging system or a parasitic drain — so we test the whole circuit rather than replacing the battery by default.\n\nIf a replacement is needed, we fit a battery suited to your vehicle and dispose of the old one responsibly.',
    inclusions: [
      'Battery health and load test',
      'Terminal cleaning and protection',
      'Alternator output check',
      'Battery replacement where required',
      'Old battery disposal',
    ],
    benefits: [
      'Avoids unnecessary replacements',
      'Prevents avoidable no-starts',
      'Confirms charging-system health',
      'Correct battery specification',
    ],
    isFeatured: false,
    sortOrder: 6,
    metaTitle: 'Car Battery Services in Dubai',
    metaDescription:
      'Car battery testing and replacement in Dubai — load tests, charging-system checks and terminal care at Street Wrenchers.',
  },
  {
    name: 'Brake Services',
    slug: 'brake-services',
    categorySlug: 'brake-services',
    price: null,
    image: '/assets/images/gallery/brake-service.jpg',
    shortDescription:
      'Brake inspection, pad and disc replacement, fluid service and ABS diagnostics.',
    description:
      'Brakes are a safety system, not a consumable to postpone. We measure pad and disc wear, inspect calipers and lines, test the fluid and scan ABS faults before recommending anything.\n\nReplacement parts are quoted in advance, and every brake job ends with a road test.',
    inclusions: [
      'Pad thickness measurement',
      'Disc condition assessment',
      'Brake fluid test',
      'Caliper and line inspection',
      'ABS diagnostic scan',
      'Replacement parts as approved',
      'Road test',
    ],
    benefits: [
      'Confident stopping performance',
      'Even wear and balanced braking',
      'Safety issues caught early',
      'No unapproved parts',
    ],
    isFeatured: true,
    sortOrder: 7,
    metaTitle: 'Brake Repair in Dubai',
    metaDescription:
      'Brake inspection and repair in Dubai — pads, discs, fluid and ABS diagnostics at Street Wrenchers.',
  },
  {
    name: 'Electrical Services',
    slug: 'electrical-services',
    categorySlug: 'electrical-services',
    price: null,
    image: '/assets/images/hero/engine.jpg',
    shortDescription:
      'Diagnostics and repair for warning lights, starting faults, battery drain and electrical components.',
    description:
      'Electrical faults can be intermittent and frustrating. We use fault-code data, measured circuit tests and component checks to isolate the cause instead of guessing at parts.\n\nFrom starting and charging problems to lighting, sensors and drains, you receive a diagnosis and quote before repair work begins.',
    inclusions: [
      'Diagnostic fault-code scan',
      'Parasitic drain testing',
      'Alternator and starter testing',
      'Lighting and sensor checks',
      'Wiring and connector inspection',
      'Repair quote before work',
    ],
    benefits: [
      'Fault isolation rather than guesswork',
      'Fewer repeat visits',
      'Safe electrical repairs',
      'Clear explanation of the cause',
    ],
    isFeatured: false,
    sortOrder: 8,
    metaTitle: 'Car Electrical Repair in Dubai',
    metaDescription:
      'Car electrical diagnostics and repair in Dubai for warning lights, starting faults and battery drain at Street Wrenchers.',
  },
  {
    name: 'Denting & Painting',
    slug: 'denting-painting',
    categorySlug: 'denting-painting',
    price: null,
    image: '/assets/images/gallery/paint-repair.jpg',
    shortDescription:
      'Dent removal, panel preparation and colour-matched refinishing for a clean, consistent finish.',
    description:
      'Panel damage is assessed before any work is promised. We look at the dent, the paint and the panel structure, then agree the repair approach and quote with you.\n\nRepairs include panel preparation and colour-matched refinishing, followed by a final inspection in daylight so the finish is checked the way you will see it.',
    inclusions: [
      'Damage assessment',
      'Dent repair',
      'Panel preparation',
      'Colour matching',
      'Primer, paint and clear application',
      'Final polish and quality check',
    ],
    benefits: [
      'Restores appearance after damage',
      'Colour-matched finish',
      'Quote before work',
      'Careful final inspection',
    ],
    isFeatured: false,
    sortOrder: 9,
    metaTitle: 'Denting & Painting in Dubai',
    metaDescription:
      'Dent removal and car painting in Dubai — panel repair, colour matching and refinishing at Street Wrenchers.',
  },
  {
    name: 'PPF & Ceramic Coating',
    slug: 'ppf-ceramic-coating',
    categorySlug: 'ppf',
    price: null,
    image: '/assets/images/gallery/ceramic-coating.jpg',
    shortDescription:
      'Paint protection film and ceramic coating packages that protect against sun, sand and daily wear.',
    description:
      'Dubai is demanding on paint: strong sun, fine sand and constant road debris. Paint protection film absorbs impact from stone chips, while ceramic coating adds a hard, hydrophobic layer that makes washing easier and slows contamination.\n\nBoth start with proper paint preparation. We inspect the vehicle, correct what is needed and quote the package before installation. Aftercare guidance is provided at handover.',
    inclusions: [
      'Paint inspection and decontamination',
      'Panel wipe and surface preparation',
      'Paint protection film installation on selected packages',
      'Ceramic coating application on selected packages',
      'Curing guidance',
      'Aftercare advice',
    ],
    benefits: [
      'Protection from stone chips and sand',
      'Easier washing and less contamination',
      'Enhanced gloss and depth',
      'Longer-lasting paint finish',
    ],
    isFeatured: true,
    sortOrder: 10,
    metaTitle: 'PPF & Ceramic Coating in Dubai',
    metaDescription:
      'Paint protection film and ceramic coating in Dubai — paint preparation, installation and aftercare at Street Wrenchers.',
  },
  {
    name: 'EV Services',
    slug: 'ev-services',
    categorySlug: 'ev-services',
    price: null,
    image: '/assets/images/gallery/ev-charging.jpg',
    shortDescription:
      'EV-specific maintenance covering cabin systems, brakes, tyres, fluids and charging-system checks.',
    description:
      'Electric vehicles need less routine fluid work, but they still need structured care. Heat management, brake condition, tyre wear and charging hardware all matter — particularly in this climate.\n\nWe carry out EV-appropriate inspections and maintenance, and we confirm the specific scope for your model when you book.',
    inclusions: [
      'High-voltage system visual inspection',
      'Cabin filter replacement',
      'Brake inspection',
      'Tyre and alignment check',
      'Cooling system check',
      'Charging port and cable inspection',
      'Fault-code scan where supported',
    ],
    benefits: [
      'Maintains efficiency and safety',
      'Protects tyres and brakes',
      'Keeps charging reliable',
      'Model-specific scope confirmed first',
    ],
    isFeatured: false,
    sortOrder: 11,
    metaTitle: 'EV Servicing in Dubai',
    metaDescription:
      'Electric vehicle servicing in Dubai — cabin, brake, tyre, cooling and charging-system checks at Street Wrenchers.',
  },
];

export const packages = [
  {
    serviceSlug: 'minor-service',
    name: 'Minor Service — Essential',
    slug: 'minor-service-essential',
    tier: 'MINOR',
    price: 250,
    priceNote: 'Starting price',
    description: 'The essential scheduled service for everyday driving.',
    inclusions: [
      'Engine oil replacement',
      'Oil filter replacement',
      'Fluid top-up',
      'Tyre pressure check',
      'Multi-point inspection',
      'Battery health check',
    ],
    exclusions: ['Additional repairs identified during inspection', 'Parts not listed above'],
    isFeatured: true,
    sortOrder: 1,
  },
  {
    serviceSlug: 'major-service',
    name: 'Major Service — Comprehensive',
    slug: 'major-service-comprehensive',
    tier: 'MAJOR',
    price: 450,
    priceNote: 'Starting price',
    description: 'The full scheduled checkpoint with filters, inspection and diagnostics.',
    inclusions: [
      'Engine oil and oil filter replacement',
      'Air filter replacement',
      'Cabin filter replacement',
      'Brake inspection',
      'Suspension and steering check',
      'Battery and charging test',
      'Diagnostic scan',
      'Multi-point inspection',
    ],
    exclusions: ['Additional repairs identified during inspection', 'Parts not listed above'],
    isFeatured: true,
    sortOrder: 2,
  },
];

export const amcPlans = [
  {
    name: 'Lite',
    slug: 'lite',
    tagline: 'Routine care for everyday driving',
    description:
      'An annual plan built around scheduled minor servicing and a structured vehicle inspection. Final coverage is confirmed with you before purchase.',
    price: 1499,
    billingPeriod: 'YEAR',
    durationMonths: 12,
    priceNote: 'Reference plan — coverage confirmed at enquiry',
    inclusions: [
      'Scheduled minor service',
      'Multi-point vehicle inspection',
      'Fluid top-ups',
      'Priority booking',
      'Service reminders',
    ],
    exclusions: ['Accident damage', 'Wear-and-tear parts outside scheduled service', 'Major mechanical repairs'],
    benefits: ['One predictable annual cost', 'Priority booking', 'Service history record'],
    sortOrder: 1,
  },
  {
    name: 'Standard',
    slug: 'standard',
    tagline: 'Minor and major servicing covered',
    description:
      'Adds major servicing and broader inspections to the routine-care plan. Final coverage is confirmed with you before purchase.',
    price: 2499,
    billingPeriod: 'YEAR',
    durationMonths: 12,
    priceNote: 'Reference plan — coverage confirmed at enquiry',
    inclusions: [
      'Scheduled minor service',
      'Scheduled major service',
      'Brake inspection',
      'AC performance check',
      'Battery health check',
      'Multi-point vehicle inspection',
      'Priority booking',
      'Service reminders',
    ],
    exclusions: ['Accident damage', 'Wear-and-tear parts outside scheduled service', 'Major mechanical repairs'],
    benefits: ['Covers both scheduled service types', 'Priority booking', 'Service history record'],
    isFeatured: true,
    sortOrder: 2,
  },
  {
    name: 'Premium',
    slug: 'premium',
    tagline: 'The most complete scheduled-care plan',
    description:
      'Our broadest scheduled-care structure with diagnostics and additional fluid services. Final coverage is confirmed with you before purchase.',
    price: 4499,
    billingPeriod: 'YEAR',
    durationMonths: 12,
    priceNote: 'Reference plan — coverage confirmed at enquiry',
    inclusions: [
      'Scheduled minor service',
      'Scheduled major service',
      'Comprehensive diagnostic scans',
      'Brake fluid service',
      'Coolant service',
      'Brake inspection',
      'AC performance check',
      'Battery health check',
      'Priority booking',
      'Dedicated account contact',
    ],
    exclusions: ['Accident damage', 'Wear-and-tear parts outside scheduled service', 'Major mechanical repairs'],
    benefits: ['Broadest scheduled coverage', 'Priority booking', 'Dedicated contact'],
    sortOrder: 3,
  },
];

const models = (brandSlug, list) =>
  list.map((name, index) => ({
    brandSlug,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    fuelTypes: brandSlug === 'tesla' ? ['Electric'] : ['Petrol'],
    sortOrder: index,
  }));

export const brands = [
  { name: 'Toyota', slug: 'toyota', country: 'Japan', isFeatured: true, sortOrder: 1 },
  { name: 'Nissan', slug: 'nissan', country: 'Japan', isFeatured: true, sortOrder: 2 },
  { name: 'Mitsubishi', slug: 'mitsubishi', country: 'Japan', isFeatured: true, sortOrder: 3 },
  { name: 'Honda', slug: 'honda', country: 'Japan', isFeatured: true, sortOrder: 4 },
  { name: 'Hyundai', slug: 'hyundai', country: 'South Korea', isFeatured: true, sortOrder: 5 },
  { name: 'Kia', slug: 'kia', country: 'South Korea', isFeatured: true, sortOrder: 6 },
  { name: 'Ford', slug: 'ford', country: 'United States', isFeatured: true, sortOrder: 7 },
  { name: 'Chevrolet', slug: 'chevrolet', country: 'United States', isFeatured: true, sortOrder: 8 },
  { name: 'Mercedes-Benz', slug: 'mercedes-benz', country: 'Germany', sortOrder: 9 },
  { name: 'BMW', slug: 'bmw', country: 'Germany', sortOrder: 10 },
  { name: 'Audi', slug: 'audi', country: 'Germany', sortOrder: 11 },
  { name: 'Volkswagen', slug: 'volkswagen', country: 'Germany', sortOrder: 12 },
  { name: 'Land Rover', slug: 'land-rover', country: 'United Kingdom', sortOrder: 13 },
  { name: 'Porsche', slug: 'porsche', country: 'Germany', sortOrder: 14 },
  { name: 'Lexus', slug: 'lexus', country: 'Japan', isFeatured: true, sortOrder: 15 },
  { name: 'Mazda', slug: 'mazda', country: 'Japan', sortOrder: 16 },
  { name: 'Tesla', slug: 'tesla', country: 'United States', sortOrder: 17 },
  { name: 'Volvo', slug: 'volvo', country: 'Sweden', sortOrder: 18 },
  { name: 'MINI', slug: 'mini', country: 'United Kingdom', sortOrder: 19 },
  { name: 'Jeep', slug: 'jeep', country: 'United States', sortOrder: 20 },
];

export const vehicleModels = [
  ...models('toyota', ['Corolla', 'Camry', 'Land Cruiser', 'Prado', 'RAV4', 'Yaris']),
  ...models('nissan', ['Altima', 'Patrol', 'Sunny', 'X-Trail', 'Kicks']),
  ...models('mitsubishi', ['Pajero', 'Lancer', 'Attrage', 'Xpander']),
  ...models('honda', ['Civic', 'Accord', 'CR-V', 'City']),
  ...models('hyundai', ['Elantra', 'Tucson', 'Santa Fe', 'Accent']),
  ...models('kia', ['Sportage', 'Sorento', 'Cerato', 'Seltos']),
  ...models('ford', ['Explorer', 'Edge', 'F-150', 'Mustang']),
  ...models('chevrolet', ['Tahoe', 'Traverse', 'Silverado', 'Captiva']),
  ...models('mercedes-benz', ['C-Class', 'E-Class', 'GLC', 'GLE']),
  ...models('bmw', ['3 Series', '5 Series', 'X3', 'X5']),
  ...models('audi', ['A4', 'A6', 'Q5', 'Q7']),
  ...models('volkswagen', ['Golf', 'Tiguan', 'Passat']),
  ...models('land-rover', ['Range Rover', 'Discovery', 'Defender']),
  ...models('porsche', ['Cayenne', 'Macan', '911']),
  ...models('lexus', ['ES', 'RX', 'LX', 'NX']),
  ...models('mazda', ['Mazda 3', 'CX-5', 'CX-9']),
  ...models('tesla', ['Model 3', 'Model Y', 'Model S', 'Model X']),
  ...models('volvo', ['XC60', 'XC90', 'S60']),
  ...models('mini', ['Cooper', 'Countryman']),
  ...models('jeep', ['Wrangler', 'Grand Cherokee', 'Compass']),
];

export const banners = [
  {
    title: 'Precision care for every kilometre.',
    subtitle:
      'Scheduled maintenance, diagnostics and repair for every make and model on Dubai roads.',
    image: '/assets/images/hero/workshop.jpg',
    ctaLabel: 'Book a service',
    ctaHref: '/book',
    sortOrder: 1,
  },
  {
    title: 'Dubai is hard on paint and interiors.',
    subtitle:
      'Detailing, paint protection film and ceramic coating that protect the finish through sun, sand and daily driving.',
    image: '/assets/images/hero/detailing.jpg',
    ctaLabel: 'Explore detailing',
    ctaHref: '/services/car-wash-detailing',
    sortOrder: 2,
  },
  {
    title: 'Keep your car ahead of its service interval.',
    subtitle:
      'Annual maintenance plans with scheduled servicing, inspections and priority booking.',
    image: '/assets/images/hero/engine.jpg',
    ctaLabel: 'View AMC plans',
    ctaHref: '/amc',
    sortOrder: 3,
  },
];

export const mediaItems = [
  { url: '/assets/images/hero/workshop.jpg', alt: 'Vehicle raised on a workshop lift in an automotive service bay', folder: 'gallery' },
  { url: '/assets/images/hero/detailing.jpg', alt: 'Machine polishing a dark car panel during paint correction', folder: 'gallery' },
  { url: '/assets/images/hero/engine.jpg', alt: 'Close-up of a clean engine bay', folder: 'gallery' },
  { url: '/assets/images/gallery/workshop-lift.jpg', alt: 'Service bay with a vehicle on a hydraulic lift', folder: 'gallery' },
  { url: '/assets/images/gallery/brake-service.jpg', alt: 'Brake disc and calliper during a brake inspection', folder: 'gallery' },
  { url: '/assets/images/gallery/ceramic-coating.jpg', alt: 'Ceramic coating being applied to a car bonnet', folder: 'gallery' },
  { url: '/assets/images/gallery/ac-service.jpg', alt: 'Air-conditioning service gauges connected to a vehicle', folder: 'gallery' },
  { url: '/assets/images/gallery/ev-charging.jpg', alt: 'Electric vehicle connected to a charging point', folder: 'gallery' },
  { url: '/assets/images/gallery/interior-detailing.jpg', alt: 'Interior detailing of a car cabin', folder: 'gallery' },
  { url: '/assets/images/gallery/paint-repair.jpg', alt: 'Panel preparation during a paint repair', folder: 'gallery' },
];

const legalPrivacy = [
  {
    key: 'overview',
    type: 'TEXT',
    heading: 'Overview',
    body:
      'This policy explains how Street Wrenchers collects, uses and stores information submitted through this website. It applies to bookings, enquiries, AMC requests and general browsing.\n\nBy using the website you agree to the practices described here. If you do not agree, please contact us before submitting personal information.',
  },
  {
    key: 'information-we-collect',
    type: 'TEXT',
    heading: 'Information we collect',
    body:
      'When you book a service or send an enquiry we collect the details you provide: name, phone number, email address, vehicle details, requested service, preferred date and any notes you add. Pickup requests may include an address.\n\nWe also record basic technical information such as the pages you visit, the referring page and campaign parameters (UTM values) where present. If marketing tools such as Google Analytics or Meta Pixel are enabled by the site operator, those tools may set their own cookies.',
  },
  {
    key: 'how-we-use-information',
    type: 'TEXT',
    heading: 'How we use information',
    body:
      'We use your information to respond to enquiries, confirm and deliver bookings, maintain service records, follow up on requests you have made and improve the website.\n\nWe may contact you about the specific booking or enquiry you submitted. Marketing communications are only sent where permitted by applicable law and can be stopped on request.',
  },
  {
    key: 'cookies',
    type: 'TEXT',
    heading: 'Cookies and sessions',
    body:
      'The admin dashboard uses a secure, HTTP-only session cookie. It is required to keep the owner signed in and is not used for advertising.\n\nAnalytics and advertising cookies are only present when the corresponding integrations are configured in the dashboard. You can block cookies in your browser settings, although some features may stop working.',
  },
  {
    key: 'sharing',
    type: 'TEXT',
    heading: 'Sharing and storage',
    body:
      'We do not sell personal information. Data is shared only with service providers needed to run the website — for example hosting, database and media storage providers — and where required by law.\n\nInformation is retained for as long as needed to provide services, maintain records and meet legal obligations.',
  },
  {
    key: 'your-choices',
    type: 'TEXT',
    heading: 'Your choices',
    body:
      'You can request access to, correction of, or deletion of the personal information we hold about you by contacting the team. We may need to verify your identity before acting on a request.\n\nIf you believe your information has been handled incorrectly, contact us first so we can investigate.',
  },
  {
    key: 'contact',
    type: 'TEXT',
    heading: 'Contact',
    body:
      'Street Wrenchers is located in Dubai, United Arab Emirates. Use the contact page to reach the team about privacy questions or requests.',
  },
];

const legalTerms = [
  {
    key: 'using-the-site',
    type: 'TEXT',
    heading: 'Using this website',
    body:
      'This website provides information about Street Wrenchers, its services and its maintenance plans. By using it you agree to these terms.\n\nContent is provided for general information and may be updated without notice. You may not misuse the website, attempt unauthorised access or interfere with its operation.',
  },
  {
    key: 'bookings',
    type: 'TEXT',
    heading: 'Bookings and quotes',
    body:
      'Submitting a booking or enquiry is a request, not a confirmed appointment. A booking is confirmed once the team accepts it and contacts you.\n\nPrices shown on the website are starting or reference prices. The final scope and price are confirmed after inspection, and any additional work is quoted for your approval before it is carried out.',
  },
  {
    key: 'payments',
    type: 'TEXT',
    heading: 'Payments',
    body:
      'Payment is arranged directly with the workshop. This website does not process card payments or store payment credentials.',
  },
  {
    key: 'changes',
    type: 'TEXT',
    heading: 'Rescheduling and cancellation',
    body:
      'To reschedule or cancel, contact the team with your booking reference as early as possible. Availability and any applicable charges are confirmed at the time of the change.',
  },
  {
    key: 'vehicles',
    type: 'TEXT',
    heading: 'Vehicle information and approval',
    body:
      'You are responsible for providing accurate vehicle details when booking, including make, model, year and any modifications relevant to the work.\n\nWork is carried out on the scope you approve. If additional faults are found, we will contact you before proceeding.',
  },
  {
    key: 'intellectual-property',
    type: 'TEXT',
    heading: 'Intellectual property',
    body:
      'The Street Wrenchers name and logo, and the content of this website, may not be copied or used without permission, except as allowed by law.',
  },
  {
    key: 'liability',
    type: 'TEXT',
    heading: 'Liability',
    body:
      'We take reasonable care to keep website information accurate, but we do not guarantee that it is complete or always current. To the extent permitted by law, Street Wrenchers is not liable for losses arising solely from reliance on website content.\n\nNothing in these terms limits rights that cannot be excluded under applicable law.',
  },
  {
    key: 'law',
    type: 'TEXT',
    heading: 'Governing law',
    body:
      'These terms are governed by the laws of the Emirate of Dubai and the applicable federal laws of the United Arab Emirates.',
  },
];

export const pages = [
  {
    slug: 'home',
    title: 'Home',
    isSystem: true,
    template: 'home',
    metaTitle: 'Street Wrenchers — Premium Auto Care in Dubai',
    metaDescription:
      'Multi-brand automotive service centre in Dubai — scheduled servicing, engine and AC repair, brakes, detailing, PPF and annual maintenance plans.',
    sortOrder: 1,
    sections: [
      {
        key: 'hero',
        type: 'HERO',
        eyebrow: 'DUBAI, UAE — MULTI-BRAND AUTO CARE',
        heading: 'Precision care, built around your car.',
        subheading:
          'Scheduled servicing, diagnostics, repair and detailing under one roof — for every make and model on Dubai roads.',
        ctaLabel: 'Book a service',
        ctaHref: '/book',
        secondaryLabel: 'Explore services',
        secondaryHref: '/services',
      },
      {
        key: 'intro',
        type: 'INTRO',
        eyebrow: 'THE WORKSHOP',
        heading: 'Care that matches the way Dubai drives.',
        body:
          'Heat, dust, stop-start traffic and long highway runs put specific demands on a car. Street Wrenchers is set up around that reality: structured inspections, diagnostics before parts, and clear recommendations you can approve before work begins.\n\nWhether it is a scheduled minor service or a problem you cannot quite describe, you deal with one team from booking to handover.',
        image: '/assets/images/hero/workshop.jpg',
        imageAlt: 'Vehicle being inspected in a workshop',
        ctaLabel: 'About the workshop',
        ctaHref: '/about',
      },
      {
        key: 'services',
        type: 'SERVICES',
        eyebrow: 'SERVICES',
        heading: 'One team for the systems that matter.',
        subheading:
          'From routine maintenance to engine diagnostics, AC, brakes, detailing and paint protection.',
        ctaLabel: 'View all services',
        ctaHref: '/services',
      },
      {
        key: 'packages',
        type: 'PACKAGES',
        eyebrow: 'SERVICING',
        heading: 'Minor or major. Start with what your car needs.',
        subheading:
          'Transparent packages with the work listed up front. Anything extra is quoted before it is carried out.',
        ctaLabel: 'See service packages',
        ctaHref: '/services/minor-service',
      },
      {
        key: 'amc',
        type: 'AMC',
        eyebrow: 'ANNUAL MAINTENANCE',
        heading: 'Keep the whole year covered.',
        subheading:
          'Annual maintenance plans for drivers who would rather plan ahead than react.',
        ctaLabel: 'Explore AMC plans',
        ctaHref: '/amc',
      },
      {
        key: 'brands',
        type: 'BRANDS',
        eyebrow: 'ALL MAKES',
        heading: 'The makes Dubai drives.',
        subheading: 'Servicing and repair for mainstream, premium and electric vehicles.',
        ctaLabel: 'View car brands',
        ctaHref: '/brands',
      },
      {
        key: 'why',
        type: 'WHY',
        eyebrow: 'WHY STREET WRENCHERS',
        heading: 'A workshop that explains before it repairs.',
        data: {
          points: [
            { title: 'Diagnostics first', text: 'Fault codes and symptoms are investigated before parts are recommended.' },
            { title: 'Approval before extra work', text: 'If we find something beyond the booked job, you get a quote before work continues.' },
            { title: 'Multi-brand capability', text: 'Routine maintenance through to engine, AC, electrical and brake work.' },
            { title: 'Dubai-specific care', text: 'Service advice shaped around heat, dust and stop-start traffic.' },
            { title: 'One point of contact', text: 'Booking, updates and handover are handled by the same team.' },
            { title: 'Detailing under the same roof', text: 'Mechanical care and cosmetic protection can be handled together.' },
          ],
        },
      },
      {
        key: 'process',
        type: 'PROCESS',
        eyebrow: 'HOW IT WORKS',
        heading: 'How a visit works.',
        data: {
          steps: [
            { step: '01', title: 'Book', text: 'Choose your vehicle, service and preferred time online or by phone.' },
            { step: '02', title: 'Inspect & confirm', text: 'We assess the vehicle and confirm the scope and price before starting.' },
            { step: '03', title: 'Service', text: 'The approved work is carried out and anything unexpected is reported to you.' },
            { step: '04', title: 'Handover', text: 'You receive a clear summary of what was completed and what to watch next.' },
          ],
        },
      },
      {
        key: 'gallery',
        type: 'GALLERY',
        eyebrow: 'GALLERY',
        heading: 'A closer look at the work.',
        subheading: 'Selected views from the workshop and detailing bay.',
        ctaLabel: 'Open gallery',
        ctaHref: '/gallery',
      },
      {
        key: 'testimonials',
        type: 'TESTIMONIALS',
        eyebrow: 'REVIEWS',
        heading: 'What drivers say.',
        subheading: 'Verified customer reviews are published here as they are added.',
      },
      {
        key: 'rental',
        type: 'MODULE_PROMO',
        eyebrow: 'COMING SOON',
        data: { module: 'CAR_RENTAL' },
      },
      {
        key: 'sales',
        type: 'MODULE_PROMO',
        eyebrow: 'COMING SOON',
        data: { module: 'CAR_SALES' },
      },
      {
        key: 'blog',
        type: 'BLOG',
        eyebrow: 'JOURNAL',
        heading: 'Notes from the workshop.',
        subheading: 'Practical guidance on servicing, maintenance and caring for your car in Dubai.',
        ctaLabel: 'Read the journal',
        ctaHref: '/blog',
      },
      {
        key: 'faqs',
        type: 'FAQS',
        eyebrow: 'FAQS',
        heading: 'Straight answers.',
        subheading: 'Common questions about booking, servicing and pricing.',
        ctaLabel: 'See all FAQs',
        ctaHref: '/faqs',
      },
      {
        key: 'contact',
        type: 'CONTACT',
        eyebrow: 'VISIT US',
        heading: 'Ready when your car is.',
        body: 'Dubai, United Arab Emirates',
        ctaLabel: 'Contact us',
        ctaHref: '/contact',
      },
    ],
  },
  {
    slug: 'about',
    title: 'About Us',
    isSystem: true,
    metaTitle: 'About Street Wrenchers',
    metaDescription:
      'Street Wrenchers is a multi-brand automotive service centre in Dubai, built around diagnostics, clear communication and careful workmanship.',
    sortOrder: 2,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'ABOUT',
        heading: 'A Dubai workshop built around precision.',
        subheading:
          'Street Wrenchers brings scheduled servicing, diagnostics, repair and detailing together in one place.',
        image: '/assets/images/hero/workshop.jpg',
      },
      {
        key: 'story',
        type: 'TEXT',
        eyebrow: 'OUR APPROACH',
        heading: 'Why Street Wrenchers exists.',
        body:
          'Car care should not require translating between three different workshops or guessing what a final bill will look like. Street Wrenchers was built around a simpler model: diagnose properly, explain the work clearly and let the owner decide before anything extra is done.\n\nThat approach runs from a minor oil service through to engine repair and paint protection. It is one team, one standard and one point of contact.\n\nDubai adds its own demands — extreme heat, fine dust and heavy stop-start traffic. Our service advice is shaped around those conditions rather than copied from a temperate-climate handbook.',
        image: '/assets/images/hero/engine.jpg',
        imageAlt: 'Engine bay inspection in the workshop',
      },
      {
        key: 'values',
        type: 'WHY',
        eyebrow: 'WHAT WE STAND FOR',
        heading: 'How we work.',
        data: {
          points: [
            { title: 'Diagnosis before parts', text: 'We test and inspect before recommending replacement components.' },
            { title: 'Approval before extra work', text: 'Anything beyond the booked scope is quoted for your approval.' },
            { title: 'Clear handover', text: 'You leave knowing what was done and what to watch next.' },
            { title: 'Careful workmanship', text: 'Vehicles are handled with the same care whether the job is a service or a detail.' },
          ],
        },
      },
      {
        key: 'cta',
        type: 'CTA',
        heading: 'Book with a team that explains the work.',
        subheading: 'Choose your service and preferred time — we will confirm the details with you.',
        ctaLabel: 'Book a service',
        ctaHref: '/book',
      },
    ],
  },
  {
    slug: 'services',
    title: 'Services',
    isSystem: true,
    metaTitle: 'Car Services in Dubai',
    metaDescription:
      'Explore Street Wrenchers services in Dubai — minor and major servicing, engine and AC repair, brakes, electrical, detailing, PPF and EV care.',
    sortOrder: 3,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'SERVICES',
        heading: 'Service, diagnostics and detailing for every make.',
        subheading:
          'Browse the full workshop offering, from scheduled maintenance to specialised repair and paint protection.',
        image: '/assets/images/gallery/workshop-lift.jpg',
      },
      {
        key: 'cta',
        type: 'CTA',
        heading: 'Not sure which service you need?',
        subheading: 'Tell us the symptoms and the team will point you in the right direction.',
        ctaLabel: 'Talk to the workshop',
        ctaHref: '/contact',
      },
    ],
  },
  {
    slug: 'amc',
    title: 'AMC Plans',
    isSystem: true,
    metaTitle: 'Annual Maintenance Plans in Dubai',
    metaDescription:
      'Annual maintenance contracts for your car in Dubai — planned servicing, inspections and priority booking with Street Wrenchers.',
    sortOrder: 4,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'ANNUAL MAINTENANCE',
        heading: 'Plan the year. Skip the surprises.',
        subheading:
          'Annual maintenance plans that put scheduled servicing, inspections and priority booking into one clear arrangement.',
        image: '/assets/images/hero/engine.jpg',
      },
      {
        key: 'plans',
        type: 'AMC',
        eyebrow: 'PLANS',
        heading: 'Choose the level of cover that fits.',
        subheading:
          'Reference pricing is shown below. Final coverage and pricing are confirmed with you before purchase.',
        ctaLabel: 'Enquire about a plan',
        ctaHref: '/amc#enquiry',
      },
    ],
  },
  {
    slug: 'brands',
    title: 'Car Brands',
    isSystem: true,
    metaTitle: 'Car Brands We Service in Dubai',
    metaDescription:
      'Street Wrenchers services mainstream, premium and electric vehicle brands in Dubai — Toyota, Nissan, BMW, Mercedes-Benz, Tesla and more.',
    sortOrder: 5,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'BRANDS',
        heading: 'The makes Dubai drives, covered.',
        subheading:
          'Servicing and repair for mainstream, premium and electric vehicles. Tell us your model when booking and we will confirm the scope.',
        image: '/assets/images/hero/detailing.jpg',
      },
    ],
  },
  {
    slug: 'why-choose-us',
    title: 'Why Choose Us',
    isSystem: true,
    metaTitle: 'Why Choose Street Wrenchers',
    metaDescription:
      'Diagnostics-led repairs, approval before extra work and one team for servicing, repair and detailing in Dubai.',
    sortOrder: 6,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'WHY STREET WRENCHERS',
        heading: 'A straightforward way to look after your car.',
        subheading:
          'No guesswork, no surprise additions and no hand-offs between departments. Here is what that means in practice.',
        image: '/assets/images/gallery/brake-service.jpg',
      },
      {
        key: 'points',
        type: 'WHY',
        eyebrow: 'THE DIFFERENCE',
        heading: 'What you can expect.',
        data: {
          points: [
            { title: 'Diagnostics first', text: 'Fault codes, measurements and physical checks come before parts recommendations. It is a slower start and a better repair.' },
            { title: 'Approval before extra work', text: 'If the inspection finds something beyond the booked service, you receive a quote and decide whether to proceed.' },
            { title: 'Multi-brand capability', text: 'Routine maintenance, engine and mechanical repair, AC, electrical, brakes, detailing and paint protection are handled by one team.' },
            { title: 'Dubai-specific advice', text: 'Cooling, AC, battery and paint care recommendations reflect the heat, dust and traffic patterns here.' },
            { title: 'Clear handover', text: 'Every visit ends with a summary of completed work and any items to monitor before the next service.' },
            { title: 'Detailing alongside servicing', text: 'Cosmetic and mechanical care can be combined, so the car leaves ready for the road and for resale photos.' },
          ],
        },
      },
      {
        key: 'cta',
        type: 'CTA',
        heading: 'See the difference on your next service.',
        subheading: 'Book online and the team will confirm your slot.',
        ctaLabel: 'Book a service',
        ctaHref: '/book',
      },
    ],
  },
  {
    slug: 'gallery',
    title: 'Gallery',
    isSystem: true,
    metaTitle: 'Workshop Gallery',
    metaDescription:
      'Views of the Street Wrenchers workshop, detailing bay and service work in Dubai.',
    sortOrder: 7,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'GALLERY',
        heading: 'Inside the workshop.',
        subheading: 'Selected views of the spaces and processes behind the work.',
        image: '/assets/images/gallery/interior-detailing.jpg',
      },
    ],
  },
  {
    slug: 'blog',
    title: 'Blog',
    isSystem: true,
    metaTitle: 'Workshop Journal',
    metaDescription:
      'Practical car care guidance from the Street Wrenchers team in Dubai.',
    sortOrder: 8,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'JOURNAL',
        heading: 'Notes from the workshop.',
        subheading:
          'Straightforward guidance on servicing, maintenance and looking after a car in Dubai.',
        image: '/assets/images/hero/engine.jpg',
      },
    ],
  },
  {
    slug: 'reviews',
    title: 'Reviews',
    isSystem: true,
    metaTitle: 'Customer Reviews',
    metaDescription:
      'Verified customer reviews of Street Wrenchers automotive services in Dubai.',
    sortOrder: 9,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'REVIEWS',
        heading: 'Feedback from the drivers we work with.',
        subheading:
          'We publish verified reviews only. New feedback appears here once it has been confirmed.',
        image: '/assets/images/hero/detailing.jpg',
      },
    ],
  },
  {
    slug: 'contact',
    title: 'Contact',
    isSystem: true,
    metaTitle: 'Contact Street Wrenchers',
    metaDescription:
      'Contact Street Wrenchers in Dubai to book a service, ask about AMC plans or discuss a repair.',
    sortOrder: 10,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'CONTACT',
        heading: 'Tell us what your car needs.',
        subheading:
          'Send an enquiry and the team will respond with next steps, availability and pricing where relevant.',
        image: '/assets/images/hero/workshop.jpg',
      },
    ],
  },
  {
    slug: 'book',
    title: 'Book a Service',
    isSystem: true,
    metaTitle: 'Book a Car Service in Dubai',
    metaDescription:
      'Book a minor or major service, diagnostics or repair at Street Wrenchers in Dubai.',
    sortOrder: 11,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'BOOKING',
        heading: 'Book your service in a few steps.',
        subheading:
          'Choose your vehicle, the work you need and a preferred time. We confirm every booking with you.',
        image: '/assets/images/gallery/workshop-lift.jpg',
      },
    ],
  },
  {
    slug: 'faqs',
    title: 'FAQs',
    isSystem: true,
    metaTitle: 'Frequently Asked Questions',
    metaDescription:
      'Answers about booking, pricing, AMC plans and vehicle care at Street Wrenchers in Dubai.',
    sortOrder: 12,
    sections: [
      {
        key: 'hero',
        type: 'PAGE_HERO',
        eyebrow: 'FAQS',
        heading: 'Straight answers.',
        subheading: 'Everything commonly asked about booking, servicing and pricing.',
        image: '/assets/images/gallery/ac-service.jpg',
      },
    ],
  },
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    isSystem: true,
    template: 'legal',
    metaTitle: 'Privacy Policy',
    metaDescription:
      'How Street Wrenchers collects, uses and protects information submitted through this website.',
    sortOrder: 13,
    sections: legalPrivacy,
  },
  {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    isSystem: true,
    template: 'legal',
    metaTitle: 'Terms & Conditions',
    metaDescription:
      'Terms covering website use, bookings, quotes and vehicle work at Street Wrenchers.',
    sortOrder: 14,
    sections: legalTerms,
  },
  {
    slug: 'rental',
    title: 'Car Rental',
    isSystem: false,
    template: 'module',
    metaTitle: 'Car Rental in Dubai',
    metaDescription: 'Car rental enquiries with Street Wrenchers in Dubai.',
    sortOrder: 15,
    sections: [],
  },
  {
    slug: 'car-sales',
    title: 'Car Sales',
    isSystem: false,
    template: 'module',
    metaTitle: 'Cars for Sale in Dubai',
    metaDescription: 'Cars for sale through Street Wrenchers in Dubai.',
    sortOrder: 16,
    sections: [],
  },
  {
    slug: 'buy-a-car',
    title: 'Buy a Car',
    isSystem: false,
    template: 'module',
    metaTitle: 'Buy a Car in Dubai',
    metaDescription: 'Buyer enquiries and vehicle sourcing with Street Wrenchers in Dubai.',
    sortOrder: 17,
    sections: [],
  },
  {
    slug: 'sell-your-car',
    title: 'Sell Your Car',
    isSystem: false,
    template: 'module',
    metaTitle: 'Sell Your Car in Dubai',
    metaDescription: 'Sell your car to Street Wrenchers in Dubai. Valuation and acquisition enquiries.',
    sortOrder: 18,
    sections: [],
  },
];

export const faqs = [
  {
    question: 'Do I need to book in advance?',
    answer:
      'Booking online is recommended so we can reserve the right slot and prepare for the work. You can also contact the team directly, subject to availability.',
    category: 'Booking',
    sortOrder: 1,
  },
  {
    question: 'How do I know what my service will cost?',
    answer:
      'Minor and major service packages are priced on the website. Any additional work is quoted for your approval before it starts.',
    category: 'Pricing',
    sortOrder: 2,
  },
  {
    question: 'Do you service all car brands?',
    answer:
      'We service mainstream, premium and electric vehicles. Tell us the make, model and year when booking and we will confirm the scope.',
    category: 'Services',
    sortOrder: 3,
  },
  {
    question: 'Can I wait while my car is being serviced?',
    answer:
      'It depends on the work and the schedule. The team will give you an expected time when your booking is confirmed.',
    category: 'Booking',
    sortOrder: 4,
  },
  {
    question: 'Do you offer pickup and drop-off?',
    answer:
      'Pickup and drop-off can be requested when booking. Availability is confirmed by the team when your booking is accepted.',
    category: 'Booking',
    sortOrder: 5,
  },
  {
    question: 'What does an AMC plan include?',
    answer:
      'Each plan has a defined scope of scheduled servicing. Coverage, pricing and exclusions are confirmed with you before purchase.',
    category: 'AMC',
    sortOrder: 6,
  },
  {
    question: 'Can you work on electric vehicles?',
    answer:
      'Yes. EV maintenance including cabin systems, brakes, tyres, fluids and charging checks is available. Tell us your model when booking so the specific work can be confirmed.',
    category: 'Services',
    sortOrder: 7,
  },
  {
    question: 'How do I reschedule or cancel a booking?',
    answer:
      'Contact us with your booking reference and the team will arrange a new slot or cancel the booking.',
    category: 'Booking',
    sortOrder: 8,
  },
];
