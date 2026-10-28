import { HeartHandshake, PartyPopper, Stethoscope, UserPlus } from "lucide-react";
import { TEXTO_ACTIVIDAD, TEXTOS_MIS_PUBLICACIONES as T } from "../../../constants";
import type { ActividadPublicacionesProps, TipoActividadPublicacion } from "../../../interfaces";
import { haceCuanto } from "../../../lib/publicacionesAdopcion";

const ICONO: Record<TipoActividadPublicacion, typeof UserPlus> = {
  postulacion: UserPlus,
  eleccion: HeartHandshake,
  atencion: Stethoscope,
  adopcion: PartyPopper,
};

/** Línea de tiempo: quién postuló, quién atendió, quién encontró familia. */
export const ActividadPublicaciones = ({ actividad }: ActividadPublicacionesProps) => (
  <section className="ap-tarjeta ap-actividad">
    <h2>{T.actividad}</h2>
    {actividad.length === 0 ? (
      <p className="ap-suave">{T.sinActividad}</p>
    ) : (
      <ol>
        {actividad.map((a, i) => {
          const Icono = ICONO[a.tipo];
          return (
            <li key={`${a.tipo}-${a.adopcionId}-${i}`}>
              <span className={`ap-actividad-icono ap-actividad-${a.tipo}`} aria-hidden>
                <Icono size={15} />
              </span>
              <span>
                {TEXTO_ACTIVIDAD[a.tipo](a.animal, a.persona)}
                <small> · {haceCuanto(a.fecha)}</small>
              </span>
            </li>
          );
        })}
      </ol>
    )}
  </section>
);
