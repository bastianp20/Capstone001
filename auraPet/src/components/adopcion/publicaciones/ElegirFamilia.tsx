import { ArrowLeft, Eye, PartyPopper } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { rutaFichaAdopcion, TEXTOS_ELEGIR_FAMILIA as T, TONOS_ADOPCION } from "../../../constants";
import { useElegirFamilia } from "../../../hooks/useElegirFamilia";
import type { ElegirFamiliaProps } from "../../../interfaces";
import { AvatarAnimal } from "../AvatarAnimal";
import { PanelAdoptada } from "./PanelAdoptada";
import { PerfilPostulante } from "./PerfilPostulante";
import { TarjetaAfinidad } from "./TarjetaAfinidad";
import { TarjetaPostulante } from "./TarjetaPostulante";

/** Pantalla "Elegir familia para…": postulantes, su perfil, la afinidad y la decisión. */
export const ElegirFamilia = ({ publicacion: p, onVolver, onCambio }: ElegirFamiliaProps) => {
  const navigate = useNavigate();
  const f = useElegirFamilia(p, onCambio);
  const sel = f.seleccionada;
  const enProceso = !f.adoptado && f.postulaciones.some((x) => x.estado === "aceptada");

  return (
    <div className="ap-elegir">
      <header className="ap-portada">
        {p.fotoUrl && <img className="ap-portada-fondo" src={p.fotoUrl} alt="" aria-hidden />}
        <button type="button" className="ap-volver" onClick={onVolver}>
          <ArrowLeft size={16} aria-hidden /> {T.volver}
        </button>
        <div className="ap-portada-contenido">
          <div>
            <h1>{T.titulo(p.nombre)}</h1>
            <p>{T.resumen(f.postulaciones.length, f.nuevas)}</p>
            <button type="button" className="ap-btn ap-btn-vidrio ap-btn-chico" onClick={() => navigate(rutaFichaAdopcion(p.id))}>
              <Eye size={15} aria-hidden /> {T.verPublicacion}
            </button>
          </div>
          <AvatarAnimal especie={p.especie} fotoUrl={p.fotoUrl} nombre={p.nombre} tono={TONOS_ADOPCION[0]} tamanoIcono={48} className="ap-portada-foto" />
        </div>
      </header>

      {f.cargando ? (
        <p className="ap-estado">{T.cargando}</p>
      ) : f.error ? (
        <p className="ap-estado" role="alert">{T.error}</p>
      ) : !sel ? (
        <p className="ap-estado">{T.sinPostulaciones}</p>
      ) : (
        <>
          <div className="ap-elegir-columnas">
            <div className="ap-postulantes">
              {f.postulaciones.map((x) => (
                <TarjetaPostulante key={x.id} postulacion={x} afinidad={f.afinidad(x.id)} seleccionada={x.id === sel.id} onElegir={() => f.seleccionar(x.id)} />
              ))}
            </div>
            <PerfilPostulante postulacion={sel} />
            <TarjetaAfinidad nombreAnimal={p.nombre} afinidad={f.afinidad(sel.id)} postulacion={sel} />
          </div>

          {!f.adoptado && (sel.estado === "pendiente" || sel.estado === "aceptada") && (
            <div className="ap-decision">
              {f.errorAccion && <p className="adopta-campo-error" role="alert">{f.errorAccion}</p>}
              {sel.estado === "pendiente" ? (
                <>
                  <button type="button" className="ap-btn ap-btn-peligro" onClick={f.rechazar} disabled={f.ocupado}>
                    {T.rechazar}
                  </button>
                  {!enProceso && (
                    <button type="button" className="ap-btn ap-btn-primario ap-btn-grande" onClick={f.elegir} disabled={f.ocupado}>
                      {T.elegir(sel.nombre.split(" ")[0])}
                    </button>
                  )}
                  <span className="ap-suave">{T.notaEsperan}</span>
                </>
              ) : (
                <button type="button" className="ap-btn ap-btn-primario ap-btn-grande" onClick={f.abrirCierre} disabled={f.ocupado}>
                  <PartyPopper size={17} aria-hidden /> {T.marcarAdoptado(p.nombre)}
                </button>
              )}
            </div>
          )}
        </>
      )}

      {f.cerrando && sel && (
        <PanelAdoptada
          nombreAnimal={p.nombre}
          fotoAnimal={p.fotoUrl}
          especie={p.especie}
          postulacion={sel}
          ocupado={f.ocupado}
          error={f.errorAccion}
          onConfirmar={f.concretar}
          onCerrar={f.cancelarCierre}
        />
      )}
    </div>
  );
};
