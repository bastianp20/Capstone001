import { useState } from "react";
import { Colors, ESTADO_VERIFICACION, FILTROS_CENTROS } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getCentrosSuperadmin } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { ModalEditarCentro } from "../../Modal/EditarCentroModal";
import type { CentroListado, FiltroCentros } from "../../interfaces";

const colors = Colors;
const FONDO = "#f6f8f8";

// Qué deja pasar cada chip de filtro (los textos están en FILTROS_CENTROS)
const FILTRO_CENTROS: Record<FiltroCentros, (c: CentroListado) => boolean> = {
  todos: () => true,
  aprobado: (c) => c.estado === "aprobado",
  pendiente: (c) => c.estado === "pendiente",
  rechazado: (c) => c.estado === "rechazado",
  real: (c) => !c.esPrueba,
  prueba: (c) => c.esPrueba,
};
// El buscador busca por nombre, comuna o dirección
const camposCentro = (c: CentroListado) => [c.nombre, c.comuna, c.direccion];

// Sección "Centros" del superadmin: todos los centros (reales y de prueba,
// en cualquier estado), con buscador, filtros y botón para editar cada uno.
export const ListaCentros = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centros = [], cargando, error } = useConsulta(() => getCentrosSuperadmin(), [recarga]);
  const [centroEditando, setCentroEditando] = useState<CentroListado | null>(null);

  // Buscador + chips (hook reutilizable)
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: centros,
    camposBusqueda: camposCentro,
    filtros: FILTRO_CENTROS,
    filtroInicial: "todos" as FiltroCentros,
  });

  const columnas = "1.8fr 1fr 1.1fr 0.9fr 0.8fr 0.7fr 0.9fr 0.7fr";

  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: colors.text }}>Centros</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: colors.textMuted }}>
        Todos los centros de AuraPet. Para crear uno nuevo usa "+ Crear" → "Agregar centro".
      </p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, comuna o dirección…"
        opciones={FILTROS_CENTROS}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
          <span>Centro</span>
          <span>Comuna</span>
          <span>Teléfono</span>
          <span>Estado</span>
          <span>Tipo</span>
          <span>Vets</span>
          <span>Creado</span>
          <span />
        </div>

        {cargando && <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>Cargando…</div>}
        {error && <div style={{ padding: "24px 18px", textAlign: "center", color: "#a4272a", fontSize: 13 }}>{error}</div>}
        {!cargando && !error && visibles.length === 0 && (
          <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
            {centros.length === 0 ? "Todavía no hay centros." : "Ningún centro coincide con el filtro."}
          </div>
        )}

        {visibles.map((c) => {
          const estado = ESTADO_VERIFICACION[c.estado];
          return (
            <div
              key={c.id}
              style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${colors.border}`, fontSize: 13 }}
            >
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontWeight: 600 }}>{c.nombre}</span>
                <span style={{ fontSize: 12, color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.direccion}</span>
              </div>
              <span style={{ color: colors.textMuted }}>{c.comuna}</span>
              <span style={{ color: colors.textMuted }}>{c.telefono ? `+${c.telefono}` : "—"}</span>
              <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: estado.fondo, color: estado.color }}>
                {estado.texto}
              </span>
              {c.esPrueba ? (
                <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: 999, background: "#fdf3e1", color: "#8a5a00", fontSize: 12, fontWeight: 600 }}>
                  Prueba
                </span>
              ) : (
                <span style={{ color: colors.textMuted }}>Real</span>
              )}
              <span style={{ color: colors.textMuted }}>{c.veterinarios}</span>
              <span style={{ color: colors.textMuted }}>{formatFechaCorta(c.creadoEn)}</span>
              <button
                onClick={() => setCentroEditando(c)}
                style={{ justifySelf: "start", padding: "4px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, background: "white", color: colors.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Editar
              </button>
            </div>
          );
        })}
      </div>

      {centroEditando && (
        <ModalEditarCentro
          centro={centroEditando}
          onClose={() => setCentroEditando(null)}
          onGuardado={() => setRecarga((n) => n + 1)}
        />
      )}
    </>
  );
};
