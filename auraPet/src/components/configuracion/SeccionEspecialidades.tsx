import { TEXTOS_MIS_ESPECIALIDADES as T } from "../../constants";
import { useMisEspecialidades } from "../../hooks/useMisEspecialidades";
import type { SeccionEspecialidadesProps } from "../../interfaces";
import { SelectorEspecialidad } from "../veterinario/registro/SelectorEspecialidad";
import styles from "../../css/modal/ConfiguracionModal.module.css";

/** Configuración → "Mis especialidades" (solo veterinarios): todas las que quiera. */
export const SeccionEspecialidades = ({ onGuardado }: SeccionEspecialidadesProps) => {
  const e = useMisEspecialidades(onGuardado);
  if (e.cargando) return <p className={styles.filaDescripcion}>{T.cargando}</p>;
  return (
    <div className={styles.form}>
      {/* key: el campo "Otra" se abre si ya tenía una escrita */}
      <SelectorEspecialidad key={e.otra ? "con-otra" : "sin-otra"} especialidades={e.catalogo} especialidadIds={e.ids} especialidadOtra={e.otra} onCambiar={e.cambiar} opcional={false} />
      {e.error && <p className={styles.error}>{e.error}</p>}
      <div className={styles.acciones}>
        <button type="button" className={styles.btnPrimario} onClick={e.guardar} disabled={e.ocupado}>
          {e.ocupado ? T.guardando : T.guardar}
        </button>
      </div>
    </div>
  );
};
