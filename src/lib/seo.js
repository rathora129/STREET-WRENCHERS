import { BUSINESS, LOGO_SRC, SITE_URL } from './site';

export function absoluteUrl(path = '/') {
  if (!path) return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

function robotsObject(robots) {
  const value = String(robots || 'index,follow').toLowerCase();
  return {
    index: !value.includes('noindex'),
    follow: !value.includes('nofollow'),
    googleBot: {
      index: !value.includes('noindex'),
      follow: !value.includes('nofollow'),
    },
  };
}

export function buildMetadata({
  title,
  description = BUSINESS.description,
  path = '/',
  image = '/assets/banners/og-default.jpg',
  keywords = [],
  robots = 'index,follow',
  type = 'website',
} = {}) {
  const canonical = absoluteUrl(path);
  const ogImage = absoluteUrl(image || '/assets/banners/og-default.jpg');

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    robots: robotsObject(robots),
    openGraph: {
      type,
      url: canonical,
      siteName: BUSINESS.name,
      title: title || BUSINESS.name,
      description,
      locale: 'en_AE',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title || BUSINESS.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: title || BUSINESS.name,
      description,
      images: [ogImage],
    },
  };
}

export function pageMetadata(page, { path, fallbackTitle, fallbackDescription } = {}) {
  if (!page) {
    return buildMetadata({
      title: fallbackTitle,
      description: fallbackDescription,
      path,
    });
  }

  return buildMetadata({
    title: page.metaTitle || page.title || fallbackTitle,
    description: page.metaDescription || fallbackDescription,
    path: path || `/${page.slug}`,
    image: page.ogImage || '/assets/banners/og-default.jpg',
    keywords: page.keywords || [],
    robots: page.robots,
    type: 'website',
  });
}

export function localBusinessSchema(settings) {
  const business = settings?.business || {};
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    '@id': `${SITE_URL}/#business`,
    name: business.name || BUSINESS.name,
    url: SITE_URL,
    image: absoluteUrl(LOGO_SRC),
    logo: absoluteUrl(LOGO_SRC),
    description: business.description || BUSINESS.description,
    slogan: BUSINESS.slogan,
    currenciesAccepted: 'AED',
    areaServed: { '@type': 'City', name: 'Dubai' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.addressLine || 'Dubai',
      addressLocality: business.city || 'Dubai',
      addressCountry: 'AE',
    },
  };

  if (business.phone) schema.telephone = business.phone;
  if (business.email) schema.email = business.email;
  if (business.hours) schema.openingHours = business.hours;

  return schema;
}

export function serviceSchema(service, settings) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    serviceType: service.name,
    description: service.shortDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: {
      '@type': 'AutoRepair',
      name: settings?.business?.name || BUSINESS.name,
      url: SITE_URL,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Dubai',
        addressCountry: 'AE',
      },
    },
    areaServed: { '@type': 'City', name: 'Dubai' },
  };

  if (service.image) schema.image = absoluteUrl(service.image);
  if (service.price != null) {
    schema.offers = {
      '@type': 'Offer',
      price: Number(service.price),
      priceCurrency: 'AED',
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/services/${service.slug}`),
    };
  }

  return schema;
}

export function faqSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function articleSchema(blog) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt,
    image: blog.coverImage ? [absoluteUrl(blog.coverImage)] : undefined,
    datePublished: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
    dateModified: new Date(blog.updatedAt || blog.publishedAt || Date.now()).toISOString(),
    author: { '@type': 'Organization', name: blog.author || BUSINESS.name },
    publisher: {
      '@type': 'Organization',
      name: BUSINESS.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl(LOGO_SRC) },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${blog.slug}`) },
  };
}

export function breadcrumbSchema(items = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function JsonLd({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
