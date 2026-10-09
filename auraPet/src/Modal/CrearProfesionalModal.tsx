import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css";
import type { CrearProfesionalModalProps } from "../interfaces";
import { useConsulta } from "../hooks/useConsulta";
import { getCentrosSelector, getEspecialidades } from "../Api/getInfo";
import { crearProfesional } from "../Api/postInfo";

export const ModalCrearProfesional = ({ onClose }: CrearProfesionalModalProps) => {
  // Listas desde la base
  const { datos: especialidades = [] } = useConsulta(() => getEspecialidades(), []);
  const { datos: centros = [] } = useConsulta(() => getCentrosSelector(), []);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [numeroColegiado, setNumeroColegiado] = useState("");
  const [especialidadId, setEspecialidadId] = useState<number | null>(null); // una sola, como guarda la tabla veterinarios
  const [centroId, setCentroId] = useState("");
  const [esAdminCentro, setEsAdminCentro] = useState(false);

  // Estado del envío
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contrasenaTemporal, setContrasenaTemporal] = useState<string | null>(null);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !correo.trim() || !centroId) {
      setError("Completa nombre, correo y centro.");
      return;
    }
    setEnviando(true);
    setError(null);
    try {
      const soloNumeros = telefono.replace(/\D/g, ""); // "9 1234 5678" → "912345678"
      const respuesta = await crearProfesional({
        nombre,
        correo,
        telefono: soloNumeros ? `56${soloNumeros}` : "",
        numeroColegiado,
        especialidadId,
        centroId: Number(centroId),
        esAdminCentro,
      });
      setContrasenaTemporal(respuesta.contrasenaTemporal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el profesional.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nueva cuenta profesional</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {contrasenaTemporal ? (
          // si todo sale bien se muestra ésta pantalla de éxito con la contraseña temporal
          <div className={styles.exito}>
            <p>Cuenta creada para <strong>{correo}</strong>.</p>
            <p>Contraseña temporal (cópiala ahora, no se vuelve a mostrar):</p>
            <code className={styles.clave}>{contrasenaTemporal}</code>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : (
          // Formulario 
          <form className={styles.grid} onSubmit={enviar}>
            <label className={styles.campo}>
              Nombre completo
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Correo
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Teléfono
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

            <label className={styles.campo}>
              N° de colegiatura (opcional)
              <input
                type="text"
                placeholder="Ej: 1234"
                value={numeroColegiado}
                onChange={(e) => setNumeroColegiado(e.target.value)}
              />
              <small className={styles.ayuda}>Recomendado: ayuda a validar el perfil del profesional.</small>
            </label>

            <div className={`${styles.campo} ${styles.completo}`}>
              Especialidad
              <div className={styles.chips}>
                {especialidades.map((esp) => (
                  <button
                    key={esp.id}
                    type="button"
                    className={especialidadId === esp.id ? styles.chipActivo : styles.chip}
                    onClick={() => setEspecialidadId(especialidadId === esp.id ? null : esp.id)}
                  >
                    {esp.nombre}
                  </button>
                ))}
              </div>
            </div>

            <label className={`${styles.campo} ${styles.completo}`}>
              Centro asignado
              <select value={centroId} onChange={(e) => setCentroId(e.target.value)}>
                <option value="" disabled>Selecciona un centro</option>
                {centros.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}{c.es_prueba ? " (pruebas)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className={`${styles.check} ${styles.completo}`}>
              <input
                type="checkbox"
                checked={esAdminCentro}
                onChange={(e) => setEsAdminCentro(e.target.checked)}
              />
              Hacer administrador del centro
            </label>

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.enviar} disabled={enviando}>
                {enviando ? "Creando…" : "Crear profesional"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
