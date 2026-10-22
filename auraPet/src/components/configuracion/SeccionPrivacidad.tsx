import { useState } from "react";
import { TEXTOS_PRIVACIDAD as T } from "../../constants";
import { getMisDatos } from "../../Api/getInfo";
import { useAccion } from "../../hooks/useAccion";
import { descargarJson } from "../../lib/descargas";
import { fechaDentroDe } from "../../lib/fechas";
import type { SeccionPrivacidadProps } from "../../interfaces";
import { SolicitarEliminacion } from "./SolicitarEliminacion";
import styles from "../../css/modal/ConfiguracionModal.module.css";

// Configuración → Privacidad y datos: descarga lo que AuraPet guarda de la
// persona (función mis_datos, migración 31) y permite pedir la eliminación (migración 32).
export const SeccionPrivacidad = ({ perfilId }: SeccionPrivacidadProps) => {
  const { ejecutar, ocupado, error } = useAccion();
  const [listo, setListo] = useState(false);

  const descargar = async () => {
    setListo(false);
    const ok = await ejecutar(async () => {
      const datos = await getMisDatos();
      descargarJson(T.nombreArchivo(fechaDentroDe(0)), datos);
    }, "No se pudieron preparar tus datos.");
    setListo(ok);
  };

  return (
    <div className={styles.form}>
      <p className={styles.subtitulo}>{T.descargarTitulo}</p>
      <small className={styles.ayudaTexto}>{T.descargarAyuda}</small>
      {error && <p className={styles.error}>{error}</p>}
      {listo && <p className={styles.exito}>{T.descargado}</p>}
      <div className={styles.acciones}>
        <button type="button" className={styles.btnPrimario} onClick={descargar} disabled={ocupado}>
          {ocupado ? T.descargando : T.descargar}
        </button>
      </div>

      <SolicitarEliminacion perfilId={perfilId} />
    </div>
  );
};
