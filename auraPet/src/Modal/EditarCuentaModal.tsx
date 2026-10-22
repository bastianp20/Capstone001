import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los modales de crear
import { useDesbloqueoTemporal } from "../hooks/useDesbloqueoTemporal";
import { editarCuenta } from "../Api/postInfo";
import { DesbloqueoCuentaReal } from "../components/superadmin/DesbloqueoCuentaReal";
import { CasillaCuentaPrueba } from "../components/superadmin/CasillaCuentaPrueba";
import type { CambioResumen, CambiosCuenta, EditarCuentaModalProps } from "../interfaces";

// Modal para que el superadmin edite una cuenta: nombre, teléfono, activa/desactivada
// y si es cuenta de prueba (los superadmins no se marcan: ven todo igual).
//
// · Cuenta de PRUEBA: se edita y se guarda directo.
// · Cuenta REAL: el formulario parte bloqueado. Hay que escribir un código
//   (DesbloqueoCuentaReal) y se abre una ventana de 60 s para editar.
//   Antes de guardar se muestra un resumen de los cambios para confirmar.
//
// Ojo: esto protege contra errores (editar sin querer), no es la seguridad.
// La seguridad está en la base: solo un superadmin puede editar perfiles.
export const ModalEditarCuenta = ({ cuenta, esMiCuenta, onClose, onGuardada }: EditarCuentaModalProps) => {
  const esReal = !cuenta.es_prueba;

  // ---------- Campos (parten con los datos actuales) ----------
  const telefonoInicial = cuenta.telefono ? String(cuenta.telefono).replace(/^56/, "") : "";
  const activaInicial = cuenta.desactivado_en === null;
  const [nombre, setNombre] = useState(cuenta.nombre);
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [activa, setActiva] = useState(activaInicial);
  const [esPrueba, setEsPrueba] = useState(cuenta.es_prueba);
  const puedeSerPrueba = cuenta.rol !== "superadmin";

  // ---------- Candado de cuentas reales (60 s después de escribir el código) ----------
  const { desbloqueado, desbloquear, tiempo, intento, confirmando, setConfirmando } = useDesbloqueoTemporal(esReal);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- ¿Qué cambió? ----------
  const soloNumeros = telefono.replace(/\D/g, "");
  const telefonoNuevo = soloNumeros ? Number(`56${soloNumeros}`) : null;
  const cambios: CambiosCuenta = {};
  if (nombre.trim() !== cuenta.nombre) cambios.nombre = nombre;
  if (telefonoNuevo !== cuenta.telefono) cambios.telefono = telefonoNuevo;
  if (activa !== activaInicial) cambios.activa = activa;
  if (esPrueba !== cuenta.es_prueba) cambios.esPrueba = esPrueba;
  const hayCambios = Object.keys(cambios).length > 0;

  // Resumen legible para el paso de confirmación
  const resumen: CambioResumen[] = [];
  if (cambios.nombre !== undefined) resumen.push({ campo: "Nombre", antes: cuenta.nombre, despues: nombre.trim() });
  if (cambios.telefono !== undefined)
    resumen.push({
      campo: "Teléfono",
      antes: cuenta.telefono ? `+${cuenta.telefono}` : "—",
      despues: telefonoNuevo ? `+${telefonoNuevo}` : "—",
    });
  if (cambios.activa !== undefined)
    resumen.push({ campo: "Estado", antes: activaInicial ? "Activa" : "Desactivada", despues: activa ? "Activa" : "Desactivada" });
  if (cambios.esPrueba !== undefined)
    resumen.push({
      campo: "Tipo de cuenta",
      antes: cuenta.es_prueba ? "De prueba" : "Real",
      despues: esPrueba ? "De prueba (verá solo los centros de prueba)" : "Real",
    });

  // ---------- Guardar ----------
  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await editarCuenta(cuenta.id, cambios);
      onGuardada();
      onClose();
    } catch (e) {
      // Ej: "No se puede quitar el último superadmin activo" (viene de la base)
      setError(e instanceof Error ? e.message : "No se pudo guardar la cuenta.");
      setConfirmando(false);
    } finally {
      setGuardando(false);
    }
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    if (!hayCambios || !desbloqueado) return;
    // Cuenta real: primero se muestra el resumen; la de prueba se guarda directo
    if (esReal) setConfirmando(true);
    else guardar();
  };


  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Editar cuenta</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Datos que no se editan aquí */}
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>
          {cuenta.email} · <strong style={{ color: esReal ? "#a4272a" : "#8a5a00" }}>{esReal ? "Cuenta real" : "Cuenta de prueba"}</strong>
        </p>

        {/* ---------- Paso de confirmación (solo cuentas reales) ---------- */}
        {confirmando ? (
          <div className={styles.exito}>
            <p>Vas a cambiar lo siguiente en <strong>{cuenta.nombre}</strong>:</p>
            <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 14 }}>
              {resumen.map((r) => (
                <li key={r.campo}>
                  <strong>{r.campo}:</strong> {r.antes} → {r.despues}
                </li>
              ))}
            </ul>
            <p style={{ fontSize: 12.5, color: "#6b7280" }}>Tiempo restante: {tiempo}</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.cancelar} onClick={() => setConfirmando(false)}>Volver</button>
              <button type="button" className={styles.enviar} disabled={guardando} onClick={guardar}>
                {guardando ? "Guardando…" : "Sí, guardar cambios"}
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.grid} onSubmit={enviar}>
            {/* Candado o contador, solo para cuentas reales */}
            {esReal && (
              <div className={styles.completo}>
                {desbloqueado ? (
                  <p style={{ margin: 0, padding: "8px 12px", borderRadius: 8, background: "#e3f5f2", color: "#0f8f80", fontSize: 13, fontWeight: 600 }}>
                    Edición desbloqueado · se vuelve a bloquear en {tiempo}
                  </p>
                ) : (
                  <DesbloqueoCuentaReal key={intento} onDesbloquear={desbloquear} />
                )}
              </div>
            )}

            {/* fieldset deshabilita todos los campos de una vez mientras está bloqueado */}
            <fieldset disabled={!desbloqueado} style={{ display: "contents" }}>
              <label className={`${styles.campo} ${styles.completo}`}>
                Nombre completo
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </label>

              <label className={styles.campo}>
                Teléfono
                <div className={styles.telefono}>
                  <span>+56</span>
                  <input type="tel" placeholder="9 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
              </label>

              <label className={styles.check} title={esMiCuenta ? "No puedes desactivar tu propia cuenta" : undefined}>
                <input
                  type="checkbox"
                  checked={activa}
                  disabled={esMiCuenta}
                  onChange={(e) => setActiva(e.target.checked)}
                />
                Cuenta activa {!activa && <span style={{ color: "#a4272a" }}>(no podrá iniciar sesión)</span>}
              </label>

              {/* Cuenta de prueba: si es veterinario o admin, sus centros deben ser del mismo tipo (la base lo revisa) */}
              {puedeSerPrueba && <CasillaCuentaPrueba marcada={esPrueba} onCambiar={setEsPrueba} />}
            </fieldset>

            {error && <p className={`${styles.error} ${styles.completo}`}>{error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
              <button type="submit" className={styles.enviar} disabled={!desbloqueado || !hayCambios || guardando}>
                {guardando ? "Guardando…" : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
