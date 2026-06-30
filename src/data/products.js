// Número de WhatsApp de IMPORTVIDE — cambia esto por el número real (solo dígitos, con código de país)
export const WHATSAPP_NUMBER = "593980118073";

export const products = [
  {
    id: 0,
    name: "Porta Credenciales Horizontales 100 Pack",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80",
    description: "Pack de 100 porta credenciales horizontales transparentes, impermeables y resellables. Tamaño 3.5x2.25 pulgadas.",
    category: "Oficina",
    amazonLink: "https://www.amazon.com/dp/B01E2BSVG2",
  },
  {
    id: 1,
    name: "Auriculares Bluetooth Pro",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    description: "Sonido premium, cancelación de ruido activa, 30h de batería.",
    category: "Electrónica",
  },
  {
    id: 2,
    name: "Smartwatch Serie X",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    description: "Monitor de salud, GPS integrado, resistente al agua.",
    category: "Electrónica",
  },
  {
    id: 3,
    name: "Cámara Portátil 4K",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    description: "Grabación 4K, estabilizador óptico, conexión Wi-Fi.",
    category: "Electrónica",
  },
  {
    id: 4,
    name: "Teclado Mecánico RGB",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    description: "Switches de alta precisión, retroiluminación RGB personalizable.",
    category: "Accesorios",
  },
  {
    id: 5,
    name: "Mouse Inalámbrico Gamer",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80",
    description: "16000 DPI, latencia ultrabaja, batería de 70h.",
    category: "Accesorios",
  },
  {
    id: 6,
    name: "Parlante Portátil Waterproof",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80",
    description: "Resistente al agua IPX7, 360° sonido, 20h reproducción.",
    category: "Audio",
  },
  {
    id: 7,
    name: "Lámpara LED de Escritorio",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80",
    description: "Luz cálida/fría ajustable, carga inalámbrica integrada.",
    category: "Hogar",
  },
  {
    id: 8,
    name: "Cargador Rápido 65W",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80",
    description: "Carga universal 65W, 3 puertos USB-C + USB-A.",
    category: "Accesorios",
  },
];

export function buildWhatsAppLink(product) {
  const message = encodeURIComponent(
    `Hola IMPORTVIDE! Me interesa el producto: *${product.name}* — $ ${product.price.toFixed(2)}. ¿Tienen disponibilidad?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}
