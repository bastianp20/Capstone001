import { useCallback, useId, useState } from "react";
import { Iconos, MENSAJE_SUGERIDO_CAMBIO, MOTIVOS_CAMBIO_HORA, TEXTOS_MI_AGENDA, TEXTOS_MI_HORARIO as T } from "../constants";
import { useAuth } from "../Auth/AuthContext";
import { useAccion } from "../hooks/useAccion";
import { useCambioHorario } from "../hooks/useCambioHorario";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { cancelarCitaVeterinario, reagendarCitaVeterinario } from "../Api/postInfo";
import { fechaEnChile, formatDiaHora, formatHora24, isoDesdeFechaHora } from "../lib/fechas";
import { primerNombre } from "../lib/miHorario";
import type { AccionCambioCita, ModificarCitaModalProps } from "../interfaces";
import { Spinner } from "../components/ui/Spinner";
import { ChipsMotivo } from "../components/veterinario/horario/ChipsMotivo";
import { AvisarCambio } from "../components/veterinario/horario/AvisarCambio";
import { ResumenCambio } from "../components/veterinario/horario/ResumenCambio";
import { SelectorHoraLibre } from "../components/veterinario/horario/SelectorHoraLibre";
import base from "../css/modal/RechazarModal.module.css";
import styles from "../css/modal/CambioHorario.module.css";

// El veterinario reagenda o cancela una cita suya y avisa al dueño (y al
// centro, si la cita es de uno). Mismo estilo oscuro que el modal de rechazo.
export const ModificarCitaModal = ({ cita, horasLibres, onCerrar, onListo }: ModificarCitaModalProps) => {
  const id = useId();
  const { usuarioActual } = useAuth();
  const vet = usuarioActual?.nombre ?? "Tu veterinario";
  const [accion, setAccion] = useState<AccionCambioCita>("reagendar");
  const [fecha, setFecha] = useState(fechaEnChile(cita.fechaHora));
  const [hora, setHora] = useState(formatHora24(cita.fechaHora));
  // Con horas libres (desde la grilla) se elige entre ellas; si no hay, a mano
  const hayHorasLibres = (horasLibres?.length ?? 0) > 0;
  const [aMano, setAMano] = useState(!hayHorasLibres);
  const [listo, setListo] = useState<string | null>(null); // texto del resumen final
  const { ejecutar, ocupado, error } = useAccion();

  const antes = formatDiaHora(cita.fechaHora);
  const nuevaIso = fecha && hora ? isoDesdeFechaHora(fecha, hora) : null;
  const ahora = nuevaIso ? formatDiaHora(nuevaIso) : "";
  const centros = cita.centro ? [cita.centro] : [];

  const cambioDeHora = nuevaIso !== null && nuevaIso !== new Date(cita.fechaHora).toISOString();

  // En el mensaje el día va en minúscula ("del jueves 6 nov, 16:00")
  const antesTexto = antes.toLowerCase();
  const ahoraTexto = cambioDeHora ? ahora.toLowerCase() : T.horaPorElegir;
  const sugerido = accion === "reagendar"
    ? MENSAJE_SUGERIDO_CAMBIO.reagendar(primerNombre(cita.dueno), vet, cita.mascota, antesTexto, ahoraTexto)
    : MENSAJE_SUGERIDO_CAMBIO.cancelar(primerNombre(cita.dueno), vet, cita.mascota, antesTexto);
  const cambio = useCambioHorario(sugerido);
  const puedeGuardar = !ocupado && (accion === "reagendar" ? cambioDeHora : cambio.motivoFinal !== "");

  const cerrar = useCallback(() => {
    if (!ocupado) onCerrar();
  }, [ocupado, onCerrar]);
  useTeclaEscape(cerrar, !ocupado);

  const destinos = [cita.dueno, ...(cambio.avisarCentro ? centros : [])];

  const guardar = async () => {
    if (!puedeGuardar) return;
    const aviso = { mensaje: cambio.mensaje, avisarCentro: cambio.avisarCentro };
    const ok = accion === "reagendar"
      ? await ejecutar(() => reagendarCitaVeterinario({ citaId: cita.id, nuevaFecha: nuevaIso!, ...aviso }), T.errorGenerico)
      : await ejecutar(() => cancelarCitaVeterinario({ citaId: cita.id, motivo: cambio.motivoFinal, ...aviso }), T.errorGenerico);
    if (ok) {
      const resumen = accion === "reagendar" ? T.antesAhora(antes, ahora) : `${cita.mascota} · ${antes}`;
      setListo(`${resumen}. ${T.listoAvisamos(destinos)}`);
      onListo();
    }
  };

  return (
    <div className={base.overlay} onClick={cerrar}>
      <div
        className={`${base.modal} ${styles.modalAncho}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-titulo`}
        onClick={(e) => e.stopPropagation()}
      >
        {listo ? (
          <ResumenCambio titulo={T.listoTitulo} detalle={listo} onCerrar={onCerrar} />
        ) : (
          <>
            <header className={base.header}>
              <Iconos.calendario size={22} className={styles.iconoCalendario} aria-hidden="true" />
              <div className={base.encabezadoTextos}>
                <h3 id={`${id}-titulo`} className={base.titulo}>{T.tituloModificar}</h3>
                <p className={base.subtitulo}>
                  {cita.mascota} · {antes} · {cita.centro ?? T.independiente}
                </p>
              </div>
              <button type="button" className={base.botonCerrar} onClick={cerrar} disabled={ocupado} aria-label={T.cerrar}>
                <Iconos.cerrar size={20} />
              </button>
            </header>

            <div className={styles.cuerpo}>
              <div className={styles.segmentado} role="group" aria-label={T.tituloModificar}>
                <button
                  type="button"
                  className={`${styles.segmento} ${accion === "reagendar" ? styles.segmentoActivo : ""}`}
                  aria-pressed={accion === "reagendar"}
                  onClick={() => { setAccion("reagendar"); cambio.setMensaje(null); }}
                  disabled={ocupado}
                >
                  {T.reagendar}
                </button>
                <button
                  type="button"
                  className={`${styles.segmento} ${styles.segmentoPeligro} ${accion === "cancelar" ? styles.segmentoActivo : ""}`}
                  aria-pressed={accion === "cancelar"}
                  onClick={() => { setAccion("cancelar"); cambio.setMensaje(null); }}
                  disabled={ocupado}
                >
                  {T.cancelarCita}
                </button>
              </div>

              {accion === "reagendar" ? (
                <div className={styles.grupo}>
                  {!aMano && horasLibres && (
                    <SelectorHoraLibre
                      horas={horasLibres}
                      elegida={cambioDeHora ? nuevaIso : null}
                      onElegir={(h) => { setFecha(h.fecha); setHora(h.hora); }}
                      deshabilitado={ocupado}
                    />
                  )}
                  {horasLibres !== undefined && !hayHorasLibres && <p className={styles.nota}>{TEXTOS_MI_AGENDA.sinHorasLibres}</p>}
                  {hayHorasLibres && (
                    <button type="button" className={styles.enlace} onClick={() => setAMano(!aMano)} disabled={ocupado}>
                      {aMano ? TEXTOS_MI_AGENDA.verHorasLibres : TEXTOS_MI_AGENDA.otraHora}
                    </button>
                  )}
                  {aMano && (
                  <div className={styles.fila}>
                    <label className={styles.campo}>
                      {T.nuevaFecha}
                      <input type="date" className={styles.input} min={fechaEnChile(new Date().toISOString())}
                        value={fecha} onChange={(e) => setFecha(e.target.value)} disabled={ocupado} />
                    </label>
                    <label className={styles.campo}>
                      {T.nuevaHora}
                      <input type="time" className={styles.input} step={900}
                        value={hora} onChange={(e) => setHora(e.target.value)} disabled={ocupado} />
                    </label>
                  </div>
                  )}
                  {cambioDeHora && <p className={styles.antesAhora}>{T.antesAhora(antes, ahora)}</p>}
                </div>
              ) : (
                <>
                  <ChipsMotivo etiqueta={T.motivo} opciones={MOTIVOS_CAMBIO_HORA} valor={cambio.motivo}
                    onCambiar={cambio.setMotivo} deshabilitado={ocupado} />
                  <label className={styles.campo}>
                    {T.detalleMotivo}
                    <input type="text" className={styles.input} maxLength={200} value={cambio.detalleMotivo}
                      onChange={(e) => cambio.setDetalleMotivo(e.target.value)} disabled={ocupado} />
                  </label>
                  <p className={styles.avisoPeligro}>{T.avisoCancelar}</p>
                </>
              )}

              <AvisarCambio
                dueno={cita.dueno}
                centros={centros}
                avisarCentro={cambio.avisarCentro}
                onAvisarCentro={cambio.setAvisarCentro}
                mensaje={cambio.mensaje}
                onMensaje={cambio.setMensaje}
                deshabilitado={ocupado}
              />

              {error && <p className={styles.error} role="alert">{error}</p>}
            </div>

            <footer className={base.pie}>
              <button type="button" className={`${base.boton} ${base.botonSecundario}`} onClick={cerrar} disabled={ocupado}>
                {T.volver}
              </button>
              <button
                type="button"
                className={`${base.boton} ${accion === "reagendar" ? styles.botonPrincipal : base.botonPeligro}`}
                onClick={guardar}
                disabled={!puedeGuardar}
                aria-busy={ocupado}
              >
                {ocupado && <Spinner />}
                {ocupado ? T.guardando : accion === "reagendar" ? T.confirmarReagendar : T.confirmarCancelar}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
