import { View } from 'react-native';

import { barraFiltrosStyles as styles } from '@/css/Compartido';
import type { BarraFiltrosProps } from '@/interfaces';

import { CampoBusqueda } from './CampoBusqueda';
import { SelectorPildoras } from './SelectorPildoras';

/**
 * Buscador + chips de categoría. Se usa junto a useFiltro:
 *   <BarraFiltros busqueda={busqueda} onBuscar={setBusqueda} filtro={filtro} onFiltrar={setFiltro}
 *     opciones={[{ valor: 'proximas', texto: 'Próximas', cantidad: cantidad('proximas') }, …]} />
 */
export function BarraFiltros<F extends string>({ busqueda, onBuscar, placeholder, opciones, filtro, onFiltrar }: BarraFiltrosProps<F>) {
  return (
    <View style={styles.contenedor}>
      <CampoBusqueda valor={busqueda} onCambiar={onBuscar} placeholder={placeholder} />
      <SelectorPildoras opciones={opciones} seleccionado={filtro} onSeleccionar={onFiltrar} variante="claro" />
    </View>
  );
}
