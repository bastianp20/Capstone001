import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import styles from "../css/modal/CrearProfesionalModal.module.css";
import propias from "../css/modal/CrearProfesionalPropio.module.css";
import { DATOS_LABORALES_VACIOS, MIN_LARGO_PASSWORD, TEXTOS_CONFIRMAR_PASSWORD, TEXTOS_REGISTRO_VETERINARIO } from "../constants";
import { bloquearCopiarPegar, passwordsNoCoinciden } from "../lib/formularios";
import type { CrearProfesionalModalProps, DatosLaboralesVeterinario } from "../interfaces";
import { useConsulta } from "../hooks/useConsulta";
import { useAccion } from "../hooks/useAccion";
import { getCentrosSelector, getEspecialidades } from "../Api/getInfo";
import { crearProfesional } from "../Api/postInfo";
import { validarDatosLaborales } from "../lib/validacionVeterinario";
import { CasillaCuentaPrueba } from "../components/superadmin/CasillaCuentaPrueba";
import { SelectorCentroVeterinario } from "../components/veterinario/registro/SelectorCentroVeterinario";
import { SelectorEspecialidad } from "../components/veterinario/registro/SelectorEspecialidad";

// El superadmin crea la cuenta de un veterinario: queda aprobada de inmediato.
// Elige su contraseña (ya no se genera una temporal), dónde trabaja
// (independiente, centro de AuraPet o centro que aún no está) y su especialidad.
export const ModalCrearProfesional = ({ onClose }: CrearProfesionalModalProps) => {
  // Listas desde la base
  const { datos: especialidades = [] } = useConsulta(() => getEspecialidades(), []);
  const { datos: centros = [] } = useConsulta(() => getCentrosSelector(), []);

  // Campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [numeroColegiado, setNumeroColegiado] = useState("");
  const [datosVet, setDatosVet] = useState<DatosLaboralesVeterinario>(DATOS_LABORALES_VACIOS);
  const [esAdminCentro, setEsAdminCentro] = useState(false);
  const [esPrueba, setEsPrueba] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState<string | null>(null);
  const [creadaPara, setCreadaPara] = useState<string | null>(null);
  const { ejecutar, ocupado, error } = useAccion();

  const cambiarDatosVet = (cambios: Partial<DatosLaboralesVeterinario>) => setDatosVet((d) => ({ ...d, ...cambios }));

  // Una cuenta de prueba solo puede ir a centros de prueba, y una real solo a centros reales
  const centrosDelMundo = centros.filter((c) => c.es_prueba === esPrueba).map((c) => ({ id: c.id, nombre: c.nombre }));
  const cambiarEsPrueba = (valor: boolean) => {
    setEsPrueba(valor);
    cambiarDatosVet({ centroId: null }); // el centro elegido podría no calzar con el nuevo tipo de cuenta
  };
  const enCentroAuraPet = datosVet.modoCentro === "centro_aurapet";

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    const faltante =
      !nombre.trim() || !correo.trim() ? "Completa nombre y correo."
      : password.length < MIN_LARGO_PASSWORD ? TEXTOS_REGISTRO_VETERINARIO.passwordCorta
      : password !== confirmacion ? TEXTOS_CONFIRMAR_PASSWORD.noCoinciden
      : validarDatosLaborales(datosVet);
    setErrorFormulario(faltante);
    if (faltante) return;

    const soloNumeros = telefono.replace(/\D/g, ""); // "9 1234 5678" → "912345678"
    const ok = await ejecutar(() => crearProfesional({
      nombre,
      correo,
      telefono: soloNumeros ? `56${soloNumeros}` : "",
      password,
      numeroColegiado,
      especialidadId: datosVet.especialidadId,
      especialidadOtra: datosVet.especialidadOtra,
      centroId: enCentroAuraPet ? datosVet.centroId : null,
      centroMencionado: datosVet.modoCentro === "centro_externo" ? datosVet.centroNombre : "",
      centroMencionadoComuna: datosVet.modoCentro === "centro_externo" ? datosVet.centroComuna : "",
      esAdminCentro: enCentroAuraPet && esAdminCentro,
      esPrueba,
    }), "No se pudo crear el profesional.");
    if (ok) setCreadaPara(correo.trim());
  };

  return (
    <div className={styles.fondo} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Nueva cuenta profesional</h2>
          <button className={styles.cerrar} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {creadaPara ? (
          // Pantalla de éxito: la contraseña la eligió el superadmin, no se muestra de nuevo
          <div className={styles.exito}>
            <p>Cuenta creada para <strong>{creadaPara}</strong>.</p>
            <p>Comparte con el profesional la contraseña que elegiste. Podrá cambiarla desde Configuración.</p>
            <div className={styles.acciones}>
              <button type="button" className={styles.enviar} onClick={onClose}>Listo</button>
            </div>
          </div>
        ) : (
          <form className={styles.grid} onSubmit={enviar} noValidate>
            <label className={styles.campo}>
              Nombre completo
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Correo
              <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            </label>

            <label className={styles.campo}>
              Contraseña
              <span className={propias.password}>
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  minLength={MIN_LARGO_PASSWORD}
                  autoComplete="new-password"
                  onChange={(e) => setPassword(e.target.value)}
                  {...bloquearCopiarPegar}
                />
                <button
                  type="button"
                  className={propias.ojo}
                  onClick={() => setMostrarPassword((v) => !v)}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
              <small className={styles.ayuda}>Mínimo {MIN_LARGO_PASSWORD} caracteres.</small>
            </label>

            <label className={styles.campo}>
              {TEXTOS_CONFIRMAR_PASSWORD.etiqueta}
              <input
                type={mostrarPassword ? "text" : "password"}
                value={confirmacion}
                placeholder={TEXTOS_CONFIRMAR_PASSWORD.placeholder}
                autoComplete="new-password"
                aria-invalid={passwordsNoCoinciden(password, confirmacion)}
                onChange={(e) => setConfirmacion(e.target.value)}
                {...bloquearCopiarPegar}
              />
              {passwordsNoCoinciden(password, confirmacion) ? (
                <small className={propias.noCoincide}>{TEXTOS_CONFIRMAR_PASSWORD.noCoinciden}</small>
              ) : (
                <small className={styles.ayuda}>{TEXTOS_CONFIRMAR_PASSWORD.ayuda}</small>
              )}
            </label>

            <label className={styles.campo}>
              Teléfono
              <div className={styles.telefono}>
                <span>+56</span>
                <input type="tel" placeholder="9 1234 5678" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>
            </label>

            <label className={`${styles.campo} ${styles.completo}`}>
              N° de colegiatura (opcional)
              <input type="text" placeholder="Ej: 1234" value={numeroColegiado} onChange={(e) => setNumeroColegiado(e.target.value)} />
              <small className={styles.ayuda}>Recomendado: ayuda a validar el perfil del profesional.</small>
            </label>

            <div className={styles.completo}>
              <SelectorCentroVeterinario datos={datosVet} centros={centrosDelMundo} onCambiar={cambiarDatosVet} />
            </div>

            {enCentroAuraPet && (
              <label className={`${styles.check} ${styles.completo}`}>
                <input type="checkbox" checked={esAdminCentro} onChange={(e) => setEsAdminCentro(e.target.checked)} />
                Hacer administrador del centro
              </label>
            )}

            <div className={styles.completo}>
              <SelectorEspecialidad
                especialidades={especialidades}
                especialidadId={datosVet.especialidadId}
                especialidadOtra={datosVet.especialidadOtra}
                onCambiar={cambiarDatosVet}
              />
            </div>

            <CasillaCuentaPrueba marcada={esPrueba} onCambiar={cambiarEsPrueba} />

            {(errorFormulario || error) && <p className={`${styles.error} ${styles.completo}`}>{errorFormulario ?? error}</p>}

            <div className={`${styles.acciones} ${styles.completo}`}>
              <button type="button" className={styles.cancelar} onClick={onClose}>Cancelar</button>
              <button type="submit" className={styles.enviar} disabled={ocupado}>
                {ocupado ? "Creando…" : "Crear profesional"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
