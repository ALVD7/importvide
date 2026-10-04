import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header";
import Seo from "../components/Seo";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { PRODUCTOS_COTIZABLES } from "../data/staticPages";
import {
  ESTADOS,
  ESTADOS_ABIERTOS,
  CANALES,
  DIAS_SEGUIMIENTO,
  hoyGuayaquil,
  pendientes,
  enlaceContacto,
} from "../lib/cotizaciones";
import info from "./Info.module.css";
import styles from "./CotizacionesAdmin.module.css";

const FILTROS = [
  { value: "abiertas", label: "Abiertas" },
  { value: "atencion", label: "Requieren atención" },
  { value: "ganado", label: "Ganadas" },
  { value: "perdido", label: "Perdidas" },
  { value: "todas", label: "Todas" },
];

const NUEVA = {
  nombre: "",
  empresa: "",
  producto: "",
  cantidad: "",
  ciudad: "",
  contacto: "",
  canal: "whatsapp",
  notas: "",
  proximo_seguimiento: "",
};

const fecha = (iso) =>
  new Date(iso).toLocaleString("es-EC", {
    timeZone: "America/Guayaquil",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const consultar = () =>
  supabase.from("cotizaciones").select("*").order("created_at", { ascending: false });

function Fila({ c, atencion, onGuardada }) {
  const [edit, setEdit] = useState({
    estado: c.estado,
    monto: c.monto ?? "",
    proximo_seguimiento: c.proximo_seguimiento ?? "",
    notas: c.notas ?? "",
  });
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  const cambiado =
    edit.estado !== c.estado ||
    String(edit.monto) !== String(c.monto ?? "") ||
    edit.proximo_seguimiento !== (c.proximo_seguimiento ?? "") ||
    edit.notas !== (c.notas ?? "");

  const cambiarEstado = (estado) => {
    setEdit((e) => ({
      ...e,
      estado,
      // Al avanzar de estado se propone el próximo seguimiento automáticamente;
      // al cerrar (ganado/perdido) ya no hay seguimiento.
      proximo_seguimiento: ESTADOS_ABIERTOS.includes(estado)
        ? e.proximo_seguimiento || (DIAS_SEGUIMIENTO[estado] ? hoyGuayaquil(DIAS_SEGUIMIENTO[estado]) : "")
        : "",
    }));
  };

  const guardar = async () => {
    setGuardando(true);
    setError("");
    const { error: err } = await supabase
      .from("cotizaciones")
      .update({
        estado: edit.estado,
        monto: edit.monto === "" ? null : Number(edit.monto),
        proximo_seguimiento: edit.proximo_seguimiento || null,
        notas: edit.notas || null,
      })
      .eq("id", c.id);
    setGuardando(false);
    if (err) return setError(err.message);
    onGuardada();
  };

  const enlace = enlaceContacto(c.contacto, c.nombre);

  return (
    <article className={`${styles.fila} ${atencion ? styles.atencion : ""}`}>
      <div className={styles.cabecera}>
        <div>
          <strong>{c.nombre}</strong>
          {c.empresa && <span className={styles.empresa}> · {c.empresa}</span>}
          <div className={styles.meta}>
            {fecha(c.created_at)} · {CANALES.find((x) => x.value === c.canal)?.label ?? c.canal}
            {c.origen?.resumen && ` · ${c.origen.resumen}`}
          </div>
        </div>
        {atencion && <span className={styles.badge}>{atencion}</span>}
      </div>

      <p className={styles.pedido}>
        <strong>{c.producto}</strong> × {c.cantidad} · {c.ciudad}
        {c.fecha_requerida && ` · para el ${c.fecha_requerida}`}
      </p>
      {c.mensaje && <p className={styles.mensaje}>“{c.mensaje}”</p>}

      <div className={styles.campos}>
        <label>
          Estado
          <select value={edit.estado} onChange={(e) => cambiarEstado(e.target.value)}>
            {ESTADOS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>
        <label>
          Monto (USD)
          <input type="number" min="0" step="0.01" value={edit.monto} onChange={(e) => setEdit({ ...edit, monto: e.target.value })} />
        </label>
        <label>
          Próximo seguimiento
          <input type="date" value={edit.proximo_seguimiento} onChange={(e) => setEdit({ ...edit, proximo_seguimiento: e.target.value })} />
        </label>
        <label className={styles.notas}>
          Notas
          <textarea rows={2} value={edit.notas} maxLength={2000} onChange={(e) => setEdit({ ...edit, notas: e.target.value })} />
        </label>
      </div>

      <div className={styles.acciones}>
        {enlace && (
          <a href={enlace} target="_blank" rel="noopener noreferrer" className={styles.contactar} data-sin-medir>
            {enlace.startsWith("mailto:") ? "Escribir correo" : "Escribir por WhatsApp"}
          </a>
        )}
        <span className={styles.contacto}>{c.contacto}</span>
        <button type="button" className={styles.guardar} onClick={guardar} disabled={!cambiado || guardando}>
          {guardando ? "Guardando…" : "Guardar"}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </article>
  );
}

function NuevaCotizacion({ onCreada, onCancelar }) {
  const [form, setForm] = useState(NUEVA);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const crear = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError("");
    const { error: err } = await supabase.from("cotizaciones").insert({
      ...form,
      empresa: form.empresa || null,
      cantidad: Number(form.cantidad),
      notas: form.notas || null,
      proximo_seguimiento: form.proximo_seguimiento || hoyGuayaquil(1),
      estado: "contactado",
      origen: { resumen: CANALES.find((x) => x.value === form.canal)?.label ?? form.canal },
      pagina: "panel",
    });
    setGuardando(false);
    if (err) return setError(err.message);
    onCreada();
  };

  return (
    <form className={`${info.card} ${styles.nueva}`} onSubmit={crear}>
      <h2 className={info.sectionTitle}>Agregar cotización (WhatsApp, llamada…)</h2>
      <div className={styles.campos}>
        <label>Nombre *<input name="nombre" value={form.nombre} onChange={cambiar} required minLength={2} /></label>
        <label>Empresa<input name="empresa" value={form.empresa} onChange={cambiar} /></label>
        <label>
          Producto *
          <select name="producto" value={form.producto} onChange={cambiar} required>
            <option value="" disabled>Elige</option>
            {PRODUCTOS_COTIZABLES.map((p) => <option key={p.value} value={p.value}>{p.value}</option>)}
          </select>
        </label>
        <label>Cantidad *<input name="cantidad" type="number" min="1" value={form.cantidad} onChange={cambiar} required /></label>
        <label>Ciudad *<input name="ciudad" value={form.ciudad} onChange={cambiar} required minLength={2} /></label>
        <label>WhatsApp o correo *<input name="contacto" value={form.contacto} onChange={cambiar} required minLength={6} /></label>
        <label>
          Llegó por
          <select name="canal" value={form.canal} onChange={cambiar}>
            {CANALES.filter((x) => x.value !== "formulario").map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </label>
        <label>Próximo seguimiento<input name="proximo_seguimiento" type="date" value={form.proximo_seguimiento} onChange={cambiar} /></label>
        <label className={styles.notas}>Notas<textarea name="notas" rows={2} value={form.notas} onChange={cambiar} /></label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.acciones}>
        <button type="button" className={styles.secundario} onClick={onCancelar}>Cancelar</button>
        <button type="submit" className={styles.guardar} disabled={guardando}>{guardando ? "Guardando…" : "Agregar"}</button>
      </div>
    </form>
  );
}

export default function CotizacionesAdmin() {
  const { user, role, loading } = useAuth();
  const [lista, setLista] = useState(null);
  const [error, setError] = useState("");
  const [filtro, setFiltro] = useState("abiertas");
  const [agregando, setAgregando] = useState(false);

  const aplicar = ({ data, error: err }) => {
    if (err) setError(err.message);
    setLista(data ?? []);
  };
  const recargar = () => consultar().then(aplicar);

  const esAdmin = role === "admin";
  useEffect(() => {
    if (esAdmin) consultar().then(aplicar);
  }, [esAdmin]);

  const { sinContactar, seguimientos } = useMemo(() => pendientes(lista ?? []), [lista]);
  const motivo = (c) =>
    sinContactar.includes(c) ? "Sin contactar +24 h" : seguimientos.includes(c) ? "Seguimiento hoy" : "";

  if (loading) return <div className={info.page}><Header /><main className={info.main}>Cargando…</main></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!esAdmin) return <Navigate to="/" replace />;

  const visibles = (lista ?? []).filter((c) => {
    if (filtro === "abiertas") return ESTADOS_ABIERTOS.includes(c.estado);
    if (filtro === "atencion") return motivo(c);
    if (filtro === "todas") return true;
    return c.estado === filtro;
  });

  const ganado = (lista ?? []).filter((c) => c.estado === "ganado").reduce((s, c) => s + Number(c.monto ?? 0), 0);

  return (
    <div className={info.page}>
      <Seo title="Cotizaciones | IMPORTVIDE" description="Panel de seguimiento de cotizaciones." path="/admin/cotizaciones" noindex />
      <Header />
      <main className={`${info.main} ${styles.main}`}>
        <div className={styles.top}>
          <h1 className={info.title}>Cotizaciones</h1>
          {!agregando && (
            <button type="button" className={styles.guardar} onClick={() => setAgregando(true)}>+ Agregar</button>
          )}
        </div>

        <div className={styles.resumen}>
          <div><strong>{sinContactar.length}</strong><span>sin contactar +24 h</span></div>
          <div><strong>{seguimientos.length}</strong><span>seguimientos para hoy</span></div>
          <div><strong>{(lista ?? []).filter((c) => ESTADOS_ABIERTOS.includes(c.estado)).length}</strong><span>abiertas</span></div>
          <div><strong>${ganado.toLocaleString("es-EC", { maximumFractionDigits: 0 })}</strong><span>ganado (total)</span></div>
        </div>

        {agregando && (
          <NuevaCotizacion
            onCancelar={() => setAgregando(false)}
            onCreada={() => { setAgregando(false); recargar(); }}
          />
        )}

        <div className={styles.filtros} role="tablist">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              type="button"
              role="tab"
              aria-selected={filtro === f.value}
              className={filtro === f.value ? styles.filtroActivo : styles.filtro}
              onClick={() => setFiltro(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && <p className={styles.error}>No se pudieron cargar las cotizaciones: {error}</p>}
        {lista === null ? (
          <p>Cargando…</p>
        ) : visibles.length === 0 ? (
          <p className={styles.vacio}>No hay cotizaciones en esta vista.</p>
        ) : (
          visibles.map((c) => (
            <Fila key={`${c.id}-${c.actualizado_at ?? ""}`} c={c} atencion={motivo(c)} onGuardada={recargar} />
          ))
        )}
      </main>
    </div>
  );
}
