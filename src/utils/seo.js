import { useEffect } from 'react';

const SITE_URL = 'https://vistavoyagetravel.group';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;
const SITE_NAME = 'VistaVoyage Travel Group';

/**
 * useSEO — injects per-page SEO tags into <head>
 *
 * @param {string} title — page title (without site name suffix)
 * @param {string} description — meta description
 * @param {string} [canonical] — canonical path e.g. "/tours/kenya-safari"
 * @param {string} [ogImage] — absolute OG image URL
 * @param {object|object[]} [schema] — JSON-LD structured data object(s)
 */
export function useSEO(
  title,
  description,
  canonical,
  ogImage,
  schema
) {
  useEffect(() => {
    // ── Title ──────────────────────────────────────────────────────────────
    const fullTitle = title
      ? `${title} | ${SITE_NAME}`
      : `${SITE_NAME} | Premier Luxury Travel & Bespoke African Safaris`;

    document.title = fullTitle;

    // ── Helper: upsert a <meta> tag ────────────────────────────────────────
    const setMeta = (selector, attr, value) => {
      let el = document.querySelector(selector);

      if (!el) {
        el = document.createElement('meta');

        const match = selector.match(
          /\[([^=]+)="([^"]+)"\]/
        );

        if (match) {
          el.setAttribute(match[1], match[2]);
        }

        document.head.appendChild(el);
      }

      el.setAttribute(attr, value);
    };

    // ── Helper: upsert a <link> tag ────────────────────────────────────────
    const setLink = (rel, href) => {
      let el = document.querySelector(`link[rel="${rel}"]`);

      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', rel);
        document.head.appendChild(el);
      }

      el.setAttribute('href', href);
    };

    // ── Helper: upsert JSON-LD ─────────────────────────────────────────────
    const setSchema = (data) => {
      const id = 'seo-schema-ld';

      let el = document.getElementById(id);

      if (!el) {
        el = document.createElement('script');
        el.id = id;
        el.type = 'application/ld+json';
        document.head.appendChild(el);
      }

      el.textContent = JSON.stringify(data);
    };

    const canonicalUrl = canonical
      ? `${SITE_URL}${
          canonical.startsWith('/')
            ? canonical
            : `/${canonical}`
        }`
      : SITE_URL;

    const image = ogImage || DEFAULT_IMAGE;

    // ── Standard meta ─────────────────────────────────────────────────────
    setMeta(
      'meta[name="description"]',
      'content',
      description || ''
    );

    setMeta(
      'meta[name="robots"]',
      'content',
      'index, follow'
    );

    // ── Canonical ──────────────────────────────────────────────────────────
    setLink('canonical', canonicalUrl);

    // ── Open Graph ─────────────────────────────────────────────────────────
    setMeta(
      'meta[property="og:title"]',
      'content',
      fullTitle
    );

    setMeta(
      'meta[property="og:description"]',
      'content',
      description || ''
    );

    setMeta(
      'meta[property="og:url"]',
      'content',
      canonicalUrl
    );

    setMeta(
      'meta[property="og:image"]',
      'content',
      image
    );

    setMeta(
      'meta[property="og:type"]',
      'content',
      'website'
    );

    setMeta(
      'meta[property="og:site_name"]',
      'content',
      SITE_NAME
    );

    // ── Twitter / X ───────────────────────────────────────────────────────
    setMeta(
      'meta[name="twitter:card"]',
      'content',
      'summary_large_image'
    );

    setMeta(
      'meta[name="twitter:title"]',
      'content',
      fullTitle
    );

    setMeta(
      'meta[name="twitter:description"]',
      'content',
      description || ''
    );

    setMeta(
      'meta[name="twitter:image"]',
      'content',
      image
    );

    // ── JSON-LD ────────────────────────────────────────────────────────────
    if (schema) {
      const schemas = Array.isArray(schema)
        ? schema
        : [schema];

      setSchema(
        schemas.length === 1
          ? schemas[0]
          : schemas
      );
    }

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      const el = document.getElementById('seo-schema-ld');

      if (el) {
        el.remove();
      }
    };
  }, [
    title,
    description,
    canonical,
    ogImage,
    schema,
  ]);
}

// ─────────────────────────────────────────────────────────────────────────────
// ORGANIZATION SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',

  name: SITE_NAME,
  url: SITE_URL,

  logo: `${SITE_URL}/vl.png`,

  description:
    'Premier luxury travel company specialising in bespoke African safaris, Kenya safari packages, and luxury tours across East Africa, UAE, and South Africa.',

  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Applewood Adams, Ngong Road, Office 904B',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },

  telephone: '+254790644745',
  email: 'info@vistavoyagetravel.group',

  sameAs: [
    'https://www.instagram.com/vistavoyagetravelgroup',
    'https://www.facebook.com/vistavoyagetravelgroup',
    'https://www.youtube.com/@vistavoyagetravelgroup',
  ],

  areaServed: [
    'Kenya',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'South Africa',
    'United Arab Emirates',
  ],

  priceRange: '$$$',
};

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL BUSINESS SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',

  name: SITE_NAME,
  url: SITE_URL,

  telephone: '+254790644745',
  email: 'info@vistavoyagetravel.group',

  image: `${SITE_URL}/og-image.jpg`,
  logo: `${SITE_URL}/vl.png`,

  description:
    'Premier luxury travel company specialising in bespoke African safaris, Kenya safari packages, and luxury tours across East Africa, UAE, and South Africa.',

  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Applewood Adams, Ngong Road, Office 904B',
    addressLocality: 'Nairobi',
    addressRegion: 'Nairobi County',
    addressCountry: 'KE',
  },

  geo: {
    '@type': 'GeoCoordinates',
    latitude: -1.2994958,
    longitude: 36.7788779,
  },

  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
      ],
      opens: '08:00',
      closes: '18:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '09:00',
      closes: '14:00',
    },
  ],

  priceRange: '$$$',

  sameAs: [
    'https://www.instagram.com/vistavoyagetravelgroup',
    'https://www.facebook.com/vistavoyagetravelgroup',
    'https://www.youtube.com/@vistavoyagetravelgroup',
  ],

  areaServed: [
    'Kenya',
    'Tanzania',
    'Uganda',
    'Rwanda',
    'South Africa',
    'United Arab Emirates',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// WEBSITE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',

  name: SITE_NAME,
  url: SITE_URL,

  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/tours?search={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOURIST TRIP SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export function buildTourSchema(tour) {
  const slug = tour?._id || tour?.id || '';

  return {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',

    name: tour?.title || '',
    description:
      tour?.fullDescription ||
      tour?.description ||
      '',

    url: `${SITE_URL}/travel/${slug}`,

    image:
      typeof tour?.image === 'string' &&
      tour.image.startsWith('http')
        ? tour.image
        : DEFAULT_IMAGE,

    touristType: 'Luxury traveller',

    itinerary: (tour?.itinerary || []).map((day) => ({
      '@type': 'TouristAttraction',
      name: day?.title || '',
      description: day?.description || '',
    })),

    offers: {
      '@type': 'Offer',
      price: tour?.price,
      priceCurrency: tour?.currency || 'KES',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/travel/${slug}#request`,
    },

    provider: {
      '@type': 'TravelAgency',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// BREADCRUMB SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',

    itemListElement: (items || []).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export function buildFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',

    mainEntity: (faqs || []).map((faq) => ({
      '@type': 'Question',
      name: faq.question,

      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

export function buildArticleSchema(article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',

    headline: article.title,
    description: article.description,

    image: article.image || DEFAULT_IMAGE,

    author: {
      '@type': 'Person',
      name: article.author || SITE_NAME,
    },

    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,

      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/vl.png`,
      },
    },

    datePublished: article.datePublished,

    url: `${SITE_URL}${article.path}`,

    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${article.path}`,
    },
  };
}