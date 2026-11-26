import { Categoria, DatosProducto, Producto } from './Producto';

/** Tomo del manga. */
export class Manga extends Producto {
  constructor(datos: DatosProducto, public readonly tomo: number) { super(datos); }

  get categoria(): Categoria { return 'manga'; }
  get etiquetaOpcion() { return 'Encuadernación'; }
  protected get multiplicadores() {
    return { 'Tapa blanda': 1, 'Tapa dura': 1.4 };
  }
  detalle() { return `Tomo ${this.tomo}`; }
}
