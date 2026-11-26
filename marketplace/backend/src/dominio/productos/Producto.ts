import {
  CantidadInvalidaError, OpcionInvalidaError, StockInsuficienteError,
} from '../errores';
import { redondear } from '../utils';

export type Categoria = 'figura' | 'jersey' | 'poster' | 'manga';
export type Equipo =
  | 'Karasuno' | 'Nekoma' | 'Aoba Johsai' | 'Fukurodani'
  | 'Shiratorizawa' | 'Inarizaki';

export interface DatosProducto {
  id: string;
  nombre: string;
  descripcion: string;
  precioBase: number;
  stock: number;
  equipo: Equipo;
  personaje: string;
}

/**
 * ABSTRACCIÓN: contrato común de todo lo que se vende en la tienda.
 * ENCAPSULAMIENTO: precio y stock son privados; solo se cambian por métodos.
 * POLIMORFISMO: cada subclase define sus opciones, su multiplicador de precio
 * y su detalle; el carrito trabaja con `Producto` sin saber cuál es.
 */
export abstract class Producto {
  private readonly _id: string;
  private readonly _nombre: string;
  private readonly _descripcion: string;
  private readonly _precioBase: number;
  private readonly _equipo: Equipo;
  private readonly _personaje: string;
  private _stock: number;

  constructor(datos: DatosProducto) {
    this._id = datos.id;
    this._nombre = datos.nombre;
    this._descripcion = datos.descripcion;
    this._precioBase = datos.precioBase;
    this._stock = datos.stock;
    this._equipo = datos.equipo;
    this._personaje = datos.personaje;
  }

  get id() { return this._id; }
  get nombre() { return this._nombre; }
  get descripcion() { return this._descripcion; }
  get precioBase() { return this._precioBase; }
  get equipo() { return this._equipo; }
  get personaje() { return this._personaje; }
  get stock() { return this._stock; }

  /** Categoría del producto (la define cada subclase). */
  abstract get categoria(): Categoria;
  /** Etiqueta de la característica elegible (talla, tamaño, edición...). */
  abstract get etiquetaOpcion(): string;
  /** Opción -> multiplicador sobre el precio base. */
  protected abstract get multiplicadores(): Readonly<Record<string, number>>;
  /** Texto corto con los datos propios de cada tipo de producto. */
  abstract detalle(): string;

  get opciones(): string[] { return Object.keys(this.multiplicadores); }
  get opcionPorDefecto(): string { return this.opciones[0]; }

  validarOpcion(opcion?: string): string {
    if (opcion === undefined || opcion === '') return this.opcionPorDefecto;
    if (!this.opciones.includes(opcion)) throw new OpcionInvalidaError(opcion, this.opciones);
    return opcion;
  }

  /** Precio de una unidad con la opción elegida. */
  precioUnitario(opcion?: string): number {
    return redondear(this._precioBase * this.multiplicadores[this.validarOpcion(opcion)]);
  }

  hayStock(cantidad: number): boolean { return cantidad >= 1 && cantidad <= this._stock; }

  descontarStock(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad < 1) throw new CantidadInvalidaError();
    if (cantidad > this._stock) throw new StockInsuficienteError(this._nombre, this._stock);
    this._stock -= cantidad;
  }

  reponerStock(cantidad: number): void {
    if (!Number.isInteger(cantidad) || cantidad < 1) throw new CantidadInvalidaError();
    this._stock += cantidad;
  }
}
