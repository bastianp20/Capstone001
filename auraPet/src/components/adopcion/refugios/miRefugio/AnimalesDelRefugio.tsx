import { Plus } from "lucide-react";
import { TEXTOS_MI_REFUGIO as T, TONOS_ADOPCION } from "../../../../constants";
import type { AnimalesDelRefugioProps } from "../../../../interfaces";
import { PestanasSubrayadas } from "../../comun/PestanasSubrayadas";
import { TarjetaAnimalRefugio } from "./TarjetaAnimalRefugio";

/** Pestañas En adopción · En proceso · Adoptados con la grilla de animales. */
export const AnimalesDelRefugio = ({
  animales,
  cargando,
  pestanas,
  pestana,
  onPestana,
  onPublicar,
  onVerPostulaciones,
}: AnimalesDelRefugioProps) => (
  <section className="ap-tarjeta mr-animales">
    <div className="mr-animales-cabecera">
      <h2>{T.animales}</h2>
      <button type="button" className="ap-btn ap-btn-primario ap-btn-chico" onClick={onPublicar}>
        <Plus size={16} aria-hidden /> {T.publicar}
      </button>
    </div>
    <PestanasSubrayadas etiqueta={T.animales} opciones={pestanas} valor={pestana} onCambiar={onPestana} />
    {cargando ? (
      <p className="ap-estado">{T.cargando}</p>
    ) : !animales.length ? (
      <p className="ap-estado">{T.vacioAnimales}</p>
    ) : (
      <div className="mr-grilla-animales">
        {animales.map((a, i) => (
          <TarjetaAnimalRefugio key={a.id} animal={a} tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]} onVerPostulaciones={onVerPostulaciones} />
        ))}
      </div>
    )}
  </section>
);
