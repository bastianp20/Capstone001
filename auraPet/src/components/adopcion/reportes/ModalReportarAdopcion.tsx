import { Phone, Send, ShieldCheck, X } from "lucide-react";
import { useId } from "react";
import { MAX_COMENTARIO_REPORTE, MOTIVOS_REPORTE, TEXTOS_REPORTE as T, TONOS_ADOPCION } from "../../../constants";
import { useReportarAdopcion } from "../../../hooks/useReportarAdopcion";
import { useTeclaEscape } from "../../../hooks/useTeclaEscape";
import type { ModalReportarAdopcionProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";
import { ReporteEnviado } from "./ReporteEnviado";
import { TarjetaMotivoReporte } from "./TarjetaMotivoReporte";
import "../../../css/ReporteAdopcion.css";

/** "Reportar publicación" (ficha): motivo con colores, comentario y aviso de emergencia. */
export const ModalReportarAdopcion = ({ adopcionId, nombre, fotoUrl, especie, onCerrar }: ModalReportarAdopcionProps) => {
  const idTitulo = useId();
  const r = useReportarAdopcion(adopcionId);
  useTeclaEscape(onCerrar, !r.ocupado);

  return (
    <div className="rep-fondo" onClick={() => !r.ocupado && onCerrar()}>
      <div
        className={`rep-modal ${r.numero ? "rep-modal-gracias" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="rep-cerrar" onClick={onCerrar} aria-label={T.cancelar} disabled={r.ocupado}>
          <X size={18} />
        </button>

        {r.numero ? (
          <ReporteEnviado nombre={nombre} numero={r.numero} onCerrar={onCerrar} />
        ) : (
          <>
            <aside className="rep-lado">
              <AvatarAnimal especie={especie} fotoUrl={fotoUrl} nombre={nombre} tono={TONOS_ADOPCION[1]} tamanoIcono={48} className="rep-foto" />
              <h2 id={idTitulo}>{T.titulo(nombre)}</h2>
              <p>{T.bajada}</p>
              <span className="rep-sello">
                <ShieldCheck size={26} aria-hidden />
                {T.proteccion}
              </span>
            </aside>

            <div className="rep-cuerpo">
              <h3>{T.pregunta}</h3>
              <div className="rep-motivos" role="radiogroup" aria-label={T.pregunta}>
                {MOTIVOS_REPORTE.map((o) => (
                  <TarjetaMotivoReporte key={o.valor} opcion={o} activa={r.motivo === o.valor} onElegir={r.setMotivo} />
                ))}
              </div>

              {r.motivo === "riesgo" && (
                <p className="rep-emergencia" role="note">
                  <Phone size={16} aria-hidden /> {T.emergencia}
                </p>
              )}

              <label className="rep-campo">
                <span>{T.comentario}</span>
                <textarea
                  value={r.comentario}
                  maxLength={MAX_COMENTARIO_REPORTE}
                  placeholder={T.comentarioPlaceholder}
                  onChange={(e) => r.setComentario(e.target.value)}
                />
                <small>
                  {r.comentario.length}/{MAX_COMENTARIO_REPORTE}
                </small>
              </label>

              {r.error && (
                <p className="rep-error" role="alert">
                  {r.error}
                </p>
              )}
              <div className="rep-pie">
                <button type="button" className="rep-btn rep-btn-texto" onClick={onCerrar} disabled={r.ocupado}>
                  {T.cancelar}
                </button>
                <button type="button" className="rep-btn rep-btn-primario" onClick={r.enviar} disabled={r.ocupado}>
                  <Send size={16} aria-hidden /> {r.ocupado ? T.enviando : T.enviar}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
