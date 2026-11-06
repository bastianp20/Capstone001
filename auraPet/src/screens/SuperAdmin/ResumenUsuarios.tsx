import { useState } from "react";
import { COLUMNAS_SUPERADMIN, ESTILO_ROL, ETIQUETA_CUENTA, ETIQUETA_PRUEBA, FILTROS_USUARIOS, PREDICADOS_FILTRO_USUARIOS, TEXTOS_DETALLE_USUARIO } from "../../constants";
import { useConsulta } from "../../hooks/useConsulta";
import { useFiltro } from "../../hooks/useFiltro";
import { getAllUsers } from "../../Api/getInfo";
import { formatFechaCorta } from "../../lib/fechas";
import { useAuth } from "../../Auth/AuthContext";
import { ModalEditarCuenta } from "../../Modal/EditarCuentaModal";
import { DetalleUsuarioModal } from "../../Modal/DetalleUsuarioModal";
import { BarraFiltros } from "../../components/ui/BarraFiltros";
import { TablaPanel } from "../../components/ui/TablaPanel";
import { FilaTabla } from "../../components/ui/FilaTabla";
import { Etiqueta } from "../../components/ui/Etiqueta";
import type { CuentaUsuario, FiltroUsuarios } from "../../interfaces";
import styles from "../../css/superadmin/SeccionesSuperAdmin.module.css";

const COLUMNAS = COLUMNAS_SUPERADMIN.usuarios;
// El buscador busca por nombre o correo
const camposUsuario = (u: CuentaUsuario) => [u.nombre, u.email];

// Sección "Usuarios" del panel superadmin: todas las cuentas con su correo.
export const ResumenUsuarios = () => {
  const { usuarioActual } = useAuth();
  const [recarga, setRecarga] = useState(0);
  // Cuenta abierta en el modal de edición (null = ninguna)
  const [cuentaEditando, setCuentaEditando] = useState<CuentaUsuario | null>(null);
  // Cuenta abierta en "Ver detalles"
  const [cuentaDetalle, setCuentaDetalle] = useState<CuentaUsuario | null>(null);
  const { datos: usuarios = [], cargando, error } = useConsulta(() => getAllUsers(), [recarga]);

  // Buscador + chips (hook reutilizable)
  const { busqueda, setBusqueda, filtro, setFiltro, visibles, cantidad } = useFiltro({
    items: usuarios,
    camposBusqueda: camposUsuario,
    filtros: PREDICADOS_FILTRO_USUARIOS,
    filtroInicial: "todos" as FiltroUsuarios,
  });

  return (
    <>
      <h1 className={styles.titulo}>Usuarios</h1>
      <p className={styles.subtitulo}>Todas las cuentas registradas en AuraPet.</p>

      <BarraFiltros
        busqueda={busqueda}
        onBuscar={setBusqueda}
        placeholder="Buscar por nombre o correo…"
        opciones={FILTROS_USUARIOS}
        filtro={filtro}
        onFiltro={setFiltro}
        cantidad={cantidad}
      />

      <TablaPanel
        columnas={COLUMNAS}
        encabezados={["Nombre", "Correo", "Rol", "Teléfono", "Estado", "Registro", "Tipo", ""]}
        cargando={cargando}
        error={error}
        vacio="Ningún usuario coincide con la búsqueda."
        cantidad={visibles.length}
      >
        {visibles.map((u) => (
          <FilaTabla key={u.id} columnas={COLUMNAS}>
            <span className={styles.fuerte}>{u.nombre}</span>
            <span className={`${styles.suave} ${styles.recortado}`} title={u.email}>{u.email}</span>
            <Etiqueta {...ESTILO_ROL[u.rol]} />
            <span className={styles.suave}>{u.telefono ? `+${u.telefono}` : "—"}</span>
            {/* desactivado_en null = cuenta activa */}
            <Etiqueta {...ETIQUETA_CUENTA[u.desactivado_en === null ? "activa" : "desactivada"]} />
            <span className={styles.suave}>{formatFechaCorta(u.creado_en)}</span>
            {/* Solo indicador: para cambiarlo se usa "Editar", que protege las cuentas reales */}
            {u.rol === "superadmin" ? (
              <span className={styles.suave}>—</span>
            ) : u.es_prueba ? (
              <Etiqueta {...ETIQUETA_PRUEBA} />
            ) : (
              <span className={styles.suave}>Real</span>
            )}
            <div className={styles.acciones}>
              <button type="button" className={styles.botonSuave} onClick={() => setCuentaDetalle(u)}>
                {TEXTOS_DETALLE_USUARIO.verDetalles}
              </button>
              <button type="button" className={styles.botonEditar} onClick={() => setCuentaEditando(u)}>
                Editar
              </button>
            </div>
          </FilaTabla>
        ))}
      </TablaPanel>

      {cuentaDetalle && (
        <DetalleUsuarioModal
          perfilId={cuentaDetalle.id}
          onCerrar={() => setCuentaDetalle(null)}
          onEditar={() => { setCuentaEditando(cuentaDetalle); setCuentaDetalle(null); }}
        />
      )}
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
