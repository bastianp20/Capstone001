import { Text, View } from 'react-native';

import { AvatarMascota } from '@/components/ui/AvatarMascota';
import { BotonPequeno } from '@/components/ui/BotonPequeno';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { COLORES, ESPECIE_LABEL, TEXTOS_VETERINARIO as T } from '@/constants/constants';
import { tarjetaSiguientePacienteStyles as styles } from '@/css/VeterinarioPage';
import type { TarjetaSiguientePacienteProps } from '@/interfaces';
import { edadDesde, partesFechaCita } from '@/lib/fechas';

/** La cita que viene (o la que está en curso), con acceso a la ficha y al botón de atención. */
export function TarjetaSiguientePaciente({ cita, ocupado, onVerFicha, onIniciar, onTerminar }: TarjetaSiguientePacienteProps) {
  const descripcion = [cita.raza || (cita.especie ? ESPECIE_LABEL[cita.especie] : null), edadDesde(cita.fechaNacimiento)]
    .filter(Boolean)
    .join(', ');
  const enCurso = cita.estado === 'en_curso';

  return (
    <View style={styles.tarjeta}>
      <View style={styles.cinta}>
        <Text style={styles.cintaTexto}>{T.siguientePaciente}</Text>
      </View>
      <View style={styles.cuerpo}>
        <View style={styles.fila}>
          <AvatarMascota nombre={cita.mascota} fotoUrl={cita.fotoUrl} tamano={52} />
          <View style={styles.textos}>
            <Text style={styles.nombre} numberOfLines={1}>
              {cita.mascota}
              {descripcion ? <Text style={styles.descripcion}> · {descripcion}</Text> : null}
            </Text>
            <Text style={styles.detalle} numberOfLines={1}>
              {cita.dueno}
            </Text>
            <Text style={styles.detalle} numberOfLines={2}>
              {cita.motivo}
            </Text>
          </View>
          <Text style={styles.hora}>{partesFechaCita(cita.fechaHora).hora}</Text>
        </View>
        {cita.alergias && (
          <Etiqueta
            texto={T.alergia(cita.alergias)}
            icono="alerta"
            colorFondo={COLORES.estados.pendiente.fondo}
            colorTexto={COLORES.estados.pendiente.texto}
          />
        )}
        <View style={styles.acciones}>
          <View style={styles.boton}>
            <BotonPequeno texto={T.verFicha} onPress={onVerFicha} />
          </View>
          <View style={styles.boton}>
            <BotonPequeno
              texto={enCurso ? T.terminarAtencion : T.iniciarAtencion}
              icono={enCurso ? 'completar' : 'iniciar'}
              variante="primario"
              cargando={ocupado}
              onPress={enCurso ? onTerminar : onIniciar}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
