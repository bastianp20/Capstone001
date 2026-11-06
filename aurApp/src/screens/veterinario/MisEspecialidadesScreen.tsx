import { Text, View } from 'react-native';

import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { Icono } from '@/components/ui/Icono';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { TarjetaEspecialidad } from '@/components/veterinario/TarjetaEspecialidad';
import { TEXTOS_MIS_ESPECIALIDADES as T, TONOS_ESPECIALIDADES } from '@/constants/constants';
import { useMisEspecialidadesStyles } from '@/css/MisEspecialidadesPage';
import { useMisEspecialidadesVeterinario } from '@/hooks/useMisEspecialidadesVeterinario';
import { iconoEspecialidad } from '@/lib/especialidades';
import { useColores } from '@/context/TemaContext';

/** Perfil → "Mis especialidades": las que ofrece (sin límite) y "Otra". */
export default function MisEspecialidadesScreen() {
  const COLORES = useColores();
  const styles = useMisEspecialidadesStyles();
  const e = useMisEspecialidadesVeterinario();

  return (
    <PantallaFormulario
      titulo={T.titulo}
      pie={
        <View>
          <MensajeFormulario tipo="error" texto={e.error} />
          <MensajeFormulario tipo="aviso" texto={e.guardado ? T.guardado : ''} />
          <View style={styles.pie}>
            <Text style={styles.cantidad}>{T.seleccionadas(e.cantidad)}</Text>
            <View style={styles.boton}>
              <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={e.guardando} onPress={e.guardar} />
            </View>
          </View>
        </View>
      }>
      {e.cargando ? (
        <EstadoCarga texto={T.cargando} />
      ) : (
        <View style={styles.cuerpo}>
          <Text style={styles.bajada}>{T.bajada}</Text>
          <View style={styles.general}>
            <Text style={styles.generalTexto}>{T.general}</Text>
            <Icono nombre="check" tamano={14} color={COLORES.primarioOscuro} grosor={2.6} />
          </View>
          <View style={styles.grilla}>
            {e.especialidades.map((x, i) => (
              <TarjetaEspecialidad
                key={x.id}
                nombre={x.nombre}
                icono={iconoEspecialidad(x.nombre)}
                tono={TONOS_ESPECIALIDADES[i % TONOS_ESPECIALIDADES.length]}
                marcada={e.seleccion.includes(x.id)}
                onPress={() => e.alternar(x.id)}
              />
            ))}
          </View>
          <CampoTexto etiqueta={T.otra} icono="estetoscopio" value={e.otra} onChangeText={e.setOtra} placeholder={T.otraPlaceholder} maxLength={80} />
        </View>
      )}
    </PantallaFormulario>
  );
}
