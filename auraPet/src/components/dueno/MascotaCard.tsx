import styles from "../../css/DuenoSecciones.module.css";
import { EMOJI_ESPECIE, Iconos } from "../../constants";
import { calcularEdad } from "../../lib/fechas";
import type { MascotaCardProps } from "../../interfaces";

const iconos = Iconos;

// Tarjeta de una mascota: especie, raza, edad, peso, etiquetas y alergias.
// Si se pasa onSolicitarCita, muestra el botón "Pedir hora".
export const MascotaCard = ({ mascota, onSolicitarCita }: MascotaCardProps) => {
  const edad = calcularEdad(mascota.fechaNacimiento);
  // "Labrador · 4 años · 28 kg" con solo los datos que existen
  const detalle = [
    mascota.raza ?? "Sin raza",
    edad !== null ? `${edad} ${edad === 1 ? "año" : "años"}` : null,
    mascota.pesoKg !== null ? `${mascota.pesoKg} kg` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="dueno-mascota-card">
      <div className="dueno-mascota-top">
        <div className="dueno-mascota-avatar">{EMOJI_ESPECIE[mascota.especie]}</div>
        <div>
          <p className="dueno-mascota-nombre">{mascota.nombre}</p>
          <p className="dueno-mascota-detalle">{detalle}</p>
        </div>
      </div>

      <div className="dueno-mascota-tags">
        <span className={`dueno-tag ${mascota.esterilizado ? "dueno-tag--ok" : ""}`}>
          {mascota.esterilizado ? "Esterilizado" : "Sin esterilizar"}
        </span>
        <span className="dueno-tag">{mascota.sexo === "macho" ? "Macho" : "Hembra"}</span>
        {mascota.alergias && (
          <span className={styles.alergia} title={mascota.alergias}>
            <iconos.urgenciaAlta size={12} /> {mascota.alergias}
          </span>
        )}
      </div>

      {onSolicitarCita && (
        <button type="button" className={styles.botonCita} onClick={() => onSolicitarCita(mascota.id)}>
          <iconos.solicitarCita size={14} /> Pedir hora
        </button>
      )}
    </div>
  );
};
