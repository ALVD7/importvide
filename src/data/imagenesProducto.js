// Fotos extra de productos concretos, por id de producto.
const FOTOS = {
  // Portacredencial tipo caparazón
  "8fb078a8-d0ae-4812-bdc9-4fa26a957591": [
    "/img/productos/portacredencial-caparazon-mano-abierto.webp",
    "/img/productos/portacredencial-caparazon-mano-fondo-negro.webp",
    "/img/productos/portacredencial-caparazon-lote.webp",
    "/img/productos/portacredencial-caparazon-medidas.webp",
  ],
};

// Las fotos que ya tiene el producto (la portada incluida) se conservan al
// inicio; las de aquí se agregan después.
export function conImagenes(producto, base = "") {
  const fotos = FOTOS[producto?.id];
  if (!fotos) return producto;
  const previas = producto.images?.length ? producto.images : producto.image ? [producto.image] : [];
  const urls = [...new Set([...previas, ...fotos.map((f) => `${base}${f}`)])];
  return { ...producto, image: urls[0], images: urls };
}
