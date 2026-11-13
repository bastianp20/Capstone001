// Ayudas para probar hooks:
//   const { result } = await montarHook(() => useMiHook(1))
//   await usarAcciones(result.current)   // prueba cada función que devuelve el hook
//   conComodines(useMiHook)              // lo llama con datos de relleno
import { act, renderHook } from '@testing-library/react'
import { comodin } from './comodin'
import { Proveedores } from './Proveedores'
import { esperarCarga } from './renderizar'

// Llama al hook con valores de relleno (comodín) en todos sus parámetros
export const conComodines = <T,>(usarHook: (...args: never[]) => T): T => usarHook(comodin, comodin, comodin, comodin)

export const montarHook = async <T,>(usarHook: () => T) => {
  const resultado = renderHook(usarHook, { wrapper: Proveedores })
  await esperarCarga()
  return resultado
}

// Lo que devuelve el hook sin las funciones (para el snapshot del estado inicial)
export const estadoDe = (valor: unknown) =>
  valor && typeof valor === 'object'
    ? Object.fromEntries(Object.entries(valor).filter(([, v]) => typeof v !== 'function'))
    : valor

// Llama una vez a cada función que devuelve el hook. Devuelve sus nombres.
export const usarAcciones = async (valor: unknown) => {
  if (!valor || typeof valor !== 'object') return []
  const acciones = Object.entries(valor).filter(([, v]) => typeof v === 'function') as [string, (...a: unknown[]) => unknown][]
  for (const [, accion] of acciones) {
    await act(async () => {
      try {
        // Algunas acciones esperan una confirmación que nadie responde: no se espera más de un momento
        await Promise.race([accion(comodin, comodin), new Promise((listo) => setTimeout(listo, 50))])
      } catch {
        // Con datos de relleno algunas acciones fallan a propósito (validaciones): no importa aquí
      }
    })
  }
  await esperarCarga()
  return acciones.map(([nombre]) => nombre)
}
