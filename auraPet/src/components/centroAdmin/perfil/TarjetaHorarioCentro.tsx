import { DIAS_SEMANA, DIAS_SEMANA_ORDEN, TEXTOS_CENTRO_ADMIN, TEXTOS_HORARIO_CENTRO as T } from "../../../constants";
import { useEditorHorarioCentro } from "../../../hooks/useEditorHorarioCentro";
import { textoHorario } from "../../../lib/centroAdmin";
import type { TarjetaDeCentroProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { Aviso } from "../../ui/Aviso";
import { TarjetaCentro } from "../TarjetaCentro";
import { FilasHorarioCentro } from "./FilasHorarioCentro";
import panel from "../../../css/centroAdmin/PanelCentro.module.css";
import styles from "../../../css/centroAdmin/UrgenciasCentro.module.css";

// Horario del centro: se ve por día y, con "Editar horario", se cambia.
export const TarjetaHorarioCentro = ({ centro, onGuardado }: TarjetaDeCentroProps) => {
  const h = useEditorHorarioCentro(centro, onGuardado);

  // Un centro 24/7 tiene el horario completo: no se edita
  const accion = !h.editando && !centro.urgencias247 && (
    <Boton variante="secundarioClaro" onClick={h.empezar}>{T.editar}</Boton>
  );

  if (centro.urgencias247) {
    return (
      <TarjetaCentro titulo={TEXTOS_CENTRO_ADMIN.horario}>
        <p className={panel.fuerte}>{T.abierto247}</p>
        <p className={styles.ayuda}>{T.ayuda247}</p>
      </TarjetaCentro>
    );
  }

  return (
    <TarjetaCentro titulo={TEXTOS_CENTRO_ADMIN.horario} accion={accion}>
      {h.editando ? (
        <>
          <p className={styles.ayuda}>{T.ayuda}</p>
          <FilasHorarioCentro dias={h.dias} onCambiarDia={h.cambiarDia} deshabilitado={h.ocupado} />
          {h.error && <Aviso tipo="error" texto={h.error} />}
          <div className={styles.pie}>
            <Boton variante="secundarioClaro" onClick={h.cancelar} disabled={h.ocupado}>{T.cancelar}</Boton>
            <Boton onClick={h.guardar} cargando={h.ocupado}>{T.guardar}</Boton>
          </div>
        </>
      ) : centro.horarios.length === 0 ? (
        <p className={panel.vacio}>{TEXTOS_CENTRO_ADMIN.sinHorario}</p>
      ) : (
        <dl className={panel.horarios}>
          {DIAS_SEMANA_ORDEN.map((dia) => {
            const x = centro.horarios.find((y) => y.diaSemana === dia);
            return (
              <div key={dia} className={panel.horarioFila}>
                <dt className={panel.fuerte}>{DIAS_SEMANA[dia]}</dt>
                <dd className={x ? panel.horarioAbierto : panel.suave}>{x ? textoHorario(x) : TEXTOS_CENTRO_ADMIN.cerrado}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </TarjetaCentro>
  );
};
