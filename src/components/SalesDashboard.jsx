import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from "recharts";
import { supabase } from "../lib/supabase";
import styles from "./SalesDashboard.module.css";

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                 "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function getMonthRange(year, month) {
  const from = new Date(year, month, 1).toISOString();
  const to   = new Date(year, month + 1, 1).toISOString();
  return { from, to };
}

export default function SalesDashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year,  setYear]  = useState(now.getFullYear());
  const [data,  setData]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const { from, to } = getMonthRange(year, month);
    setLoading(true);
    supabase
      .from("invoice_logs")
      .select("product_name, quantity")
      .gte("created_at", from)
      .lt("created_at", to)
      .then(({ data: rows }) => {
        // Aggregate by product name
        const map = {};
        (rows ?? []).forEach(({ product_name, quantity }) => {
          map[product_name] = (map[product_name] ?? 0) + quantity;
        });
        const sorted = Object.entries(map)
          .map(([name, total]) => ({ name, total }))
          .sort((a, b) => b.total - a.total);
        setData(sorted);
        setLoading(false);
      });
  }, [month, year]);

  const topProduct  = data[0] ?? null;
  const totalUnits  = data.reduce((s, d) => s + d.total, 0);

  const years = [];
  for (let y = now.getFullYear(); y >= now.getFullYear() - 2; y--) years.push(y);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipName}>{payload[0].payload.name}</p>
        <p className={styles.tooltipVal}>{payload[0].value} unidades</p>
      </div>
    );
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Ventas del mes</h2>
        <div className={styles.headerRight}>
          {!collapsed && (
            <div className={styles.filters}>
              <select className={styles.select} value={month} onChange={(e) => setMonth(Number(e.target.value))}>
                {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select className={styles.select} value={year} onChange={(e) => setYear(Number(e.target.value))}>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
          <button
            className={styles.toggleBtn}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? "Mostrar" : "Ocultar"}
          >
            <svg
              className={`${styles.toggleArrow} ${collapsed ? styles.arrowUp : styles.arrowDown}`}
              width="18" height="18" viewBox="0 0 18 18" fill="none"
            >
              <path d="M4 7l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          {/* KPI cards */}
          <div className={styles.kpis}>
            {topProduct && (
              <div className={`${styles.kpi} ${styles.kpiTop}`}>
                <span className={styles.kpiIcon}>🏆</span>
                <div className={styles.kpiTopText}>
                  <span className={styles.kpiLabel}>Más vendido del mes</span>
                  <span className={styles.kpiValueOrange}>{topProduct.name}</span>
                  <span className={styles.kpiSub}>{topProduct.total} unidades vendidas</span>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className={styles.chartWrap}>
            {loading ? (
              <p className={styles.empty}>Cargando datos...</p>
            ) : data.length === 0 ? (
              <p className={styles.empty}>No hay ventas registradas en {MONTHS[month]} {year}.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#666" }}
                    angle={-35}
                    textAnchor="end"
                    interval={0}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#888" }}
                    allowDecimals={false}
                    width={32}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,107,0,0.06)" }} />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={64}>
                    {data.map((entry, i) => (
                      <Cell key={i} fill={i === 0 ? "#ff6b00" : "#ffb380"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
