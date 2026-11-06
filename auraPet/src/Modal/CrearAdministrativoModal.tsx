import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los otros modales de crear
import type { CrearAdministrativoModalProps } from "../interfaces";
import { useConsulta } from "../hooks/useConsulta";
import { getCentrosSelector } from "../Api/getInfo";
import { crearAdministrativo } from "../Api/postInfo";
import { CasillaCuentaPrueba } from "../components/superadmin/CasillaCuentaPrueba";

// Cuenta para alguien que administra un centro pero no es veterinario
// (recepción, gerencia...). Entra directo al panel de su centro.
export const ModalCrearAdministrativo = ({ onClose }: CrearAdministrativoModalProps) => {
  const { datos: centros = [] } = useConsulta(() => getCentrosSelector(), []);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [centroId, setCentroId] = useState("");
  const [esPrueba, setEsPrueba] = useState(false);

  // Una cuenta de prueba solo puede administrar centros de prueba, y una real solo centros reales
  const centrosDelMundo = centros.filter((c) => c.es_prueba === esPrueba);
  const cambiarEsPrueba = (valor: boolean) => {
    setEsPrueba(valor);
    setCentroId("");
  };

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
      const soloNumeros = telefono.replace(/\D/g, "");
      const respuesta = await crearAdministrativo({
        nombre,
        correo,
        telefono: soloNumeros ? `56${soloNumeros}` : "",
        centroId: Number(centroId),
        esPrueba,
      });
      setContrasenaTemporal(respuesta.contrasenaTemporal);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta administrativa.");
    } finally {
      setEnviando(false);
    }
  };

  const nombreCentro = centros.find((c) => String(c.id) === centroId)?.nombre;

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nueva cuenta administrativa</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {contrasenaTemporal ? (
          <div className={styles.exito}>
            <p>✅ Cuenta creada para <strong>{correo}</strong>.</p>
            <p>Contraseña temporal (cópiala ahora, no se vuelve a mostrar):</p>
            <code className={styles.clave}>{contrasenaTemporal}</code>
            <p>Al entrar verá directamente el panel de <strong>{nombreCentro}</strong>.</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : (
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
                <input type="tel" placeholder="9 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
            </label>

            <label className={`${styles.campo} ${styles.completo}`}>
              Centro que administrará
              <select value={centroId} onChange={(e) => setCentroId(e.target.value)}>
                <option value="" disabled>Selecciona un centro</option>
                {centrosDelMundo.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}{c.es_prueba ? " (pruebas)" : ""}
                  </option>
                ))}
              </select>
              <small className={styles.ayuda}>Para que un veterinario administre un centro, usa "Cuenta profesional" y marca "Hacer administrador del centro".</small>
            </label>

            <CasillaCuentaPrueba marcada={esPrueba} onCambiar={cambiarEsPrueba} />

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
              <button type="submit" className={styles.enviar} disabled={enviando}>
                {enviando ? "Creando…" : "Crear cuenta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
