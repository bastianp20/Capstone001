import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { TarjetaAnimalSolidario } from '@/components/solidaria/TarjetaAnimalSolidario';
import { TarjetaAtencionPropia } from '@/components/solidaria/TarjetaAtencionPropia';
import { TarjetaImpactoSolidario } from '@/components/solidaria/TarjetaImpactoSolidario';
import { TarjetaUrgenteSolidaria } from '@/components/solidaria/TarjetaUrgenteSolidaria';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { SelectorPildoras } from '@/components/ui/SelectorPildoras';
import { TituloSeccion } from '@/components/ui/TituloSeccion';
import { TEXTOS_CARGA, TEXTOS_SOLIDARIA as T } from '@/constants/constants';
import { solidariaStyles as styles } from '@/css/SolidariaPage';
import { useAdopcionSolidaria } from '@/hooks/useAdopcionSolidaria';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import type { PestanaSolidaria } from '@/interfaces';

const atender = (id: number) => router.push(`/veterinario/solidaria/${id}`);
const verFicha = (id: number) => router.push(`/adopcion/${id}`);

/** Adopción solidaria: impacto, los más urgentes y los animales para atender (o mis atenciones). */
export default function AdopcionSolidariaScreen() {
  useBarraEstadoClara();
  const { pestana } = useLocalSearchParams<{ pestana?: PestanaSolidaria }>();
  const s = useAdopcionSolidaria(pestana ?? 'esperando');

  const lista = () => {
    if (s.cargando) return <EstadoCarga texto={T.cargando} />;
    if (s.error) return <EstadoVacio icono="cancelar" titulo={T.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={s.recargar} />;
    if (s.pestana === 'mias') {
      if (!s.atenciones.length) return <EstadoVacio icono="estetoscopio" titulo={T.vacio.mias} />;
      return s.atenciones.map((a) => <TarjetaAtencionPropia key={a.id} atencion={a} onPress={() => verFicha(a.adopcionId)} />);
    }
    if (!s.animales.length) return <EstadoVacio icono="huella" titulo={T.vacio[s.pestana]} />;
    return s.animales.map((a) => <TarjetaAnimalSolidario key={a.id} animal={a} onAtender={() => atender(a.id)} onVer={() => verFicha(a.id)} />);
  };

  return (
    <PantallaLista
      recargando={s.recargando}
      onRecargar={s.recargar}
      encabezado={
        <EncabezadoPagina titulo={T.titulo} subtitulo={T.subtitulo} onVolver={router.back}>
          {s.resumen && <TarjetaImpactoSolidario resumen={s.resumen} />}
        </EncabezadoPagina>
      }>
      <SelectorPildoras opciones={s.opciones} seleccionado={s.pestana} onSeleccionar={s.setPestana} />
      {s.pestana === 'esperando' && s.urgentes.length > 0 && (
        <View style={styles.urgentes}>
          <TituloSeccion texto={T.urgentes} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filaUrgentes}>
            {s.urgentes.map((a) => (
              <TarjetaUrgenteSolidaria key={a.id} animal={a} onPress={() => atender(a.id)} />
            ))}
          </ScrollView>
        </View>
      )}
      <View style={styles.lista}>{lista()}</View>
      <Text style={styles.aviso}>{T.aviso}</Text>
    </PantallaLista>
  );
}
