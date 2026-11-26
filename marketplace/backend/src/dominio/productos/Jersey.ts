import { Categoria, DatosProducto, Producto } from './Producto';

/** Jersey de un equipo, con número de jugador. XG cuesta 10 % más. */
export class Jersey extends Producto {
  constructor(datos: DatosProducto, public readonly numero: number) { super(datos); }

  get categoria(): Categoria { return 'jersey'; }
  get etiquetaOpcion() { return 'Talla'; }
  protected get multiplicadores() {
    return { 'CH': 1, 'M': 1, 'G': 1, 'XG': 1.1 };
  }
  detalle() { return `${this.equipo} · Número ${this.numero}`; }
}
