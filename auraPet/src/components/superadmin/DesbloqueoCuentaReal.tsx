import { useState } from "react";
import styles from "../../css/modal/CrearProfesionalModal.module.css";
import { CARACTERES_CODIGO_CONFIRMACION, Iconos, LARGO_CODIGO_CONFIRMACION, SEGUNDOS_DESBLOQUEO_CUENTA_REAL } from "../../constants";
import { generarCodigo } from "../../utils";
import type { DesbloqueoCuentaRealProps } from "../../interfaces";

const iconos = Iconos;

// Candado para editar una cuenta REAL: muestra un código al azar que hay que
// escribir a mano (no se puede pegar). Al acertar, avisa al modal para que
// abra la ventana de edición. Cada vez que se monta, el código es distinto.
export const DesbloqueoCuentaReal = ({ onDesbloquear, titulo = "Esta es una cuenta real" }: DesbloqueoCuentaRealProps) => {
  // El código se genera una sola vez por montaje (función en useState)
  const [codigo] = useState(() => generarCodigo(LARGO_CODIGO_CONFIRMACION, CARACTERES_CODIGO_CONFIRMACION));
  const [escrito, setEscrito] = useState("");

  // Se compara sin guiones ni espacios y sin importar mayúsculas
  const limpio = escrito.replace(/[\s-]/g, "").toUpperCase();
  const coincide = limpio === codigo;

  // "K7P2QX" se muestra como "K7P-2QX" para que sea más fácil de leer
  const mitad = Math.ceil(codigo.length / 2);
  const codigoVisible = `${codigo.slice(0, mitad)}-${codigo.slice(mitad)}`;

  return (
    <div style={{ padding: 14, borderRadius: 10, background: "#fdf3e1", border: "1px solid #f4c98a", color: "#5a3600" }}>
      <p style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>
        <iconos.permisos size={16} /> {titulo}
      </p>
      <p style={{ margin: "0 0 10px", fontSize: 13 }}>
        Para editar, escribe este código. Tendrás {SEGUNDOS_DESBLOQUEO_CUENTA_REAL} segundos para hacer los cambios.
      </p>
      <code className={styles.clave} style={{ marginBottom: 10, textAlign: "center", userSelect: "none" }}>
        {codigoVisible}
      </code>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: "9px 11px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 14, letterSpacing: 2 }}
          placeholder="Escribe el código"
          value={escrito}
          onChange={(e) => setEscrito(e.target.value)}
          onPaste={(e) => e.preventDefault()}   // hay que escribirlo, no pegarlo
          onKeyDown={(e) => e.key === "Enter" && coincide && onDesbloquear()}
          autoFocus
          aria-label="Código de confirmación"
        />
        <button type="button" className={styles.enviar} disabled={!coincide} onClick={onDesbloquear}>
          Desbloquear
        </button>
      </div>
    </div>
  );
};
