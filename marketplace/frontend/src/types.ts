export interface Opcion { nombre: string; precio: number }

export interface Producto {
  id: string
  nombre: string
  descripcion: string
  categoria: 'figura' | 'jersey' | 'poster' | 'manga'
  equipo: string
  personaje: string
  detalle: string
  precioBase: number
  stock: number
  etiquetaOpcion: string
  opciones: Opcion[]
}

export interface ItemCarrito {
  id: string
  producto: Producto
  opcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Carrito {
  items: ItemCarrito[]
  piezas: number
  cupon: { codigo: string; descripcion: string } | null
  subtotal: number
  descuento: number
  total: number
}

export interface LineaOrden {
  productoId: string
  nombre: string
  opcion: string
  cantidad: number
  precioUnitario: number
  subtotal: number
}

export interface Orden {
  id: string
  lineas: LineaOrden[]
  subtotal: number
  descuento: number
  total: number
  metodoPago: string
  referenciaPago: string
  estado: 'pagada' | 'pendiente_pago'
  fecha: string
}

export interface Filtros { q: string; categoria: string; equipo: string }
