import { useState } from "react";
import styles from "../css/modal/RecetaModal.module.css";
import type { MedicamentoReceta, RecetaModalProps } from "../interfaces";
import { getPacienteByVeterinarioId } from "../Api/getInfo";
import { useConsulta } from "../hooks/useConsulta";
import { Iconos, getFechaHoy, medicamentoVacio } from "../constants";
import { formatFechaCorta } from "../lib/fechas";
import { SelectorPaciente } from "../components/receta/SelectorPaciente";
import { TablaMedicamentos } from "../components/receta/TablaMedicamentos";
import { ProximoControl } from "../components/receta/ProximoControl";

const iconos = Iconos;

// Modal "Nueva receta" del veterinario.
// Este archivo solo maneja el ESTADO del formulario y arma las piezas;
// cada parte visual vive en components/receta/:
//   · SelectorPaciente  -> buscar y elegir paciente (muestra TarjetaPaciente)
//   · TablaMedicamentos -> filas editables (FilaMedicamento) + agregar
//   · ProximoControl    -> calendario + atajos "En 7 días", etc.
export const RecetaModal = ({ veterinarioId, pacienteInicialId, nombreVeterinario, centro, onCerrar, onGuardar }: RecetaModalProps) => {
  // Pacientes del veterinario (mascotas con las que ha tenido citas)
  const { datos: pacientes = [], cargando } =
    useConsulta(() => getPacienteByVeterinarioId(veterinarioId), [veterinarioId]);

  // ---------- Estado del formulario ----------
  const [pacienteId, setPacienteId] = useState<number | null>(pacienteInicialId ?? null);
  const [medicamentos, setMedicamentos] = useState<MedicamentoReceta[]>([medicamentoVacio()]);
  const [indicaciones, setIndicaciones] = useState("");
  const [proximoControl, setProximoControl] = useState(""); // "YYYY-MM-DD" o ""

  // ---------- Acciones sobre la tabla de medicamentos ----------
  const cambiarMedicamento = (index: number, campo: keyof MedicamentoReceta, valor: string) =>
    setMedicamentos((prev) => prev.map((m, i) => (i === index ? { ...m, [campo]: valor } : m)));

  const agregarMedicamento = () => setMedicamentos((prev) => [...prev, medicamentoVacio()]);

  const eliminarMedicamento = (index: number) =>
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));

  // ---------- Validación ----------
  // Las filas totalmente vacías se ignoran (por si agregó una y no la usó).
  const filasConDatos = medicamentos.filter((m) => Object.values(m).some((v) => v.trim()));
  const filasCompletas = filasConDatos.every((m) => Object.values(m).every((v) => v.trim()));
  const esValido = pacienteId !== null && filasConDatos.length > 0 && filasCompletas;

  // Mensaje de ayuda: le dice al veterinario qué le falta para poder guardar
  const ayuda =
    pacienteId === null
      ? "Elige un paciente para continuar."
      : filasConDatos.length === 0
        ? "Agrega al menos un medicamento."
        : !filasCompletas
          ? "Completa medicamento, dosis, frecuencia y duración en cada fila."
          : null;

  const nombrePaciente = pacientes.find((p) => p.id === pacienteId)?.nombre;

  // ---------- Guardar ----------
  const guardar = () => {
    if (!esValido || pacienteId === null) return;
    onGuardar({
      mascotaId: pacienteId,
      veterinarioId,
      fecha: getFechaHoy(),
      medicamentos: filasConDatos.map((m) => ({
        nombre: m.nombre.trim(),
        dosis: m.dosis.trim(),
        frecuencia: m.frecuencia.trim(),
        duracion: m.duracion.trim(),
      })),
      indicaciones: indicaciones.trim(),
      proximoControl: proximoControl || undefined,
    });
    onCerrar();
  };

  // Subtítulo: "Dr. Camilo Rojas · Clínica VetSur · 13/10/2026" (solo lo que exista)
  const subtitulo = [nombreVeterinario, centro, formatFechaCorta(new Date().toISOString())]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      {/* stopPropagation: un clic dentro del modal no lo cierra */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="titulo-receta">
        {/* ---------- Encabezado ---------- */}
        <div className={styles.header}>
          <div>
            <h2 id="titulo-receta" className={styles.titulo}>Nueva receta</h2>
            <p className={styles.subtitulo}>{subtitulo}</p>
          </div>
          <button type="button" className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            <iconos.cerrar size={18} />
          </button>
        </div>

        {/* ---------- Cuerpo (hace scroll si no cabe) ---------- */}
        <div className={styles.cuerpo}>
          <section className={styles.seccion}>
            <span className={styles.etiqueta}>Paciente</span>
            <SelectorPaciente
              pacientes={pacientes}
              pacienteId={pacienteId}
              onSeleccionar={setPacienteId}
              cargando={cargando}
            />
          </section>

          <section className={styles.seccion}>
            <span className={styles.etiqueta}>Medicamentos</span>
            <TablaMedicamentos
              medicamentos={medicamentos}
              onCambiar={cambiarMedicamento}
              onAgregar={agregarMedicamento}
              onEliminar={eliminarMedicamento}
            />
          </section>

          <section className={styles.seccion}>
            <label className={styles.etiqueta} htmlFor="indicaciones-receta">Indicaciones para el dueño</label>
            <textarea
              id="indicaciones-receta"
              className={styles.textarea}
              rows={3}
              placeholder="Ej: Administrar con comida. Reposo relativo, evitar saltos y paseos largos."
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
            />
          </section>

          <section className={styles.seccion}>
            <span className={styles.etiqueta}>Próximo control (opcional)</span>
            <ProximoControl valor={proximoControl} onCambiar={setProximoControl} />
          </section>
        </div>

        {/* ---------- Pie ---------- */}
        <div className={styles.pie}>
          <p className={styles.notaPie}>
            {ayuda ?? `La receta quedará en el historial de ${nombrePaciente} y visible para su dueño.`}
          </p>
          <div className={styles.acciones}>
            <button type="button" className={styles.cancelar} onClick={onCerrar}>Cancelar</button>
            <button type="button" className={styles.guardar} disabled={!esValido} onClick={guardar}>
              Guardar receta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
