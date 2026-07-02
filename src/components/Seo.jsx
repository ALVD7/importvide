import { SITE_URL, DEFAULT_OG_IMAGE } from "../lib/structuredData";

/**
 * Meta tags por ruta. React 19 eleva <title>, <meta> y <link> al <head>
 * automáticamente. El JSON-LD se renderiza inline (Google lo lee también
 * dentro del <body>).
 */
export default function Seo({ title, description, path, image, jsonLd = [] }) {
  const canonical = `${SITE_URL}${path}`;
  const ogImage = image?.startsWith("http") ? image : `${SITE_URL}${image ?? DEFAULT_OG_IMAGE}`;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="IMPORTVIDE" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="es_EC" />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}
    </>
  );
}
