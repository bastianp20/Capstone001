import { useMemo, useState } from "react";
import { Colors, Iconos } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { getAllUsers } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { useAuth } from "../../Auth/AuthContext";
import { ModalEditarCuenta } from "../../Modal/EditarCuentaModal";
import type { CuentaUsuario } from "../../interfaces";

const colors = Colors;
const iconos = Iconos;
const FONDO = "#f6f8f8";

type Rol = "dueno" | "veterinario" | "superadmin" | "administrativo";
type FiltroRol = Rol | "todos" | "prueba"; // "prueba" = solo cuentas de prueba

// Cómo se muestra cada rol (texto y colores del chip)
const ROLES: Record<Rol, { texto: string; fondo: string; color: string }> = {
  dueno: { texto: "Dueño", fondo: "#eef2ff", color: "#3b4cb8" },
  veterinario: { texto: "Veterinario", fondo: "#e3f5f2", color: "#0f8f80" },
  superadmin: { texto: "Superadmin", fondo: "#fdf3e1", color: "#8a5a00" },
  administrativo: { texto: "Administrativo", fondo: "#f3eefe", color: "#6b3fb8" },
};

// Sección "Usuarios" del panel superadmin: todas las cuentas con su correo.
export const ResumenUsuarios = () => {
  // useConsulta llama a getAllUsers UNA vez, espera la respuesta y nos da los datos listos.
  const { usuarioActual } = useAuth();
  const [recarga, setRecarga] = useState(0);
  // Cuenta abierta en el modal de edición (null = ninguna)
  const [cuentaEditando, setCuentaEditando] = useState<CuentaUsuario | null>(null);
  const { datos: usuarios = [], cargando, error } = useConsulta(() => getAllUsers(), [recarga]);


  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState<FiltroRol>("todos");

  // Cuántos hay de cada rol (para los chips de filtro)
  const cantidad = (rol: Rol) => usuarios.filter((u) => u.rol === rol).length;

  // La lista que se muestra: filtrada por rol y por texto (nombre o correo).
  // useMemo evita recalcularla en cada render si nada cambió.
  const visibles = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => {
      if (filtro === "prueba" && !u.es_prueba) return false;
      if (filtro !== "todos" && filtro !== "prueba" && u.rol !== filtro) return false;
      return !texto || u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto);
    });
  }, [usuarios, busqueda, filtro]);

  const chipFiltro = (valor: FiltroRol, texto: string, total: number) => {
    const activo = filtro === valor;
    return (
      <button
        onClick={() => setFiltro(valor)}
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          border: `1px solid ${activo ? colors.accent : colors.border}`,
          background: activo ? colors.accentSoft : "white",
          color: activo ? colors.accent : colors.text,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {texto}
        <span style={{ marginLeft: 6, opacity: 0.7 }}>{total}</span>
      </button>
    );
  };

  const columnas = "1.5fr 1.8fr 1fr 1.1fr 0.8fr 0.9fr 1fr 0.7fr";

  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: colors.text }}>Usuarios</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: colors.textMuted }}>
        Todas las cuentas registradas en AuraPet.
      </p>

      {/* Buscador y filtros por rol */}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: "1 1 240px", maxWidth: 320 }}>
          <iconos.buscar size={15} color={colors.textMuted} style={{ position: "absolute", left: 11, top: 10 }} />
          <input
            type="text"
            placeholder="Buscar por nombre o correo…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", padding: "8px 12px 8px 32px", borderRadius: 9, border: `1px solid ${colors.border}`, fontSize: 13.5, background: "white", outline: "none" }}
          />
        </div>
        {chipFiltro("todos", "Todos", usuarios.length)}
        {chipFiltro("dueno", "Dueños", cantidad("dueno"))}
        {chipFiltro("veterinario", "Veterinarios", cantidad("veterinario"))}
        {chipFiltro("administrativo", "Administrativos", cantidad("administrativo"))}
        {chipFiltro("superadmin", "Superadmins", cantidad("superadmin"))}
        {chipFiltro("prueba", "De prueba", usuarios.filter((u) => u.es_prueba).length)}
      </div>


      {/* Tabla */}
      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
          <span>Teléfono</span>
          <span>Estado</span>
          <span>Registro</span>
          <span>Cuenta de prueba</span>
          <span />
        </div>

        {/* Los 3 estados posibles antes de tener datos */}
        {cargando && <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>Cargando…</div>}
        {error && <div style={{ padding: "24px 18px", textAlign: "center", color: "#a4272a", fontSize: 13 }}>{error}</div>}
        {!cargando && !error && visibles.length === 0 && (
          <div style={{ padding: "24px 18px", textAlign: "center", color: colors.textMuted, fontSize: 13 }}>
            Ningún usuario coincide con la búsqueda.
          </div>
        )}

        {/* Una fila por usuario: .map() convierte cada objeto en JSX */}
        {visibles.map((u) => {
          const rol = ROLES[u.rol];
          const activo = u.desactivado_en === null; // null = cuenta activa
          return (
            <div
              key={u.id}
              style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, alignItems: "center", padding: "12px 18px", borderTop: `1px solid ${colors.border}`, fontSize: 13 }}
            >
              <span style={{ fontWeight: 600 }}>{u.nombre}</span>
              <span style={{ color: colors.textMuted, overflow: "hidden", textOverflow: "ellipsis" }}>{u.email}</span>
              <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: rol.fondo, color: rol.color }}>
                {rol.texto}
              </span>
              <span style={{ color: colors.textMuted }}>{u.telefono ? `+${u.telefono}` : "—"}</span>
              <span style={{ color: activo ? colors.accent : "#a4272a", fontWeight: 500 }}>{activo ? "Activa" : "Desactivada"}</span>
              <span style={{ color: colors.textMuted }}>{formatFechaCorta(u.creado_en)}</span>
              {/* Solo indicador: para cambiarlo se usa "Editar", que protege las cuentas reales */}
              {u.rol === "superadmin" ? (
                <span style={{ color: colors.textMuted }}>—</span>
              ) : u.es_prueba ? (
                <span style={{ justifySelf: "start", padding: "3px 10px", borderRadius: 999, background: "#fdf3e1", color: "#8a5a00", fontSize: 12, fontWeight: 600 }}>
                  Prueba
                </span>
              ) : (
                <span style={{ color: colors.textMuted }}>Real</span>
              )}
              <button
                onClick={() => setCuentaEditando(u)}
                style={{ justifySelf: "start", padding: "4px 10px", borderRadius: 8, border: `1px solid ${colors.border}`, background: "white", color: colors.accent, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
              >
                Editar
              </button>
            </div>
          );
        })}
      </div>

      {cuentaEditando && (
        <ModalEditarCuenta
          cuenta={cuentaEditando}
          esMiCuenta={cuentaEditando.id === usuarioActual?.id}
          onClose={() => setCuentaEditando(null)}
          onGuardada={() => setRecarga((n) => n + 1)}
        />
      )}
    </>
  );
};