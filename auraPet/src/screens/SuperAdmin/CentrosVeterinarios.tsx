import { useState } from "react";
import { Colors, ESTADO_VERIFICACION, FILTROS_ASIGNACIONES, Iconos } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getAsignacionesVeterinarios, getCentrosSelector } from "../../Api/getInfo";
import { asignarCentroAVeterinario, quitarCentroAVeterinario } from "../../Api/postInfo";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import type { FiltroAsignaciones, VeterinarioAsignaciones } from "../../interfaces";

const colors = Colors;
const iconos = Iconos;
const FONDO = "#f6f8f8";
const ROJO = "#a4272a";

// Qué deja pasar cada chip de filtro (los textos están en FILTROS_ASIGNACIONES)
const FILTRO_ASIGNACIONES: Record<FiltroAsignaciones, (v: VeterinarioAsignaciones) => boolean> = {
  todos: () => true,
  sinCentro: (v) => v.centros.length === 0,
  pendientes: (v) => v.estado === "pendiente",
  prueba: (v) => v.esPrueba,
};
const camposVeterinario = (v: VeterinarioAsignaciones) => [v.nombre, v.especialidad, ...v.centros.map((c) => c.nombre)];

// Sección "Centros y veterinarios" del panel superadmin:
// revisar en qué centros atiende cada veterinario y corregir las asignaciones.
export const CentrosVeterinarios = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: veterinarios = [], cargando, error } = useConsulta(() => getAsignacionesVeterinarios(), [recarga]);
  const { datos: centros = [] } = useConsulta(() => getCentrosSelector(), []);

  // Buscador + chips (hook reutilizable)
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: veterinarios,
    camposBusqueda: camposVeterinario,
    filtros: FILTRO_ASIGNACIONES,
    filtroInicial: "todos" as FiltroAsignaciones,
  });
  const [centroElegido, setCentroElegido] = useState<Record<number, string>>({}); // vetId -> centroId del select
  const [ocupado, setOcupado] = useState<number | null>(null);                   // vetId que se está guardando
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);

  const ejecutar = async (vetId: number, accion: () => Promise<void>, mensajeOk: string) => {
    setOcupado(vetId);
    try {
      await accion();
      setAviso({ tipo: "ok", texto: mensajeOk });
      setRecarga((n) => n + 1);
    } catch (e) {
      setAviso({ tipo: "error", texto: e instanceof Error ? e.message : "No se pudo guardar el cambio." });
    } finally {
      setOcupado(null);
    }
  };

  const asignar = (v: VeterinarioAsignaciones) => {
    const centroId = Number(centroElegido[v.id]);
    if (!centroId) return;
    const centro = centros.find((c) => c.id === centroId);
    ejecutar(v.id, () => asignarCentroAVeterinario(v.id, centroId), `${v.nombre} ahora atiende en ${centro?.nombre ?? "el centro"}.`);
    setCentroElegido((prev) => ({ ...prev, [v.id]: "" }));
  };

  const quitar = (v: VeterinarioAsignaciones, centroId: number, nombreCentro: string) => {
    const seguro = window.confirm(
      `¿Quitar a ${v.nombre} de ${nombreCentro}?\n\nTambién se borran sus horarios de atención en ese centro.`
    );
    if (!seguro) return;
    ejecutar(v.id, () => quitarCentroAVeterinario(v.id, centroId), `${v.nombre} ya no atiende en ${nombreCentro}.`);
  };

  const columnas = "1.6fr 0.8fr 2fr 1.5fr";

  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: colors.text }}>Centros y veterinarios</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: colors.textMuted }}>
        Revisa en qué centros atiende cada profesional y corrige las asignaciones.
      </p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar veterinario, especialidad o centro…"
        opciones={FILTROS_ASIGNACIONES}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      {aviso && (
        <div
          style={{
            marginBottom: 14,
            padding: "10px 14px",
            borderRadius: 10,
            fontSize: 13,
            background: aviso.tipo === "ok" ? colors.accentSoft : "#fdecec",
            color: aviso.tipo === "ok" ? colors.accent : ROJO,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {aviso.texto}
          <button onClick={() => setAviso(null)} style={{ border: "none", background: "none", color: "inherit", cursor: "pointer" }} aria-label="Cerrar aviso">✕</button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
          <span>Veterinario</span>
          <span>Estado</span>
          <span>Centros donde atiende</span>
          <span>Asignar a otro centro</span>
        </div>

        {cargando && <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>Cargando…</div>}
        {error && <div style={{ padding: "24px 18px", textAlign: "center", color: ROJO, fontSize: 13 }}>{error}</div>}
        {!cargando && !error && visibles.length === 0 && (
          <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
            {veterinarios.length === 0 ? "Todavía no hay veterinarios registrados." : "Ningún veterinario coincide con el filtro."}
          </div>
        )}

        {visibles.map((v) => {
          // Solo centros del mismo "mundo": vet de prueba -> centros de prueba; vet real -> centros reales
          const disponibles = centros.filter(
            (c) => c.es_prueba === v.esPrueba && !v.centros.some((asignado) => asignado.id === c.id)
          );
          const estado = ESTADO_VERIFICACION[v.estado];
          const guardando = ocupado === v.id;
          return (
            <div
              key={v.id}
              style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, alignItems: "center", padding: "13px 18px", borderTop: `1px solid ${colors.border}`, opacity: guardando ? 0.6 : 1 }}
            >
              {/* Veterinario */}
              <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                  {v.nombre}
                  {v.esPrueba && <span style={{ marginLeft: 6, fontSize: 11, color: "#8a5a00" }}>(prueba)</span>}
                </span>
                <span style={{ fontSize: 12, color: colors.textMuted }}>
                  {[v.especialidad ?? "Medicina general", v.numeroColegiado && `N° ${v.numeroColegiado}`].filter(Boolean).join(" · ")}
                </span>
              </div>

              {/* Estado */}
              <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: estado.fondo, color: estado.color }}>
                {estado.texto}
              </span>

              {/* Centros asignados */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {v.centros.length === 0 && (
                  <span style={{ fontSize: 12.5, color: colors.textMuted, fontStyle: "italic" }}>Independiente (sin centro)</span>
                )}
                {v.centros.map((c) => (
                  <span
                    key={c.id}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 6px 4px 10px", borderRadius: 999, background: FONDO, border: `1px solid ${colors.border}`, fontSize: 12.5 }}
                  >
                    {c.nombre}
                    {c.esPrueba && <span style={{ fontSize: 11, color: "#8a5a00" }}>(pruebas)</span>}
                    <button
                      onClick={() => quitar(v, c.id, c.nombre)}
                      disabled={guardando}
                      title={`Quitar de ${c.nombre}`}
                      aria-label={`Quitar de ${c.nombre}`}
                      style={{ display: "flex", border: "none", background: "none", padding: 2, borderRadius: 999, cursor: "pointer", color: colors.textMuted }}
                    >
                      <iconos.cerrar size={13} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Asignar */}
              <div style={{ display: "flex", gap: 6 }}>
                <select
                  value={centroElegido[v.id] ?? ""}
                  onChange={(e) => setCentroElegido((prev) => ({ ...prev, [v.id]: e.target.value }))}
                  disabled={guardando || disponibles.length === 0}
                  style={{ flex: 1, minWidth: 0, padding: "7px 8px", borderRadius: 8, border: `1px solid ${colors.border}`, fontSize: 12.5, background: "white" }}
                >
                  <option value="">{disponibles.length === 0 ? "Ya está en todos" : "Elegir centro…"}</option>
                  {disponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}{c.es_prueba ? " (pruebas)" : ""}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => asignar(v)}
                  disabled={guardando || !centroElegido[v.id]}
                  style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: colors.accent, color: "white", fontSize: 12.5, fontWeight: 600, cursor: "pointer", opacity: !centroElegido[v.id] ? 0.5 : 1 }}
                >
                  Asignar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
