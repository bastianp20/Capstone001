import { useState } from "react";
import type { MedicamentoReceta, RecetaModalProps } from "../interfaces";
import { getPacienteByVeterinarioId } from "../Api/getInfo";
import styles from "../css/Modal.module.css";


const medicamentoVacio = (): MedicamentoReceta => ({
  nombre: "",
  dosis: "",
  frecuencia: "",
  duracion: "",
});

// fecha de hoy en formato YYYYMMDD
const getFechaHoy = (): number => {
  const hoy = new Date();
  const yyyy = hoy.getFullYear();
  const mm = String(hoy.getMonth() + 1).padStart(2, "0");
  const dd = String(hoy.getDate()).padStart(2, "0");
  return Number(`${yyyy}${mm}${dd}`);
};

// Modal solo de escritura: el veterinario elige a cuál de sus pacientes
// le está recetando (getPacientesPorVeterinario ya trae la lista de
// mascotas únicas que atiende), agrega uno o más medicamentos e indicaciones.
export const RecetaModal = ({ veterinarioId, onCerrar, onGuardar }: RecetaModalProps) => {
  const pacientes = getPacienteByVeterinarioId(veterinarioId);

  const [mascotaId, setMascotaId] = useState<number | "">("");
  const [medicamentos, setMedicamentos] = useState<MedicamentoReceta[]>([medicamentoVacio()]);
  const [indicaciones, setIndicaciones] = useState("");
  const [proximoControl, setProximoControl] = useState("");

  const actualizarMedicamento = (index: number, campo: keyof MedicamentoReceta, valor: string) => {
    setMedicamentos((prev) => prev.map((m, i) => (i === index ? { ...m, [campo]: valor } : m)));
  };

  const agregarMedicamento = () => setMedicamentos((prev) => [...prev, medicamentoVacio()]);

  const eliminarMedicamento = (index: number) =>
    setMedicamentos((prev) => prev.filter((_, i) => i !== index));

  // Válida solo si hay paciente elegido y todos los medicamentos cargados
  // tienen sus 4 campos completos (evita guardar filas a medio llenar).
  const esValido =
    mascotaId !== "" &&
    medicamentos.length > 0 &&
    medicamentos.every((m) => m.nombre.trim() && m.dosis.trim() && m.frecuencia.trim() && m.duracion.trim());

  const handleGuardar = () => {
    if (!esValido || mascotaId === null) return;

    onGuardar({
      mascotaId,
      veterinarioId,
      fecha: getFechaHoy(),
      medicamentos,
      indicaciones: indicaciones.trim(),
      proximoControl: proximoControl.trim() || undefined,
    });
    onCerrar();
  };

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Nueva Receta</h3>
          <button className={styles.closeButton} onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <label className={styles.label}>
            Paciente <span className={styles.required}>(requerido)</span>
          </label>
          <select
            className={styles.select}
            value={mascotaId}
            onChange={(e) => setMascotaId(e.target.value ? Number(e.target.value) : "")}
          >
            <option value="">Selecciona un paciente…</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre} — {p.especie} ({p.dueno})
              </option>
            ))}
          </select>

          <label className={styles.label} style={{ display: "block", marginTop: 16 }}>
            Medicamentos <span className={styles.required}>(requerido)</span>
          </label>

          {medicamentos.map((m, i) => (
            <div key={i} className={styles.medicamentoRow}>
              {medicamentos.length > 1 && (
                <button
                  type="button"
                  className={styles.btnEliminarMedicamento}
                  onClick={() => eliminarMedicamento(i)}
                >
                  ×
                </button>
              )}
              <input
                className={styles.input}
                placeholder="Medicamento"
                value={m.nombre}
                onChange={(e) => actualizarMedicamento(i, "nombre", e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Dosis (ej: 5mg)"
                value={m.dosis}
                onChange={(e) => actualizarMedicamento(i, "dosis", e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Frecuencia (ej: cada 12h)"
                value={m.frecuencia}
                onChange={(e) => actualizarMedicamento(i, "frecuencia", e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Duración (ej: 7 días)"
                value={m.duracion}
                onChange={(e) => actualizarMedicamento(i, "duracion", e.target.value)}
              />
            </div>
          ))}

          <button type="button" className={styles.btnAgregar} onClick={agregarMedicamento}>
            + Agregar medicamento
          </button>

          <label className={styles.label}>Indicaciones</label>
          <textarea
            className={styles.textarea}
            rows={3}
            placeholder="Indicaciones generales para el dueño…"
            value={indicaciones}
            onChange={(e) => setIndicaciones(e.target.value)}
          />

          <label className={styles.label} style={{ display: "block", marginTop: 12 }}>
            Próximo control (opcional)
          </label>
          <input
            className={styles.input}
            placeholder="ej: en 10 días"
            value={proximoControl}
            onChange={(e) => setProximoControl(e.target.value)}
          />
        </div>

        <div className={styles.actions}>
          <button className={styles.btnCancelar} onClick={onCerrar}>
            Cancelar
          </button>
          <button className={styles.btnConfirmar} disabled={!esValido} onClick={handleGuardar}>
            Guardar receta
          </button>
        </div>
      </div>
    </div>
  );
};