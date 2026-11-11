export const GUIDE_STORAGE_KEY = 'sw-dashboard-guide-v1';
export const CHECKLIST_STORAGE_KEY = 'sw-getting-started-v1';

export const HELP_TOPICS = [
  {
    id: 'dashboard',
    group: 'Start here',
    title: 'Dashboard overview',
    href: '/dashboard',
    summary: 'Today’s bookings, workshop load and the numbers that need attention.',
    purpose:
      'The overview gives you a live operational picture: bookings for today, vehicles in the workshop, work awaiting approval, vehicles ready for delivery, new enquiries, recent activity and a breakdown of vehicles by service stage.',
    steps: [
      'Open Dashboard from the first group in the sidebar.',
      'Check the “Today” and “Action needed” cards first — these highlight pickups, approvals and deliveries that need attention.',
      'Review “Vehicles by stage” to see where workshop capacity is building up.',
      'Use the recent activity list to catch up on new bookings, enquiries and status changes.',
    ],
    effect: 'The overview reads directly from the database. Nothing is estimated or invented, so keeping bookings and stages updated keeps this page accurate.',
  },
  {
    id: 'bookings',
    group: 'Operations',
    title: 'Bookings & vehicle tracking',
    href: '/dashboard/bookings',
    summary: 'Manage appointments through the 10-stage workshop workflow and share private tracking links.',
    purpose:
      'Bookings contains every appointment created from the website. Each booking has customer and vehicle details, an appointment slot, a service stage, stage history and a private customer tracking link.',
    steps: [
      'Open Bookings and use the search or status/stage filters to find the vehicle.',
      'Open a booking to see its details, stage history and private tracking link.',
      'Change the service stage as work progresses. Add a customer-visible note when the customer should hear something, and an internal note for the workshop team.',
      'Set the expected delivery date so the customer tracking page shows a realistic handover time.',
      'Copy the tracking link or send it through WhatsApp. Updates are never sent automatically — you choose when to open the chat.',
    ],
    effect: 'Changing a stage instantly updates the customer tracking page and keeps the dashboard overview accurate. Internal notes never appear on the public tracking page.',
  },
  {
    id: 'customers',
    group: 'Operations',
    title: 'Customers',
    href: '/dashboard/customers',
    summary: 'A single record for each customer, linked to their enquiries and bookings.',
    purpose:
      'Customer records bring together contact details, notes and service history. Bookings and enquiries created from the website are linked to these records automatically when contact details match.',
    steps: [
      'Open Customers and search by name, phone or email.',
      'Open a record to review linked bookings, enquiries and internal notes.',
      'Update contact details or notes so future follow-ups use the right information.',
      'Use the customer’s bookings to see which vehicle is with the workshop right now.',
    ],
    effect: 'Internal customer notes are private to the dashboard and never rendered on the public website.',
  },
  {
    id: 'leads',
    group: 'Operations',
    title: 'Leads & CRM',
    href: '/dashboard/leads',
    summary: 'Track enquiries from first contact to booking.',
    purpose:
      'Leads collects contact-form enquiries, AMC requests and website callbacks. Each lead has a status, source, campaign attribution and activity history.',
    steps: [
      'Open Leads & CRM and filter by status or type.',
      'Open a lead to read the message, contact the customer and log follow-up activities.',
      'Move the lead through the statuses as it progresses.',
      'When the customer books, the booking is linked to the same lead and customer record.',
    ],
    effect: 'Contact details submitted through the website appear here — they are not published anywhere on the site.',
  },
  {
    id: 'services',
    group: 'Catalogue',
    title: 'Categories & services',
    href: '/dashboard/services',
    summary: 'Control the service catalogue, icons, prices, images and publishing.',
    purpose:
      'Services are the pages customers browse and book. Each service belongs to a category, can have its own icon, description, starting price, duration, image and SEO fields, and can be published or unpublished.',
    steps: [
      'Open Services and create a new service or edit an existing one.',
      'Choose a category and pick an icon from the searchable icon library — no code changes are needed.',
      'Write a short card description and a full description for the service page.',
      'Add a starting price, duration and an optional image.',
      'Toggle Published to show or hide it on the website, and use Sort order to arrange the catalogue.',
      'Create categories under Service Categories to group services in navigation and listings.',
    ],
    effect: 'Published services appear on the services listing, category pages, booking wizard and service detail pages immediately after saving.',
  },
  {
    id: 'amc',
    group: 'Catalogue',
    title: 'AMC plans',
    href: '/dashboard/amc',
    summary: 'Create any number of annual maintenance plans with their own pricing and benefits.',
    purpose:
      'AMC plans power the annual maintenance section of the website. Plans are fully editable: name, AED price, duration, benefits, icon, image, featured flag, order and publishing.',
    steps: [
      'Open AMC Plans and create a plan or edit an existing one.',
      'Enter the plan name, price in AED and duration in months.',
      'Add each inclusion as a separate benefit line.',
      'Optionally pick an icon, upload a plan image and mark the plan as featured.',
      'Set the sort order and toggle Published.',
      'Use the plan’s slug to preview its public detail page.',
    ],
    effect: 'The public AMC section and plan detail pages read directly from these records — there are no hardcoded prices or benefits in the code.',
  },
  {
    id: 'brands',
    group: 'Catalogue',
    title: 'Car brands & models',
    href: '/dashboard/brands',
    summary: 'Maintain brand logos, brand-specific vehicle images, models and visibility.',
    purpose:
      'Brands power the brands directory, the brand landing pages and the vehicle selector in the booking form. Each brand can have a logo and its own vehicle photo, plus a list of models.',
    steps: [
      'Open Car Brands and add a brand or edit an existing one.',
      'Upload the brand logo and a brand-specific vehicle image. If no vehicle image is uploaded, the site shows the logo plate — your uploaded logo first, then the built-in manufacturer mark. It never substitutes another brand’s photo.',
      'Set the sort order and toggle Active to control whether the brand is visible.',
      'Open Vehicle Models to add or edit models for that brand, set their sort order and visibility.',
      'Preview the public brand page from the brand card on the website.',
    ],
    effect: 'Public brand cards and brand pages update immediately. Only models assigned to that brand are shown under it.',
  },
  {
    id: 'pages',
    group: 'Website',
    title: 'Pages & sections',
    href: '/dashboard/pages',
    summary: 'Edit the content blocks that make up key public pages.',
    purpose:
      'Pages & Sections controls editable content blocks such as headings, supporting text and calls to action on the public website.',
    steps: [
      'Open Pages & Sections and choose the page you want to edit.',
      'Edit the section content and save the change.',
      'Preview the public page in a new tab to confirm the copy reads correctly.',
      'Use the visibility control to hide a section without deleting its content.',
    ],
    effect: 'Saved section content appears on the corresponding public page — no deployment is required.',
  },
  {
    id: 'banners',
    group: 'Website',
    title: 'Hero banners',
    href: '/dashboard/banners',
    summary: 'Manage hero slides, CTAs, overlay strength, ordering and scheduling.',
    purpose:
      'Banners are the hero slides at the top of the homepage. Each banner has desktop and mobile images, headline, description, primary and optional secondary calls to action, overlay opacity, order and a scheduling window.',
    steps: [
      'Open Banners and create a slide or edit an existing one.',
      'Upload a desktop image and, ideally, a mobile image with the subject centred.',
      'Add the heading, description and call-to-action text and URLs.',
      'Adjust overlay opacity so the text stays readable over the photo.',
      'Set the sort order, toggle Enabled and optionally add start/end dates.',
      'Repeat for each slide — arrows, dots, autoplay and swipe are handled by the site.',
    ],
    effect: 'Enabled banners within their schedule window appear in the homepage hero. Disabled or out-of-window slides are hidden automatically.',
  },
  {
    id: 'testimonials',
    group: 'Website',
    title: 'Testimonials',
    href: '/dashboard/testimonials',
    summary: 'Publish genuine customer reviews, with ratings, avatars and ordering.',
    purpose:
      'Testimonials appear in the reviews section and reviews page. Each record has the customer name, review text, rating, optional avatar and vehicle, review date, featured flag, visibility and order.',
    steps: [
      'Open Testimonials and add a review you have actually received.',
      'Enter the customer name, the review and a rating from 1 to 5.',
      'Optionally upload an avatar and add the vehicle details.',
      'Set the review date, toggle Published and mark it as featured if it should be highlighted.',
      'Use Sort order to control the sequence in the slider.',
    ],
    effect: 'Only published testimonials appear publicly. Never create reviews that were not genuinely left by customers.',
  },
  {
    id: 'media',
    group: 'Website',
    title: 'Media library',
    href: '/dashboard/media',
    summary: 'Upload and reuse images across services, brands, banners and pages.',
    purpose:
      'The media library stores images with their public URL, alt text and folder. Uploading here keeps assets reusable across every module.',
    steps: [
      'Open Media Library and upload an image, or add one by URL.',
      'Add descriptive alt text — this is used for accessibility and image SEO.',
      'Assign a folder so the library stays organised.',
      'Paste the public URL into any image field, or use the upload control in a specific module.',
    ],
    effect: 'Images used on the website are served through Next.js image optimisation where supported. Keep source images reasonably sized for fast mobile loading.',
  },
  {
    id: 'seo',
    group: 'Marketing',
    title: 'SEO & redirects',
    href: '/dashboard/seo',
    summary: 'Titles, descriptions, social images and safe URL redirects.',
    purpose:
      'SEO settings control site-wide metadata defaults and page-level overrides, while Redirects lets you point old URLs at new ones without breaking links.',
    steps: [
      'Open SEO & Redirects to review the default title, description and social image.',
      'Add per-record SEO fields when editing services, AMC plans, blog posts and pages.',
      'Create redirects for any URL you have replaced or removed.',
      'Check the sitemap and robots files from the public site after changing index settings.',
    ],
    effect: 'Metadata is rendered server-side for search engines. Private tracking links are excluded from indexing and the sitemap.',
  },
  {
    id: 'whatsapp',
    group: 'Marketing',
    title: 'WhatsApp & contact',
    href: '/dashboard/whatsapp',
    summary: 'Click-to-chat number and pre-filled message templates.',
    purpose:
      'WhatsApp settings control the floating chat button, the business number and the message templates used across the site and in booking updates.',
    steps: [
      'Open WhatsApp and enable the floating button if you want it visible on the website.',
      'Enter the country code and number exactly as they should appear in a wa.me link.',
      'Edit the default, service, AMC, rental and sales message templates.',
      'Open a booking and use “Send via WhatsApp” to preview and send a stage update yourself.',
    ],
    effect: 'The website only ever creates a click-to-chat link. Messages are sent by you from WhatsApp — the dashboard never claims a message was delivered automatically.',
  },
  {
    id: 'settings',
    group: 'Settings',
    title: 'Business settings',
    href: '/dashboard/settings',
    summary: 'Business name, contact details, hours, currency and booking rules.',
    purpose:
      'Business settings feed the website footer, contact page, structured data, tracking page and booking wizard. Booking settings control minimum notice, how far ahead customers can book and pickup messaging.',
    steps: [
      'Open Business Settings and complete the business name, address, phone, WhatsApp, email and opening hours.',
      'Set the currency and timezone — the site uses Asia/Dubai for appointments.',
      'Review the booking rules: minimum notice, maximum days ahead and pickup availability.',
      'Save and open the public contact page to confirm the details render correctly.',
    ],
    effect: 'These settings are used throughout the public website. Empty fields fall back to neutral text rather than invented business information.',
  },
  {
    id: 'modules',
    group: 'Settings',
    title: 'Module controls',
    href: '/dashboard/modules',
    summary: 'Turn optional website sections and future modules on or off.',
    purpose:
      'Module controls decide which optional sections appear on the public website, including future rental and sales modules.',
    steps: [
      'Open Module Controls and review each module.',
      'Toggle a module off to hide it from the website navigation and sections.',
      'Turn it back on when the content and pages are ready.',
      'Check the public navigation after changing a module.',
    ],
    effect: 'Disabled modules are removed from public navigation and page rendering. Their dashboard data is preserved.',
  },
  {
    id: 'help',
    group: 'Settings',
    title: 'Help centre',
    href: '/dashboard/help',
    summary: 'Searchable guides, the getting-started checklist and this walkthrough.',
    purpose:
      'The help centre explains every dashboard module, lists step-by-step instructions and lets you replay the guided walkthrough at any time.',
    steps: [
      'Open Help Centre from the top bar or the sidebar.',
      'Search for a module or task, or browse the grouped topics.',
      'Work through the getting-started checklist.',
      'Use “Replay guided walkthrough” to see the tour again.',
      'Open a topic’s help icon in any module for a quick reminder without leaving the page.',
    ],
    effect: 'The help centre explains how each module affects the live website, so you can make changes confidently.',
  },
];

export const GUIDE_STEPS = [
  {
    topicId: 'dashboard',
    title: 'Your daily overview',
    description: 'Start here each morning. The dashboard shows today’s bookings, vehicles in the workshop, approvals waiting on customers, deliveries due and the latest activity — all from real records.',
  },
  {
    topicId: 'bookings',
    title: 'Bookings and customer tracking',
    description: 'Open a booking to move the vehicle through the 10 workshop stages, add customer-visible or internal notes, set the expected delivery and share a private tracking link.',
  },
  {
    topicId: 'customers',
    title: 'Customer records',
    description: 'Customers are created from website enquiries and bookings. Use their records to see contact details and every linked booking and enquiry in one place.',
  },
  {
    topicId: 'leads',
    title: 'Leads and follow-ups',
    description: 'Contact-form enquiries, AMC requests and callbacks land in Leads & CRM. Log follow-ups and move each lead towards a booking.',
  },
  {
    topicId: 'services',
    title: 'Services and icons',
    description: 'Build your catalogue: categories, service pages, icons from the searchable library, starting prices, durations, images, SEO, publishing and order.',
  },
  {
    topicId: 'amc',
    title: 'AMC plans',
    description: 'Create any number of maintenance plans with their own AED pricing, duration, benefit lists and optional imagery. The public AMC section is fully data-driven.',
  },
  {
    topicId: 'brands',
    title: 'Brands and models',
    description: 'Upload a logo and a brand-specific vehicle image, then manage the models shown under each brand. Cards and brand pages update as soon as you save.',
  },
  {
    topicId: 'banners',
    title: 'Hero banners',
    description: 'Upload desktop and mobile images, write the headline and calls to action, set overlay strength, order and scheduling for the homepage hero.',
  },
  {
    topicId: 'testimonials',
    title: 'Testimonials',
    description: 'Publish genuine reviews with ratings, avatars and dates. Only published reviews appear on the site, and the loop never shows invented content.',
  },
  {
    topicId: 'media',
    title: 'Media library',
    description: 'Keep images reusable and accessible with folders and alt text. Upload once and reference the asset from any module.',
  },
  {
    topicId: 'pages',
    title: 'Pages and SEO',
    description: 'Edit public page content and control metadata, redirects, the sitemap and robots rules so search engines index the right pages.',
  },
  {
    topicId: 'settings',
    title: 'Business settings',
    description: 'Your business name, contact details, hours, currency, timezone and booking rules power the footer, contact page, booking form and tracking pages.',
  },
];

export const GETTING_STARTED = [
  { id: 'business', label: 'Complete your business details and opening hours', href: '/dashboard/settings', note: 'Name, address, phone, email and hours appear across the public site.' },
  { id: 'service', label: 'Publish at least one service', href: '/dashboard/services', note: 'Services power the catalogue, service pages and the booking wizard.' },
  { id: 'amc', label: 'Create your AMC plans', href: '/dashboard/amc', note: 'Add real prices and benefit lists — nothing is hardcoded on the site.' },
  { id: 'brand', label: 'Add car brands and their models', href: '/dashboard/brands', note: 'Upload a brand-specific vehicle image for the best-looking brand cards.' },
  { id: 'banner', label: 'Set up the homepage hero banner', href: '/dashboard/banners', note: 'Add desktop and mobile images, a headline and a call to action.' },
  { id: 'whatsapp', label: 'Connect your WhatsApp number', href: '/dashboard/whatsapp', note: 'Enables click-to-chat across the site and in booking updates.' },
  { id: 'testimonial', label: 'Publish genuine customer reviews', href: '/dashboard/testimonials', note: 'Only add reviews you have actually received.' },
];

export const HELP_FAQS = [
  {
    question: 'Why did my change not appear on the website?',
    answer:
      'Check that the record is published (or enabled) and that any schedule window includes the current time. Some pages are cached for a short period; refresh after a moment. If an image is missing, confirm the URL or upload it again from the media library.',
  },
  {
    question: 'How does the customer tracking link work?',
    answer:
      'Every booking has a private tracking link that does not require a login. The customer sees the booking reference, vehicle, current stage, timeline, expected delivery and customer-visible notes. Internal notes, database IDs and staff-only information are never included. You can regenerate or revoke the link at any time from the booking.',
  },
  {
    question: 'Was a WhatsApp message sent automatically?',
    answer:
      'No. Street Wrenchers uses click-to-chat links only. When you choose “Send via WhatsApp”, WhatsApp opens with the message pre-filled and you press send yourself. The dashboard never claims a message was delivered.',
  },
  {
    question: 'Can I change a service icon without a developer?',
    answer:
      'Yes. Edit the service and choose an icon from the searchable icon library. The same icon is used on service cards, the service page and the booking flow.',
  },
  {
    question: 'What happens if I revoke a tracking link?',
    answer:
      'The old link stops working immediately and shows the customer a friendly “link unavailable” page. Generate a new link and send it to the customer when needed.',
  },
  {
    question: 'Where do new bookings and enquiries come from?',
    answer:
      'They are created by the public booking form and contact forms. They appear in Bookings and Leads & CRM, and matching contact details link them to a customer record automatically.',
  },
  {
    question: 'Why do I see a vehicle image missing on a brand card?',
    answer:
      'If a brand has no vehicle image, the site shows its logo plate: your uploaded logo first, then the built-in manufacturer mark. It never shows another brand’s vehicle. Upload a brand-specific image from Car Brands to use the full photo treatment.',
  },
];

export const HELP_GROUPS = ['Start here', 'Operations', 'Catalogue', 'Website', 'Marketing', 'Settings'];

export function findHelpTopic(id) {
  return HELP_TOPICS.find((topic) => topic.id === id) || null;
}
