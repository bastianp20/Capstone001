import { CircleCheck } from "lucide-react";
import type { ToastProps } from "../../../interfaces";

/** Aviso corto abajo a la derecha ("Cupos actualizados"). */
export const Toast = ({ mensaje }: ToastProps) =>
  mensaje ? (
    <div className="ap-toast" role="status">
      <CircleCheck size={18} aria-hidden /> {mensaje}
    </div>
  ) : null;
