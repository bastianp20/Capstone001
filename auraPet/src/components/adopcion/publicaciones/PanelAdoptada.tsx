import { Heart } from "lucide-react";
import { useState } from "react";
import { MAX_TESTIMONIO_ADOPCION, TEXTOS_ADOPTADA as T, TONOS_ADOPCION } from "../../../constants";
import type { PanelAdoptadaProps } from "../../../interfaces";
import { iniciales } from "../../../lib/publicacionesAdopcion";
import { AvatarAnimal } from "../AvatarAnimal";
import { PanelLateralAdopcion } from "../comun/PanelLateralAdopcion";
import { CampoTextoAdopcion } from "../formulario/CampoTextoAdopcion";
import { InterruptorAdopcion } from "../formulario/InterruptorAdopcion";

/** "¡Tiene familia!": cierra la adopción con testimonio y traspaso de la ficha. */
export const PanelAdoptada = ({ nombreAnimal, fotoAnimal, especie, postulacion, ocupado, error, onConfirmar, onCerrar }: PanelAdoptadaProps) => {
  const [testimonio, setTestimonio] = useState("");
  const [traspasar, setTraspasar] = useState(true);
  const primerNombre = postulacion.nombre.split(" ")[0];

  return (
    <PanelLateralAdopcion
      titulo={T.titulo(nombreAnimal)}
      onCerrar={onCerrar}
      pie={
        <div className="ap-adoptada-pie">
          {error && <p className="adopta-campo-error" role="alert">{error}</p>}
          <button type="button" className="ap-btn ap-btn-primario ap-btn-ancho" disabled={ocupado} onClick={() => onConfirmar({ testimonio, traspasar })}>
            {ocupado ? T.confirmando : T.confirmar}
          </button>
          <p className="ap-suave">{T.gracias}</p>
        </div>
      }
    >
      <div className="ap-confeti" aria-hidden />
      <div className="ap-pareja">
        <AvatarAnimal especie={especie} fotoUrl={fotoAnimal} nombre={nombreAnimal} tono={TONOS_ADOPCION[0]} tamanoIcono={40} className="ap-pareja-foto" />
        <Heart size={26} className="ap-pareja-corazon" fill="currentColor" aria-hidden />
        <span className="ap-pareja-foto ap-avatar ap-avatar-grande">{iniciales(postulacion.nombre)}</span>
      </div>

      <div className="adopta-campo">
        <span className="adopta-campo-titulo">{T.quien}</span>
        <div className="ap-elegida">
          <span className="ap-avatar">{iniciales(postulacion.nombre)}</span>
          <strong>{postulacion.nombre}</strong>
        </div>
      </div>
      <CampoTextoAdopcion
        id="adoptada-testimonio"
        etiqueta={T.testimonio}
        valor={testimonio}
        onCambiar={setTestimonio}
        placeholder={T.testimonioPlaceholder}
        multilinea
        maximo={MAX_TESTIMONIO_ADOPCION}
      />
      <div className="ap-traspaso">
        <InterruptorAdopcion etiqueta={T.traspasar(nombreAnimal, primerNombre)} activo={traspasar} onCambiar={setTraspasar} />
        <p className="ap-suave">{T.traspasarDetalle}</p>
      </div>

      {testimonio.trim() && (
        <div className="ap-vista-polaroid">
          <span className="ap-suave">{T.vistaPrevia}</span>
          <figure className="adopta-polaroid" style={{ transform: "rotate(-2deg)" }}>
            <AvatarAnimal especie={especie} fotoUrl={fotoAnimal} nombre={nombreAnimal} tono={TONOS_ADOPCION[2]} tamanoIcono={54} className="adopta-polaroid-foto" />
            <figcaption>
              <strong>{nombreAnimal}</strong>
              <span>“{testimonio.trim()}”</span>
              <small>— {primerNombre}</small>
            </figcaption>
          </figure>
        </div>
      )}
    </PanelLateralAdopcion>
  );
};
