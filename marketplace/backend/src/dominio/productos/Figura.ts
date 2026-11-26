import { Categoria, DatosProducto, Producto } from './Producto';

/** Figura coleccionable de un personaje. */
export class Figura extends Producto {
  constructor(datos: DatosProducto, public readonly alturaCm: number) { super(datos); }

  get categoria(): Categoria { return 'figura'; }
  get etiquetaOpcion() { return 'Edición'; }
  protected get multiplicadores() {
    return { 'Estándar': 1, 'Edición coleccionista': 1.6 };
  }
  detalle() { return `${this.alturaCm} cm · PVC pintado a mano`; }
}
