import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { COLORES } from '@/constants/constants';
import type { IconoProps, NombreIcono } from '@/interfaces';

// Trazos de Lucide (https://lucide.dev, licencia ISC), en una grilla de 24x24.
const TRAZOS: Record<NombreIcono, React.ReactNode> = {
  inicio: (
    <>
      <Path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <Path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </>
  ),
  citas: (
    <>
      <Path d="M8 2v3" />
      <Path d="M16 2v3" />
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18" />
      <Path d="M8 13h.01" />
      <Path d="M12 13h.01" />
      <Path d="M16 13h.01" />
      <Path d="M8 17h.01" />
      <Path d="M12 17h.01" />
      <Path d="M16 17h.01" />
    </>
  ),
  historial: (
    <>
      <Path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <Path d="M3 3v5h5" />
      <Path d="M12 7v5l4 2" />
    </>
  ),
  perfil: (
    <>
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </>
  ),
  campana: (
    <>
      <Path d="M10.268 21a2 2 0 0 0 3.464 0" />
      <Path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
    </>
  ),
  pastilla: (
    <>
      <Path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
      <Path d="m8.5 8.5 7 7" />
    </>
  ),
  jeringa: (
    <>
      <Path d="m18 2 4 4" />
      <Path d="m17 7 3-3" />
      <Path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
      <Path d="m9 11 4 4" />
      <Path d="m5 19-3 3" />
      <Path d="m14 4 6 6" />
    </>
  ),
  flecha: (
    <>
      <Path d="M5 12h14" />
      <Path d="m12 5 7 7-7 7" />
    </>
  ),
  mas: (
    <>
      <Path d="M5 12h14" />
      <Path d="M12 5v14" />
    </>
  ),
  huella: (
    <>
      <Circle cx="11" cy="4" r="2" />
      <Circle cx="18" cy="8" r="2" />
      <Circle cx="20" cy="16" r="2" />
      <Path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </>
  ),
  escudo: (
    <>
      <Path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <Path d="m9 12 2 2 4-4" />
    </>
  ),
  estetoscopio: (
    <>
      <Path d="M11 2v2" />
      <Path d="M5 2v2" />
      <Path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <Path d="M8 15a6 6 0 0 0 12 0v-3" />
      <Circle cx="20" cy="10" r="2" />
    </>
  ),
  reloj: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M12 6v6l4 2" />
    </>
  ),
  ubicacion: (
    <>
      <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <Circle cx="12" cy="10" r="3" />
    </>
  ),
  correo: (
    <>
      <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
      <Rect x="2" y="4" width="20" height="16" rx="2" />
    </>
  ),
  candado: (
    <>
      <Rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <Path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  ojo: (
    <>
      <Path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
      <Circle cx="12" cy="12" r="3" />
    </>
  ),
  ojoTachado: (
    <>
      <Path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
      <Path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
      <Path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
      <Path d="m2 2 20 20" />
    </>
  ),
  persona: (
    <>
      <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </>
  ),
  telefono: (
    <Path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
  ),
  salir: (
    <>
      <Path d="m16 17 5-5-5-5" />
      <Path d="M21 12H9" />
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    </>
  ),
  buscar: (
    <>
      <Path d="m21 21-4.34-4.34" />
      <Circle cx="11" cy="11" r="8" />
    </>
  ),
  cerrar: (
    <>
      <Path d="M18 6 6 18" />
      <Path d="m6 6 12 12" />
    </>
  ),
  atras: (
    <>
      <Path d="m12 19-7-7 7-7" />
      <Path d="M19 12H5" />
    </>
  ),
  chevronDerecha: <Path d="m9 18 6-6-6-6" />,
  descarga: (
    <>
      <Path d="M12 15V3" />
      <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <Path d="m7 10 5 5 5-5" />
    </>
  ),
  ayuda: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <Path d="M12 17h.01" />
    </>
  ),
  etiqueta: (
    <>
      <Path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <Circle cx="7.5" cy="7.5" r=".5" />
    </>
  ),
  ficha: (
    <>
      <Path d="M13 19a4 4 0 0 0-8 0" />
      <Path d="M16 10h2" />
      <Path d="M16 14h2" />
      <Circle cx="9" cy="12" r="3" />
      <Rect x="2" y="5" width="20" height="14" rx="2" />
    </>
  ),
  check: <Path d="M20 6 9 17l-5-5" />,
  calendarioMas: (
    <>
      <Path d="M16 18h6" />
      <Path d="M16 2v3" />
      <Path d="M19 15v6" />
      <Path d="M21 11.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.3" />
      <Path d="M3 9h18" />
      <Path d="M8 2v3" />
    </>
  ),
  cancelar: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="m15 9-6 6" />
      <Path d="m9 9 6 6" />
    </>
  ),
  editar: (
    <>
      <Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
      <Path d="m15 5 4 4" />
    </>
  ),
  enviar: (
    <>
      <Path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      <Path d="m21.854 2.147-10.94 10.939" />
    </>
  ),
  peso: (
    <>
      <Circle cx="12" cy="5" r="3" />
      <Path d="M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z" />
    </>
  ),
  equipo: (
    <>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Path d="M16 3.128a4 4 0 0 1 0 7.744" />
      <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <Circle cx="9" cy="7" r="4" />
    </>
  ),
  aprobaciones: (
    <>
      <Rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <Path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <Path d="m9 14 2 2 4-4" />
    </>
  ),
  mensaje: (
    <>
      <Path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z" />
    </>
  ),
  hoy: (
    <>
      <Path d="M8 2v3" />
      <Path d="M16 2v3" />
      <Rect x="3" y="3" width="18" height="18" rx="2" />
      <Path d="M3 9h18" />
      <Path d="m9 15 2 2 4-4" />
    </>
  ),
  resumen: (
    <>
      <Path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" />
      <Path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
    </>
  ),
  usuarioX: (
    <>
      <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <Circle cx="9" cy="7" r="4" />
      <Path d="M17 8l5 5" />
      <Path d="M22 8l-5 5" />
    </>
  ),
  plan: (
    <>
      <Rect width="20" height="14" x="2" y="5" rx="2" />
      <Path d="M2 10h20" />
      <Path d="M6 14h2" />
    </>
  ),
  alerta: (
    <>
      <Path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
      <Path d="M12 9v4" />
      <Path d="M12 17h.01" />
    </>
  ),
  iniciar: (
    <>
      <Path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
    </>
  ),
  completar: (
    <>
      <Circle cx="12" cy="12" r="10" />
      <Path d="m16 9-5.5 5.5L8 12" />
    </>
  ),
  derivacion: (
    <>
      <Path d="m16 3 4 4-4 4" />
      <Path d="M20 7H4" />
      <Path d="m8 21-4-4 4-4" />
      <Path d="M4 17h16" />
    </>
  ),
  centro: (
    <>
      <Path d="M12 11v4" />
      <Path d="M14 13h-4" />
      <Path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <Path d="M18 6v14" />
      <Path d="M6 6v14" />
      <Rect width="20" height="14" x="2" y="6" rx="2" />
    </>
  ),
};

export function Icono({ nombre, tamano = 24, color = COLORES.texto, grosor = 2 }: IconoProps) {
  return (
    <Svg
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={grosor}
      strokeLinecap="round"
      strokeLinejoin="round">
      {TRAZOS[nombre]}
    </Svg>
  );
}
