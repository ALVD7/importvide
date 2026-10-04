// Datos del negocio (NAP: nombre, dirección, teléfono) en un solo lugar: los
// usan el pie de página, /contacto, /privacidad, el JSON-LD y el prerender.
// Deben coincidir EXACTAMENTE con la ficha de Google Business Profile.
//
// Lo marcado [PENDIENTE] está en null a propósito: mientras siga en null, la web
// simplemente no muestra ese dato (ni lo publica en el JSON-LD). No inventar.

export const BUSINESS = {
  name: "IMPORTVIDE",
  url: "https://importvide.com",
  logo: "/favicon-192.png",

  whatsapp: "593980118073",
  phone: "+593980118073",
  phoneDisplay: "+593 98 011 8073",

  // [PENDIENTE] correo con dominio propio, p. ej. "ventas@importvide.com"
  email: null,

  city: "Guayaquil",
  region: "Guayas",
  country: "EC",
  // Operación 100 % en línea, sin local de atención al público: no se publica
  // calle. [PENDIENTE] solo si se abre un local y se verifica en Google Business.
  streetAddress: null,
  serviceArea: "Guayaquil y envíos a todo Ecuador",

  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "17:00",
    label: "Lunes a viernes, de 08:00 a 17:00",
  },

  instagram: "https://www.instagram.com/importvide/",

  // [PENDIENTE] enlace a la ficha de Google Business Profile
  // (Google Maps → tu ficha → Compartir → copiar enlace)
  googleBusinessUrl: null,
  // [PENDIENTE] enlace directo para dejar reseña
  // (Business Profile → Pedir reseñas → copiar enlace, tipo https://g.page/r/.../review)
  googleReviewUrl: null,
};

export const whatsappUrl = (text) =>
  `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
