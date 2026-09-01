// Prerenderiza como HTML estático la portada, las fichas de producto y las
// landings SEO tras el build de Vite. Los crawlers de IA (GPTBot, ClaudeBot,
// PerplexityBot) y de Bing no ejecutan JavaScript: sin esto solo verían el
// <div id="root"> vacío. El navegador carga igual el bundle de React, que toma
// el control al montar.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { seoPages, CATALOG } from "../src/data/seoPages.js";
import {
  SITE_URL,
  productJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
  localBusinessJsonLd,
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

const PIE = `<p><strong>IMPORTVIDE</strong> — Importador directo en Guayaquil, Ecuador. WhatsApp: +593 98 011 8073.</p>`;

// Documento completo para las rutas que Vite no genera (landings y fichas).
function documento({ title, description, canonical, ogImage, markdown, jsonLd, content }) {
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
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="IMPORTVIDE" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="es_EC" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="alternate" type="text/markdown" href="${markdown}" title="Esta página en Markdown" />
    <link rel="describedby" type="text/plain" href="/llms.txt" />
    <link rel="ai-catalog" type="application/json" href="/.well-known/ai-catalog.json" />
    <link rel="service-desc" type="application/json" href="/.well-known/mcp/server-card.json" />
    <link rel="api-catalog" href="/.well-known/api-catalog" />
    <link rel="preconnect" href="https://cbfvcyxrrpseasuujkcz.supabase.co" crossorigin />
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
  const description =
    producto.description ||
    `${producto.name} disponible en IMPORTVIDE. Venta al por mayor en Guayaquil con envío a todo Ecuador. Consulta precio y stock por WhatsApp.`;
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
  <p>${esc(description)}</p>
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
          alt: description,
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
  <h1>Todo lo que tu negocio necesita, lo importamos por ti</h1>
  <p>Artículos de identificación y señalización para tu negocio.</p>
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
const indexHtml = shell
  .replace("</head>", `  ${baseStyle}\n    ${jsonLdPortada}\n  </head>`)
  .replace('<div id="root"></div>', `<div id="root">${portada}\n    </div>`);
writeFileSync(new URL("index.html", dist), indexHtml);
console.log("prerender: / (portada)");

console.log(
  `prerender OK: portada + ${productos.length} fichas + ${seoPages.length} landings`
);
