import { useState } from 'react';
import { Text, View } from 'react-native';

import { EnlaceTexto } from '@/components/formulario/EnlaceTexto';
import { CirculoIcono } from '@/components/ui/CirculoIcono';
import { Etiqueta } from '@/components/ui/Etiqueta';
import { TarjetaPastel } from '@/components/ui/TarjetaPastel';
import { ESTILO_ITEM_HISTORIAL, TEXTOS_HISTORIAL } from '@/constants/constants';
import { useItemLineaDeTiempoStyles } from '@/css/HistorialPage';
import type { ItemLineaDeTiempoProps } from '@/interfaces';

import { DetalleReceta } from './DetalleReceta';
import { useColores, useTonosTarjeta } from '@/context/TemaContext';

/** Un registro en la línea de tiempo: punto de color, ícono y tarjeta según su tipo. */
export function ItemLineaDeTiempo({ item, mostrarMascota, ultimo }: ItemLineaDeTiempoProps) {
  const COLORES = useColores();
  const TONOS_TARJETA = useTonosTarjeta();
  const styles = useItemLineaDeTiempoStyles();
  const [recetaAbierta, setRecetaAbierta] = useState(false);
  const estilo = ESTILO_ITEM_HISTORIAL[item.tipo];
  const tono = estilo.tono ? TONOS_TARJETA[estilo.tono] : null;
  const subtitulo = [mostrarMascota ? item.mascota : null, item.subtitulo].filter(Boolean).join(' · ');

  const contenido = (
    <View style={styles.fila}>
      <CirculoIcono
        icono={estilo.icono}
        tamano={38}
        tamanoIcono={19}
        colorIcono={tono?.icono ?? COLORES.primario}
        colorFondo={tono?.iconoFondo ?? COLORES.primarioSuave}
      />
      <View style={styles.textos}>
        <Text style={styles.titulo}>{item.titulo}</Text>
        {!!subtitulo && <Text style={styles.subtitulo}>{subtitulo}</Text>}
        {!!item.detalle && <Text style={styles.detalle}>{item.detalle}</Text>}
        {item.etiqueta && (
          <Etiqueta texto={item.etiqueta} colorFondo={tono?.iconoFondo ?? COLORES.primarioSuave} colorTexto={tono?.icono ?? COLORES.primarioOscuro} />
        )}
        {item.receta && item.receta.medicamentos.length > 0 && (
          <>
            <EnlaceTexto
              texto={recetaAbierta ? TEXTOS_HISTORIAL.ocultarReceta : TEXTOS_HISTORIAL.verReceta}
              onPress={() => setRecetaAbierta((v) => !v)}
            />
            {recetaAbierta && <DetalleReceta receta={item.receta} />}
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.contenedor}>
      <View style={styles.guia}>
        <View style={[styles.punto, { backgroundColor: estilo.colorPunto }]} />
        {!ultimo && <View style={styles.linea} />}
      </View>
      {estilo.tono ? (
        <TarjetaPastel tono={estilo.tono} style={styles.tarjeta}>
          {contenido}
        </TarjetaPastel>
      ) : (
        <View style={[styles.tarjeta, styles.tarjetaBlanca]}>{contenido}</View>
      )}
    </View>
  );
}
