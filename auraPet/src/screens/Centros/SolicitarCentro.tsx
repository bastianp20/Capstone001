import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getEspecialidades } from "../../Api/getInfo";
import { solicitarCentro } from "../../Api/postInfo";
import { useConsulta } from "../../hooks/useConsulta";
import { useAccion } from "../../hooks/useAccion";
import type { DatosSolicitudCentro } from "../../interfaces";
import { SolicitarCentroVista } from "../../components/solicitudCentro/SolicitarCentroVista";

// Página pública /solicitar-centro: un centro sin cuenta pide unirse a AuraPet.
// Aquí solo va la lógica (cargar especialidades y enviar); lo visual está en
// SolicitarCentroVista. La solicitud la revisa un superadmin (migración 20).
export const SolicitarCentro = () => {
  const navigate = useNavigate();
  const { datos: especialidades = [] } = useConsulta(getEspecialidades, []);
  const { ejecutar, ocupado, error } = useAccion();
  const [enviadoA, setEnviadoA] = useState<string | null>(null);

  const enviar = async (datos: DatosSolicitudCentro) => {
    const ok = await ejecutar(() => solicitarCentro(datos), "No se pudo enviar la solicitud. Intenta de nuevo.");
    if (ok) {
      setEnviadoA(datos.correo.trim());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <SolicitarCentroVista
      especialidades={especialidades}
      enviando={ocupado}
      error={error}
      enviadoA={enviadoA}
      onEnviar={enviar}
      onVolverInicio={() => navigate("/")}
    />
  );
};
