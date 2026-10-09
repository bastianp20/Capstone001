import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css";
import type { CrearMascotaModalProps, EspecieMascota } from "../interfaces";
import { EMOJI_ESPECIE } from "../constants";
import { crearMascota } from "../Api/postInfo";

const ESPECIES: { valor: EspecieMascota; label: string }[] = [
  { valor: "perro", label: "Perro" },
  { valor: "gato", label: "Gato" },
  { valor: "ave", label: "Ave" },
  { valor: "conejo", label: "Conejo" },
  { valor: "otro", label: "Otro" },
];

const hoy = new Date().toLocaleDateString("en-CA"); // "2026-10-08" (para no elegir fechas futuras)

export const ModalCrearMascota = ({ duenoId, onClose, onCreada }: CrearMascotaModalProps) => {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState<EspecieMascota | null>(null);
  const [sexo, setSexo] = useState<"macho" | "hembra" | null>(null);
  const [raza, setRaza] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [pesoKg, setPesoKg] = useState("");
  const [esterilizado, setEsterilizado] = useState(false);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !especie || !sexo) {
      setError("Completa nombre, especie y sexo.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      await crearMascota(duenoId, { nombre, especie, sexo, raza, fechaNacimiento, pesoKg, esterilizado });
      onCreada(); // avisa a la pantalla para que recargue la lista y cierre el modal
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo registrar la mascota.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Registrar mascota</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <form className={styles.grid} onSubmit={enviar}>
          <label className={`${styles.campo} ${styles.completo}`}>
            Nombre
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </label>

          <div className={`${styles.campo} ${styles.completo}`}>
            Especie
            <div className={styles.chips}>
              {ESPECIES.map((esp) => (
                <button
                  key={esp.valor}
                  type="button"
                  className={especie === esp.valor ? styles.chipActivo : styles.chip}
                  onClick={() => setEspecie(esp.valor)}
                >
                  {EMOJI_ESPECIE[esp.valor]} {esp.label}
                </button>
              ))}
            </div>
          </div>

          <div className={`${styles.campo} ${styles.completo}`}>
            Sexo
            <div className={styles.chips}>
              <button type="button" className={sexo === "macho" ? styles.chipActivo : styles.chip} onClick={() => setSexo("macho")}>
                Macho
              </button>
              <button type="button" className={sexo === "hembra" ? styles.chipActivo : styles.chip} onClick={() => setSexo("hembra")}>
                Hembra
              </button>
            </div>
          </div>

          <label className={styles.campo}>
            Raza (opcional)
            <input type="text" placeholder="Ej: Mestizo" value={raza} onChange={(e) => setRaza(e.target.value)} />
          </label>

          <label className={styles.campo}>
            Fecha de nacimiento (opcional)
            <input type="date" max={hoy} value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />
          </label>

          <label className={styles.campo}>
            Peso en kg (opcional)
            <input type="number" min="0.01" step="0.01" placeholder="Ej: 12.5" value={pesoKg} onChange={(e) => setPesoKg(e.target.value)} />
          </label>

          <label className={styles.check}>
            <input type="checkbox" checked={esterilizado} onChange={(e) => setEsterilizado(e.target.checked)} />
            Está esterilizado/a
          </label>

          {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

          <div className={`${styles.acciones} ${styles.completo}`}>
            <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
            <button type="submit" className={styles.enviar} disabled={enviando}>
              {enviando ? "Guardando…" : "Registrar mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};