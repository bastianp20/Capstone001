import { ArrowLeft, PawPrint } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { AvisoConfianzaAdopcion } from "../../components/adopcion/AvisoConfianzaAdopcion";
import { CabeceraFichaAdopcion } from "../../components/adopcion/ficha/CabeceraFichaAdopcion";
import { ChequeoDestacadoAdopcion } from "../../components/adopcion/ficha/ChequeoDestacadoAdopcion";
import { FilaOtrosAdopcion } from "../../components/adopcion/ficha/FilaOtrosAdopcion";
import { GaleriaAdopcion } from "../../components/adopcion/ficha/GaleriaAdopcion";
import { TarjetaPersonalidadAdopcion } from "../../components/adopcion/ficha/TarjetaPersonalidadAdopcion";
import { TarjetaPublicadorAdopcion } from "../../components/adopcion/ficha/TarjetaPublicadorAdopcion";
import { TarjetaSaludAdopcion } from "../../components/adopcion/ficha/TarjetaSaludAdopcion";
import { ModalPostulacionAdopcion } from "../../components/adopcion/postulacion/ModalPostulacionAdopcion";
import { RUTA_ADOPTA, rutaFichaAdopcion, TEXTOS_FICHA_ADOPCION as T } from "../../constants";
import { useCompartir } from "../../hooks/useCompartir";
import { useFichaAdopcion } from "../../hooks/useFichaAdopcion";
import { useGuardadosAdopcion } from "../../hooks/useGuardadosAdopcion";
import { estadoBotonAdoptar } from "../../lib/adopcion";
import { LoginScreen } from "../Login/LoginScreen";
import "../../css/AdopcionCompartido.css";
import "../../css/FichaAdopcionPage.css";

/** Ficha /adopta/:id: pública. Postular pide sesión (se abre el login). */
export const FichaAdopcionScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const { ficha, otros, cargando, error, marcarPostulado } = useFichaAdopcion(Number(id));
  const { compartir, copiado } = useCompartir();
  const guardados = useGuardadosAdopcion();
  const [postulando, setPostulando] = useState(false);
  const [login, setLogin] = useState(false);

  if (cargando) return <main className="adopta ficha-estado">{T.cargando}</main>;

  if (error || !ficha) {
    return (
      <main className="adopta ficha-estado">
        <PawPrint size={40} aria-hidden />
        <p>{T.noEncontrada}</p>
        <Link to={RUTA_ADOPTA} className="adopta-btn adopta-btn-primario">
          {T.verOtros}
        </Link>
      </main>
    );
  }

  const quieroAdoptar = () => (usuarioActual ? setPostulando(true) : setLogin(true));

  return (
    <main className="adopta ficha">
      <div className="ficha-contenedor">
        <Link to={RUTA_ADOPTA} className="ficha-volver">
          <ArrowLeft size={16} aria-hidden /> {T.volver}
        </Link>

        <div className="ficha-columnas">
          <div className="ficha-principal">
            <div className="ficha-presentacion">
              <GaleriaAdopcion fotos={ficha.fotos} nombre={ficha.nombre} especie={ficha.especie} />
              <CabeceraFichaAdopcion ficha={ficha} />
            </div>
            <TarjetaPersonalidadAdopcion personalidad={ficha.personalidad} rasgos={ficha.rasgos} />
            <TarjetaSaludAdopcion ficha={ficha} />
            <ChequeoDestacadoAdopcion chequeo={ficha.chequeo} solicitado={ficha.solicitaChequeo} />
          </div>

          <aside className="ficha-lateral">
            <TarjetaPublicadorAdopcion
              publicador={ficha.publicador}
              nombreAnimal={ficha.nombre}
              sexo={ficha.sexo}
              estadoBoton={estadoBotonAdoptar(ficha)}
              guardado={guardados.estaGuardado(ficha.id)}
              textoCompartir={copiado ? T.copiado : T.compartir}
              onAdoptar={quieroAdoptar}
              onCompartir={() => compartir({ titulo: ficha.nombre, texto: T.compartirTexto(ficha.nombre), url: window.location.href })}
              onGuardar={() => guardados.alternar(ficha.id)}
            />
            <AvisoConfianzaAdopcion compacto />
            <p className="ficha-ley">{T.ley}</p>
          </aside>
        </div>

        <FilaOtrosAdopcion animales={otros} onConocer={(a) => navigate(rutaFichaAdopcion(a.id))} />
      </div>

      {postulando && (
        <ModalPostulacionAdopcion
          adopcionId={ficha.id}
          nombreAnimal={ficha.nombre}
          publicador={ficha.publicador.nombre}
          onCerrar={() => setPostulando(false)}
          onEnviada={marcarPostulado}
        />
      )}
      {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </main>
  );
};
