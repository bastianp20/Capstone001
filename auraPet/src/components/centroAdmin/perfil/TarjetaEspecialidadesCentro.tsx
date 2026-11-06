import { TEXTOS_CENTRO_ADMIN, TEXTOS_ESPECIALIDADES_CENTRO as T } from "../../../constants";
import { useEditarEspecialidadesCentro } from "../../../hooks/useEditarEspecialidadesCentro";
import type { TarjetaDeCentroProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { Aviso } from "../../ui/Aviso";
import { FiltroEspecialidades } from "../../ui/FiltroEspecialidades";
import { TarjetaCentro } from "../TarjetaCentro";
import panel from "../../../css/centroAdmin/PanelCentro.module.css";
import styles from "../../../css/centroAdmin/UrgenciasCentro.module.css";

// Especialidades del centro: se ven como chips y se editan con selección múltiple.
export const TarjetaEspecialidadesCentro = ({ centro, onGuardado }: TarjetaDeCentroProps) => {
  const e = useEditarEspecialidadesCentro(centro, onGuardado);
  const accion = !e.editando && <Boton variante="secundarioClaro" onClick={e.empezar}>{T.editar}</Boton>;

  return (
    <TarjetaCentro titulo={TEXTOS_CENTRO_ADMIN.especialidades} accion={accion}>
      {e.editando ? (
        <>
          <FiltroEspecialidades especialidades={e.catalogo} seleccion={e.seleccion} onCambiar={e.setSeleccion}
            etiqueta={T.etiqueta} ayuda={T.ayuda} />
          {e.error && <Aviso tipo="error" texto={e.error} />}
          <div className={styles.pie}>
            <Boton variante="secundarioClaro" onClick={e.cancelar} disabled={e.ocupado}>{T.cancelar}</Boton>
            <Boton onClick={e.guardar} cargando={e.ocupado}>{T.guardar}</Boton>
          </div>
        </>
      ) : centro.especialidades.length === 0 ? (
        <p className={panel.vacio}>{TEXTOS_CENTRO_ADMIN.sinEspecialidades}</p>
      ) : (
        <div className={panel.chips}>
          {centro.especialidades.map((nombre) => <span key={nombre} className={panel.chip}>{nombre}</span>)}
        </div>
      )}
    </TarjetaCentro>
  );
};
