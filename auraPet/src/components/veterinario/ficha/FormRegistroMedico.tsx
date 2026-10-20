import { useState, type FormEvent } from "react";
import { MAX_CARACTERES_REGISTRO, TIPO_REGISTRO_LABEL, TIPOS_REGISTRO } from "../../../constants";
import { fechaDentroDe } from "../../../lib/fechas";
import { agregarRegistroMedico } from "../../../Api/postInfo";
import { useAccion } from "../../../hooks/useAccion";
import type { FormRegistroMedicoProps, TipoRegistro } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { ContadorCaracteres } from "../../ui/ContadorCaracteres";
import styles from "../../../css/ficha/FormularioFicha.module.css";

// Agrega un registro al historial (diagnóstico, control, vacuna...).
// El veterinario y el centro los pone la base; los registros no se editan.
export const FormRegistroMedico = ({ mascotaId, onGuardado, onCancelar }: FormRegistroMedicoProps) => {
  const hoy = fechaDentroDe(0);
  const [tipo, setTipo] = useState<TipoRegistro>("diagnostico");
  const [fecha, setFecha] = useState(hoy);
  const [descripcion, setDescripcion] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [proximaDosis, setProximaDosis] = useState("");
  const { ejecutar, ocupado, error } = useAccion();

  const proximaDosisValida = !proximaDosis || proximaDosis > fecha;
  const puedeGuardar = descripcion.trim().length > 0 && proximaDosisValida && !ocupado;

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!puedeGuardar) return;
    const ok = await ejecutar(
      () => agregarRegistroMedico({ mascotaId, tipo, fecha, descripcion, tratamiento, proximaDosis }),
      "No se pudo guardar el registro."
    );
    if (ok) onGuardado();
  };

  return (
    <form className={styles.formulario} onSubmit={guardar}>
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor="registro-tipo" className={styles.etiqueta}>Tipo de registro</label>
          <select id="registro-tipo" className={styles.control} value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoRegistro)} disabled={ocupado}>
            {TIPOS_REGISTRO.map((t) => <option key={t} value={t}>{TIPO_REGISTRO_LABEL[t]}</option>)}
          </select>
        </div>
        <div className={styles.campo}>
          <label htmlFor="registro-fecha" className={styles.etiqueta}>Fecha</label>
          <input id="registro-fecha" type="date" className={styles.control} value={fecha} max={hoy}
            onChange={(e) => setFecha(e.target.value)} disabled={ocupado} required />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="registro-descripcion" className={styles.etiqueta}>
          {tipo === "vacuna" ? "Vacuna aplicada" : "Descripción"}
          <span className={styles.requerido} aria-hidden="true">*</span>
        </label>
        <textarea id="registro-descripcion" className={styles.control} value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)} maxLength={MAX_CARACTERES_REGISTRO}
          placeholder={tipo === "vacuna" ? "Ej: Óctuple (refuerzo anual)" : "Hallazgos, diagnóstico o motivo de la atención…"}
          disabled={ocupado} required autoFocus />
        <ContadorCaracteres actual={descripcion.length} maximo={MAX_CARACTERES_REGISTRO} />
      </div>

      <div className={styles.campo}>
        <label htmlFor="registro-tratamiento" className={styles.etiqueta}>
          Tratamiento<span className={styles.opcional}>(opcional)</span>
        </label>
        <textarea id="registro-tratamiento" className={styles.control} value={tratamiento}
          onChange={(e) => setTratamiento(e.target.value)} maxLength={MAX_CARACTERES_REGISTRO} disabled={ocupado} />
      </div>

      <div className={styles.campo}>
        <label htmlFor="registro-proxima" className={styles.etiqueta}>
          Próxima dosis o control<span className={styles.opcional}>(opcional)</span>
        </label>
        <input id="registro-proxima" type="date" className={styles.control} value={proximaDosis}
          min={fechaDentroDe(1, new Date(`${fecha}T12:00:00`))}
          onChange={(e) => setProximaDosis(e.target.value)} disabled={ocupado} />
        {!proximaDosisValida && <p className={styles.ayuda}>Debe ser posterior a la fecha del registro.</p>}
      </div>

      <p className={styles.ayuda}>Los registros no se pueden editar después; para corregir, agrega uno nuevo.</p>
      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.acciones}>
        <Boton variante="secundario" onClick={onCancelar} disabled={ocupado}>Cancelar</Boton>
        <Boton type="submit" disabled={!puedeGuardar} cargando={ocupado}>
          {ocupado ? "Guardando…" : "Guardar registro"}
        </Boton>
      </div>
    </form>
  );
};
