import { BUSINESS } from "../data/business.js";

export const SITE_URL = BUSINESS.url;
export const DEFAULT_OG_IMAGE = "/img/productos/portacredencial-acrilico-rigido-vertical-cinta-naranja.webp";

const ORG_ID = `${SITE_URL}/#organizacion`;
const NEGOCIO_ID = `${SITE_URL}/#negocio`;

// Solo los datos confirmados en business.js: lo que está en null ([PENDIENTE])
// no se publica. Sin aggregateRating ni reseñas: Google exige que sean reales.
const sameAs = () => [BUSINESS.instagram, BUSINESS.googleBusinessUrl].filter(Boolean);

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    logo: `${SITE_URL}${BUSINESS.logo}`,
    sameAs: sameAs(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: BUSINESS.phone,
      ...(BUSINESS.email && { email: BUSINESS.email }),
      areaServed: "EC",
      availableLanguage: ["es"],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": NEGOCIO_ID,
    name: BUSINESS.name,
    url: SITE_URL,
    logo: `${SITE_URL}${BUSINESS.logo}`,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    telephone: BUSINESS.phone,
    ...(BUSINESS.email && { email: BUSINESS.email }),
    address: {
      "@type": "PostalAddress",
      ...(BUSINESS.streetAddress && { streetAddress: BUSINESS.streetAddress }),
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: [
      { "@type": "City", name: "Guayaquil" },
      { "@type": "Country", name: "Ecuador" },
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: BUSINESS.hours.days,
      opens: BUSINESS.hours.opens,
      closes: BUSINESS.hours.closes,
    },
    ...(BUSINESS.googleBusinessUrl && { hasMap: BUSINESS.googleBusinessUrl }),
    sameAs: sameAs(),
    parentOrganization: { "@id": ORG_ID },
    description:
      "Importador y distribuidor de portacredenciales, cordones (lanyards) y soportes acrílicos en Ecuador. Venta al por mayor para colegios, bancos, entidades públicas, empresas y eventos.",
  };
}

export function productJsonLd(p) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.img.startsWith("http") ? p.img : `${SITE_URL}${p.img}`,
    description: p.alt,
    brand: { "@type": "Brand", name: "IMPORTVIDE" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${p.id}`,
      priceCurrency: "USD",
      price: p.price.toFixed(2),
      availability: p.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", "@id": ORG_ID, name: BUSINESS.name },
    },
  };
}

export function faqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

// Recorta una descripción a la longitud que Google muestra (~155 caracteres)
// sin cortar palabras.
export function metaDescription(text, max = 155) {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "")}…`;
}
