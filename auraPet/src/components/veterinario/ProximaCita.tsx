import { useState } from "react";
import styles from "../../css/InicioVeterinario.module.css";
import { Badge, badgeStyles, ESTADO_LABEL, Iconos, ORDEN_URGENCIAS, SIGUIENTE_PASO_CITA, URGENCIA_LABEL } from "../../constants";
import { calcularEdad } from "../../lib/fechas";
import type { ProximaCitaProps, UrgenciaCita } from "../../interfaces";
import { TarjetaPanel } from "../ui/TarjetaPanel";
import { EstadoVacio } from "../ui/EstadoVacio";

const iconos = Iconos;

// Tarjeta protagonista: la cita que el veterinario tiene que atender ahora.
// Muestra paciente, dueño, motivo, síntomas, alergias y la urgencia sugerida
// por la IA, con el botón del siguiente paso (confirmar / iniciar / finalizar).
export const ProximaCita = ({ cita, ocupado, onCambiar, onRecetar }: ProximaCitaProps) => {
  const [cambiandoUrgencia, setCambiandoUrgencia] = useState(false);

  if (!cita) {
    return (
      <TarjetaPanel titulo="Próxima cita">
        <EstadoVacio icono={<iconos.completado size={22} />} texto="No te quedan citas por hoy." />
      </TarjetaPanel>
    );
  }

  const edad = calcularEdad(cita.fechaNacimiento);
  // "Perro · Labrador · 4 años" con solo los datos que existen
  const detalle = [cita.especie, cita.raza, edad !== null ? `${edad} ${edad === 1 ? "año" : "años"}` : null]
    .filter(Boolean)
    .join(" · ");
  const paso = SIGUIENTE_PASO_CITA[cita.estado];

  const elegirUrgencia = (urgencia: UrgenciaCita) => {
    setCambiandoUrgencia(false);
    onCambiar(cita.id, { urgencia });
  };

  return (
    <TarjetaPanel>
      <span className={styles.proximaEtiqueta}>
        {cita.estado === "en_curso" ? "En atención" : "Próxima cita"} · {cita.hora}
      </span>

      <h3 className={styles.proximaMascota}>
        {cita.mascota} <span className={styles.proximaDetalle}>· {detalle}</span>
      </h3>

      <p className={styles.dato}>
        <span className={styles.datoEtiqueta}>Dueño:</span> {cita.dueno}
        {cita.telefonoDueno && ` · +${cita.telefonoDueno}`}
      </p>
      <p className={styles.dato}>
        <span className={styles.datoEtiqueta}>Motivo:</span> {cita.motivo}
      </p>
      {cita.sintomas.length > 0 && (
        <p className={styles.dato}>
          <span className={styles.datoEtiqueta}>Síntomas reportados:</span> {cita.sintomas.join(", ")}
        </p>
      )}

      <div className={styles.chips}>
        <span style={Badge(badgeStyles[cita.estado])}>{ESTADO_LABEL[cita.estado]}</span>

        {/* Urgencia: confirmada por el veterinario, o sugerida por la IA y pendiente de confirmar */}
        {cita.urgencia ? (
          <span style={Badge(badgeStyles[cita.urgencia])}>Urgencia: {URGENCIA_LABEL[cita.urgencia]}</span>
        ) : cita.urgenciaSugerida ? (
          <span className={styles.chipIA}>
            <iconos.ia size={14} />
            IA sugiere: {URGENCIA_LABEL[cita.urgenciaSugerida]}
            {cambiandoUrgencia ? (
              <select
                autoFocus
                defaultValue={cita.urgenciaSugerida}
                onChange={(e) => elegirUrgencia(e.target.value as UrgenciaCita)}
                onBlur={() => setCambiandoUrgencia(false)}
                aria-label="Elegir urgencia"
              >
                {ORDEN_URGENCIAS.map((u) => <option key={u} value={u}>{URGENCIA_LABEL[u]}</option>)}
              </select>
            ) : (
              <>
                <button type="button" className={styles.botonMini} disabled={ocupado}
                  onClick={() => elegirUrgencia(cita.urgenciaSugerida!)}>
                  Confirmar
                </button>
                <button type="button" className={styles.botonMini} disabled={ocupado}
                  onClick={() => setCambiandoUrgencia(true)}>
                  Cambiar
                </button>
              </>
            )}
          </span>
        ) : null}

        {cita.alergias && (
          <span className={styles.chipAlerta}>
            <iconos.urgenciaAlta size={13} /> Alergia: {cita.alergias}
          </span>
        )}
        {cita.condicionesCronicas && (
          <span className={styles.chipAlerta}>
            <iconos.signosVitales size={13} /> {cita.condicionesCronicas}
          </span>
        )}
      </div>

      <div className={styles.acciones}>
        {paso && (
          <button type="button" className={styles.botonPrincipal} disabled={ocupado}
            onClick={() => onCambiar(cita.id, { estado: paso.estado })}>
            {ocupado ? "Guardando…" : paso.texto}
          </button>
        )}
        <button type="button" className={styles.botonSecundario} onClick={() => onRecetar(cita.mascotaId)}>
          Recetar
        </button>
      </div>
    </TarjetaPanel>
  );
};
