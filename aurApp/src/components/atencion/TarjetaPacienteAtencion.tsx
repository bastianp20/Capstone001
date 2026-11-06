import { Text, View } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { Icono } from '@/components/ui/Icono';
import { TEXTOS_ATENCION as T } from '@/constants/constants';
import { useTarjetaPacienteAtencionStyles } from '@/css/AtencionPage';
import type { TarjetaPacienteAtencionProps } from '@/interfaces';
import { useColores } from '@/context/TemaContext';

/** El paciente: foto, raza/edad/peso, dueño y la alerta de alergia si tiene. */
export function TarjetaPacienteAtencion({ nombre, descripcion, dueno, fotoUrl, alergias }: TarjetaPacienteAtencionProps) {
  const COLORES = useColores();
  const styles = useTarjetaPacienteAtencionStyles();
  return (
    <View style={styles.tarjeta}>
      <AvatarMascota nombre={nombre} fotoUrl={fotoUrl} tamano={72} />
      <View style={styles.textos}>
        <Text style={styles.nombre}>{nombre}</Text>
        <Text style={styles.detalle}>{descripcion}</Text>
        {dueno ? <Text style={styles.detalle}>{T.dueno(dueno)}</Text> : null}
        {alergias && (
          <View style={styles.alergia}>
            <Icono nombre="alerta" tamano={14} color={COLORES.peligro} grosor={2.2} />
            <Text style={styles.alergiaTexto} numberOfLines={2}>
              {T.alergia(alergias)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
