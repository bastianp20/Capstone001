import { useState, type FormEvent } from "react";
import styles from "../css/modal/CrearProfesionalModal.module.css"; // mismo diseño que los otros modales
import { ESTADO_VERIFICACION, TEXTO_CENTRO_PRUEBA } from "../constants";
import { useDesbloqueoTemporal } from "../hooks/useDesbloqueoTemporal";
import { actualizarCentro } from "../Api/postInfo";
import { DesbloqueoCuentaReal } from "../components/superadmin/DesbloqueoCuentaReal";
import { CasillaCuentaPrueba } from "../components/superadmin/CasillaCuentaPrueba";
import type { CambioResumen, EditarCentroModalProps } from "../interfaces";

// Modal para que el superadmin edite un centro: nombre, dirección, comuna,
// teléfono y si es centro de prueba. Igual que "Editar cuenta":
// · Centro de PRUEBA: se edita y guarda directo.
// · Centro REAL: candado con código + 60 s, y resumen de cambios antes de guardar.
// (Horarios y especialidades se editan desde el panel del centro.)
export const ModalEditarCentro = ({ centro, onClose, onGuardado }: EditarCentroModalProps) => {
  const esReal = !centro.esPrueba;

  // ---------- Campos (parten con los datos actuales) ----------
  const telefonoInicial = centro.telefono ? String(centro.telefono).replace(/^56/, "") : "";
  const [nombre, setNombre] = useState(centro.nombre);
  const [direccion, setDireccion] = useState(centro.direccion);
  const [comuna, setComuna] = useState(centro.comuna);
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [esPrueba, setEsPrueba] = useState(centro.esPrueba);

  // ---------- Candado de centros reales ----------
  const { desbloqueado, desbloquear, tiempo, intento, confirmando, setConfirmando } = useDesbloqueoTemporal(esReal);

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------- ¿Qué cambió? (para el resumen y para saber si hay algo que guardar) ----------
  const soloNumeros = telefono.replace(/\D/g, "");
  const telefonoNuevo = soloNumeros ? `56${soloNumeros}` : "";
  const resumen: CambioResumen[] = [];
  if (nombre.trim() !== centro.nombre) resumen.push({ campo: "Nombre", antes: centro.nombre, despues: nombre.trim() });
  if (direccion.trim() !== centro.direccion) resumen.push({ campo: "Dirección", antes: centro.direccion, despues: direccion.trim() });
  if (comuna.trim() !== centro.comuna) resumen.push({ campo: "Comuna", antes: centro.comuna, despues: comuna.trim() });
  if (telefonoNuevo !== (centro.telefono ? String(centro.telefono) : ""))
    resumen.push({
      campo: "Teléfono",
      antes: centro.telefono ? `+${centro.telefono}` : "—",
      despues: telefonoNuevo ? `+${telefonoNuevo}` : "—",
    });
  if (esPrueba !== centro.esPrueba)
    resumen.push({
      campo: "Tipo de centro",
      antes: centro.esPrueba ? "De prueba" : "Real",
      despues: esPrueba ? "De prueba (solo lo verán las cuentas de prueba)" : "Real",
    });
  const hayCambios = resumen.length > 0;

  // ---------- Guardar ----------
  const guardar = async () => {
    setGuardando(true);
    setError(null);
    try {
      await actualizarCentro(centro.id, {
        nombre,
        direccion,
        comuna,
        telefono: telefonoNuevo,
        // solo se manda si cambió (la base revisa que el equipo sea del mismo tipo)
        esPrueba: esPrueba !== centro.esPrueba ? esPrueba : undefined,
      });
      onGuardado();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo guardar el centro.");
      setConfirmando(false);
    } finally {
      setGuardando(false);
    }
  };

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !direccion.trim() || !comuna.trim()) {
      setError("Nombre, dirección y comuna son obligatorios.");
      return;
    }
    if (!hayCambios || !desbloqueado) return;
    if (esReal) setConfirmando(true); // centro real: primero el resumen
    else guardar();
  };

  const estado = ESTADO_VERIFICACION[centro.estado];

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Editar centro</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6b7280" }}>
          <span style={{ color: estado.color, fontWeight: 600 }}>{estado.texto}</span>
          {" · "}
          <strong style={{ color: esReal ? "#a4272a" : "#8a5a00" }}>{esReal ? "Centro real" : "Centro de prueba"}</strong>
          {" · "}
          {centro.veterinarios} {centro.veterinarios === 1 ? "veterinario" : "veterinarios"}
        </p>

        {confirmando ? (
          // ---------- Confirmación (solo centros reales) ----------
          <div className={styles.exito}>
            <p>Vas a cambiar lo siguiente en <strong>{centro.nombre}</strong>:</p>
            <ul style={{ margin: "0 0 14px", paddingLeft: 18, fontSize: 14 }}>
              {resumen.map((r) => (
                <li key={r.campo}><strong>{r.campo}:</strong> {r.antes} → {r.despues}</li>
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
            {esReal && (
              <div className={styles.completo}>
                {desbloqueado ? (
                  <p style={{ margin: 0, padding: "8px 12px", borderRadius: 8, background: "#e3f5f2", color: "#0f8f80", fontSize: 13, fontWeight: 600 }}>
                    Edición desbloqueada · se vuelve a bloquear en {tiempo}
                  </p>
                ) : (
                  <DesbloqueoCuentaReal key={intento} titulo="Este es un centro real" onDesbloquear={desbloquear} />
                )}
              </div>
            )}

            {/* fieldset deshabilita todos los campos mientras está bloqueado */}
            <fieldset disabled={!desbloqueado} style={{ display: "contents" }}>
              <label className={`${styles.campo} ${styles.completo}`}>
                Nombre del centro
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </label>
              <label className={styles.campo}>
                Dirección
                <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </label>
              <label className={styles.campo}>
                Comuna
                <input type="text" value={comuna} onChange={(e) => setComuna(e.target.value)} />
              </label>
              <label className={styles.campo}>
                Teléfono
                <div className={styles.telefono}>
                  <span>+56</span>
                  <input type="tel" placeholder="2 2345 6789" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                </div>
              </label>
              <CasillaCuentaPrueba marcada={esPrueba} onCambiar={setEsPrueba} titulo="Centro de prueba" ayuda={TEXTO_CENTRO_PRUEBA} />
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
