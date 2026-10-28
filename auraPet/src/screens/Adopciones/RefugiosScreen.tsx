import { HandHeart, Home } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { PestanasAdopta } from "../../components/adopcion/PestanasAdopta";
import { FiltrosRefugios } from "../../components/adopcion/refugios/FiltrosRefugios";
import { FranjaNecesitanAyuda } from "../../components/adopcion/refugios/FranjaNecesitanAyuda";
import { TarjetaRefugio } from "../../components/adopcion/refugios/TarjetaRefugio";
import { FOTOS_HERO_ADOPCION, RUTA_CONTACTO_REPORTE, RUTA_PANEL, rutaAnimalesDeRefugio, TEXTOS_REFUGIOS as T } from "../../constants";
import { useRefugios } from "../../hooks/useRefugios";
import type { Refugio } from "../../interfaces";
import { LoginScreen } from "../Login/LoginScreen";
import "../../css/AdopcionCompartido.css";
import "../../css/AdopcionPanel.css";
import "../../css/RefugiosPage.css";

/** /adopta/refugios — refugios que cuidan y dan en adopción (datos de la migración 39). */
export const RefugiosScreen = () => {
  const navigate = useNavigate();
  const r = useRefugios();
  const { usuarioActual } = useAuth();
  const [login, setLogin] = useState(false);
  const verAnimales = (x: Refugio) => navigate(rutaAnimalesDeRefugio(x.id));
  const verRefugio = (x: Refugio) => document.getElementById(`refugio-${x.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <main className="adopta ap refugios">
      <section className="refugios-hero">
        <div>
          <PestanasAdopta actual="refugios" />
          <h1>{T.titulo}</h1>
          {r.resumen && (
            <div className="refugios-numeros">
              <div className="ap-numero ap-tono-menta">
                <strong>{r.resumen.refugios}</strong>
                <span>{T.refugios(r.resumen.refugios)}</span>
              </div>
              <div className="ap-numero ap-tono-durazno">
                <strong>{r.resumen.animales}</strong>
                <span>{T.animales}</span>
              </div>
              <div className="ap-numero ap-tono-lavanda">
                <strong>{r.resumen.aliados}</strong>
                <span>{T.aliados}</span>
              </div>
            </div>
          )}
        </div>
        <img className="refugios-hero-foto" src={FOTOS_HERO_ADOPCION[0].src} alt={FOTOS_HERO_ADOPCION[0].alt} />
      </section>

      <div className="refugios-contenedor">
        <FranjaNecesitanAyuda refugios={r.necesitanAyuda} onVer={verRefugio} />
        <FiltrosRefugios filtros={r.filtros} regiones={r.regiones} comunas={r.comunas} onCambiar={r.cambiarFiltros} />

        {r.cargando ? (
          <p className="ap-estado">{T.cargando}</p>
        ) : r.error ? (
          <p className="ap-estado" role="alert">{T.error}</p>
        ) : !r.refugios.length ? (
          <p className="ap-estado">{T.sinRefugios}</p>
        ) : !r.visibles.length ? (
          <p className="ap-estado">{T.vacio}</p>
        ) : (
          <div className="refugios-grilla">
            {r.visibles.map((x) => (
              <div key={x.id} id={`refugio-${x.id}`}>
                <TarjetaRefugio refugio={x} onVerAnimales={verAnimales} />
              </div>
            ))}
          </div>
        )}

        <section className="refugios-cierre">
          <div className="refugios-cierre-tarjeta ap-tono-menta">
            <Home size={34} aria-hidden />
            <h2>{T.tienesRefugio}</h2>
            <p>{T.tienesRefugioTexto}</p>
            <button type="button" className="ap-btn ap-btn-primario" onClick={() => navigate(RUTA_CONTACTO_REPORTE)}>
              {T.sumate}
            </button>
          </div>
          <div className="refugios-cierre-tarjeta ap-tono-lavanda">
            <HandHeart size={34} aria-hidden />
            <h2>{T.eresVet}</h2>
            <p>{T.eresVetTexto}</p>
            <button type="button" className="ap-btn ap-btn-primario" onClick={() => (usuarioActual ? navigate(RUTA_PANEL) : setLogin(true))}>
              {T.hazteAliado}
            </button>
          </div>
        </section>
      </div>
      {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </main>
  );
};
