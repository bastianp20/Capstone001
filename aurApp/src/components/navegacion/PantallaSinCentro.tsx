import { View } from 'react-native';

import { BotonSecundario } from '@/components/formulario/BotonSecundario';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { TEXTOS_LOGIN, TEXTOS_SIN_CENTRO } from '@/constants/constants';
import { pantallaCentradaStyles as styles } from '@/css/Navegacion';
import { useAuth } from '@/Auth/AuthContext';

/** Cuenta administrativa que todavía no tiene un centro asignado. */
export function PantallaSinCentro() {
  const { logout } = useAuth();
  return (
    <View style={styles.pantalla}>
      <EstadoVacio icono="centro" titulo={TEXTOS_SIN_CENTRO.titulo} detalle={TEXTOS_SIN_CENTRO.detalle} />
      <BotonSecundario texto={TEXTOS_LOGIN.cerrarSesion} icono="salir" onPress={logout} />
    </View>
  );
}
