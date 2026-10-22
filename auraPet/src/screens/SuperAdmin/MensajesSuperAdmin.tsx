import { useState } from "react";
import {
  COLUMNAS_SUPERADMIN, ESTADO_CONTACTO, FILTROS_MENSAJES, PREDICADOS_FILTRO_MENSAJES, TEXTOS_MENSAJES as T,
} from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { useAccion } from "../../hooks/useAccion";
import { getMensajesContacto } from "../../Api/getInfo";
import { cambiarEstadoMensaje } from "../../Api/postInfo";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import { Aviso } from "../../components/ui/Aviso";
import type { EstadoContacto, FiltroMensajes, MensajeContacto } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.mensajes;
const camposMensaje = (m: MensajeContacto) => [m.nombre, m.correo, m.asunto, m.mensaje];
// Enlace para contestar desde el correo, con el asunto ya puesto
const enlaceRespuesta = (m: MensajeContacto) => `mailto:${m.correo}?subject=${encodeURIComponent(`Re: ${m.asunto} — AuraPet`)}`;

// Sección "Mensajes" del superadmin: lo que llega desde el formulario de
// Contacto. Se contesta por correo y se marca el estado para llevar el orden.
export const MensajesSuperAdmin = () => {
  const [recarga, setRecarga] = useState(0);
  const { datos: mensajes = [], cargando, error } = useConsulta(() => getMensajesContacto(), [recarga]);
  const { ejecutar, ocupado, error: errorAccion } = useAccion();
  const [enCurso, setEnCurso] = useState<number | null>(null);

  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: mensajes,
    camposBusqueda: camposMensaje,
    filtros: PREDICADOS_FILTRO_MENSAJES,
    filtroInicial: "pendiente" as FiltroMensajes,
  });

  const cambiarEstado = async (m: MensajeContacto, estado: EstadoContacto) => {
    setEnCurso(m.id);
    const ok = await ejecutar(() => cambiarEstadoMensaje(m.id, estado), "No se pudo actualizar el mensaje.");
    setEnCurso(null);
    if (ok) setRecarga((n) => n + 1);
  };

  return (
    <>
      <h1 className={styles.titulo}>{T.titulo}</h1>
      <p className={styles.subtitulo}>{T.subtitulo}</p>
      {errorAccion && <Aviso tipo="error" texto={errorAccion} />}

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre, correo o texto…"
        opciones={FILTROS_MENSAJES}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Remitente", "Asunto", "Mensaje", "Recibido", "Estado", ""]}
        cargando={cargando}
        error={error}
        vacio={mensajes.length === 0 ? T.vacio : T.vacioFiltro}
        cantidad={visibles.length}
      >
        {visibles.map((m) => (
          <FilaTabla key={m.id} columnas={COLUMNAS} atenuada={ocupado && enCurso === m.id}>
            <div className={styles.celdaDoble}>
              <span className={styles.fuerte}>{m.nombre}</span>
              <span className={`${styles.detalle} ${styles.recortado}`} title={m.correo}>{m.correo}</span>
            </div>
            <span className={styles.suave}>{m.asunto}</span>
            <span className={styles.motivo} title={m.mensaje}>{m.mensaje}</span>
            <span className={styles.suave}>{m.fecha}</span>
            <Etiqueta {...ESTADO_CONTACTO[m.estado]} />
            <div className={styles.acciones}>
              <a className={styles.botonSuave} href={enlaceRespuesta(m)}>{T.responder}</a>
              {m.estado === "pendiente" && (
                <button type="button" className={styles.botonPrimario} disabled={ocupado} onClick={() => cambiarEstado(m, "respondido")}>
                  {T.marcarRespondido}
                </button>
              )}
              {m.estado !== "cerrado" ? (
                <button type="button" className={styles.botonPeligro} disabled={ocupado} onClick={() => cambiarEstado(m, "cerrado")}>
                  {T.cerrar}
                </button>
              ) : (
                <button type="button" className={styles.botonEditar} disabled={ocupado} onClick={() => cambiarEstado(m, "pendiente")}>
                  {T.reabrir}
                </button>
              )}
            </div>
          </FilaTabla>
        ))}
      </TablaPanel>
    </>
  );
};
