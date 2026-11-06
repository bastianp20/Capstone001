import { Megaphone } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PESTANAS_PUBLICACIONES, rutaFichaAdopcion, TEXTOS_MIS_PUBLICACIONES as T, TONOS_ADOPCION } from "../../../constants";
import { useMisPublicaciones } from "../../../hooks/useMisPublicaciones";
import type { PublicacionPropia, SeccionMisPublicacionesProps } from "../../../interfaces";
import { PestanasSubrayadas } from "../comun/PestanasSubrayadas";
import { ActividadPublicaciones } from "./ActividadPublicaciones";
import { ElegirFamilia } from "./ElegirFamilia";
import { EncabezadoMisPublicaciones } from "./EncabezadoMisPublicaciones";
import { TarjetaPublicacion } from "./TarjetaPublicacion";
import { TarjetaPublicacionDestacada } from "./TarjetaPublicacionDestacada";
import "../../../css/AdopcionCompartido.css";
import "../../../css/AdopcionPanel.css";

/**
 * "Mis publicaciones" dentro del panel de cualquier rol: resumen, destacada,
 * actividad y la lista por estado. "Ver postulaciones" abre "Elegir familia".
 */
export const SeccionMisPublicaciones = ({ onDarEnAdopcion, version }: SeccionMisPublicacionesProps) => {
  const navigate = useNavigate();
  const m = useMisPublicaciones(version);
  const [revisando, setRevisando] = useState<PublicacionPropia | null>(null);
  const verFicha = (p: PublicacionPropia) => navigate(rutaFichaAdopcion(p.id));

  if (revisando) {
    return (
      <div className="ap">
        <ElegirFamilia publicacion={revisando} onVolver={() => setRevisando(null)} onCambio={m.recargar} />
      </div>
    );
  }

  return (
    <div className="ap">
      <EncabezadoMisPublicaciones
        publicados={m.totales.publicados}
        nuevas={m.totales.nuevas}
        adoptados={m.totales.adoptados}
        onDarEnAdopcion={onDarEnAdopcion}
      />

      {m.cargando ? (
        <p className="ap-estado">{T.cargando}</p>
      ) : m.error ? (
        <p className="ap-estado" role="alert">{T.error}</p>
      ) : !m.publicaciones.length ? (
        <div className="ap-vacio">
          <span className="ap-vacio-icono" aria-hidden>
            <Megaphone size={34} />
          </span>
          <h2>{T.vacioTitulo}</h2>
          <p>{T.vacioTexto}</p>
          <button type="button" className="ap-btn ap-btn-primario" onClick={onDarEnAdopcion}>
            {T.darEnAdopcion}
          </button>
        </div>
      ) : (
        <>
          <div className="ap-bento">
            {m.destacada && <TarjetaPublicacionDestacada publicacion={m.destacada} onRevisar={setRevisando} />}
            <ActividadPublicaciones actividad={m.actividad} />
          </div>

          <PestanasSubrayadas
            etiqueta={T.titulo}
            opciones={PESTANAS_PUBLICACIONES.map((o) => ({ ...o, cantidad: m.cantidad(o.valor) }))}
            valor={m.pestana}
            onCambiar={m.setPestana}
          />
          {m.errorAccion && <p className="adopta-campo-error" role="alert">{m.errorAccion}</p>}
          {m.visibles.length === 0 ? (
            <p className="ap-estado">{T.vacioFiltro}</p>
          ) : (
            <div className="ap-grilla-publicaciones">
              {m.visibles.map((p, i) => (
                <TarjetaPublicacion
                  key={p.id}
                  publicacion={p}
                  tono={TONOS_ADOPCION[i % TONOS_ADOPCION.length]}
                  onRevisar={setRevisando}
                  onVer={verFicha}
                  onRetirar={m.retirar}
                  onReactivar={m.reactivar}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
