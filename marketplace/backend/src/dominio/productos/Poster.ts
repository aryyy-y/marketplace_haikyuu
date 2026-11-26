import { Categoria, DatosProducto, Producto } from './Producto';

/** Póster impreso; el precio crece con el tamaño. */
export class Poster extends Producto {
  constructor(datos: DatosProducto, public readonly acabado: string) { super(datos); }

  get categoria(): Categoria { return 'poster'; }
  get etiquetaOpcion() { return 'Tamaño'; }
  protected get multiplicadores() {
    return { 'A3': 1, 'A2': 1.5, 'A1': 2.2 };
  }
  detalle() { return `Acabado ${this.acabado}`; }
}
