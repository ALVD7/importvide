import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";
import styles from "./Admin.module.css";

const EMPTY_FORM = { name: "", price: "", description: "", image: "", category: "" };

export default function Admin() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch products ──────────────────────────────────
  const fetchProducts = async () => {
    setLoadingList(true);
    const { data } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    setProducts(data ?? []);
    setLoadingList(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Form helpers ────────────────────────────────────
  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
    setFormSuccess("");
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description ?? "",
      image: product.image ?? "",
      category: product.category ?? "",
    });
    setFormError("");
    setFormSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setFormSuccess("");
  };

  // ── CREATE / UPDATE ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    if (!form.name || !form.price) return setFormError("Nombre y precio son obligatorios.");
    setSaving(true);

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      image: form.image,
      category: form.category,
    };

    let error;
    if (editingId) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingId));
    } else {
      ({ error } = await supabase.from("products").insert([payload]));
    }

    setSaving(false);
    if (error) return setFormError(error.message);
    setFormSuccess(editingId ? "✅ Producto actualizado." : "✅ Producto agregado.");
    cancelEdit();
    fetchProducts();
  };

  // ── DELETE ──────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    await supabase.from("products").delete().eq("id", deleteId);
    setDeleting(false);
    setDeleteId(null);
    fetchProducts();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>

        {/* Top bar */}
        <div className={styles.topbar}>
          <h1 className={styles.title}>Panel Admin</h1>
          <button className={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
        </div>

        {/* ── FORM (Create / Edit) ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>
            {editingId ? "Editar producto" : "Agregar producto"}
          </h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label className={styles.label}>Nombre *</label>
                <input name="name" className={styles.input} value={form.name} onChange={handleChange} placeholder="Nombre del producto" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Precio (S/.) *</label>
                <input name="price" type="number" step="0.01" min="0" className={styles.input} value={form.price} onChange={handleChange} placeholder="0.00" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Categoría</label>
                <input name="category" className={styles.input} value={form.category} onChange={handleChange} placeholder="Ej: Oficina, Electrónica..." />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>URL de imagen</label>
                <input name="image" className={styles.input} value={form.image} onChange={handleChange} placeholder="https://..." />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Descripción</label>
              <textarea name="description" className={styles.textarea} value={form.description} onChange={handleChange} placeholder="Describe el producto..." rows={3} />
            </div>

            {form.image && (
              <div className={styles.preview}>
                <p className={styles.previewLabel}>Vista previa</p>
                <img src={form.image} alt="preview" className={styles.previewImg} />
              </div>
            )}

            {formError   && <p className={styles.error}>{formError}</p>}
            {formSuccess && <p className={styles.successMsg}>{formSuccess}</p>}

            <div className={styles.formActions}>
              {editingId && (
                <button type="button" className={styles.cancelBtn} onClick={cancelEdit}>
                  Cancelar
                </button>
              )}
              <button type="submit" className={styles.btn} disabled={saving}>
                {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Agregar producto"}
              </button>
            </div>
          </form>
        </div>

        {/* ── PRODUCT LIST ── */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Productos ({products.length})</h2>
          {loadingList ? (
            <p className={styles.emptyMsg}>Cargando...</p>
          ) : products.length === 0 ? (
            <p className={styles.emptyMsg}>No hay productos aún.</p>
          ) : (
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Imagen</span>
                <span>Nombre</span>
                <span>Categoría</span>
                <span>Precio</span>
                <span>Acciones</span>
              </div>
              {products.map((p) => (
                <div key={p.id} className={styles.tableRow}>
                  <div className={styles.tableImg}>
                    {p.image
                      ? <img src={p.image} alt={p.name} />
                      : <span className={styles.noImg}>Sin imagen</span>}
                  </div>
                  <span className={styles.tableName}>{p.name}</span>
                  <span className={styles.tableCategory}>{p.category || "—"}</span>
                  <span className={styles.tablePrice}>S/. {Number(p.price).toFixed(2)}</span>
                  <div className={styles.tableActions}>
                    <button className={styles.editBtn} onClick={() => startEdit(p)}>Editar</button>
                    <button className={styles.deleteBtn} onClick={() => setDeleteId(p.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>¿Eliminar producto?</h3>
            <p className={styles.modalText}>Esta acción no se puede deshacer.</p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setDeleteId(null)} disabled={deleting}>
                Cancelar
              </button>
              <button className={styles.deleteBtn} onClick={confirmDelete} disabled={deleting}>
                {deleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
