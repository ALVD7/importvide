import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import Marquee from "./components/Marquee";
import ScrollStory from "./components/ScrollStory";
import StatsBand from "./components/StatsBand";
import CtaBand from "./components/CtaBand";
import Reveal from "./components/Reveal";
import ProductCard from "./components/ProductCard";

// Solo lo ve el admin: se carga bajo demanda para no enviar recharts a todos los visitantes
const SalesDashboard = lazy(() => import("./components/SalesDashboard"));
import Footer from "./components/Footer";
import Seo from "./components/Seo";
import { localBusinessJsonLd, organizationJsonLd } from "./lib/structuredData";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Politicas from "./pages/Politicas";
import SeoLanding from "./pages/SeoLanding";
import Contacto from "./pages/Contacto";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import NotFound from "./pages/NotFound";
import Cotizar from "./pages/Cotizar";
import Privacidad from "./pages/Privacidad";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { seoPages } from "./data/seoPages";
import styles from "./App.module.css";

const EMPTY_FORM = { name: "", price: "", stock: "", description: "", image: "", category: "" };

const queryProducts = () =>
  supabase.from("products").select("*").order("created_at", { ascending: false });

function Home() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Modal state
  const [showForm, setShowForm]   = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget]     = useState(null);

  const [form, setForm]         = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError]   = useState("");

  const applyProducts = ({ data }) => {
    setProducts(data ?? []);
    setLoadingProducts(false);
  };

  const fetchProducts = () => queryProducts().then(applyProducts);

  // El setState ocurre al resolver la promesa, no dentro del efecto.
  useEffect(() => { queryProducts().then(applyProducts); }, []);

  // ── Form ──────────────────────────────────────────
  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setImagePreviews([]);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name:        product.name,
      price:       String(product.price),
      stock:       String(product.stock ?? 0),
      description: product.description ?? "",
      image:       product.image ?? "",
      category:    product.category ?? "",
    });
    setImageFiles([]);
    const existing = product.images?.length ? product.images : (product.image ? [product.image] : []);
    setImagePreviews(existing);
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const src = imagePreviews[index];
    if (src.startsWith("blob:")) {
      const blobsBefore = imagePreviews.slice(0, index).filter((p) => p.startsWith("blob:")).length;
      setImageFiles((prev) => prev.filter((_, i) => i !== blobsBefore));
      URL.revokeObjectURL(src);
    }
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!form.name || !form.price) return setFormError("Nombre y precio son obligatorios.");
    setSaving(true);

    // Upload new files
    const uploadedUrls = [];
    for (const file of imageFiles) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("productos")
        .upload(path, file, { upsert: true });
      if (uploadError) { setSaving(false); return setFormError(uploadError.message); }
      const { data: urlData } = supabase.storage.from("productos").getPublicUrl(path);
      uploadedUrls.push(urlData.publicUrl);
    }

    const existingUrls = imagePreviews.filter((p) => !p.startsWith("blob:"));
    const allImages = [...existingUrls, ...uploadedUrls];
    const primaryImage = allImages[0] ?? "";

    const payload = {
      name: form.name, price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      description: form.description,
      image: primaryImage,
      images: allImages,
      category: form.category,
    };
    const { error } = editingProduct
      ? await supabase.from("products").update(payload).eq("id", editingProduct.id)
      : await supabase.from("products").insert([payload]);
    setSaving(false);
    if (error) return setFormError(error.message);
    closeForm();
    fetchProducts();
  };

  // ── Delete ────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    fetchProducts();
  };

  return (
    <div className={styles.app}>
      <Seo
        title="Portacredenciales, Cordones y Acrílicos | IMPORTVIDE Ecuador"
        description="Importador directo en Guayaquil de portacredenciales, cordones y soportes acrílicos. Venta al por mayor para colegios, bancos y eventos en todo Ecuador."
        path="/"
        jsonLd={[organizationJsonLd(), localBusinessJsonLd()]}
      />
      <Header />
      <HeroBanner />
      <Marquee />
      <ScrollStory />
      <StatsBand productCount={products.length} />
      <main className={styles.main} id="productos">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTop}>
            <Reveal as="span" variant="fade" className={styles.sectionKicker}>
              Catálogo
            </Reveal>
            <Reveal as="h2" delay={60} className={styles.sectionTitle}>
              Nuestros productos
            </Reveal>
            <Reveal as="p" delay={120} className={styles.sectionSub}>
              Consulta disponibilidad y precio por WhatsApp con un solo clic
            </Reveal>
            <Reveal as="p" delay={180} className={styles.sectionSub}>
              Somos importadores directos de <Link to="/portacredenciales">portacredenciales</Link>,{" "}
              <Link to="/lanyards-ecuador">lanyards y cintas</Link> y{" "}
              <Link to="/habladores-acrilicos">habladores acrílicos</Link> en Guayaquil, con venta al
              por mayor para <Link to="/portacredenciales-para-colegios">colegios</Link>,{" "}
              <Link to="/portacredenciales-para-empresas">empresas y bancos</Link> y{" "}
              <Link to="/credenciales-para-eventos">eventos</Link> en todo Ecuador.
            </Reveal>
            {isAdmin && (
              <button className={styles.addBtn} onClick={openCreate}>
                + Agregar producto
              </button>
            )}
          </div>
        </div>

        {isAdmin && (
          <Suspense fallback={<div className={styles.loadingProducts}>Cargando panel...</div>}>
            <SalesDashboard />
          </Suspense>
        )}

        {loadingProducts ? (
          <div className={styles.loadingProducts}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>No hay productos aún.</div>
        ) : (
          <div className={styles.grid}>
            {products.map((product, i) => (
              <Reveal key={product.id} variant="blur" delay={(i % 4) * 90}>
                <ProductCard
                  product={product}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                />
              </Reveal>
            ))}
          </div>
        )}
      </main>
      <CtaBand />
      <Footer />

      {/* ── Modal: Create / Edit ── */}
      {showForm && (
        <div className={styles.overlay} onClick={closeForm}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editingProduct ? "Editar producto" : "Agregar producto"}
              </h3>
              <button className={styles.closeBtn} onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre *</label>
                  <input name="name" className={styles.input} value={form.name} onChange={handleChange} placeholder="Nombre del producto" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Precio ($) *</label>
                  <input name="price" type="number" step="0.01" min="0" className={styles.input} value={form.price} onChange={handleChange} placeholder="0.00" required />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Cantidad en stock</label>
                  <input name="stock" type="number" min="0" className={styles.input} value={form.stock} onChange={handleChange} placeholder="0" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Categoría</label>
                  <input name="category" className={styles.input} value={form.category} onChange={handleChange} placeholder="Ej: Oficina..." />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Imágenes del producto</label>
                <label className={styles.fileLabel}>
                  <span className={styles.fileBtn}>+ Agregar imágenes</span>
                  <input type="file" accept="image/*" multiple className={styles.fileInput} onChange={handleImageChange} />
                </label>
                {imagePreviews.length > 0 && (
                  <div className={styles.previewGrid}>
                    {imagePreviews.map((src, i) => (
                      <div key={i} className={styles.previewThumb}>
                        <img src={src} alt={`Vista previa ${i + 1}`} className={styles.previewImg} />
                        <button type="button" className={styles.removeImgBtn} onClick={() => removeImage(i)}>✕</button>
                        {i === 0 && <span className={styles.mainBadge}>Principal</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descripción</label>
                <textarea name="description" className={styles.textarea} value={form.description} onChange={handleChange} placeholder="Describe el producto..." rows={3} />
              </div>
              {formError && <p className={styles.formError}>{formError}</p>}
              <div className={styles.formActions}>
                <button type="button" className={styles.cancelBtn} onClick={closeForm}>Cancelar</button>
                <button type="submit" className={styles.saveBtn} disabled={saving}>
                  {saving ? "Guardando..." : editingProduct ? "Guardar cambios" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Delete confirm ── */}
      {deleteTarget && (
        <div className={styles.overlay} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>¿Eliminar producto?</h3>
            <p className={styles.modalText}>
              Vas a eliminar <strong>{deleteTarget.name}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className={styles.formActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancelar</button>
              <button className={styles.deleteSaveBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      // "instant" evita que el scroll suave del CSS anime cada cambio de ruta.
      window.scrollTo({ top: 0, behavior: "instant" });
      return;
    }
    // Al llegar desde otra página, la portada se monta con el catálogo vacío:
    // cuando los productos llegan de Supabase crecen varios miles de píxeles y
    // empujan la sección destino hacia abajo. Por eso no basta con un solo
    // salto: hay que reajustar mientras la altura siga cambiando, y soltar el
    // control en cuanto el usuario mueva el scroll por su cuenta.
    const id = hash.slice(1);
    let observer;

    const align = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
    };

    const release = () => {
      observer?.disconnect();
      window.removeEventListener("wheel", release);
      window.removeEventListener("touchstart", release);
      window.removeEventListener("keydown", release);
    };

    observer = new ResizeObserver(align);
    observer.observe(document.body);
    window.addEventListener("wheel", release, { passive: true });
    window.addEventListener("touchstart", release, { passive: true });
    window.addEventListener("keydown", release);

    align();
    const timer = setTimeout(release, 2500);

    return () => {
      release();
      clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}

function AdminRoute() {
  const { user, role, loading } = useAuth();
  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (!user || role !== "admin") return <Navigate to="/" replace />;
  return <Navigate to="/" replace />;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className={styles.loading}>Cargando...</div>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/admin"    element={<AdminRoute />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
          <Route path="/cotizar" element={<Cotizar />} />
          <Route path="/privacidad" element={<Privacidad />} />
          {seoPages.map((page) => (
            <Route key={page.slug} path={`/${page.slug}`} element={<SeoLanding page={page} />} />
          ))}
          <Route path="*"         element={<NotFound />} />
        </Routes>
        <WhatsAppFloat />
      </AuthProvider>
    </BrowserRouter>
  );
}
