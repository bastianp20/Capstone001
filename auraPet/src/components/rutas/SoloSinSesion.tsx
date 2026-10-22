import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Auth/AuthContext";
import { RUTA_PANEL } from "../../constants";

// Páginas públicas (landing, solicitar centro): con sesión iniciada se va
// directo al panel, igual que antes de tener rutas.
export const SoloSinSesion = () => {
  const { usuarioActual } = useAuth();
  if (usuarioActual) return <Navigate to={RUTA_PANEL} replace />;
  return <Outlet />;
};
