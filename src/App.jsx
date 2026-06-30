import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";
import Header from "./components/Header";
import HeroBanner from "./components/HeroBanner";
import ProductCard from "./components/ProductCard";
import SalesDashboard from "./components/SalesDashboard";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/ProductDetail";
import Politicas from "./pages/Politicas";
import styles from "./App.module.css";

const EMPTY_FORM = { name: "", price: "", stock: "", description: "", image: "", category: "" };

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

  const fetchProducts = async () => {
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoadingProducts(false);
  };

  useEffect(() => { fetchProducts(); }, []);

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
      <Header />
      <HeroBanner />
      <main className={styles.main} id="productos">
        <div className={styles.sectionHeader}>
          <div className={styles.sectionTop}>
            <h2 className={styles.sectionTitle}>Nuestros Productos</h2>
            <p className={styles.sectionSub}>Consulta disponibilidad y precio por WhatsApp con un solo clic</p>
            {isAdmin && (
              <button className={styles.addBtn} onClick={openCreate}>
                + Agregar producto
              </button>
            )}
          </div>
        </div>

        {isAdmin && <SalesDashboard />}

        {loadingProducts ? (
          <div className={styles.loadingProducts}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div className={styles.empty}>No hay productos aún.</div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isAdmin={isAdmin}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
        )}
      </main>
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
                        <img src={src} alt={`img-${i}`} className={styles.previewImg} />
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login"    element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/admin"    element={<AdminRoute />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/politicas" element={<Politicas />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
