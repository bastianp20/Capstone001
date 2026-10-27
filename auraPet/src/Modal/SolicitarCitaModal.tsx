import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los otros modales
import {
  EMOJI_ESPECIE, ESPECIALIDAD_POR_DEFECTO, PASO_HORA_CITA_SEGUNDOS, SINTOMAS_FRECUENTES, TEXTOS_SOLICITAR_CITA as T,
  VALOR_ATENCION_INDEPENDIENTE,
} from "../constants";
import { useConsulta } from "../hooks/useConsulta";
import { getCentrosParaCita, getVeterinariosDeCentro, getVeterinariosIndependientes } from "../Api/getInfo";
import { solicitarCita } from "../Api/postInfo";
import { diaSemanaDeFecha, fechaDentroDe } from "../lib/fechas";
import type { SolicitarCitaModalProps } from "../interfaces";
import { useAuth } from "../Auth/AuthContext";

// Modal "Solicitar cita" del dueño: mascota, dónde (un centro o un veterinario
// independiente), veterinario (opcional en un centro, obligatorio si es
// independiente; con su especialidad), fecha y hora, motivo y síntomas. La cita queda "pendiente" hasta que el
// veterinario la confirme. La base revisa horario, hora libre, etc.
export const ModalSolicitarCita = ({ mascotas, mascotaInicialId, onClose, onCreada }: SolicitarCitaModalProps) => {
  const { usuarioActual } = useAuth();
  const { datos: todosLosCentros = [], cargando: cargandoCentros } = useConsulta(() => getCentrosParaCita(), []);
  // Cuenta de prueba -> solo centros de prueba; cuenta real -> solo centros reales
  // (la base igual lo vuelve a revisar al guardar)
  const centros = todosLosCentros.filter((c) => c.esPrueba === (usuarioActual?.esPrueba ?? false));

  // ---------- Campos ----------
  const [mascotaId, setMascotaId] = useState<number | null>(mascotaInicialId ?? (mascotas.length === 1 ? mascotas[0].id : null));
  // Dónde atenderse: "" (sin elegir), VALOR_ATENCION_INDEPENDIENTE o el id del centro
  const [destino, setDestino] = useState("");
  const esIndependiente = destino === VALOR_ATENCION_INDEPENDIENTE;
  const centroId = destino && !esIndependiente ? Number(destino) : null;
  const [veterinarioId, setVeterinarioId] = useState<number | null>(null); // null = sin preferencia
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [motivo, setMotivo] = useState("");
  const [sintomas, setSintomas] = useState<string[]>([]);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listo, setListo] = useState(false);

  // Veterinarios del centro elegido, o los independientes (se vuelve a pedir al cambiar)
  const { datos: veterinarios = [], cargando: cargandoVeterinarios } = useConsulta(
    () => (esIndependiente
      ? getVeterinariosIndependientes()
      : centroId ? getVeterinariosDeCentro(centroId) : Promise.resolve([])),
    [centroId, esIndependiente]
  );
  const veterinarioElegido = veterinarios.find((v) => v.id === veterinarioId);

  const centro = centros.find((c) => c.id === centroId);

  // Horario del centro para el día elegido, para mostrarlo como ayuda
  const textoHorario = (() => {
    if (!centro || !fecha) return null;
    if (centro.horarios.length === 0) return "Este centro no tiene horarios registrados.";
    const h = centro.horarios.find((x) => x.diaSemana === diaSemanaDeFecha(fecha));
    if (!h) return "El centro no atiende ese día.";
    const colacion = h.inicioColacion ? ` (colación ${h.inicioColacion} a ${h.finColacion})` : "";
    return `Ese día atiende de ${h.abre} a ${h.cierra}${colacion}.`;
  })();

  const alternarSintoma = (s: string) =>
    setSintomas((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const elegirDestino = (valor: string) => {
    setDestino(valor);
    setVeterinarioId(null); // el veterinario elegido podría no atender en el nuevo lugar
  };

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!mascotaId || !destino || !fecha || !hora || !motivo.trim()) {
      setError(T.faltanDatos);
      return;
    }
    if (esIndependiente && veterinarioId === null) {
      setError(T.faltaVeterinario);
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await solicitarCita({
        mascotaId,
        centroId,
        veterinarioId,
        // Fecha y hora del computador (Chile) -> ISO en UTC para la base
        fechaHora: new Date(`${fecha}T${hora}:00`).toISOString(),
        motivo,
        sintomas,
      });
      setListo(true);
      onCreada();
    } catch (err) {
      // El mensaje viene de la base: "El centro no atiende ese día", etc.
      setError(err instanceof Error ? err.message : "No se pudo solicitar la cita.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Solicitar cita</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {listo ? (
          // ---------- Éxito ----------
          <div className={styles.exito}>
            <p>✅ {T.enviadaA(esIndependiente ? veterinarioElegido?.nombre ?? "" : centro?.nombre ?? "")}</p>
            <p>Queda como <strong>pendiente</strong> hasta que el veterinario la confirme. La verás en "Próximas citas".</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : mascotas.length === 0 ? (
          // ---------- Sin mascotas ----------
          <div className={styles.exito}>
            <p>Primero registra a tu mascota para poder pedir una hora.</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Entendido</button>
            </div>
          </div>
        ) : (
          // ---------- Formulario ----------
          <form className={styles.grid} onSubmit={enviar}>
            <div className={`${styles.campo} ${styles.completo}`}>
              Mascota
              <div className={styles.chips}>
                {mascotas.map((m) => (
                  <button key={m.id} type="button" className={mascotaId === m.id ? styles.chipActivo : styles.chip}
                    onClick={() => setMascotaId(m.id)}>
                    {EMOJI_ESPECIE[m.especie]} {m.nombre}
                  </button>
                ))}
              </div>
            </div>

            <label className={styles.campo}>
              Centro
              <select value={destino} onChange={(e) => elegirDestino(e.target.value)}>
                <option value="">{cargandoCentros ? "Cargando…" : T.elegirCentro}</option>
                <optgroup label={T.grupoCentros}>
                  {centros.map((c) => <option key={c.id} value={c.id}>{c.nombre} · {c.comuna}</option>)}
                </optgroup>
                <optgroup label={T.grupoIndependiente}>
                  <option value={VALOR_ATENCION_INDEPENDIENTE}>{T.opcionIndependiente}</option>
                </optgroup>
              </select>
            </label>

            <label className={styles.campo}>
              Veterinario
              <select value={veterinarioId ?? ""} disabled={!destino}
                onChange={(e) => setVeterinarioId(e.target.value ? Number(e.target.value) : null)}>
                <option value="">
                  {esIndependiente
                    ? (!cargandoVeterinarios && veterinarios.length === 0 ? T.sinIndependientes : T.elegirVeterinario)
                    : T.sinPreferencia}
                </option>
                {veterinarios.map((v) => (
                  <option key={v.id} value={v.id}>{v.nombre} · {v.especialidad ?? ESPECIALIDAD_POR_DEFECTO}</option>
                ))}
              </select>
            </label>

            {/* La especialidad del profesional elegido, bien a la vista */}
            {veterinarioElegido && (
              <small className={`${styles.ayuda} ${styles.completo} ${styles.especialidadElegida}`}>
                {T.especialidad(veterinarioElegido.especialidad ?? ESPECIALIDAD_POR_DEFECTO)}
              </small>
            )}
            {esIndependiente && <small className={`${styles.ayuda} ${styles.completo}`}>{T.ayudaIndependiente}</small>}

            <label className={styles.campo}>
              Fecha
              <input type="date" min={fechaDentroDe(0)} value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Hora
              <input type="time" step={PASO_HORA_CITA_SEGUNDOS} value={hora} onChange={(e) => setHora(e.target.value)} />
            </label>

            {textoHorario && <small className={`${styles.ayuda} ${styles.completo}`}>{textoHorario}</small>}

            <label className={`${styles.campo} ${styles.completo}`}>
              Motivo de la consulta
              <input type="text" placeholder="Ej: vómitos desde ayer, control anual…" value={motivo}
                onChange={(e) => setMotivo(e.target.value)} />
            </label>

            <div className={`${styles.campo} ${styles.completo}`}>
              Síntomas (opcional)
              <div className={styles.chips}>
                {SINTOMAS_FRECUENTES.map((s) => (
                  <button key={s} type="button" className={sintomas.includes(s) ? styles.chipActivo : styles.chip}
                    onClick={() => alternarSintoma(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
              <button type="submit" className={styles.enviar} disabled={enviando}>
                {enviando ? "Enviando…" : "Solicitar cita"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
