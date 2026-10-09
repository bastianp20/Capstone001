import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  User, Lock, Palette, Bell, ShieldCheck, CircleHelp,
  ChevronRight, ChevronDown, Eye, EyeOff, LogOut, Sun, Moon, Monitor, X,
} from "lucide-react";
import { useAuth } from "../Auth/AuthContext";
import { supabase } from "../lib/supabase";
import { getIniciales } from "../utils";
import styles from "../css/modal/ConfiguracionModal.module.css";

interface ConfiguracionModalProps {
  onCerrar: () => void;
}

type Seccion = "perfil" | "seguridad" | "apariencia" | "notificaciones" | "privacidad" | "ayuda";
type Tema = "claro" | "oscuro" | "auto";

const ROL_LABEL = { dueno: "Dueño", veterinario: "Veterinario", superadmin: "Superadmin" } as const;

// =====================================================================
// MODAL PRINCIPAL
// =====================================================================
export const ConfiguracionModal = ({ onCerrar }: ConfiguracionModalProps) => {
  const { usuarioActual, logout } = useAuth();
  const [abierta, setAbierta] = useState<Seccion | null>(null);

  // Abre la sección; si ya estaba abierta, la cierra (acordeón)
  const alternar = (s: Seccion) => setAbierta(abierta === s ? null : s);

  const cerrarSesion = async () => {
    await logout();
    onCerrar();
  };

  if (!usuarioActual) return null;

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* ---------- Encabezado ---------- */}
        <div className={styles.header}>
          <h2>Configuración</h2>
          <button className={styles.cerrar} onClick={onCerrar} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        {/* ---------- Tarjeta de perfil ---------- */}
        <div className={styles.perfil}>
          <div className={styles.avatar}>{getIniciales(usuarioActual.nombre)}</div>
          <div>
            <p className={styles.perfilNombre}>{usuarioActual.nombre}</p>
            <p className={styles.perfilCorreo}>{usuarioActual.email}</p>
            <span className={styles.rol}>{ROL_LABEL[usuarioActual.rol]}</span>
          </div>
        </div>

        {/* ---------- Acordeón ---------- */}
        <div className={styles.lista}>
          <Fila icono={<User size={18} />} titulo="Editar perfil" descripcion="Nombre y teléfono"
                abierta={abierta === "perfil"} onClick={() => alternar("perfil")}>
            <SeccionPerfil onGuardado={() => setAbierta(null)} />
          </Fila>

          <Fila icono={<Lock size={18} />} titulo="Seguridad" descripcion="Contraseña y sesiones"
                abierta={abierta === "seguridad"} onClick={() => alternar("seguridad")}>
            <SeccionSeguridad onCerrarModal={onCerrar} />
          </Fila>

          <Fila icono={<Palette size={18} />} titulo="Apariencia" descripcion="Tema claro, oscuro o automático"
                abierta={abierta === "apariencia"} onClick={() => alternar("apariencia")}>
            <SeccionApariencia />
          </Fila>

          <Fila icono={<Bell size={18} />} titulo="Notificaciones" descripcion="Recordatorios de citas y vacunas"
                proximamente />

          <Fila icono={<ShieldCheck size={18} />} titulo="Privacidad y datos" descripcion="Descargar o eliminar tus datos"
                proximamente />

          <Fila icono={<CircleHelp size={18} />} titulo="Ayuda" descripcion="Preguntas frecuentes y contacto"
                abierta={abierta === "ayuda"} onClick={() => alternar("ayuda")}>
            <div className={styles.ayuda}>
              <Link to="/como-funciona" onClick={onCerrar}>¿Cómo funciona AuraPet?</Link>
              <Link to="/contacto" onClick={onCerrar}>Preguntas frecuentes y contacto</Link>
            </div>
          </Fila>
        </div>

        {/* ---------- Cerrar sesión ---------- */}
        <button className={styles.btnCerrarSesion} onClick={cerrarSesion}>
          Cerrar sesión <LogOut size={16} />
        </button>
      </div>
    </div>
  );
};

// =====================================================================
// UNA FILA DEL ACORDEÓN
// =====================================================================
interface FilaProps {
  icono: ReactNode;
  titulo: string;
  descripcion: string;
  abierta?: boolean;
  proximamente?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}

const Fila = ({ icono, titulo, descripcion, abierta = false, proximamente = false, onClick, children }: FilaProps) => (
  <div className={styles.fila}>
    <button
      className={styles.filaBoton}
      onClick={onClick}
      disabled={proximamente}
      aria-expanded={abierta}
    >
      <span className={styles.filaIcono}>{icono}</span>
      <span className={styles.filaTexto}>
        <span className={styles.filaTitulo}>{titulo}</span>
        <span className={styles.filaDescripcion}>{descripcion}</span>
      </span>
      {proximamente && <span className={styles.pildora}>Próximamente</span>}
      {abierta ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
    </button>
    {abierta && <div className={styles.filaContenido}>{children}</div>}
  </div>
);

// =====================================================================
// SECCIÓN: EDITAR PERFIL
// =====================================================================
const SeccionPerfil = ({ onGuardado }: { onGuardado: () => void }) => {
  const { usuarioActual, recargarPerfil } = useAuth();
  // El teléfono se guarda como 56912345678; en pantalla mostramos solo 912345678
  const telefonoInicial = usuarioActual?.telefono ? String(usuarioActual.telefono).replace(/^56/, "") : "";

  const [nombre, setNombre] = useState(usuarioActual?.nombre ?? "");
  const [telefono, setTelefono] = useState(telefonoInicial);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return setError("El nombre no puede quedar vacío.");
    const soloNumeros = telefono.replace(/\D/g, "");
    if (soloNumeros && soloNumeros.length !== 9) return setError("El teléfono debe tener 9 dígitos (ej: 9 1234 5678).");

    setGuardando(true);
    setError(null);
    const { error } = await supabase
      .from("perfiles")
      .update({ nombre: nombre.trim(), telefono: soloNumeros ? Number(`56${soloNumeros}`) : null })
      .eq("id", usuarioActual!.id);
    setGuardando(false);

    if (error) return setError("No se pudieron guardar los cambios.");
    recargarPerfil(); // vuelve a leer el perfil para que el nombre nuevo se vea en toda la app
    onGuardado();
  };

  return (
    <form className={styles.form} onSubmit={guardar}>
      <label className={styles.campo}>
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
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.acciones}>
        <button type="submit" className={styles.btnPrimario} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
};

// =====================================================================
// SECCIÓN: SEGURIDAD
// =====================================================================
// Campo de contraseña con el ojito para mostrar/ocultar
const CampoClave = ({ placeholder, value, onChange, autoComplete }: {
  placeholder: string; value: string; onChange: (v: string) => void; autoComplete: string;
}) => {
  const [ver, setVer] = useState(false);
  return (
    <div className={styles.campoClave}>
      <input
        type={ver ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <button type="button" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}>
        {ver ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

const SeccionSeguridad = ({ onCerrarModal }: { onCerrarModal: () => void }) => {
  const { usuarioActual } = useAuth();
  const [claveActual, setClaveActual] = useState("");
  const [claveNueva, setClaveNueva] = useState("");
  const [claveRepetida, setClaveRepetida] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);

  const limpiar = () => {
    setClaveActual("");
    setClaveNueva("");
    setClaveRepetida("");
    setError(null);
  };

  const cambiarClave = async (e: FormEvent) => {
    e.preventDefault();
    setExito(false);
    setError(null);

    if (!claveActual || !claveNueva || !claveRepetida) return setError("Completa los tres campos.");
    if (claveNueva.length < 8) return setError("La nueva contraseña debe tener al menos 8 caracteres.");
    if (claveNueva !== claveRepetida) return setError("Las contraseñas nuevas no coinciden.");
    if (claveNueva === claveActual) return setError("La nueva contraseña debe ser distinta a la actual.");

    setGuardando(true);
    try {
      // 1) Verificar la contraseña actual
      const { error: errorActual } = await supabase.auth.signInWithPassword({
        email: usuarioActual?.email ?? "",
        password: claveActual,
      });
      if (errorActual) throw new Error("La contraseña actual no es correcta.");

      // 2) Cambiarla
      const { error: errorNueva } = await supabase.auth.updateUser({ password: claveNueva });
      if (errorNueva) {
        if (errorNueva.message.includes("different from the old")) throw new Error("La nueva contraseña debe ser distinta a la actual.");
        if (errorNueva.message.toLowerCase().includes("weak")) throw new Error("La contraseña es muy débil. Usa letras y números.");
        throw new Error("No se pudo cambiar la contraseña.");
      }
      limpiar();
      setExito(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar la contraseña.");
    } finally {
      setGuardando(false);
    }
  };

  // Cierra la sesión en TODOS los dispositivos (celular, otro computador, etc.)
  const cerrarEnTodos = async () => {
    await supabase.auth.signOut({ scope: "global" });
    onCerrarModal();
  };

  return (
    <form className={styles.form} onSubmit={cambiarClave}>
      <p className={styles.subtitulo}>Cambiar contraseña</p>
      <CampoClave placeholder="Contraseña actual" autoComplete="current-password" value={claveActual} onChange={setClaveActual} />
      <CampoClave placeholder="Nueva contraseña" autoComplete="new-password" value={claveNueva} onChange={setClaveNueva} />
      <small className={styles.ayudaTexto}>Mínimo 8 caracteres</small>
      <CampoClave placeholder="Repetir nueva contraseña" autoComplete="new-password" value={claveRepetida} onChange={setClaveRepetida} />

      {error && <p className={styles.error}>{error}</p>}
      {exito && <p className={styles.exito}>✅ Contraseña actualizada.</p>}

      <div className={styles.acciones}>
        <button type="button" className={styles.btnSecundario} onClick={limpiar}>Cancelar</button>
        <button type="submit" className={styles.btnPrimario} disabled={guardando}>
          {guardando ? "Guardando…" : "Guardar contraseña"}
        </button>
      </div>

      <button type="button" className={styles.link} onClick={cerrarEnTodos}>
        Cerrar sesión en todos los dispositivos
      </button>
    </form>
  );
};

// =====================================================================
// SECCIÓN: APARIENCIA
// (por ahora guarda la preferencia; el modo oscuro real viene cuando
//  pasemos los colores de la app a variables CSS)
// =====================================================================
const leerTema = (): Tema => {
  try {
    return (localStorage.getItem("aurapet-tema") as Tema) ?? "claro";
  } catch {
    return "claro";
  }
};

const SeccionApariencia = () => {
  const [tema, setTema] = useState<Tema>(leerTema);

  const elegir = (nuevo: Tema) => {
    setTema(nuevo);
    try { localStorage.setItem("aurapet-tema", nuevo); } catch { /* navegador sin almacenamiento */ }
    document.documentElement.dataset.tema = nuevo; // <html data-tema="oscuro"> para el CSS futuro
  };

  const opciones: { valor: Tema; label: string; icono: ReactNode }[] = [
    { valor: "claro", label: "Claro", icono: <Sun size={18} /> },
    { valor: "oscuro", label: "Oscuro", icono: <Moon size={18} /> },
    { valor: "auto", label: "Automático", icono: <Monitor size={18} /> },
  ];

  return (
    <div className={styles.temas}>
      {opciones.map((o) => (
        <button
          key={o.valor}
          type="button"
          className={tema === o.valor ? styles.temaActivo : styles.tema}
          onClick={() => elegir(o.valor)}
        >
          {o.icono}
          {o.label}
        </button>
      ))}
    </div>
  );
};