import { useState, type FormEvent } from "react";
import { MAX_CARACTERES_DERIVACION, TEXTOS_DERIVACION as T } from "../../../constants";
import { getDestinosDerivacion } from "../../../Api/getInfo";
import { crearDerivacion } from "../../../Api/postInfo";
import { useConsulta } from "../../../hooks/useConsulta";
import { useAccion } from "../../../hooks/useAccion";
import type { FormDerivacionProps, TipoDestinoDerivacion } from "../../../interfaces";
import { Boton } from "../../ui/Boton";
import { ContadorCaracteres } from "../../ui/ContadorCaracteres";
import styles from "../../../css/ficha/FormularioFicha.module.css";

// El <select> guarda "tipo:id" (p. ej. "centro:3") para saber a qué tabla apunta
const separarDestino = (valor: string) => {
  const [tipo, id] = valor.split(":");
  return { tipo: tipo as TipoDestinoDerivacion, id: Number(id) };
};

// Deriva al paciente a otro veterinario o a un centro.
export const FormDerivacion = ({ mascotaId, onGuardado, onCancelar }: FormDerivacionProps) => {
  const { datos: destinos = [], cargando, error: errorDestinos } = useConsulta(() => getDestinosDerivacion(), []);
  const [destino, setDestino] = useState("");
  const [motivo, setMotivo] = useState("");
  const { ejecutar, ocupado, error } = useAccion();

  const veterinarios = destinos.filter((d) => d.tipo === "veterinario");
  const centros = destinos.filter((d) => d.tipo === "centro");
  const puedeGuardar = destino !== "" && motivo.trim().length > 0 && !ocupado;

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!puedeGuardar) return;
    const ok = await ejecutar(
      () => crearDerivacion({ mascotaId, destino: separarDestino(destino), motivo }),
      "No se pudo derivar al paciente."
    );
    if (ok) onGuardado();
  };

  return (
    <form className={styles.formulario} onSubmit={guardar}>
      <div className={styles.campo}>
        <label htmlFor="derivacion-destino" className={styles.etiqueta}>
          {T.destino}<span className={styles.requerido} aria-hidden="true">*</span>
        </label>
        <select id="derivacion-destino" className={styles.control} value={destino}
          onChange={(e) => setDestino(e.target.value)} disabled={ocupado || cargando} required>
          <option value="">{cargando ? "Cargando…" : T.elegirDestino}</option>
          {veterinarios.length > 0 && (
            <optgroup label={T.grupoVeterinarios}>
              {veterinarios.map((d) => <option key={`v${d.id}`} value={`veterinario:${d.id}`}>{d.nombre} · {d.detalle}</option>)}
            </optgroup>
          )}
          {centros.length > 0 && (
            <optgroup label={T.grupoCentros}>
              {centros.map((d) => <option key={`c${d.id}`} value={`centro:${d.id}`}>{d.nombre} · {d.detalle}</option>)}
            </optgroup>
          )}
        </select>
        {errorDestinos && <p className={styles.ayuda}>{errorDestinos}</p>}
      </div>

      <div className={styles.campo}>
        <label htmlFor="derivacion-motivo" className={styles.etiqueta}>
          {T.motivo}<span className={styles.requerido} aria-hidden="true">*</span>
        </label>
        <textarea id="derivacion-motivo" className={styles.control} value={motivo}
          onChange={(e) => setMotivo(e.target.value)} maxLength={MAX_CARACTERES_DERIVACION}
          placeholder={T.placeholderMotivo} disabled={ocupado} required />
        <ContadorCaracteres actual={motivo.length} maximo={MAX_CARACTERES_DERIVACION} />
      </div>

      <p className={styles.ayuda}>{T.ayudaForm}</p>
      {error && <div className={styles.error} role="alert">{error}</div>}

      <div className={styles.acciones}>
        <Boton variante="secundario" onClick={onCancelar} disabled={ocupado}>Cancelar</Boton>
        <Boton type="submit" disabled={!puedeGuardar} cargando={ocupado}>
          {ocupado ? T.guardando : T.guardar}
        </Boton>
      </div>
    </form>
  );
};
