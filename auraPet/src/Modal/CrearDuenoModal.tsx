import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que el de profesional
import type { CrearDuenoModalProps } from "../interfaces";
import { crearDueno } from "../Api/postInfo";

export const ModalCrearDueno = ({ onClose }: CrearDuenoModalProps) => {
  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  // Estado del envío
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contrasenaTemporal, setContrasenaTemporal] = useState<string | null>(null);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim()) {
      setError("Completa nombre y correo.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const soloNumeros = telefono.replace(/\D/g, ""); // "9 1234 5678" → "912345678"
      const respuesta = await crearDueno({
        nombre,
        correo,
        telefono: soloNumeros ? `56${soloNumeros}` : "",
      });
      setContrasenaTemporal(respuesta.contrasenaTemporal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el dueño.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nueva cuenta de dueño</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {contrasenaTemporal ? (
          // ---------- Pantalla de éxito ----------
          <div className={styles.exito}>
            <p>✅ Cuenta creada para <strong>{correo}</strong>.</p>
            <p>Contraseña temporal (cópiala ahora, no se vuelve a mostrar):</p>
            <code className={styles.clave}>{contrasenaTemporal}</code>
            <p>Con esta cuenta el dueño ya puede entrar y registrar sus mascotas.</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : (
          // ---------- Formulario ----------
          <form className={styles.grid} onSubmit={enviar}>
            <label className={`${styles.campo} ${styles.completo}`}>
              Nombre completo
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Correo
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Teléfono (opcional)
              <div className={styles.telefono}>
                <span>+56</span>
                <input
                  type="tel"
                  placeholder="9 1234 5678"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>
            </label>

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.enviar} disabled={enviando}>
                {enviando ? "Creando…" : "Crear dueño"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};