import { useState } from "react";
import { DURACIONES_CITA, TEXTOS_HORARIO_ATENCION as T, TEXTOS_TELEFONO_URGENCIAS } from "../../../constants";
import { useHorarioAtencion } from "../../../hooks/useHorarioAtencion";
import { useProgresoPerfil } from "../../../hooks/useProgresoPerfil";
import { claveLugar } from "../../../lib/horarioAtencion";
import { Aviso } from "../../ui/Aviso";
import { Spinner } from "../../ui/Spinner";
import { TarjetaLugarHorario } from "./TarjetaLugarHorario";
import { CampoComunas } from "./CampoComunas";
import { TarjetaColegiado } from "./TarjetaColegiado";
import styles from "../../../css/veterinario/HorarioAtencion.module.css";

// Pantalla "Mi horario de atención" del veterinario (menú "Mi horario").
// Días y horas por lugar, duración de cada hora, urgencias 24/7 y, si atiende
// de forma independiente, dónde atiende. Si le falta, también el N° de colegiado.
export const SeccionHorarioAtencion = () => {
  const [versionPerfil, setVersionPerfil] = useState(0);
  const { progreso } = useProgresoPerfil(versionPerfil);
  const h = useHorarioAtencion(() => setVersionPerfil((n) => n + 1));
  const deshabilitado = h.ocupado || h.cargando;

  return (
    <div className={styles.seccion}>
      <header>
        <h1 className={styles.titulo}>{T.titulo}</h1>
        <p className={styles.subtitulo}>{T.subtitulo}</p>
      </header>

      {h.cargando && <p className={styles.ayuda}>Cargando…</p>}

      {h.horario?.lugares.map((lugar) => (
        <TarjetaLugarHorario
          key={claveLugar(lugar.centroId)}
          lugar={lugar}
          dias={h.form[claveLugar(lugar.centroId)] ?? []}
          onCambiarDia={(i, cambio) => h.cambiarDia(lugar, i, cambio)}
          onUsarHorarioCentro={() => h.usarHorarioCentro(lugar)}
          deshabilitado={deshabilitado}
        />
      ))}

      {h.horario && (
        <>
          <section className={styles.tarjeta} aria-label={T.duracionTitulo}>
            <h2 className={styles.tarjetaTitulo}>{T.duracionTitulo}</h2>
            <p className={styles.ayuda}>{T.duracionAyuda}</p>
            <div className={styles.chips} role="group" aria-label={T.duracionTitulo}>
              {DURACIONES_CITA.map((min) => (
                <button key={min} type="button" disabled={deshabilitado} aria-pressed={h.duracion === min}
                  className={`${styles.chip} ${h.duracion === min ? styles.chipActivo : ""}`}
                  onClick={() => h.setDuracion(min)}>
                  {T.minutos(min)}
                </button>
              ))}
            </div>
          </section>

          <section className={styles.tarjeta} aria-label={T.urgenciasTitulo}>
            <h2 className={styles.tarjetaTitulo}>{T.urgenciasTitulo}</h2>
            <p className={styles.ayuda}>{T.urgenciasAyuda}</p>
            <label className={styles.casilla}>
              <input type="checkbox" checked={h.urgencias247} disabled={deshabilitado}
                onChange={(e) => h.setUrgencias247(e.target.checked)} />
              {T.urgenciasTexto}
            </label>
            {h.urgencias247 && (
              <div className={styles.subopcion}>
                <label className={styles.casilla}>
                  <input type="checkbox" checked={h.mostrarTelefono} disabled={deshabilitado || !h.tieneTelefono}
                    onChange={(e) => h.setMostrarTelefono(e.target.checked)} />
                  {TEXTOS_TELEFONO_URGENCIAS.casilla}
                </label>
                <p className={styles.ayuda}>{h.tieneTelefono ? TEXTOS_TELEFONO_URGENCIAS.ayuda : TEXTOS_TELEFONO_URGENCIAS.sinTelefono}</p>
              </div>
            )}
          </section>

          {h.horario.independiente && (
            <section className={styles.tarjeta} aria-label={T.zonaTitulo}>
              <h2 className={styles.tarjetaTitulo}>{T.zonaTitulo}</h2>
              <p className={styles.ayuda}>{T.zonaAyuda}</p>
              <label className={styles.casilla}>
                <input type="checkbox" checked={h.aDomicilio} disabled={deshabilitado}
                  onChange={(e) => h.setADomicilio(e.target.checked)} />
                {T.aDomicilio}
              </label>
              <CampoComunas comunas={h.comunas} onCambiar={h.setComunas} deshabilitado={deshabilitado} />
            </section>
          )}

          {progreso && progreso.pasos.colegiado === false && (
            <TarjetaColegiado onRegistrado={() => setVersionPerfil((n) => n + 1)} />
          )}

          {h.error && <Aviso tipo="error" texto={h.error} />}
          {h.guardado && <Aviso tipo="ok" texto={T.guardado} />}

          <div className={styles.pie}>
            <button type="button" className={styles.boton} onClick={h.guardar} disabled={deshabilitado} aria-busy={h.ocupado}>
              {h.ocupado && <Spinner />}
              {h.ocupado ? T.guardando : T.guardar}
            </button>
          </div>
        </>
      )}
    </div>
  );
};
