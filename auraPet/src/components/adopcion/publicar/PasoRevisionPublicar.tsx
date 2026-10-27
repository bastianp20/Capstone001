import { Stethoscope } from "lucide-react";
import { TAMANO_ADOPCION_LABEL, TEXTOS_ADOPCION, TEXTOS_FICHA_ADOPCION, TEXTOS_PUBLICAR as T } from "../../../constants";
import type { PasoPublicarProps } from "../../../interfaces";
import { especieAdopcion } from "../../../lib/adopcion";
import { AvatarAnimal } from "../AvatarAnimal";

const edadTexto = (anios: string, meses: string) =>
  [Number(anios) > 0 && `${anios} ${Number(anios) === 1 ? "año" : "años"}`, Number(meses) > 0 && `${meses} ${Number(meses) === 1 ? "mes" : "meses"}`]
    .filter(Boolean)
    .join(" y ");

/** Paso 4 — vista previa de cómo se verá la publicación. */
export const PasoRevisionPublicar = ({ datos }: Pick<PasoPublicarProps, "datos">) => (
  <div className="publica-vista">
    <p className="publica-vista-titulo">{T.revisaTitulo}</p>
    <article className="publica-vista-tarjeta">
      <AvatarAnimal
        especie={especieAdopcion(datos.especie ?? "otro")}
        fotoUrl={datos.fotos[0]?.vista ?? null}
        nombre={datos.nombre}
        tono="#ffe6d5"
        tamanoIcono={64}
        className="publica-vista-foto"
      />
      <div className="publica-vista-cuerpo">
        <h3>{datos.nombre}</h3>
        <p className="ficha-datos">
          {[datos.raza.trim() || null, edadTexto(datos.anios, datos.meses), datos.tamano && TAMANO_ADOPCION_LABEL[datos.tamano], datos.comuna]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {datos.frase && <blockquote className="ficha-frase">“{datos.frase}”</blockquote>}
        <div className="adopta-etiquetas">
          {datos.personalidad.map((p) => (
            <span key={p} className="adopta-etiqueta">
              {p}
            </span>
          ))}
        </div>
        <p className="publica-vista-historia">{datos.historia}</p>
        {datos.solicitaChequeo && (
          <p className="publica-vista-chequeo">
            <Stethoscope size={16} aria-hidden /> {TEXTOS_FICHA_ADOPCION.chequeoSolicitado}
          </p>
        )}
        <p className="publica-vista-gratis">{TEXTOS_ADOPCION.confianzaTitulo}</p>
      </div>
    </article>
  </div>
);
