import { useNavigate } from "react-router-dom";
import { BeneficiosSumate } from "../../components/adopcion/refugios/sumate/BeneficiosSumate";
import { CierreSumate } from "../../components/adopcion/refugios/sumate/CierreSumate";
import { HeroSumate } from "../../components/adopcion/refugios/sumate/HeroSumate";
import { PasosSumate } from "../../components/adopcion/refugios/sumate/PasosSumate";
import { TestimonioSumate } from "../../components/adopcion/refugios/sumate/TestimonioSumate";
import { RUTA_POSTULAR_REFUGIO } from "../../constants";
import { useSumateRefugio } from "../../hooks/useSumateRefugio";
import "../../css/AdopcionCompartido.css";
import "../../css/AdopcionPanel.css";
import "../../css/SumateRefugio.css";

/** /adopta/refugios/sumate — invita a los refugios a sumarse a AuraPet. */
export const SumateRefugioScreen = () => {
  const navigate = useNavigate();
  const { resumen, historia } = useSumateRefugio();
  const postular = () => navigate(RUTA_POSTULAR_REFUGIO);

  return (
    <main className="adopta ap su">
      <HeroSumate resumen={resumen} onPostular={postular} />
      <div className="su-contenedor">
        <BeneficiosSumate />
        <PasosSumate />
        {historia && <TestimonioSumate historia={historia} />}
        <CierreSumate onPostular={postular} />
      </div>
    </main>
  );
};
