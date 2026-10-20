import { useState } from "react";
import { COLUMNAS_SUPERADMIN, ESTADO_VERIFICACION, ETIQUETA_PRUEBA, FILTROS_CENTROS, PREDICADOS_FILTRO_CENTROS, TEXTOS_DETALLE_CENTRO } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getCentrosSuperadmin } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { ModalEditarCentro } from "../../Modal/EditarCentroModal";
import { DetalleCentroModal } from "../../Modal/DetalleCentroModal";
import type { CentroListado, FiltroCentros } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.centros;
// El buscador busca por nombre, comuna o dirección
const camposCentro = (c: CentroListado) => [c.nombre, c.comuna, c.direccion];

// Sección "Centros" del superadmin: todos los centros (reales y de prueba,
// en cualquier estado), con buscador, filtros y botón para editar cada uno.
export const ListaCentros = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centros = [], cargando, error } = useConsulta(() => getCentrosSuperadmin(), [recarga]);
  const [centroEditando, setCentroEditando] = useState<CentroListado | null>(null);
  // Centro abierto en "Ver detalles"
  const [centroDetalle, setCentroDetalle] = useState<CentroListado | null>(null);

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
              <span className={`${styles.detalle} ${styles.recortado}`} title={c.direccion}>{c.direccion}</span>
            </div>
            <span className={styles.suave}>{c.comuna}</span>
            <span className={styles.suave}>{c.telefono ? `+${c.telefono}` : "—"}</span>
            <Etiqueta {...ESTADO_VERIFICACION[c.estado]} />
            {c.esPrueba ? <Etiqueta {...ETIQUETA_PRUEBA} /> : <span className={styles.suave}>Real</span>}
            <span className={styles.suave}>{c.veterinarios}</span>
            <span className={styles.suave}>{formatFechaCorta(c.creadoEn)}</span>
            <div className={styles.acciones}>
              <button type="button" className={styles.botonSuave} onClick={() => setCentroDetalle(c)}>
                {TEXTOS_DETALLE_CENTRO.verDetalles}
              </button>
              <button type="button" className={styles.botonEditar} onClick={() => setCentroEditando(c)}>
                Editar
              </button>
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
