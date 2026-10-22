import { useState } from "react";
import { COLUMNAS_SUPERADMIN, ESTADO_VERIFICACION, FILTROS_ASIGNACIONES, Iconos, PREDICADOS_FILTRO_ASIGNACIONES, TEXTOS_CENTRO_VETERINARIO } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getAsignacionesVeterinarios, getCentrosSelector } from "../../Api/getInfo";
import { asignarCentroAVeterinario, quitarCentroAVeterinario } from "../../Api/postInfo";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import type { AvisoEstado, FiltroAsignaciones, VeterinarioAsignaciones } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.asignaciones;
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
    filtros: PREDICADOS_FILTRO_ASIGNACIONES,
    filtroInicial: "todos" as FiltroAsignaciones,
  });
  const [centroElegido, setCentroElegido] = useState<Record<number, string>>({}); // vetId -> centroId del select
  const [ocupado, setOcupado] = useState<number | null>(null);                   // vetId que se está guardando
  const [aviso, setAviso] = useState<AvisoEstado | null>(null);

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

  return (
    <>
      <h1 className={styles.titulo}>Centros y veterinarios</h1>
      <p className={styles.subtitulo}>Revisa en qué centros atiende cada profesional y corrige las asignaciones.</p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar veterinario, especialidad o centro…"
        opciones={FILTROS_ASIGNACIONES}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      {aviso && <Aviso {...aviso} onCerrar={() => setAviso(null)} />}

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Veterinario", "Estado", "Centros donde atiende", "Asignar a otro centro"]}
        cargando={cargando}
        error={error}
        vacio={veterinarios.length === 0 ? "Todavía no hay veterinarios registrados." : "Ningún veterinario coincide con el filtro."}
        cantidad={visibles.length}
      >
        {visibles.map((v) => {
          // Solo centros del mismo "mundo": vet de prueba -> centros de prueba; vet real -> centros reales
          const disponibles = centros.filter(
            (c) => c.es_prueba === v.esPrueba && !v.centros.some((asignado) => asignado.id === c.id)
          );
          const guardando = ocupado === v.id;
          return (
            <FilaTabla key={v.id} columnas={COLUMNAS} atenuada={guardando}>
              {/* Veterinario */}
              <div className={styles.celdaDoble}>
                <span className={styles.fuerte}>
                  {v.nombre}
                  {v.esPrueba && <span className={styles.notaPrueba}>(prueba)</span>}
                </span>
                <span className={styles.detalle}>
                  {[v.especialidad ?? "Medicina general", v.numeroColegiado && `N° ${v.numeroColegiado}`].filter(Boolean).join(" · ")}
                </span>
              </div>

              <Etiqueta {...ESTADO_VERIFICACION[v.estado]} />

              {/* Centros asignados */}
              <div className={styles.chips}>
                {/* Sin centro asignado: lo que pidió al registrarse (si pidió algo) o "independiente" */}
                {v.centros.length === 0 && (
                  <span className={styles.italica}>
                    {v.centroSolicitado
                      ? TEXTOS_CENTRO_VETERINARIO.seAsignaAlAprobar(v.centroSolicitado)
                      : v.centroMencionado
                        ? TEXTOS_CENTRO_VETERINARIO.noEstaEnAuraPet(v.centroMencionado)
                        : TEXTOS_CENTRO_VETERINARIO.independienteCorto}
                  </span>
                )}
                {v.centros.map((c) => (
                  <span key={c.id} className={styles.chipCentro}>
                    {c.nombre}
                    {c.esPrueba && <span className={styles.notaPrueba}>(pruebas)</span>}
                    <button
                      type="button"
                      className={styles.quitarChip}
                      onClick={() => quitar(v, c.id, c.nombre)}
                      disabled={guardando}
                      title={`Quitar de ${c.nombre}`}
                      aria-label={`Quitar de ${c.nombre}`}
                    >
                      <Iconos.cerrar size={13} />
                    </button>
                  </span>
                ))}
              </div>

              {/* Asignar */}
              <div className={styles.asignar}>
                <select
                  className={styles.select}
                  value={centroElegido[v.id] ?? ""}
                  onChange={(e) => setCentroElegido((prev) => ({ ...prev, [v.id]: e.target.value }))}
                  disabled={guardando || disponibles.length === 0}
                  aria-label={`Centro para asignar a ${v.nombre}`}
                >
                  <option value="">{disponibles.length === 0 ? "Ya está en todos" : "Elegir centro…"}</option>
                  {disponibles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}{c.es_prueba ? " (pruebas)" : ""}
                    </option>
                  ))}
                </select>
                <button type="button" className={styles.botonAsignar} onClick={() => asignar(v)} disabled={guardando || !centroElegido[v.id]}>
                  Asignar
                </button>
              </div>
            </FilaTabla>
          );
        })}
      </TablaPanel>
    </>
  );
};
