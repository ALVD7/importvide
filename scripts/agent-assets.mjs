// Genera, después del build de Vite, todo lo que consumen los agentes de IA:
//
//   dist/index.md, dist/<slug>.md   representación Markdown de cada página
//                                   (se sirve también con Accept: text/markdown)
//   dist/llms-full.txt              contenido completo del sitio en texto plano
//   dist/.well-known/agent-skills/index.json
//                                   índice de Agent Skills con digest sha256 real
//
// Se ejecuta con `npm run build`, después de vite build y de prerender.mjs.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { seoPages, CATALOG } from "../src/data/seoPages.js";
import { productos, CATEGORIAS, EMPRESA, SITE_URL } from "../src/data/agentCatalog.js";

const dist = new URL("../dist/", import.meta.url);
const distPath = (p) => new URL(p, dist);

const PIE = `\n---\n\n**IMPORTVIDE** — ${EMPRESA.descripcion}\n\n- WhatsApp: ${EMPRESA.whatsapp} · ${EMPRESA.whatsapp_url}\n- Horario: ${EMPRESA.horario}\n- Envíos: ${EMPRESA.envios}\n- ${EMPRESA.pedidos}\n`;

const filaProducto = (p) =>
  `| ${p.nombre} | $${p.precio_usd.toFixed(2)} | ${p.medidas || "—"} | ${p.en_stock ? "En stock" : "Sin stock"} | ${p.url} |`;

const TABLA_CABECERA = "| Producto | Precio ref. (USD) | Medidas | Stock | Ficha |\n| --- | --- | --- | --- | --- |";

function tablaProductos(lista) {
  return [TABLA_CABECERA, ...lista.map(filaProducto)].join("\n");
}

// ── Markdown de la portada ───────────────────────────────────────────────
function markdownHome() {
  const porCategoria = Object.entries(CATEGORIAS)
    .map(([clave, cat]) => {
      const lista = productos.filter((p) => p.categoria === clave);
      return `### ${cat.nombre}\n\n${cat.url}\n\n${tablaProductos(lista)}`;
    })
    .join("\n\n");

  return `# IMPORTVIDE — Portacredenciales, lanyards y habladores acrílicos en Ecuador

> ${EMPRESA.descripcion} Venta al por mayor para colegios, bancos, empresas, entidades públicas y organizadores de eventos, con envío a todo Ecuador.

- **URL canónica:** ${SITE_URL}/
- **Ciudad:** ${EMPRESA.ciudad} · ${EMPRESA.nota_local}
- **Contacto:** WhatsApp ${EMPRESA.whatsapp} (${EMPRESA.whatsapp_url}) · Instagram ${EMPRESA.instagram}
- **Horario:** ${EMPRESA.horario}
- **Moneda:** ${EMPRESA.moneda} · ${EMPRESA.factura}

## Cómo comprar

${EMPRESA.pedidos}

${EMPRESA.envios}

Política de devoluciones: ${EMPRESA.politicas}

## Catálogo

${porCategoria}

## Páginas del sitio

${seoPages.map((p) => `- [${p.h1}](${SITE_URL}/${p.slug}) — ${p.description}`).join("\n")}

## Para agentes

- Servidor MCP: ${SITE_URL}/mcp (Streamable HTTP, sin autenticación)
- Server card: ${SITE_URL}/.well-known/mcp/server-card.json
- Agent Skills: ${SITE_URL}/.well-known/agent-skills/index.json
- Manifiesto ARD: ${SITE_URL}/.well-known/ai-catalog.json
- Resumen llms.txt: ${SITE_URL}/llms.txt
${PIE}`;
}

// ── Markdown de una landing ──────────────────────────────────────────────
function markdownPagina(page) {
  const lista = page.products
    .map((k) => CATALOG[k])
    .map((p) => productos.find((x) => x.id === p.id))
    .filter(Boolean);

  const secciones = page.sections
    .map((s) => {
      const cuerpo = [
        ...s.paras,
        ...(s.bullets ? [s.bullets.map((b) => `- ${b}`).join("\n")] : []),
      ].join("\n\n");
      return `## ${s.h2}\n\n${cuerpo}`;
    })
    .join("\n\n");

  const faqs = page.faqs.map((f) => `### ${f.q}\n\n${f.a}`).join("\n\n");
  const relacionadas = page.related.map((r) => `- [${r.label}](${SITE_URL}${r.to})`).join("\n");
  const imagenes = (page.gallery ?? [])
    .map((g) => `- ![${g.alt}](${SITE_URL}${g.src})`)
    .join("\n");

  return `# ${page.h1}

> ${page.description}

- **URL canónica:** ${SITE_URL}/${page.slug}
- **Empresa:** IMPORTVIDE, ${EMPRESA.ciudad}

${page.intro.join("\n\n")}

## Productos disponibles

${tablaProductos(lista)}

Precios en USD referenciales; el precio por volumen se cotiza por WhatsApp.

${secciones}
${imagenes ? `\n## Imágenes\n\n${imagenes}\n` : ""}
## Preguntas frecuentes

${faqs}

## También te puede interesar

${relacionadas}
${PIE}`;
}

// ── Escritura ────────────────────────────────────────────────────────────
const home = markdownHome();
writeFileSync(distPath("index.md"), home);

const paginas = seoPages.map((page) => {
  const md = markdownPagina(page);
  writeFileSync(distPath(`${page.slug}.md`), md);
  return md;
});

writeFileSync(
  distPath("llms-full.txt"),
  [
    "# IMPORTVIDE — contenido completo del sitio",
    `> Generado el ${new Date().toISOString().slice(0, 10)} desde ${SITE_URL}`,
    home,
    ...paginas,
  ].join("\n\n")
);

// ── Índice de Agent Skills con digest real ───────────────────────────────
const skillsDir = distPath(".well-known/agent-skills/");
if (!existsSync(skillsDir)) mkdirSync(skillsDir, { recursive: true });

const skills = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => {
    const ruta = new URL(`${d.name}/SKILL.md`, skillsDir);
    const contenido = readFileSync(ruta);
    const frontmatter = contenido.toString().match(/^---\n([\s\S]*?)\n---/);
    const description = frontmatter?.[1].match(/^description:\s*(.+)$/m)?.[1].trim() ?? "";
    return {
      name: d.name,
      type: "skill-md",
      description,
      url: `${SITE_URL}/.well-known/agent-skills/${d.name}/SKILL.md`,
      digest: `sha256:${createHash("sha256").update(contenido).digest("hex")}`,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

if (skills.length === 0) throw new Error("No se encontró ninguna SKILL.md en dist/.well-known/agent-skills");

writeFileSync(
  new URL("index.json", skillsDir),
  `${JSON.stringify(
    { $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json", skills },
    null,
    2
  )}\n`
);

console.log(
  `agent-assets OK: ${paginas.length + 1} Markdown, llms-full.txt y ${skills.length} agent skills`
);
