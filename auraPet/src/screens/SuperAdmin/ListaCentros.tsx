import { useState } from "react";
import { COLUMNAS_SUPERADMIN, ESTADO_VERIFICACION, ETIQUETA_ELIMINADO, ETIQUETA_PRUEBA, FILTROS_CENTROS, PREDICADOS_FILTRO_CENTROS, TEXTOS_DETALLE_CENTRO, TEXTOS_ELIMINAR_CENTRO } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { useEliminarCentro } from "../../hooks/useEliminarCentro";
import { getCentrosSuperadmin } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import { RechazarModal } from "../../Modal/ReachazarModal";
import { ModalEditarCentro } from "../../Modal/EditarCentroModal";
import { DetalleCentroModal } from "../../Modal/DetalleCentroModal";
import type { CentroListado, FiltroCentros } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.centros;
// El buscador busca por nombre, comuna o dirección
const camposCentro = (c: CentroListado) => [c.nombre, c.comuna, c.direccion];

// Sección "Centros" del superadmin: todos los centros (reales y de prueba,
// en cualquier estado), con buscador, filtros, editar y eliminar (desactivar).
export const ListaCentros = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centros = [], cargando, error } = useConsulta(() => getCentrosSuperadmin(), [recarga]);
  const [centroEditando, setCentroEditando] = useState<CentroListado | null>(null);
  // Centro abierto en "Ver detalles"
  const [centroDetalle, setCentroDetalle] = useState<CentroListado | null>(null);
  const eliminar = useEliminarCentro(() => setRecarga((n) => n + 1));

  // Buscador + chips (hook reutilizable)
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: centros,
    camposBusqueda: camposCentro,
    filtros: PREDICADOS_FILTRO_CENTROS,
    filtroInicial: "todos" as FiltroCentros,
  });

  return (
    <>
      <h1 className={styles.titulo}>Centros</h1>
      <p className={styles.subtitulo}>Todos los centros de AuraPet. Para crear uno nuevo usa "+ Crear" → "Agregar centro".</p>

      {eliminar.aviso && <Aviso {...eliminar.aviso} onCerrar={eliminar.cerrarAviso} />}

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, comuna o dirección…"
        opciones={FILTROS_CENTROS}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Centro", "Comuna", "Teléfono", "Estado", "Tipo", "Vets", "Creado", ""]}
        cargando={cargando}
        error={error}
        vacio={centros.length === 0 ? "Todavía no hay centros." : "Ningún centro coincide con el filtro."}
        cantidad={visibles.length}
      >
        {visibles.map((c) => (
          <FilaTabla key={c.id} columnas={COLUMNAS}>
            <div className={styles.celdaDoble}>
              <span className={styles.fuerte}>{c.nombre}</span>
              <span className={`${styles.detalle} ${styles.recortado}`} title={c.motivoEliminacion ?? c.direccion}>
                {c.motivoEliminacion ?? c.direccion}
              </span>
            </div>
            <span className={styles.suave}>{c.comuna}</span>
            <span className={styles.suave}>{c.telefono ? `+${c.telefono}` : "—"}</span>
            {c.eliminadoEn ? <Etiqueta {...ETIQUETA_ELIMINADO} /> : <Etiqueta {...ESTADO_VERIFICACION[c.estado]} />}
            {c.esPrueba ? <Etiqueta {...ETIQUETA_PRUEBA} /> : <span className={styles.suave}>Real</span>}
            <span className={styles.suave}>{c.veterinarios}</span>
            <span className={styles.suave}>{formatFechaCorta(c.creadoEn)}</span>
            <div className={styles.acciones}>
              <button type="button" className={styles.botonSuave} onClick={() => setCentroDetalle(c)}>
                {TEXTOS_DETALLE_CENTRO.verDetalles}
              </button>
              {c.eliminadoEn ? (
                <button type="button" className={styles.botonEditar} onClick={() => eliminar.reactivar(c)} disabled={eliminar.ocupado}>
                  {TEXTOS_ELIMINAR_CENTRO.reactivar}
                </button>
              ) : (
                <>
                  <button type="button" className={styles.botonEditar} onClick={() => setCentroEditando(c)}>
                    Editar
                  </button>
                  <button type="button" className={styles.botonPeligro} onClick={() => eliminar.pedirEliminar(c)}>
                    {TEXTOS_ELIMINAR_CENTRO.eliminar}
                  </button>
                </>
              )}
            </div>
          </FilaTabla>
        ))}
      </TablaPanel>

      {centroDetalle && (
        <DetalleCentroModal
          centroId={centroDetalle.id}
          onCerrar={() => setCentroDetalle(null)}
          onEditar={() => { setCentroEditando(centroDetalle); setCentroDetalle(null); }}
        />
      )}
      {eliminar.aEliminar && (
        <RechazarModal
          nombreSolicitud={`${eliminar.aEliminar.nombre} · ${eliminar.aEliminar.comuna}`}
          titulo={TEXTOS_ELIMINAR_CENTRO.titulo}
          descripcion={TEXTOS_ELIMINAR_CENTRO.descripcion}
          placeholder={TEXTOS_ELIMINAR_CENTRO.placeholder}
          textoConfirmar={TEXTOS_ELIMINAR_CENTRO.confirmar}
          textoProcesando={TEXTOS_ELIMINAR_CENTRO.procesando}
          ocupado={eliminar.ocupado}
          onCancelar={eliminar.cancelarEliminacion}
          onConfirmar={eliminar.confirmarEliminacion}
        />
      )}
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
