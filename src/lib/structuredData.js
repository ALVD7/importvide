export const SITE_URL = "https://www.importvd.com";
export const DEFAULT_OG_IMAGE = "/img/productos/portacredencial-acrilico-rigido-vertical-cinta-naranja.webp";

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "IMPORTVIDE",
    url: SITE_URL,
    image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    telephone: "+593980118073",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Guayaquil",
      addressCountry: "EC",
    },
    areaServed: "Ecuador",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    sameAs: ["https://www.instagram.com/importvide/"],
    description:
      "Importador y distribuidor de portacredenciales, lanyards y habladores acrílicos en Ecuador. Venta al por mayor para colegios, bancos, entidades públicas y eventos.",
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
      seller: { "@type": "Organization", name: "IMPORTVIDE" },
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
