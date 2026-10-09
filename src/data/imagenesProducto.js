// Fotos propias de productos concretos. Tienen prioridad sobre las que estén
// guardadas en la base de datos (se aplican por id de producto).
const FOTOS = {
  // Portacredencial tipo caparazón
  "8fb078a8-d0ae-4812-bdc9-4fa26a957591": [
    "/img/productos/portacredencial-caparazon-mano-abierto.webp",
    "/img/productos/portacredencial-caparazon-mano-fondo-negro.webp",
    "/img/productos/portacredencial-caparazon-lote.webp",
    "/img/productos/portacredencial-caparazon-medidas.webp",
  ],
};

export function conImagenes(producto, base = "") {
  const fotos = FOTOS[producto?.id];
  if (!fotos) return producto;
  const urls = fotos.map((f) => `${base}${f}`);
  return { ...producto, image: urls[0], images: urls };
}
