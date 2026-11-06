import { useState } from "react";
import { CONFIRMACIONES, Iconos, TEXTOS_MI_AGENDA as T } from "../../../constants";
import { useMiAgendaSemana } from "../../../hooks/useMiAgendaSemana";
import { useConfirmar } from "../../../hooks/useConfirmar";
import { formatDiaHora, formatHora24 } from "../../../lib/fechas";
import { horaDesdeMinutos, minutosDe } from "../../../lib/agendaSemana";
import type { CeldaAgenda, CitaAgendaItem, SeccionMiAgendaProps, ValoresBloqueo } from "../../../interfaces";
import { ModificarCitaModal } from "../../../Modal/ModificarCitaModal";
import { BloquearHorarioModal } from "../../../Modal/BloquearHorarioModal";
import { GrillaSemana } from "./GrillaSemana";
import { LeyendaAgenda } from "./LeyendaAgenda";
import styles from "../../../css/veterinario/MiAgenda.module.css";

// "Mi Agenda" del veterinario: la semana con TODAS sus horas.
// Hora libre → bloquearla · cita → reagendarla o cancelarla (avisa al dueño
// y al centro) · bloqueada → quitar el bloqueo.
export const SeccionMiAgenda = ({ veterinarioId, onConfigurarHorario, onVerPorConfirmar, recarga, onCambio }: SeccionMiAgendaProps) => {
  const agenda = useMiAgendaSemana(veterinarioId, recarga);
  const confirmar = useConfirmar();
  const [citaAModificar, setCitaAModificar] = useState<CitaAgendaItem | null>(null);
  const [bloqueo, setBloqueo] = useState<ValoresBloqueo | null>(null);

  const alCambiar = () => {
    agenda.recargar();
    onCambio();
  };

  const elegirCelda = async (celda: CeldaAgenda) => {
    if (celda.tipo === "libre") {
      setBloqueo({ fecha: celda.fecha, desde: celda.hora, hasta: horaDesdeMinutos(Math.min(minutosDe(celda.hora) + agenda.duracion, 23 * 60 + 59)) });
    } else if (celda.tipo === "tomada" && celda.cita) {
      setCitaAModificar(celda.cita);
    } else if (celda.tipo === "bloqueada" && celda.bloqueo) {
      const b = celda.bloqueo;
      const detalle = `${formatDiaHora(b.desde)} a ${formatHora24(b.hasta)} · ${b.motivo}`;
      if (await confirmar(CONFIRMACIONES.quitarBloqueo(detalle))) {
        await agenda.quitarBloqueo(b);
        alCambiar();
      }
    }
  };

  const { dias } = agenda.semana;

  return (
    <div className={styles.seccion}>
      <header>
        <h1 className={styles.titulo}>{T.titulo}</h1>
        <p className={styles.subtitulo}>{T.subtitulo}</p>
      </header>

      <div className={styles.barra}>
        <div className={styles.navegacion}>
          <button type="button" className={styles.botonIcono} onClick={agenda.semanaAnterior} aria-label={T.semanaAnterior}>
            <Iconos.volver size={18} />
          </button>
          <span className={styles.rango} aria-live="polite">{T.rango(dias[0].titulo, dias[6].titulo)}</span>
          <button type="button" className={styles.botonIcono} onClick={agenda.semanaSiguiente} aria-label={T.semanaSiguiente}>
            <Iconos.flechaDerecha size={18} />
          </button>
          <button type="button" className={styles.botonSecundario} onClick={agenda.irAHoy} disabled={agenda.esSemanaActual}>
            {T.hoy}
          </button>
        </div>
        <div className={styles.acciones}>
          {agenda.porConfirmar > 0 && (
            <button type="button" className={styles.botonSecundario} onClick={onVerPorConfirmar}>
              <span className={styles.contador}>{agenda.porConfirmar}</span> {T.porConfirmar}
            </button>
          )}
          <button type="button" className={styles.boton} onClick={() => setBloqueo({ fecha: dias.find((d) => d.esHoy)?.fecha ?? dias[0].fecha, desde: "16:00", hasta: "17:00" })}>
            <Iconos.candado size={15} aria-hidden="true" /> {T.bloquear}
          </button>
        </div>
      </div>

      {agenda.sinHorario && (
        <div className={styles.sinHorario}>
          <div>
            <strong>{T.sinHorarioTitulo}</strong>
            <p>{T.sinHorarioTexto}</p>
          </div>
          <button type="button" className={styles.boton} onClick={onConfigurarHorario}>{T.configurarHorario}</button>
        </div>
      )}

      {agenda.error && <div className={styles.error} role="alert">{agenda.error}</div>}

      <LeyendaAgenda />

      {agenda.cargando ? <p className={styles.vacio}>Cargando…</p> : (
        <GrillaSemana semana={agenda.semana} onElegirCelda={elegirCelda} />
      )}

      {citaAModificar && (
        <ModificarCitaModal
          cita={citaAModificar}
          horasLibres={agenda.horasLibres()}
          onCerrar={() => setCitaAModificar(null)}
          onListo={alCambiar}
        />
      )}
      {bloqueo && (
        <BloquearHorarioModal citas={agenda.citas} inicial={bloqueo} onCerrar={() => setBloqueo(null)} onListo={alCambiar} />
      )}
    </div>
  );
};
