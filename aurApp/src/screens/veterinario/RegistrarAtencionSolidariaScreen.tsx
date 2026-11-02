import { router, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { TarjetaPacienteAtencion } from '@/components/atencion/TarjetaPacienteAtencion';
import { BotonPrincipal } from '@/components/formulario/BotonPrincipal';
import { CampoTexto } from '@/components/formulario/CampoTexto';
import { MensajeFormulario } from '@/components/formulario/MensajeFormulario';
import { AtencionSolidariaGuardada } from '@/components/solidaria/AtencionSolidariaGuardada';
import { FilaFichaAtencion } from '@/components/solidaria/FilaFichaAtencion';
import { TarjetaTipoAtencion } from '@/components/solidaria/TarjetaTipoAtencion';
import { AvisoSinConexion } from '@/components/ui/AvisoSinConexion';
import { ContadorNumero } from '@/components/ui/ContadorNumero';
import { EstadoBorrador } from '@/components/ui/EstadoBorrador';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { GrupoCampo } from '@/components/ui/GrupoCampo';
import { PantallaFormulario } from '@/components/ui/PantallaFormulario';
import { PreguntaOpciones } from '@/components/ui/PreguntaOpciones';
import {
  ESTADOS_GENERALES_ATENCION,
  MAX_RESUMEN_ATENCION_SOLIDARIA,
  PASO_PESO_KG,
  TEXTOS_ATENCION_SOLIDARIA as T,
  TEXTOS_CARGA,
  TEXTOS_SOLIDARIA,
} from '@/constants/constants';
import { useAuth } from '@/Auth/AuthContext';
import { atencionSolidariaStyles as styles } from '@/css/SolidariaPage';
import { useAtencionSolidaria } from '@/hooks/useAtencionSolidaria';
import type { ProcedimientoFicha } from '@/interfaces';
import { formatearPeso } from '@/lib/formatos';

const PROCEDIMIENTOS_FICHA: readonly ProcedimientoFicha[] = ['vacunas', 'desparasitacion', 'esterilizacion', 'microchip'];
const A_DOMICILIO = 'domicilio';

/** Registrar una atención a un animal en adopción (en terreno, con borrador sin conexión) y el "¡Gracias!". */
export default function RegistrarAtencionSolidariaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const a = useAtencionSolidaria(Number(id));
  const { usuarioActual } = useAuth();
  const f = a.ficha;

  if (a.guardada) {
    return (
      <PantallaFormulario titulo={T.titulo} subtitulo={a.guardada.nombreAnimal}>
        <AtencionSolidariaGuardada
          guardada={a.guardada}
          nombreVeterinario={usuarioActual?.nombre ?? ''}
          onOtro={router.back}
          onMisAtenciones={() => router.replace({ pathname: '/veterinario/solidaria', params: { pestana: 'mias' } })}
        />
      </PantallaFormulario>
    );
  }

  if (!f) {
    return (
      <PantallaFormulario titulo={T.titulo}>
        {a.cargando ? (
          <EstadoCarga texto={T.cargando} />
        ) : (
          <EstadoVacio icono="huella" titulo={a.errorCarga ?? T.noEncontrado} textoAccion={a.errorCarga ? TEXTOS_CARGA.reintentar : undefined} onAccion={a.recargar} />
        )}
      </PantallaFormulario>
    );
  }

  const opcionesCentro = [{ valor: A_DOMICILIO, texto: TEXTOS_SOLIDARIA.aDomicilio }, ...a.centros.map((c) => ({ valor: String(c.id), texto: c.nombre }))];
  const quien = f.refugio ?? f.publicador.nombre;

  return (
    <PantallaFormulario
      titulo={T.titulo}
      subtitulo={`${f.nombre} · ${quien}`}
      pie={
        <View style={styles.pie}>
          {!a.sinConexion && <MensajeFormulario tipo="error" texto={a.error} />}
          <EstadoBorrador guardadoEn={a.guardadoEn} />
          <BotonPrincipal texto={T.guardar} textoCargando={T.guardando} cargando={a.guardando} onPress={a.guardar} tono="coral" />
        </View>
      }>
      <View style={styles.cuerpo}>
        <AvisoSinConexion visible={a.sinConexion} reintentando={a.guardando} onReintentar={a.guardar} />
        <TarjetaPacienteAtencion nombre={f.nombre} descripcion={[f.raza, f.edad].join(' · ')} dueno="" fotoUrl={f.fotoUrl} alergias={f.alergias} />

        <GrupoCampo titulo={T.comoFue}>
          <View style={styles.tipos}>
            <TarjetaTipoAtencion icono="corazon" titulo={T.solidaria} seleccionada={a.datos.solidario} onPress={() => a.cambiar({ solidario: true })} />
            <TarjetaTipoAtencion icono="etiqueta" titulo={T.conCosto} detalle={T.conCostoDetalle} seleccionada={!a.datos.solidario} onPress={() => a.cambiar({ solidario: false })} />
          </View>
        </GrupoCampo>
        {!a.datos.solidario && (
          <CampoTexto
            etiqueta={T.monto}
            icono="etiqueta"
            value={a.datos.monto}
            onChangeText={(v) => a.cambiar({ monto: v.replace(/\D/g, '') })}
            placeholder={T.montoPlaceholder}
            keyboardType="number-pad"
            maxLength={7}
          />
        )}

        <PreguntaOpciones
          titulo={T.donde}
          opciones={opcionesCentro}
          valor={a.datos.centroId === null ? A_DOMICILIO : String(a.datos.centroId)}
          onCambiar={(v) => a.cambiar({ centroId: !v || v === A_DOMICILIO ? null : Number(v) })}
        />
        <CampoTexto
          etiqueta={T.resumen}
          icono="ficha"
          value={a.datos.resumen}
          onChangeText={(v) => a.cambiar({ resumen: v })}
          placeholder={T.resumenPlaceholder}
          multiline
          maxLength={MAX_RESUMEN_ATENCION_SOLIDARIA}
        />
        <PreguntaOpciones titulo={T.estado} opciones={ESTADOS_GENERALES_ATENCION} valor={a.datos.estadoGeneral} onCambiar={(v) => v && a.cambiar({ estadoGeneral: v })} />

        <GrupoCampo titulo={T.ficha} ayuda={T.fichaAyuda}>
          <View style={styles.ficha}>
            {PROCEDIMIENTOS_FICHA.map((p) => (
              <FilaFichaAtencion
                key={p}
                texto={T.procedimientos[p]}
                yaEnFicha={a.yaEnFicha[p]}
                marcado={a.datos.procedimientos.includes(p)}
                onCambiar={(marcado) => a.alternarProcedimiento(p, marcado)}
              />
            ))}
          </View>
        </GrupoCampo>

        <GrupoCampo titulo={T.peso}>
          <ContadorNumero valor={a.peso} onCambiar={a.cambiarPeso} paso={PASO_PESO_KG} formato={formatearPeso} textoVacio={T.sinPeso} />
        </GrupoCampo>
        <Text style={styles.aviso}>{T.aviso}</Text>
      </View>
    </PantallaFormulario>
  );
}
