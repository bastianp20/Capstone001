import { useState } from "react";
import {
  CITAS_POR_PAGINA, ESTADO_LABEL, FILTROS_RANGO_CITAS, MS_ESPERA_BUSQUEDA, ORDEN_URGENCIAS,
  TEXTOS_CITAS, URGENCIA_LABEL,
} from "../../constants";
import { getAllCitas } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { useValorDiferido } from "../../hooks/useValorDiferido";
import type { EstadoCita, FiltrosCitas, RangoCitas, UrgenciaCita } from "../../interfaces";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { Paginacion } from "../../components/ui/Paginacion";
import { TablaCitas } from "../../components/superadmin/TablaCitas";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const ESTADOS = Object.keys(ESTADO_LABEL) as EstadoCita[];

// Sección "Citas": todas las citas de la plataforma con buscador, rango de
// fechas, estado, urgencia y paginación. La base filtra y pagina (getAllCitas),
// así no se descargan miles de citas de una vez.
export const CitasSuperAdmin = () => {
  const [busqueda, setBusqueda] = useState("");
  const [rango, setRango] = useState<RangoCitas>("proximas");
  const [estado, setEstado] = useState<EstadoCita | null>(null);
  const [urgencia, setUrgencia] = useState<UrgenciaCita | null>(null);
  const [pagina, setPagina] = useState(1);
  const busquedaDiferida = useValorDiferido(busqueda, MS_ESPERA_BUSQUEDA);

  const filtros: FiltrosCitas = { busqueda: busquedaDiferida, estado, urgencia, rango, pagina, porPagina: CITAS_POR_PAGINA };
  const { datos, cargando, error } = useConsulta(
    () => getAllCitas(filtros),
    [busquedaDiferida, estado, urgencia, rango, pagina]
  );

  // Cualquier cambio de filtro vuelve a la página 1
  const cambiarFiltro = <T,>(set: (v: T) => void) => (valor: T) => { set(valor); setPagina(1); };

  return (
    <>
      <h1 className={styles.titulo}>{TEXTOS_CITAS.titulo}</h1>
      <p className={styles.subtitulo}>{TEXTOS_CITAS.subtitulo}</p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={cambiarFiltro(setBusqueda)}
        placeholder={TEXTOS_CITAS.buscar}
        opciones={FILTROS_RANGO_CITAS}
        filtro={rango}
        onFiltro={cambiarFiltro(setRango)}
      />

      <div className={styles.filtrosExtra}>
        <select
          className={styles.select}
          value={estado ?? ""}
          onChange={(e) => cambiarFiltro(setEstado)((e.target.value || null) as EstadoCita | null)}
          aria-label="Filtrar por estado"
        >
          <option value="">{TEXTOS_CITAS.todosEstados}</option>
          {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_LABEL[e]}</option>)}
        </select>
        <select
          className={styles.select}
          value={urgencia ?? ""}
          onChange={(e) => cambiarFiltro(setUrgencia)((e.target.value || null) as UrgenciaCita | null)}
          aria-label="Filtrar por urgencia"
        >
          <option value="">{TEXTOS_CITAS.todasUrgencias}</option>
          {ORDEN_URGENCIAS.map((u) => <option key={u} value={u}>{URGENCIA_LABEL[u]}</option>)}
        </select>
      </div>

      <TablaCitas citas={datos?.citas ?? []} cargando={cargando} error={error} vacio={TEXTOS_CITAS.sinCitas} />
      <Paginacion pagina={pagina} porPagina={CITAS_POR_PAGINA} total={datos?.total ?? 0} onCambiar={setPagina} />
    </>
  );
};
