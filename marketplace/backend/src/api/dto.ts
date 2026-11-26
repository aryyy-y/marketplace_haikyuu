import { Carrito } from '../dominio/Carrito';
import { Orden } from '../dominio/Orden';
import { Producto } from '../dominio/productos/Producto';

export const productoDTO = (p: Producto) => ({
  id: p.id,
  nombre: p.nombre,
  descripcion: p.descripcion,
  categoria: p.categoria,
  equipo: p.equipo,
  personaje: p.personaje,
  detalle: p.detalle(),
  precioBase: p.precioBase,
  stock: p.stock,
  etiquetaOpcion: p.etiquetaOpcion,
  opciones: p.opciones.map((o) => ({ nombre: o, precio: p.precioUnitario(o) })),
});

export const carritoDTO = (c: Carrito) => ({
  items: c.items.map((i) => ({
    id: i.id,
    producto: productoDTO(i.producto),
    opcion: i.opcion,
    cantidad: i.cantidad,
    precioUnitario: i.precioUnitario,
    subtotal: i.subtotal,
  })),
  piezas: c.cantidadPiezas,
  cupon: c.cupon.codigo ? { codigo: c.cupon.codigo, descripcion: c.cupon.descripcion } : null,
  subtotal: c.subtotal,
  descuento: c.descuento,
  total: c.total,
});

export const ordenDTO = (o: Orden) => ({
  id: o.id,
  lineas: o.lineas,
  subtotal: o.subtotal,
  descuento: o.descuento,
  total: o.total,
  metodoPago: o.metodoPago,
  referenciaPago: o.referenciaPago,
  estado: o.estado,
  fecha: o.fecha.toISOString(),
});
