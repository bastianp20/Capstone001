import { useAuth } from "../Auth/AuthContext";
import styles from "../css/Modal.module.css";

interface ConfiguracionModalProps {
  onCerrar: () => void;
}

// modal de configuración :p por ahora solo muestra los datos de la
// cuenta y permite cerrar sesión. Más adelante se puede agregar cambio
// de contraseña, notificaciones, etc.
export const ConfiguracionModal = ({ onCerrar }: ConfiguracionModalProps) => {
  const { usuarioActual, logout } = useAuth();

  const handleCerrarSesion = () => {
    logout();
    onCerrar();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Configuración</h2>
          <button className={styles.closeButton} onClick={onCerrar}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <p className={styles.label}>Nombre</p>
          <p>{usuarioActual?.nombre ?? "—"}</p>

          <p className={styles.label} style={{ marginTop: 16 }}>
            Correo
          </p>
          <p>{usuarioActual?.email ?? "—"}</p>
        </div>

        <div className={styles.actions}>
          <button
            className={styles.btnCancelar}
            style={{ color: "#dc2626", borderColor: "#dc2626" }}
            onClick={handleCerrarSesion}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};
