// Valor "comodín" para llamar funciones en las pruebas sin armar cada argumento:
// sirve como número (1), como texto ("1"), como objeto (cualquier propiedad es otro
// comodín) y como lista vacía.
const lista: unknown[] = []

export const comodin = new Proxy(function () {}, {
  get: (_, prop) => {
    if (prop === Symbol.toPrimitive) return (tipo: string) => (tipo === 'number' ? 1 : '1')
    if (prop === Symbol.iterator) return lista[Symbol.iterator].bind(lista)
    if (prop === 'then') return undefined
    if (prop === 'length') return 0
    if (typeof prop === 'string' && prop in Array.prototype) {
      const metodo = (Array.prototype as unknown as Record<string, unknown>)[prop]
      return typeof metodo === 'function' ? metodo.bind(lista) : metodo
    }
    if (prop === 'trim' || prop === 'toLowerCase' || prop === 'toUpperCase') return () => '1'
    return comodin
  },
  apply: () => comodin,
}) as never
