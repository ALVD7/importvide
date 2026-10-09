// Fotos extra de productos concretos, por id de producto.
const FOTOS = {
  // Portacredencial deslizable negro
  "f82f4976-0ca2-4ed8-9844-4226c1e10f9d": [
    "/img/productos/portacredencial-deslizable-negro-abierto.webp",
  ],
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
// Nombres que se muestran en la web, por id de producto.
const NOMBRES = {
  "6dd12d50-8fd1-4756-8795-b4c364f90d07": "Clips para credenciales",
};

export function conImagenes(original, base = "") {
  const producto = NOMBRES[original?.id] ? { ...original, name: NOMBRES[original.id] } : original;
  const fotos = FOTOS[producto?.id];
  if (!fotos) return producto;
  const previas = producto.images?.length ? producto.images : producto.image ? [producto.image] : [];
  const urls = [...new Set([...previas, ...fotos.map((f) => `${base}${f}`)])];
  return { ...producto, image: urls[0], images: urls };
}
