import { useState } from "react";
import { TEXTOS_MI_REFUGIO as T } from "../../../../constants";
import { useMisRefugios } from "../../../../hooks/useMisRefugios";
import { PanelMiRefugio } from "./PanelMiRefugio";
import { SelectorMiRefugio } from "./SelectorMiRefugio";
import "../../../../css/AdopcionCompartido.css";
import "../../../../css/AdopcionPanel.css";
import "../../../../css/MiRefugio.css";

/** "Mi refugio" en el panel de cualquier rol (solo para quien administra uno o más). */
export const SeccionMiRefugio = () => {
  const refugios = useMisRefugios();
  const [elegido, setElegido] = useState<number | null>(null);
  const id = elegido ?? refugios[0]?.id ?? null;

  return (
    <div className="ap mr">
      <h1 className="ap-solo-lector">{T.titulo}</h1>
      {id !== null && refugios.length > 1 && (
        <div className="mr-barra">
          <SelectorMiRefugio refugios={refugios} valor={id} onCambiar={setElegido} />
        </div>
      )}
      {/* key: al cambiar de refugio se reinicia todo (cupos, pestaña, paneles) */}
      {id === null ? <p className="ap-estado">{T.cargando}</p> : <PanelMiRefugio key={id} refugioId={id} />}
    </div>
  );
};
