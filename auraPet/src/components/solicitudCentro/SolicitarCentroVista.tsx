import { useEffect, useRef, type FormEvent } from "react";
import { Iconos, PASOS_WIZARD_SOLICITUD, PREGUNTAS_SOLICITUD, TEXTOS_SOLICITUD } from "../../constants";
import { useWizardSolicitud } from "../../hooks/useWizardSolicitud";
import type { CampoSolicitud, PasoSolicitud, SolicitarCentroVistaProps } from "../../interfaces";
import { Spinner } from "../ui/Spinner";
import imagenPanel from "../../assets/ParaVeterinarias/PrimeraFoto.png";
import { PanelMarcaSolicitud } from "./PanelMarcaSolicitud";
import { IndicadorPasos } from "./IndicadorPasos";
import { PasoCentro } from "./PasoCentro";
import { PasoResponsable } from "./PasoResponsable";
import { PasoRevisar } from "./PasoRevisar";
import { PreguntasFrecuentesSolicitud } from "./PreguntasFrecuentesSolicitud";
import { EstadoExitoSolicitud } from "./EstadoExitoSolicitud";
import "../../css/SolicitarCentro.css";

const ULTIMO_PASO = PASOS_WIZARD_SOLICITUD.length - 1;

// Lleva el foco al campo con error (los ids son "solicitud-<campo>")
const enfocar = (campo: CampoSolicitud) => document.getElementById(`solicitud-${campo}`)?.focus();

// Vista de la página: solo arma las piezas. No llama a la API; el envío
// lo resuelve quien la usa (screens/Centros/SolicitarCentro.tsx).
export const SolicitarCentroVista = ({ especialidades, enviando, error, enviadoA, onEnviar, onVolverInicio }: SolicitarCentroVistaProps) => {
  const wizard = useWizardSolicitud();
  const { paso, avanzar, retroceder, irAPaso, datos } = wizard;
  const inicioRef = useRef<HTMLElement>(null);
  const primeraVez = useRef(true);

  // Al cambiar de paso, sube hasta el título para que se vea el progreso
  useEffect(() => {
    if (primeraVez.current) { primeraVez.current = false; return; }
    inicioRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [paso]);

  const alEnviar = (e: FormEvent) => {
    e.preventDefault();
    const conError = avanzar();                  // valida el paso actual
    if (conError) return enfocar(conError);
    if (paso === ULTIMO_PASO) onEnviar(datos);
  };

  return (
    <div className="solicitud-pagina">
      <PanelMarcaSolicitud imagen={imagenPanel} onVolverInicio={onVolverInicio} />

      <main className="solicitud-principal">
        <div className="solicitud-columna">
          {enviadoA ? (
            <EstadoExitoSolicitud correo={enviadoA} onVolverInicio={onVolverInicio} />
          ) : (
            <>
              <header ref={inicioRef} className="solicitud-encabezado">
                <h2 className="solicitud-titulo">{TEXTOS_SOLICITUD.tituloFormulario}</h2>
                <p className="solicitud-subtitulo">{TEXTOS_SOLICITUD.subtituloFormulario}</p>
              </header>

              <IndicadorPasos pasos={PASOS_WIZARD_SOLICITUD} actual={paso} onIrAPaso={(i) => irAPaso(i as PasoSolicitud)} />

              <form className="solicitud-tarjeta" onSubmit={alEnviar} noValidate>
                <h3 className="solicitud-tarjeta-titulo">{PASOS_WIZARD_SOLICITUD[paso].titulo}</h3>

                {paso === 0 && <PasoCentro wizard={wizard} especialidades={especialidades} />}
                {paso === 1 && <PasoResponsable wizard={wizard} />}
                {paso === 2 && <PasoRevisar wizard={wizard} especialidades={especialidades} error={error} />}

                <div className="solicitud-acciones">
                  {paso > 0 && (
                    <button type="button" className="solicitud-btn solicitud-btn--secundario" onClick={retroceder} disabled={enviando}>
                      <Iconos.anterior size={16} aria-hidden="true" /> {TEXTOS_SOLICITUD.atras}
                    </button>
                  )}
                  <button type="submit" className="solicitud-btn solicitud-btn--primario" disabled={enviando} aria-busy={enviando}>
                    {paso < ULTIMO_PASO ? (
                      <>{TEXTOS_SOLICITUD.continuar} <Iconos.siguiente size={16} aria-hidden="true" /></>
                    ) : enviando ? (
                      <><Spinner /> {TEXTOS_SOLICITUD.enviando}</>
                    ) : (
                      TEXTOS_SOLICITUD.enviar
                    )}
                  </button>
                </div>
              </form>

              <PreguntasFrecuentesSolicitud preguntas={PREGUNTAS_SOLICITUD} />
            </>
          )}
        </div>
      </main>
    </div>
  );
};
