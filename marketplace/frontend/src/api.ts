import type { Carrito, Filtros, Orden, Producto } from './types'

function clienteId(): string {
  let id = localStorage.getItem('haikyuu-client-id')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('haikyuu-client-id', id)
  }
  return id
}

async function peticion<T>(ruta: string, metodo = 'GET', cuerpo?: unknown): Promise<T> {
  const res = await fetch(`/api${ruta}`, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', 'x-client-id': clienteId() },
    body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
  })
  const datos = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(datos.error ?? 'Error de conexión con el servidor')
  return datos as T
}

export const api = {
  productos: (f: Filtros) => {
    const p = new URLSearchParams()
    if (f.q) p.set('q', f.q)
    if (f.categoria) p.set('categoria', f.categoria)
    if (f.equipo) p.set('equipo', f.equipo)
    return peticion<Producto[]>(`/productos?${p}`)
  },
  filtros: () => peticion<{ categorias: string[]; equipos: string[] }>('/filtros'),
  carrito: () => peticion<Carrito>('/carrito'),
  agregar: (productoId: string, opcion: string, cantidad = 1) =>
    peticion<Carrito>('/carrito/items', 'POST', { productoId, opcion, cantidad }),
  cambiar: (itemId: string, cambios: { cantidad?: number; opcion?: string }) =>
    peticion<Carrito>(`/carrito/items/${itemId}`, 'PATCH', cambios),
  quitar: (itemId: string) => peticion<Carrito>(`/carrito/items/${itemId}`, 'DELETE'),
  cupon: (codigo: string) => peticion<Carrito>('/carrito/cupon', 'POST', { codigo }),
  quitarCupon: () => peticion<Carrito>('/carrito/cupon', 'DELETE'),
  comprar: (metodoPago: string, numeroTarjeta?: string) =>
    peticion<Orden>('/ordenes', 'POST', { metodoPago, numeroTarjeta }),
}
