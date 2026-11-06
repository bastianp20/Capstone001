import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AvisoCuentaPostulacion } from "../../components/adopcion/refugios/postular/AvisoCuentaPostulacion";
import { PanelPostulacion } from "../../components/adopcion/refugios/postular/PanelPostulacion";
import { PasoCapacidadFotos } from "../../components/adopcion/refugios/postular/PasoCapacidadFotos";
import { PasoContactoRefugio } from "../../components/adopcion/refugios/postular/PasoContactoRefugio";
import { PasoTuRefugio } from "../../components/adopcion/refugios/postular/PasoTuRefugio";
import { PostulacionEnviada } from "../../components/adopcion/refugios/postular/PostulacionEnviada";
import { ModalRecorteImagen } from "../../components/ui/ModalRecorteImagen";
import { FORMATO_RECORTE_REFUGIO, PASOS_POSTULAR_REFUGIO, RUTA_REFUGIOS, RUTA_SUMATE_REFUGIO, TEXTOS_POSTULAR_REFUGIO as T, TEXTOS_RECORTE } from "../../constants";
import { usePostularRefugio } from "../../hooks/usePostularRefugio";
import { LoginScreen } from "../Login/LoginScreen";
import "../../css/AdopcionCompartido.css";
import "../../css/AdopcionPanel.css";
import "../../css/RefugiosPage.css";
import "../../css/PostularRefugio.css";

/** /adopta/refugios/postular — un refugio postula en 3 pasos, con o sin cuenta (migración 48). */
export const PostularRefugioScreen = () => {
  const navigate = useNavigate();
  const [login, setLogin] = useState(false);
  const f = usePostularRefugio();
  const comunes = { datos: f.datos, errores: f.errores, onCambiar: f.actualizar };
  const total = PASOS_POSTULAR_REFUGIO.length;

  return (
    <main className="adopta ap pr">
      {f.enviado ? (
        <PostulacionEnviada nombre={f.datos.nombre.trim()} correoAcceso={f.correoAcceso} onVolver={() => navigate(RUTA_REFUGIOS)} />
      ) : (
        <div className="pr-marco">
          <PanelPostulacion datos={f.datos} paso={f.paso} />
          <section className="pr-formulario">
            <button type="button" className="pr-volver" onClick={() => (f.esPrimero ? navigate(RUTA_SUMATE_REFUGIO) : f.retroceder())}>
              <ArrowLeft size={16} aria-hidden /> {T.volver}
            </button>
            {f.esPrimero && <AvisoCuentaPostulacion nombre={f.nombreCuenta} onIngresar={() => setLogin(true)} />}
            <span className="pr-contador">{T.pasoDe(f.paso + 1, total)}</span>
            <form onSubmit={(e) => e.preventDefault()} noValidate>
              {f.paso === 0 && <PasoTuRefugio {...comunes} onLogo={f.elegirLogo} errorLogo={f.errorLogo} />}
              {f.paso === 1 && <PasoCapacidadFotos {...comunes} />}
              {f.paso === 2 && <PasoContactoRefugio {...comunes} conSesion={f.conSesion} />}
              {/* Campo trampa: invisible para las personas, los bots lo llenan */}
              <input className="pr-trampa" tabIndex={-1} autoComplete="off" aria-hidden value={f.trampa} onChange={(e) => f.setTrampa(e.target.value)} />
            </form>
            {f.errorEnviar && (
              <p className="adopta-campo-error" role="alert">
                {f.errorEnviar}
              </p>
            )}
            <footer className="pr-pie">
              {!f.esPrimero && (
                <button type="button" className="ap-btn ap-btn-borde" onClick={f.retroceder} disabled={f.enviando}>
                  {T.atras}
                </button>
              )}
              {f.esUltimo ? (
                <button type="button" className="ap-btn pr-btn-coral" onClick={f.enviar} disabled={f.enviando}>
                  {f.enviando ? T.enviando : T.enviar} {!f.enviando && <Send size={16} aria-hidden />}
                </button>
              ) : (
                <button type="button" className="ap-btn ap-btn-primario" onClick={f.avanzar}>
                  {T.siguiente} <ArrowRight size={16} aria-hidden />
                </button>
              )}
            </footer>
          </section>
        </div>
      )}
      {f.porRecortar && (
        <ModalRecorteImagen
          url={f.porRecortar.url}
          formato={FORMATO_RECORTE_REFUGIO.logo}
          titulo={TEXTOS_RECORTE.logo}
          onListo={f.recortada}
          onCancelar={f.cancelarRecorte}
        />
      )}
      {login && !f.conSesion && <LoginScreen onCerrar={() => setLogin(false)} />}
    </main>
  );
};
