import { useCallback, useId, useState } from "react";
import { Iconos, MENSAJE_SUGERIDO_CAMBIO, MOTIVOS_CAMBIO_HORA, TEXTOS_MI_HORARIO as T } from "../constants";
import { useAuth } from "../Auth/AuthContext";
import { useAccion } from "../hooks/useAccion";
import { useCambioHorario } from "../hooks/useCambioHorario";
import { useTeclaEscape } from "../hooks/useTeclaEscape";
import { bloquearMiHorario } from "../Api/postInfo";
import { fechaDentroDe, formatDiaConNombre, formatDiaHora, formatHora24, isoDesdeFechaHora } from "../lib/fechas";
import { centrosDeCitas, citasEnRango } from "../lib/miHorario";
import type { BloquearHorarioModalProps } from "../interfaces";
import { Spinner } from "../components/ui/Spinner";
import { ChipsMotivo } from "../components/veterinario/horario/ChipsMotivo";
import { AvisarCambio } from "../components/veterinario/horario/AvisarCambio";
import { ResumenCambio } from "../components/veterinario/horario/ResumenCambio";
import base from "../css/modal/RechazarModal.module.css";
import styles from "../css/modal/CambioHorario.module.css";

// El veterinario bloquea un rango de horas (le surgió algo). Si el rango tiene
// citas, las muestra: puede cancelarlas aquí (avisando a cada dueño) o cerrar
// y reagendarlas una por una con "Modificar".
export const BloquearHorarioModal = ({ citas, inicial, onCerrar, onListo }: BloquearHorarioModalProps) => {
  const id = useId();
  const { usuarioActual } = useAuth();
  const vet = usuarioActual?.nombre ?? "Tu veterinario";
  const [fecha, setFecha] = useState(inicial?.fecha ?? fechaDentroDe(0));
  const [desde, setDesde] = useState(inicial?.desde ?? "16:00");
  const [hasta, setHasta] = useState(inicial?.hasta ?? "17:00");
  const [todoElDia, setTodoElDia] = useState(false);
  const [cancelarCitas, setCancelarCitas] = useState(false);
  const [listo, setListo] = useState<string | null>(null);
  const { ejecutar, ocupado, error } = useAccion();
  const cambio = useCambioHorario(MENSAJE_SUGERIDO_CAMBIO.bloqueo(vet));

  // Rango en ISO. "Todo el día" = de 00:00 a 00:00 del día siguiente.
  const desdeIso = fecha ? isoDesdeFechaHora(fecha, todoElDia ? "00:00" : desde) : "";
  const hastaIso = fecha
    ? (todoElDia ? isoDesdeFechaHora(fechaDentroDe(1, new Date(`${fecha}T00:00:00`)), "00:00") : isoDesdeFechaHora(fecha, hasta))
    : "";
  const rangoValido = desdeIso !== "" && hastaIso > desdeIso;
  const afectadas = rangoValido ? citasEnRango(citas, desdeIso, hastaIso) : [];
  const duenos = [...new Set(afectadas.map((c) => c.dueno))];
  const centros = centrosDeCitas(afectadas);

  const puedeGuardar = !ocupado && rangoValido && cambio.motivoFinal !== "" && (afectadas.length === 0 || cancelarCitas);

  const cerrar = useCallback(() => {
    if (!ocupado) onCerrar();
  }, [ocupado, onCerrar]);
  useTeclaEscape(cerrar, !ocupado);

  const guardar = async () => {
    if (!puedeGuardar) return;
    const ok = await ejecutar(() => bloquearMiHorario({
      desde: desdeIso,
      hasta: hastaIso,
      motivo: cambio.motivoFinal,
      cancelarCitas: afectadas.length > 0,
      mensaje: cambio.mensaje,
      avisarCentro: cambio.avisarCentro,
    }), T.errorGenerico);
    if (ok) {
      const rango = todoElDia ? `${formatDiaConNombre(fecha)}, ${T.todoElDia.toLowerCase()}` : `${formatDiaConNombre(fecha)}, ${desde} a ${hasta}`;
      const destinos = [...duenos, ...(cambio.avisarCentro ? centros : [])];
      setListo(destinos.length > 0 ? `${rango}. ${T.listoAvisamos(destinos)}` : `${rango}.`);
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
              <Iconos.candado size={22} className={styles.iconoCalendario} aria-hidden="true" />
              <div className={base.encabezadoTextos}>
                <h3 id={`${id}-titulo`} className={base.titulo}>{T.tituloBloquear}</h3>
                <p className={base.subtitulo}>{T.subtituloBloquear}</p>
              </div>
              <button type="button" className={base.botonCerrar} onClick={cerrar} disabled={ocupado} aria-label={T.cerrar}>
                <Iconos.cerrar size={20} />
              </button>
            </header>

            <div className={styles.cuerpo}>
              <div className={styles.grupo}>
                <label className={styles.campo}>
                  {T.dia}
                  <input type="date" className={styles.input} min={fechaDentroDe(0)} value={fecha}
                    onChange={(e) => setFecha(e.target.value)} disabled={ocupado} />
                </label>
                {!todoElDia && (
                  <div className={styles.fila}>
                    <label className={styles.campo}>
                      {T.desde}
                      <input type="time" className={styles.input} step={900} value={desde}
                        onChange={(e) => setDesde(e.target.value)} disabled={ocupado} />
                    </label>
                    <label className={styles.campo}>
                      {T.hasta}
                      <input type="time" className={styles.input} step={900} value={hasta}
                        onChange={(e) => setHasta(e.target.value)} disabled={ocupado} />
                    </label>
                  </div>
                )}
                <label className={styles.casilla}>
                  <input type="checkbox" checked={todoElDia} onChange={(e) => setTodoElDia(e.target.checked)} disabled={ocupado} />
                  {T.todoElDia}
                </label>
              </div>

              <ChipsMotivo etiqueta={T.motivo} opciones={MOTIVOS_CAMBIO_HORA} valor={cambio.motivo}
                onCambiar={cambio.setMotivo} deshabilitado={ocupado} />
              <label className={styles.campo}>
                {T.detalleMotivo}
                <input type="text" className={styles.input} maxLength={200} value={cambio.detalleMotivo}
                  onChange={(e) => cambio.setDetalleMotivo(e.target.value)} disabled={ocupado} />
              </label>

              {afectadas.length > 0 && (
                <>
                  <div className={styles.grupo}>
                    <p className={styles.avisoAmbar}>{T.citasEnRango(afectadas.length)}</p>
                    <ul className={styles.citasAfectadas}>
                      {afectadas.map((c) => (
                        <li key={c.id} className={styles.citaAfectada}>
                          <span><strong>{formatHora24(c.fechaHora)}</strong> · {c.mascota} — {c.dueno}</span>
                          <span>{c.centro ?? T.independiente}</span>
                        </li>
                      ))}
                    </ul>
                    <label className={styles.casilla}>
                      <input type="checkbox" checked={cancelarCitas} onChange={(e) => setCancelarCitas(e.target.checked)} disabled={ocupado} />
                      {T.opcionCancelarCitas}
                    </label>
                    <span className={styles.nota}>{T.ayudaReagendar}</span>
                  </div>

                  {cancelarCitas && (
                    <AvisarCambio
                      dueno={duenos.join(", ")}
                      centros={centros}
                      avisarCentro={cambio.avisarCentro}
                      onAvisarCentro={cambio.setAvisarCentro}
                      mensaje={cambio.mensaje}
                      onMensaje={cambio.setMensaje}
                      deshabilitado={ocupado}
                    />
                  )}
                </>
              )}

              {rangoValido && afectadas.length === 0 && (
                <p className={styles.antesAhora}>
                  {todoElDia ? `${formatDiaConNombre(fecha)} · ${T.todoElDia}` : `${formatDiaHora(desdeIso)} – ${hasta}`}
                </p>
              )}

              {error && <p className={styles.error} role="alert">{error}</p>}
            </div>

            <footer className={base.pie}>
              <button type="button" className={`${base.boton} ${base.botonSecundario}`} onClick={cerrar} disabled={ocupado}>
                {T.volver}
              </button>
              <button
                type="button"
                className={`${base.boton} ${afectadas.length > 0 ? base.botonPeligro : styles.botonPrincipal}`}
                onClick={guardar}
                disabled={!puedeGuardar}
                aria-busy={ocupado}
              >
                {ocupado && <Spinner />}
                {ocupado ? T.guardando : afectadas.length > 0 ? T.confirmarBloquearYCancelar : T.confirmarBloquear}
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
};
