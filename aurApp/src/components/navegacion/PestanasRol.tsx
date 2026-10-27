import { Tabs } from 'expo-router/js-tabs';

import type { PestanasRolProps } from '@/interfaces';

import { BarraNavegacion } from './BarraNavegacion';

/** Pestañas de un rol con la barra flotante. Cada _layout de pestañas solo le pasa su lista. */
export function PestanasRol({ pestanas }: PestanasRolProps) {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BarraNavegacion {...props} pestanas={pestanas} />}>
      {pestanas.map((p) => (
        <Tabs.Screen key={p.nombreRuta} name={p.nombreRuta} options={{ title: p.titulo }} />
      ))}
    </Tabs>
  );
}
