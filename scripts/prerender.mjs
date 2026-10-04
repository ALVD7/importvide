// Prerenderiza como HTML estático la portada, las fichas de producto y las
// landings SEO tras el build de Vite. Los crawlers de IA (GPTBot, ClaudeBot,
// PerplexityBot) y de Bing no ejecutan JavaScript: sin esto solo verían el
// <div id="root"> vacío. El navegador carga igual el bundle de React, que toma
// el control al montar.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { seoPages, CATALOG, PENDING_SPEC } from "../src/data/seoPages.js";
import { STATIC_PAGES, FAQ_GROUPS, PRODUCTOS_COTIZABLES } from "../src/data/staticPages.js";
import { BUSINESS } from "../src/data/business.js";
import {
  SITE_URL,
  productJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  localBusinessJsonLd,
  organizationJsonLd,
  metaDescription,
} from "../src/lib/structuredData.js";
import { cargarProductos, linkWhatsApp } from "./products.mjs";

const dist = new URL("../dist/", import.meta.url);
const shell = readFileSync(new URL("index.html", dist), "utf8");

const assetTags = [...shell.matchAll(/<(?:script[^>]*type="module"[^>]*|link[^>]*rel="stylesheet"[^>]*)>(?:<\/script>)?/g)]
  .map((m) => m[0])
  .join("\n    ");
if (!assetTags.includes("script")) throw new Error("No se encontró el bundle en dist/index.html");

const esc = (s) =>
  String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const baseStyle = `<style>
  body{font-family:system-ui,sans-serif;color:#111;background:#f7f7f7;margin:0}
  .pre-wrap{max-width:860px;margin:0 auto;padding:32px 20px;line-height:1.65}
  .pre-wrap img{max-width:240px;height:auto;border-radius:8px}
  .pre-wrap a{color:#ff6b00}
</style>`;

const ldTags = (objetos) =>
  objetos
    .filter(Boolean)
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n    ");

const PIE = `<p><strong>${BUSINESS.name}</strong> — Importador directo en ${BUSINESS.city}, Ecuador. WhatsApp: ${BUSINESS.phoneDisplay}. ${BUSINESS.hours.label}.</p>
  <p><a href="/cotizar">Cotizar</a> · <a href="/contacto">Contacto</a> · <a href="/preguntas-frecuentes">Preguntas frecuentes</a> · <a href="/politicas">Devoluciones</a> · <a href="/privacidad">Privacidad</a></p>`;

// Documento completo para las rutas que Vite no genera (landings y fichas).
function documento({ title, description, canonical, ogImage, markdown, jsonLd = "", content, noindex = false }) {
  return `<!doctype html>
<html lang="es-EC">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${noindex ? '<meta name="robots" content="noindex, follow" />' : `<link rel="canonical" href="${canonical}" />`}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="IMPORTVIDE" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="es_EC" />
    <meta name="twitter:card" content="summary_large_image" />
    ${markdown ? `<link rel="alternate" type="text/markdown" href="${markdown}" title="Esta página en Markdown" />` : ""}
    <link rel="describedby" type="text/plain" href="/llms.txt" />
    <link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" />
    <link rel="service-desc" type="application/json" href="/.well-known/mcp/server-card.json" />
    <link rel="api-catalog" href="/.well-known/api-catalog" />
    <link rel="preconnect" href="https://cbfvcyxrrpseasuujkcz.supabase.co" crossorigin />
    <link rel="preload" href="/fonts/sora-latin.woff2" as="font" type="font/woff2" crossorigin />
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-HPFQPCHE9W"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-HPFQPCHE9W');
    </script>
    ${baseStyle}
    ${assetTags}
    ${jsonLd}
  </head>
  <body>
    <div id="root">${content}
    </div>
  </body>
</html>
`;
}

// ── Landings SEO ─────────────────────────────────────────────────────────
for (const page of seoPages) {
  const products = page.products.map((k) => CATALOG[k]);
  const canonical = `${SITE_URL}/${page.slug}`;

  const content = `
<div class="pre-wrap">
  <nav><a href="/">Inicio</a> › ${esc(page.h1)}</nav>
  <h1>${esc(page.h1)}</h1>
  ${page.intro.map((p) => `<p>${esc(p)}</p>`).join("\n  ")}
  <h2>Productos disponibles en stock</h2>
  <ul>
    ${products
      .map(
        (p) =>
          `<li><a href="/product/${p.id}">${esc(p.name)}</a> — $${p.price.toFixed(2)} USD (${p.inStock ? "en stock" : "sin stock"}). ${esc(p.alt)}</li>`
      )
      .join("\n    ")}
  </ul>
  ${page.specs?.length
    ? `<h2>Ficha técnica</h2>
  <dl>${page.specs.map((sp) => `<dt>${esc(sp.label)}</dt><dd>${esc(sp.value ?? PENDING_SPEC)}</dd>`).join("")}</dl>`
    : ""}
  ${page.sections
    .map(
      (s) => `<section>
    <h2>${esc(s.h2)}</h2>
    ${s.paras.map((p) => `<p>${esc(p)}</p>`).join("\n    ")}
    ${s.bullets ? `<ul>${s.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
  </section>`
    )
    .join("\n  ")}
  ${(page.gallery ?? [])
    .map((g) => `<figure><img src="${g.src}" alt="${esc(g.alt)}" loading="lazy"><figcaption>${esc(g.alt)}</figcaption></figure>`)
    .join("\n  ")}
  <h2>Preguntas frecuentes</h2>
  ${page.faqs
    .map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`)
    .join("\n  ")}
  <h2>También te puede interesar</h2>
  <ul>
    ${page.related.map((r) => `<li><a href="${r.to}">${esc(r.label)}</a></li>`).join("\n    ")}
  </ul>
  ${PIE}
</div>`;

  mkdirSync(new URL(`${page.slug}/`, dist), { recursive: true });
  writeFileSync(
    new URL(`${page.slug}/index.html`, dist),
    documento({
      title: page.title,
      description: page.description,
      canonical,
      ogImage: `${SITE_URL}${products[0]?.img ?? ""}`,
      markdown: `/${page.slug}.md`,
      jsonLd: ldTags([
        breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: page.h1, path: `/${page.slug}` },
        ]),
        faqJsonLd(page.faqs),
        ...products.map(productJsonLd),
      ]),
      content,
    })
  );
  console.log(`prerender: /${page.slug}`);
}

// ── Fichas de producto ───────────────────────────────────────────────────
const productos = await cargarProductos();

// Landings donde aparece cada producto, para enlazarlas desde su ficha.
const landingsDe = (id) => {
  const enLanding = seoPages.filter((p) => p.products.some((k) => CATALOG[k]?.id === id));
  const lista = enLanding.length ? enLanding : seoPages.slice(0, 4);
  return lista.map((p) => ({ to: `/${p.slug}`, label: p.h1 }));
};

for (const producto of productos) {
  const canonical = `${SITE_URL}/product/${producto.id}`;
  const descripcionCompleta =
    producto.description ||
    `${producto.name} disponible en IMPORTVIDE. Venta al por mayor en Guayaquil con envío a todo Ecuador. Consulta precio y stock por WhatsApp.`;
  const description = metaDescription(descripcionCompleta);
  const disponibilidad = producto.inStock
    ? `En stock${producto.stock ? ` — ${producto.stock} disponibles` : ""}`
    : "Sin stock";

  const content = `
<div class="pre-wrap">
  <nav><a href="/">Inicio</a> › ${esc(producto.name)}</nav>
  <h1>${esc(producto.name)}</h1>
  ${producto.image ? `<img src="${esc(producto.image)}" alt="${esc(producto.name)}" loading="lazy">` : ""}
  <p><strong>$ ${producto.price.toFixed(2)} USD</strong> — ${esc(disponibilidad)}</p>
  ${producto.category ? `<p>Categoría: ${esc(producto.category)}</p>` : ""}
  <h2>Descripción</h2>
  <p>${esc(descripcionCompleta)}</p>
  <p>Precio referencial: para compras al por mayor el descuento se cotiza por volumen.
  <a href="${esc(linkWhatsApp(producto))}">Consultar por WhatsApp</a>.</p>
  <h2>Categorías relacionadas</h2>
  <ul>
    ${landingsDe(producto.id).map((r) => `<li><a href="${r.to}">${esc(r.label)}</a></li>`).join("\n    ")}
  </ul>
  ${PIE}
</div>`;

  mkdirSync(new URL(`product/${producto.id}/`, dist), { recursive: true });
  writeFileSync(
    new URL(`product/${producto.id}/index.html`, dist),
    documento({
      title: `${producto.name} | IMPORTVIDE Ecuador`,
      description,
      canonical,
      ogImage: producto.image,
      markdown: `/product/${producto.id}/index.md`,
      jsonLd: ldTags([
        breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: producto.name, path: `/product/${producto.id}` },
        ]),
        productJsonLd({
          id: producto.id,
          name: producto.name,
          price: producto.price,
          inStock: producto.inStock,
          img: producto.image,
          alt: descripcionCompleta,
        }),
      ]),
      content,
    })
  );
}
console.log(`prerender: ${productos.length} fichas de producto`);

// ── Portada ──────────────────────────────────────────────────────────────
// Aquí no se genera el documento: se inyecta el contenido en el index.html que
// ya produjo Vite, para no perder nada de su <head>.
const portada = `
<div class="pre-wrap">
  <p>Todo lo que tu negocio necesita, lo importamos por ti.</p>
  <h1>Portacredenciales, cordones y soportes acrílicos al por mayor en Ecuador</h1>
  <p>En IMPORTVIDE somos importadores directos de portacredenciales, lanyards y habladores
  acrílicos, con bodega en Guayaquil y envío a todo Ecuador. Vendemos al por mayor a colegios,
  bancos, empresas, entidades públicas y organizadores de eventos, y también por unidad.</p>
  <h2>Nuestros productos</h2>
  <ul>
    ${productos
      .map(
        (p) =>
          `<li><a href="/product/${p.id}">${esc(p.name)}</a> — $${p.price.toFixed(2)} USD (${p.inStock ? "en stock" : "sin stock"}). ${esc(p.description)}</li>`
      )
      .join("\n    ")}
  </ul>
  <h2>Catálogo por categoría</h2>
  <ul>
    ${seoPages.map((p) => `<li><a href="/${p.slug}">${esc(p.h1)}</a> — ${esc(p.description)}</li>`).join("\n    ")}
  </ul>
  <h2>Cómo comprar</h2>
  <p>No hay checkout en línea: la cotización y el pedido se cierran por WhatsApp al
  +593 98 011 8073, de lunes a viernes de 08:00 a 17:00. Los precios publicados son
  referenciales y el descuento por volumen se negocia según la cantidad. Emitimos factura
  para empresas e instituciones y enviamos a Quito, Cuenca y todo el país.</p>
  <p><a href="/politicas">Política de devoluciones</a></p>
  ${PIE}
</div>`;

// La portada es una página de listado: Google espera ItemList, no 13 entidades
// Product sueltas. El Product completo va en la ficha de cada producto.
const jsonLdPortada = ldTags([
  organizationJsonLd(),
  localBusinessJsonLd(),
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo IMPORTVIDE",
    numberOfItems: productos.length,
    itemListElement: productos.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.name,
      url: `${SITE_URL}/product/${p.id}`,
    })),
  },
]);

if (!shell.includes('<div id="root"></div>')) {
  throw new Error("dist/index.html no tiene el <div id=\"root\"> vacío esperado");
}
// Shell vacío para las rutas que resuelve React en el cliente (fichas nuevas
// aún no prerenderizadas, /login, /register, /admin). vercel.json las reescribe
// a /app.html para que no hereden el contenido, el canonical ni el JSON-LD de
// la portada.
writeFileSync(new URL("app.html", dist), shell);

const indexHtml = shell
  .replace("</head>", `  <link rel="canonical" href="${SITE_URL}/" />\n    ${baseStyle}\n    ${jsonLdPortada}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${portada}\n    </div>`);
writeFileSync(new URL("index.html", dist), indexHtml);
console.log("prerender: / (portada)");

// ── Páginas informativas ─────────────────────────────────────────────────
// Mismo título, descripción y H1 que los componentes React (staticPages.js).
const migas = (page) => [
  { name: "Inicio", path: "/" },
  { name: page.h1, path: page.path },
];
const navMigas = (page) => `<nav><a href="/">Inicio</a> › ${esc(page.h1)}</nav>`;

const CONTENIDO_ESTATICO = {
  contacto: () => `
  <p>Cotizamos portacredenciales, cordones y soportes acrílicos al por mayor. La forma más rápida es WhatsApp.</p>
  <dl>
    <dt>Empresa</dt><dd>${esc(BUSINESS.name)}</dd>
    <dt>WhatsApp y teléfono</dt><dd><a href="tel:${BUSINESS.phone}">${esc(BUSINESS.phoneDisplay)}</a></dd>
    ${BUSINESS.email ? `<dt>Correo</dt><dd><a href="mailto:${BUSINESS.email}">${esc(BUSINESS.email)}</a></dd>` : ""}
    <dt>Horario</dt><dd>${esc(BUSINESS.hours.label)}</dd>
    <dt>Ubicación</dt><dd>${esc(BUSINESS.city)}, ${esc(BUSINESS.region)}, Ecuador. Operamos 100 % en línea, sin local de atención al público.</dd>
    <dt>Cobertura</dt><dd>${esc(BUSINESS.serviceArea)}</dd>
  </dl>
  <p><a href="https://wa.me/${BUSINESS.whatsapp}">Escribir por WhatsApp</a> · <a href="/cotizar">Usar el formulario</a></p>`,
  faq: () =>
    FAQ_GROUPS.map(
      (g) => `<h2>${esc(g.title)}</h2>
  ${g.faqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join("\n  ")}`
    ).join("\n  "),
  cotizar: () => `
  <p>Cuéntanos qué necesitas y te respondemos con disponibilidad, precio por volumen y opciones de envío. ${esc(BUSINESS.hours.label)}.</p>
  <p>Productos que cotizamos: ${PRODUCTOS_COTIZABLES.map((p) => esc(p.value)).join(", ")}.</p>
  <p>Escríbenos por <a href="https://wa.me/${BUSINESS.whatsapp}">WhatsApp al ${esc(BUSINESS.phoneDisplay)}</a> o usa el formulario de esta página.</p>`,
  privacidad: () => `
  <p>${esc(BUSINESS.name)} usa los datos del formulario de cotización y de WhatsApp para responder tu solicitud, preparar la proforma y la factura y coordinar el envío. Usamos Google Analytics para medir el uso del sitio. Puedes pedir acceso, rectificación o eliminación de tus datos por WhatsApp al ${esc(BUSINESS.phoneDisplay)}.</p>`,
  politicas: () => `
  <p>No realizamos devoluciones ni reembolsos una vez despachado el pedido, salvo si se pierde en tránsito o llega totalmente dañado o con un daño significativo. Repórtalo por WhatsApp dentro de las 48 horas de recibido, con fotos del producto y del empaque y el comprobante de compra.</p>`,
};

const jsonLdEstatico = {
  contacto: () => [localBusinessJsonLd()],
  faq: () => [faqJsonLd(FAQ_GROUPS.flatMap((g) => g.faqs))],
};

for (const [clave, contenido] of Object.entries(CONTENIDO_ESTATICO)) {
  const page = STATIC_PAGES[clave];
  const html = documento({
    title: page.title,
    description: page.description,
    canonical: `${SITE_URL}${page.path}`,
    ogImage: `${SITE_URL}${CATALOG.acrilico.img}`,
    jsonLd: ldTags([breadcrumbJsonLd(migas(page)), ...(jsonLdEstatico[clave]?.() ?? [])]),
    content: `
<div class="pre-wrap">
  ${navMigas(page)}
  <h1>${esc(page.h1)}</h1>
  ${contenido()}
  ${PIE}
</div>`,
  });
  mkdirSync(new URL(`${page.path.slice(1)}/`, dist), { recursive: true });
  writeFileSync(new URL(`${page.path.slice(1)}/index.html`, dist), html);
  console.log(`prerender: ${page.path}`);
}

// ── 404 ──────────────────────────────────────────────────────────────────
// Vercel sirve dist/404.html con status 404 a toda ruta que no exista (ver
// vercel.json: ya no hay rewrite comodín). React monta NotFound encima.
writeFileSync(
  new URL("404.html", dist),
  documento({
    title: "Página no encontrada | IMPORTVIDE",
    description: "La página que buscas no existe. Revisa nuestros portacredenciales, cordones y soportes acrílicos o escríbenos por WhatsApp.",
    noindex: true,
    ogImage: `${SITE_URL}${CATALOG.acrilico.img}`,
    content: `
<div class="pre-wrap">
  <h1>No encontramos esta página</h1>
  <ul>
    ${seoPages.map((p) => `<li><a href="/${p.slug}">${esc(p.h1)}</a></li>`).join("\n    ")}
  </ul>
  ${PIE}
</div>`,
  })
);
console.log("prerender: 404.html");

// ── Sitemap ──────────────────────────────────────────────────────────────
// Se genera aquí para que liste exactamente las páginas que se acaban de
// prerenderizar: si se añade un producto desde el panel, entra solo.
const hoy = new Date().toISOString().slice(0, 10);
// Fecha del copy de las landings y de la página de políticas: vive en el
// repositorio, así que solo cambia cuando se edita ese texto.
const LASTMOD_CONTENIDO = "2026-10-04";

const entrada = (loc, lastmod, priority) =>
  `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entrada(`${SITE_URL}/`, hoy, "1.0"),
  ...seoPages.map((p) => entrada(`${SITE_URL}/${p.slug}`, LASTMOD_CONTENIDO, "0.9")),
  ...productos.map((p) =>
    entrada(`${SITE_URL}/product/${p.id}`, (p.createdAt ?? hoy).slice(0, 10), "0.7")
  ),
  ...Object.keys(CONTENIDO_ESTATICO).map((clave) =>
    entrada(`${SITE_URL}${STATIC_PAGES[clave].path}`, LASTMOD_CONTENIDO, clave === "politicas" ? "0.3" : "0.6")
  ),
  "</urlset>",
].join("\n");

writeFileSync(new URL("sitemap.xml", dist), `${sitemap}\n`);
console.log(
  `prerender: sitemap.xml con ${productos.length + seoPages.length + Object.keys(CONTENIDO_ESTATICO).length + 1} URLs`
);

console.log(
  `prerender OK: portada + ${productos.length} fichas + ${seoPages.length} landings`
);
