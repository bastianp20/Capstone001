import { useEffect, useState } from 'react';

import { useAuth } from '@/Auth/AuthContext';

import { useFuentesAuraPet } from './useFuentesAuraPet';

/**
 * true cuando la app ya puede mostrarse: fuentes cargadas y sesión inicial recuperada.
 * Solo espera la primera vez; después, ingresar o salir no vuelve a mostrar la pantalla de carga.
 */
export function useArranqueApp() {
  const fuentesListas = useFuentesAuraPet();
  const { cargando } = useAuth();
  const [sesionInicialLista, setSesionInicialLista] = useState(false);

  useEffect(() => {
    if (!cargando) setSesionInicialLista(true);
  }, [cargando]);

  return fuentesListas && sesionInicialLista;
}
