import type { BotonProps } from "../../interfaces";
import { Spinner } from "./Spinner";
import styles from "../../css/ui/Boton.module.css";

// Botón con variantes (primario / secundario / peligro) y estado de carga.
// Recibe cualquier prop de <button> (onClick, type, disabled, aria-*...).
export const Boton = ({
  variante = "primario",
  cargando = false,
  icono,
  disabled,
  className = "",
  children,
  type = "button",
  ...resto
}: BotonProps) => (
  <button
    type={type}
    className={`${styles.boton} ${styles[variante]} ${className}`}
    disabled={disabled || cargando}
    aria-busy={cargando || undefined}
    {...resto}
  >
    {cargando ? <Spinner /> : icono}
    {children}
  </button>
);
