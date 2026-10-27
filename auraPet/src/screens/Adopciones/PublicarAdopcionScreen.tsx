import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { BandaPasosPublicar } from "../../components/adopcion/publicar/BandaPasosPublicar";
import { FormularioPublicarAdopcion } from "../../components/adopcion/publicar/FormularioPublicarAdopcion";
import { InvitacionSesionAdopcion } from "../../components/adopcion/publicar/InvitacionSesionAdopcion";
import { PASOS_DAR_EN_ADOPCION, rutaFichaAdopcion } from "../../constants";
import { LoginScreen } from "../Login/LoginScreen";
import "../../css/AdopcionCompartido.css";
import "../../css/PublicarAdopcionPage.css";

/** /adopta/publicar — "Dar en adopción". Sin sesión invita a ingresar. */
export const PublicarAdopcionScreen = () => {
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const [login, setLogin] = useState(false);

  return (
    <main className="adopta publica">
      <BandaPasosPublicar pasos={PASOS_DAR_EN_ADOPCION} />
      <div className="publica-contenedor">
        {usuarioActual ? (
          <FormularioPublicarAdopcion onVerPublicacion={(id) => navigate(rutaFichaAdopcion(id))} />
        ) : (
          <InvitacionSesionAdopcion onIngresar={() => setLogin(true)} />
        )}
      </div>
      {login && <LoginScreen onCerrar={() => setLogin(false)} />}
    </main>
  );
};
