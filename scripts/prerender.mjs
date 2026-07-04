// Prerenderiza las landings SEO como HTML estático tras el build de Vite.
// Los crawlers de IA (GPTBot, ClaudeBot, PerplexityBot) y de Bing no ejecutan
// JavaScript: sin esto solo verían el <div id="root"> vacío. El navegador
// carga igual el bundle de React, que toma el control al montar.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { seoPages, CATALOG } from "../src/data/seoPages.js";
import {
  SITE_URL,
  productJsonLd,
  faqJsonLd,
  breadcrumbJsonLd,
} from "../src/lib/structuredData.js";

const dist = new URL("../dist/", import.meta.url);
const shell = readFileSync(new URL("index.html", dist), "utf8");

const assetTags = [...shell.matchAll(/<(?:script[^>]*type="module"[^>]*|link[^>]*rel="stylesheet"[^>]*)>(?:<\/script>)?/g)]
  .map((m) => m[0])
  .join("\n    ");
if (!assetTags.includes("script")) throw new Error("No se encontró el bundle en dist/index.html");

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

const baseStyle = `<style>
  body{font-family:system-ui,sans-serif;color:#111;background:#f7f7f7;margin:0}
  .pre-wrap{max-width:860px;margin:0 auto;padding:32px 20px;line-height:1.65}
  .pre-wrap img{max-width:240px;height:auto;border-radius:8px}
  .pre-wrap a{color:#ff6b00}
</style>`;

for (const page of seoPages) {
  const products = page.products.map((k) => CATALOG[k]);
  const canonical = `${SITE_URL}/${page.slug}`;
  const ogImage = `${SITE_URL}${products[0]?.img ?? ""}`;

  const jsonLd = [
    breadcrumbJsonLd([
      { name: "Inicio", path: "/" },
      { name: page.h1, path: `/${page.slug}` },
    ]),
    faqJsonLd(page.faqs),
    ...products.map(productJsonLd),
  ]
    .map((o) => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n    ");

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
  <p><strong>IMPORTVIDE</strong> — Importador directo en Guayaquil, Ecuador. WhatsApp: +593 98 011 8073.</p>
</div>`;

  const html = `<!doctype html>
<html lang="es-EC">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192.png" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(page.title)}</title>
    <meta name="description" content="${esc(page.description)}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="IMPORTVIDE" />
    <meta property="og:title" content="${esc(page.title)}" />
    <meta property="og:description" content="${esc(page.description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="es_EC" />
    <meta name="twitter:card" content="summary_large_image" />
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

  mkdirSync(new URL(`${page.slug}/`, dist), { recursive: true });
  writeFileSync(new URL(`${page.slug}/index.html`, dist), html);
  console.log(`prerender: /${page.slug}`);
}

console.log(`prerender OK: ${seoPages.length} páginas estáticas`);
