import { Pressable, Text, View } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { Icono } from '@/components/ui/Icono';
import { COLORES, ESPECIE_LABEL, TEXTOS_PACIENTES as T, TEXTOS_VETERINARIO } from '@/constants/constants';
import { tarjetaPacienteStyles as styles } from '@/css/VeterinarioPage';
import type { TarjetaPacienteProps } from '@/interfaces';
import { diaDeCita, tiempoDesde } from '@/lib/fechas';

export function TarjetaPaciente({ paciente, onPress }: TarjetaPacienteProps) {
  const especie = paciente.raza || (paciente.especie ? ESPECIE_LABEL[paciente.especie] : null);
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}>
      <AvatarMascota nombre={paciente.nombre} fotoUrl={paciente.fotoUrl} tamano={48} />
      <View style={styles.textos}>
        <Text style={styles.nombre} numberOfLines={1}>
          {paciente.nombre}
          {especie ? <Text style={styles.especie}> · {especie}</Text> : null}
        </Text>
        <Text style={styles.detalle} numberOfLines={1}>
          {paciente.dueno} · {T.visitas(paciente.totalVisitas)}
        </Text>
        <Text style={styles.detalle}>{T.ultimaVisita(tiempoDesde(diaDeCita(paciente.ultimaVisita)))}</Text>
        {paciente.alergias && (
          <Etiqueta
            texto={TEXTOS_VETERINARIO.alergia(paciente.alergias)}
            icono="alerta"
            colorFondo={COLORES.estados.pendiente.fondo}
            colorTexto={COLORES.estados.pendiente.texto}
          />
        )}
      </View>
      <Icono nombre="chevronDerecha" tamano={20} color={COLORES.textoSecundario} />
    </Pressable>
  );
}
