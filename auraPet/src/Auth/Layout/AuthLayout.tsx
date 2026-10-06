import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { NavBar } from '../../components/NavBar';
import { Footer } from '../../components/Footer';
import { Colors } from '../../constants';
import "../../css/HomePage.css";

const colors = Colors;

// Antes cada página pasaba estas variables al NavBar y al Footer.
// Como ahora viven en el layout, las define el layout.
const temaVars = {
  "--landing-primario": colors.primario,
  "--landing-secundario": colors.secundario,
  "--landing-oscuro": colors.oscuro,
  "--landing-sidebar-oscuro": colors.sidebarOscuro,
  "--landing-texto": colors.texto,
  "--landing-texto-suave": colors.textoSuave,
  "--landing-texto-sidebar": colors.textoSidebar,
  "--landing-borde": colors.borde,
} as React.CSSProperties;

export const Layout = () => {
  const { pathname } = useLocation();

  // Cada vez que cambia la página, volvemos arriba
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div style={temaVars}>
      <NavBar />
      <Outlet /> {/* aquí aparece la página de la ruta actual */}
      <Footer />
    </div>
  );
};