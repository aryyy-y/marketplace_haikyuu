import { randomUUID } from 'node:crypto';
import { EstrategiaDescuento } from './descuentos/EstrategiaDescuento';
import { FabricaDescuentos, SinDescuento } from './descuentos/descuentos';
import { ItemNoEncontradoError } from './errores';
import { ItemCarrito } from './ItemCarrito';
import { Producto } from './productos/Producto';
import { redondear } from './utils';

/**
 * COMPOSICIÓN: el carrito se compone de ítems (que no existen sin él) y de una
 * estrategia de descuento. Los ítems solo se manipulan a través del carrito.
 */
export class Carrito {
  private readonly _items = new Map<string, ItemCarrito>();
  private _descuento: EstrategiaDescuento = new SinDescuento();

  constructor(readonly id: string) {}

  get items(): ItemCarrito[] { return [...this._items.values()]; }
  get estaVacio() { return this._items.size === 0; }
  get cupon(): EstrategiaDescuento { return this._descuento; }
  get cantidadPiezas() { return this.items.reduce((n, i) => n + i.cantidad, 0); }

  /** Agrega un producto; si ya existe con la misma opción, suma cantidades. */
  agregar(producto: Producto, cantidad = 1, opcion?: string): ItemCarrito {
    const op = producto.validarOpcion(opcion);
    const existente = this.buscarIgual(producto.id, op);
    if (existente) {
      existente.cambiarCantidad(existente.cantidad + cantidad);
      return existente;
    }
    const item = new ItemCarrito(randomUUID(), producto, cantidad, op);
    this._items.set(item.id, item);
    return item;
  }

  eliminar(itemId: string): void {
    if (!this._items.delete(itemId)) throw new ItemNoEncontradoError(itemId);
  }

  modificarCantidad(itemId: string, cantidad: number): ItemCarrito {
    const item = this.obtener(itemId);
    item.cambiarCantidad(cantidad);
    return item;
  }

  /** Cambia talla/tamaño/edición. Si ya hay un ítem igual, los fusiona. */
  cambiarOpcion(itemId: string, opcion: string): ItemCarrito {
    const item = this.obtener(itemId);
    const op = item.producto.validarOpcion(opcion);
    const otro = this.buscarIgual(item.producto.id, op, item.id);
    if (otro) {
      otro.cambiarCantidad(otro.cantidad + item.cantidad);
      this._items.delete(item.id);
      return otro;
    }
    item.cambiarOpcion(op);
    return item;
  }

  aplicarCupon(codigo: string): void { this._descuento = FabricaDescuentos.porCodigo(codigo); }
  quitarCupon(): void { this._descuento = new SinDescuento(); }
  vaciar(): void { this._items.clear(); this.quitarCupon(); }

  get subtotal(): number {
    return redondear(this.items.reduce((suma, i) => suma + i.subtotal, 0));
  }
  get descuento(): number {
    return Math.min(this._descuento.calcular(this.subtotal), this.subtotal);
  }
  get total(): number { return redondear(this.subtotal - this.descuento); }

  private obtener(itemId: string): ItemCarrito {
    const item = this._items.get(itemId);
    if (!item) throw new ItemNoEncontradoError(itemId);
    return item;
  }

  private buscarIgual(productoId: string, opcion: string, excluirId?: string) {
    return this.items.find(
      (i) => i.producto.id === productoId && i.opcion === opcion && i.id !== excluirId,
    );
  }
}
