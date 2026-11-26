import { CantidadInvalidaError, StockInsuficienteError } from './errores';
import { Producto } from './productos/Producto';
import { redondear } from './utils';

/** Una línea del carrito: un producto + una opción elegida + una cantidad. */
export class ItemCarrito {
  private _cantidad: number;
  private _opcion: string;

  constructor(
    readonly id: string,
    readonly producto: Producto,
    cantidad: number,
    opcion: string,
  ) {
    this._opcion = producto.validarOpcion(opcion);
    this._cantidad = this.validarCantidad(cantidad);
  }

  get cantidad() { return this._cantidad; }
  get opcion() { return this._opcion; }
  get precioUnitario() { return this.producto.precioUnitario(this._opcion); }
  get subtotal() { return redondear(this.precioUnitario * this._cantidad); }

  cambiarCantidad(cantidad: number): void { this._cantidad = this.validarCantidad(cantidad); }
  cambiarOpcion(opcion: string): void { this._opcion = this.producto.validarOpcion(opcion); }

  private validarCantidad(cantidad: number): number {
    if (!Number.isInteger(cantidad) || cantidad < 1) throw new CantidadInvalidaError();
    if (!this.producto.hayStock(cantidad)) {
      throw new StockInsuficienteError(this.producto.nombre, this.producto.stock);
    }
    return cantidad;
  }
}
