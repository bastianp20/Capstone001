// Renderiza un componente con todo lo que la app pone alrededor (main.tsx):
// rutas, sesión y confirmaciones.
// Espera a que terminen de llegar los datos (del Supabase falso) antes de devolver:
//   await renderizar(<MiPantalla />)
//   await renderizar(<App />, { ruta: '/panel', usuario: usuarioDePrueba('dueno') })
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { vi } from 'vitest'
import type { UsuarioActual } from '../interfaces'
import { comodin } from './comodin'
import { EsperarSesion, Proveedores } from './Proveedores'
import { iniciarSesion } from './supabaseFalso'

interface Opciones {
  ruta?: string
  usuario?: UsuarioActual
}

// Deja pasar unos instantes para que se resuelvan las consultas y se redibuje.
const esperarUnMomento = () => act(() => new Promise((listo) => setTimeout(listo, 30)))

// Espera hasta que la pantalla deje de cambiar (en un computador lento o con muchas
// pruebas a la vez las consultas tardan más; si no, el snapshot saldría a medio cargar).
export const esperarCarga = async () => {
  let antes = ''
  for (let intento = 0; intento < 40; intento++) {
    await esperarUnMomento()
    const ahora = document.body.innerHTML
    if (intento > 0 && ahora === antes) return
    antes = ahora
  }
}

export const renderizar = async (ui: ReactElement, { ruta = '/', usuario }: Opciones = {}) => {
  if (usuario) iniciarSesion(usuario)
  const resultado = render(
    <Proveedores ruta={ruta}>
      <EsperarSesion>{ui}</EsperarSesion>
    </Proveedores>,
  )
  await esperarCarga()
  return resultado
}

// Botones de los menús (<nav>) de la pantalla, sin "Cerrar sesión".
export const botonesDelMenu = () =>
  screen
    .queryAllByRole('navigation')
    .flatMap((menu) => within(menu).queryAllByRole('button'))
    .filter((boton) => !/cerrar sesi|salir/i.test(boton.textContent ?? ''))

// Aprieta cada opción del menú, una por una, y devuelve el texto de cada sección.
// Si el menú no usa <nav>, se le pasa cómo encontrar sus opciones.
export const recorrerMenu = async (opciones: () => HTMLElement[] = botonesDelMenu) => {
  const secciones: string[] = []
  const total = opciones().length
  for (let i = 0; i < total; i++) {
    const boton = opciones()[i]
    if (!boton) break
    fireEvent.click(boton)
    await esperarCarga()
    secciones.push(boton.textContent ?? '')
  }
  return secciones
}

// Props de relleno: cualquier prop que el componente lea es un comodín.
const propsDeRelleno = new Proxy({}, { get: (_, prop) => (prop === 'children' ? null : comodin) })

// Dibuja un componente dándole props de relleno (sirve para revisar que se dibuje sin romperse).
//   await renderizarConRelleno(MiComponente)
// React reclama por consola cuando un comodín llega a la pantalla: esos avisos se callan.
export const renderizarConRelleno = async (Componente: (props: never) => ReactNode, opciones?: Opciones) => {
  const ConRelleno = () => Componente(propsDeRelleno as never)
  const avisos = vi.spyOn(console, 'error').mockImplementation(() => {})
  try {
    return await renderizar(<ConRelleno />, opciones)
  } finally {
    avisos.mockRestore()
  }
}
