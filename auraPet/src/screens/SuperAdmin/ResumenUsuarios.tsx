import { useState } from "react";
import { Colors, ESTILO_ROL, FILTROS_USUARIOS } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getAllUsers } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { useAuth } from "../../Auth/AuthContext";
import { ModalEditarCuenta } from "../../Modal/EditarCuentaModal";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import type { CuentaUsuario, FiltroUsuarios } from "../../interfaces";

const colors = Colors;
const FONDO = "#f6f8f8";

// los chips de filtro son como los cositos que están en excel, los menú desplegables que se le asigna un estado
// y un color y cambian de estado y color dependiendo de la circuntancia. 

// Qué deja pasar cada chip de filtro (los textos de los chips están en FILTROS_USUARIOS)
const FILTRO_USUARIOS: Record<FiltroUsuarios, (u: CuentaUsuario) => boolean> = {
  todos: () => true,
  dueno: (u) => u.rol === "dueno",
  veterinario: (u) => u.rol === "veterinario",
  administrativo: (u) => u.rol === "administrativo",
  superadmin: (u) => u.rol === "superadmin",
  prueba: (u) => u.es_prueba,
};
// El buscador busca por nombre o correo
const camposUsuario = (u: CuentaUsuario) => [u.nombre, u.email];

// Sección "Usuarios" del panel superadmin: todas las cuentas con su correo.
export const ResumenUsuarios = () => {
  // useConsulta llama a getAllUsers UNA vez, espera la respuesta y nos da los datos listos.
  const { usuarioActual } = useAuth();
  const [recarga, setRecarga] = useState(0);
  // Cuenta abierta en el modal de edición (null = ninguna)
  const [cuentaEditando, setCuentaEditando] = useState<CuentaUsuario | null>(null);
  const { datos: usuarios = [], cargando, error } = useConsulta(() => getAllUsers(), [recarga]);


  // Buscador + chips (hook reutilizable)
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: usuarios,
    camposBusqueda: camposUsuario,
    filtros: FILTRO_USUARIOS,
    filtroInicial: "todos" as FiltroUsuarios,
  });

  const columnas = "1.5fr 1.8fr 1fr 1.1fr 0.8fr 0.9fr 1fr 0.7fr";

  return (
    <>
      <h1 style={{ margin: "0 0 4px", fontSize: 21, fontWeight: 700, color: colors.text }}>Usuarios</h1>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: colors.textMuted }}>
        Todas las cuentas registradas en AuraPet.
      </p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre o correo…"
        opciones={FILTROS_USUARIOS}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      {/* Tabla */}
      <div style={{ background: "white", border: `1px solid ${colors.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: columnas, gap: 12, padding: "10px 18px", background: FONDO, fontSize: 11.5, fontWeight: 700, color: colors.textMuted, textTransform: "uppercase" }}>
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
          <span>Teléfono</span>
          <span>Estado</span>
          <span>Registro</span>
          <span>Tipo</span>
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
          const rol = ESTILO_ROL[u.rol];
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