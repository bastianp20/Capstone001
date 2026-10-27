import { router } from 'expo-router';
import { View } from 'react-native';

import { TarjetaPaciente } from '@/components/veterinario/TarjetaPaciente';
import { BarraFiltros } from '@/components/ui/BarraFiltros';
import { EncabezadoPagina } from '@/components/ui/EncabezadoPagina';
import { EstadoCarga } from '@/components/ui/EstadoCarga';
import { EstadoVacio } from '@/components/ui/EstadoVacio';
import { PantallaLista } from '@/components/ui/PantallaLista';
import { TEXTOS_CARGA, TEXTOS_PACIENTES as T } from '@/constants/constants';
import { listaGruposStyles as styles } from '@/css/Compartido';
import { useBarraEstadoClara } from '@/hooks/useBarraEstadoClara';
import { usePacientes } from '@/hooks/usePacientes';

export default function PacientesScreen() {
  useBarraEstadoClara();
  const p = usePacientes();

  const contenido = () => {
    if (p.cargando) return <EstadoCarga />;
    if (p.error) return <EstadoVacio icono="cancelar" titulo={p.error} textoAccion={TEXTOS_CARGA.reintentar} onAccion={p.recargar} />;
    if (!p.hayPacientes) return <EstadoVacio icono="huella" titulo={T.vacio} detalle={T.vacioDetalle} />;
    if (!p.visibles.length) return <EstadoVacio icono="buscar" titulo={T.sinResultados} />;
    return (
      <View style={styles.grupo}>
        {p.visibles.map((paciente) => (
          <TarjetaPaciente
            key={paciente.id}
            paciente={paciente}
            onPress={() => router.push({ pathname: '/veterinario/paciente/[id]', params: { id: paciente.id } })}
          />
        ))}
      </View>
    );
  };

  return (
    <PantallaLista recargando={p.recargando} onRecargar={p.recargar} encabezado={<EncabezadoPagina titulo={T.titulo} />}>
      {p.hayPacientes && (
        <BarraFiltros
          busqueda={p.busqueda}
          onBuscar={p.setBusqueda}
          placeholder={T.buscar}
          opciones={p.opciones}
          filtro={p.filtro}
          onFiltrar={p.setFiltro}
        />
      )}
      {contenido()}
    </PantallaLista>
  );
}
