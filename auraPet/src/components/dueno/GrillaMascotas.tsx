import { Iconos } from "../../constants";
import type { GrillaMascotasProps } from "../../interfaces";
import { MascotaCard } from "./MascotaCard";

const iconos = Iconos;

// Grilla de tarjetas de mascotas + la tarjeta punteada "Agregar mascota" al final.
export const GrillaMascotas = ({ mascotas, onAgregar, onSolicitarCita }: GrillaMascotasProps) => (
  <div className="dueno-mascotas-grid">
    {mascotas.map((m) => (
      <MascotaCard key={m.id} mascota={m} onSolicitarCita={onSolicitarCita} />
    ))}

    <div className="dueno-mascota-card-add" onClick={onAgregar} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onAgregar()}>
      <iconos.agregar size={22} />
      <span>Agregar mascota</span>
    </div>
  </div>
);
