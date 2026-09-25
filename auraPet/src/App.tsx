import { useAuth } from './Auth/AuthContext';
import { HomeScreen } from './screens/Home/HomeScreen';
import { LoginRol } from './screens/Login/LoginRol';

// Sin router todavía: esta es la única pieza que decide qué se muestra.
// Sin usuario -> LandingScreen (con el login como modal adentro).
// Con usuario -> LoginRol resuelve la pantalla según el rol.
export const App = () => {
  const { usuarioActual } = useAuth();
  if (!usuarioActual) return <HomeScreen />;
  return <LoginRol />;
};
