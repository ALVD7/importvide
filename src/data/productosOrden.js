// Orden del catálogo: portacredenciales, luego cordones y clips, y al final los
// acrílicos (habladores y soportes). Dentro de cada grupo se respeta el orden
// original (más recientes primero).
const quitarTildes = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function grupo(nombre = "") {
  const n = quitarTildes(nombre);
  if (/portacredencial|porta cred|porta carnet|portacarnet/.test(n)) return 0;
  if (/cordon|lanyard|cinta/.test(n)) return 1;
  if (/clip/.test(n)) return 2;
  if (/hablador|soporte|acrilic/.test(n)) return 3;
  return 4;
}

export function ordenarProductos(lista) {
  return lista
    .map((p, i) => [p, i])
    .sort((a, b) => grupo(a[0].name) - grupo(b[0].name) || a[1] - b[1])
    .map(([p]) => p);
}
