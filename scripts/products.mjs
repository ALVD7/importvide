// Fuente de productos para el prerender. Intenta leer el catálogo real de
// Supabase en tiempo de build (así las fichas estáticas reflejan precios y
// stock reales, e incluyen los productos que se añadan desde el panel) y, si
// no hay credenciales o la API falla, cae al catálogo estático de seoPages.js.
import { CATALOG } from "../src/data/seoPages.js";

const IMG_BASE = "https://importvide.com";

const desdeCatalogoEstatico = () =>
  Object.values(CATALOG).map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: null,
    inStock: p.inStock,
    description: p.alt,
    image: `${IMG_BASE}${p.img}`,
    category: "",
  }));

// Una fila con precio nulo o texto no debe tumbar el build.
const numero = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

const normalizar = (row) => ({
  id: row.id,
  name: row.name ?? "Producto",
  price: numero(row.price),
  stock: row.stock === null || row.stock === undefined ? null : numero(row.stock),
  inStock: Number(row.stock) > 0,
  description: row.description ?? "",
  image: row.images?.[0] ?? row.image ?? "",
  category: row.category ?? "",
});

export async function cargarProductos() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn("prerender: sin credenciales de Supabase, uso el catálogo estático");
    return desdeCatalogoEstatico();
  }

  try {
    const res = await fetch(
      `${url}/rest/v1/products?select=id,name,price,stock,description,image,images,category&order=created_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) throw new Error(`Supabase respondió ${res.status}`);
    const filas = await res.json();
    if (!Array.isArray(filas) || filas.length === 0) throw new Error("Supabase devolvió 0 productos");
    console.log(`prerender: ${filas.length} productos leídos de Supabase`);
    return filas.map(normalizar);
  } catch (error) {
    console.warn(`prerender: fallo al leer Supabase (${error.message}), uso el catálogo estático`);
    return desdeCatalogoEstatico();
  }
}

export function linkWhatsApp(producto) {
  const mensaje = encodeURIComponent(
    `Hola IMPORTVIDE! Me interesa el producto: *${producto.name}* — $ ${producto.price.toFixed(2)}. ¿Tienen disponibilidad?`
  );
  return `https://wa.me/593980118073?text=${mensaje}`;
}
