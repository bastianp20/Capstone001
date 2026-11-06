import { useState } from "react";
import { TEXTOS_CENTRO_ADMIN as T } from "../../constants";
import { getCentroDetalle } from "../../Api/getInfo";
import { useConsulta } from "../../hooks/useConsulta";
import type { SeccionDeCentroProps } from "../../interfaces";
import { FormularioCentro } from "../../components/centroAdmin/FormularioCentro";
import { TarjetaHorarioCentro } from "../../components/centroAdmin/perfil/TarjetaHorarioCentro";
import { TarjetaEspecialidadesCentro } from "../../components/centroAdmin/perfil/TarjetaEspecialidadesCentro";
import { TarjetaUrgenciasCentro } from "../../components/centroAdmin/perfil/TarjetaUrgenciasCentro";
import styles from "../../css/centroAdmin/PanelCentro.module.css";

// Mi centro: datos, horario, especialidades y urgencias/UCI (todo editable).
export const SeccionMiCentro = ({ centroId }: SeccionDeCentroProps) => {
  const [recarga, setRecarga] = useState(0);
  const { datos: centro, cargando, error } = useConsulta(() => getCentroDetalle(centroId), [centroId, recarga]);
  const recargar = () => setRecarga((n) => n + 1);

  if (cargando && !centro) return <p className={styles.estado}>Cargando…</p>;
  if (error || !centro) return <p className={styles.error}>{error ?? "No se encontró el centro."}</p>;

  return (
    <>
      <h1 className={styles.titulo}>
        {centro.nombre}
        {centro.esPrueba && <span className={styles.marcaPrueba}>{T.centroPrueba}</span>}
      </h1>

      {/* key: si cambia el centro, cada tarjeta se reinicia con sus datos */}
      <FormularioCentro key={`datos-${centro.id}`} centro={centro} onGuardado={recargar} />
      <TarjetaUrgenciasCentro key={`urg-${centro.id}`} centro={centro} onGuardado={recargar} />
      <TarjetaHorarioCentro key={`hor-${centro.id}`} centro={centro} onGuardado={recargar} />
      <TarjetaEspecialidadesCentro key={`esp-${centro.id}`} centro={centro} onGuardado={recargar} />
    </>
  );
};
