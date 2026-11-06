import { useState, type FormEvent } from "react";
import { MAX_CARACTERES_DATO_CLINICO } from "../../../constants";
import { actualizarDatosClinicos } from "../../../Api/postInfo";
import { useAccion } from "../../../hooks/useAccion";
import type { FormDatosClinicosProps } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import styles from "../../../css/ficha/FormularioFicha.module.css";

// Actualiza peso, alergias, condiciones crónicas, esterilizado y microchip.
// Viene relleno con lo que ya tiene la ficha; un texto vacío borra el dato.
export const FormDatosClinicos = ({ mascotaId, datos, onGuardado, onCancelar }: FormDatosClinicosProps) => {
  const [peso, setPeso] = useState(datos.pesoKg?.toString() ?? "");
  const [alergias, setAlergias] = useState(datos.alergias ?? "");
  const [condiciones, setCondiciones] = useState(datos.condicionesCronicas ?? "");
  const [esterilizado, setEsterilizado] = useState(datos.esterilizado);
  const [microchip, setMicrochip] = useState(datos.microchip ?? "");
  const { ejecutar, ocupado, error } = useAccion();

  const pesoNumero = peso.trim() === "" ? null : Number(peso);
  const pesoValido = pesoNumero === null || (Number.isFinite(pesoNumero) && pesoNumero > 0);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!pesoValido || ocupado) return;
    const ok = await ejecutar(
      () => actualizarDatosClinicos(mascotaId, {
        pesoKg: pesoNumero,
        alergias,
        condicionesCronicas: condiciones,
        esterilizado,
        microchip,
      }),
      "No se pudieron guardar los datos clínicos."
    );
    if (ok) onGuardado();
  };

  return (
    <form className={styles.formulario} onSubmit={guardar}>
      <div className={styles.fila}>
        <div className={styles.campo}>
          <label htmlFor="datos-peso" className={styles.etiqueta}>Peso (kg)</label>
          <input id="datos-peso" type="number" inputMode="decimal" step="0.01" min="0.01" className={styles.control}
            value={peso} onChange={(e) => setPeso(e.target.value)} placeholder="Ej: 12.5" disabled={ocupado} autoFocus />
          {!pesoValido && <p className={styles.ayuda}>El peso debe ser mayor a 0.</p>}
        </div>
        <div className={styles.campo}>
          <label htmlFor="datos-microchip" className={styles.etiqueta}>
            Microchip<span className={styles.opcional}>(opcional)</span>
          </label>
          <input id="datos-microchip" className={styles.control} value={microchip}
            onChange={(e) => setMicrochip(e.target.value)} placeholder="N° de 15 dígitos" disabled={ocupado} />
        </div>
      </div>

      <div className={styles.campo}>
        <label htmlFor="datos-alergias" className={styles.etiqueta}>Alergias</label>
        <textarea id="datos-alergias" className={styles.control} value={alergias}
          onChange={(e) => setAlergias(e.target.value)} maxLength={MAX_CARACTERES_DATO_CLINICO}
          placeholder="Ej: Penicilina. Déjalo vacío si no tiene." disabled={ocupado} />
      </div>

      <div className={styles.campo}>
        <label htmlFor="datos-condiciones" className={styles.etiqueta}>Condiciones crónicas</label>
        <textarea id="datos-condiciones" className={styles.control} value={condiciones}
          onChange={(e) => setCondiciones(e.target.value)} maxLength={MAX_CARACTERES_DATO_CLINICO}
          placeholder="Ej: Insuficiencia renal, displasia de cadera…" disabled={ocupado} />
      </div>

      <label className={styles.checkbox}>
        <input type="checkbox" checked={esterilizado} onChange={(e) => setEsterilizado(e.target.checked)} disabled={ocupado} />
        Esterilizado
      </label>

      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.acciones}>
        <Boton variante="secundario" onClick={onCancelar} disabled={ocupado}>Cancelar</Boton>
        <Boton type="submit" disabled={!pesoValido} cargando={ocupado}>
          {ocupado ? "Guardando…" : "Guardar datos"}
        </Boton>
      </div>
    </form>
  );
};
