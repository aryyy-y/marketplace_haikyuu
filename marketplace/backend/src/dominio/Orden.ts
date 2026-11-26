export type EstadoOrden = 'pagada' | 'pendiente_pago';

/** Copia (snapshot) de un ítem al momento de la compra. */
export interface LineaOrden {
  productoId: string;
  nombre: string;
  opcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/** Orden de compra inmutable: no cambia aunque cambie el catálogo después. */
export class Orden {
  constructor(
    readonly id: string,
    readonly clienteId: string,
    readonly lineas: readonly LineaOrden[],
    readonly subtotal: number,
    readonly descuento: number,
    readonly total: number,
    readonly metodoPago: string,
    readonly referenciaPago: string,
    readonly estado: EstadoOrden,
    readonly fecha: Date = new Date(),
  ) {}
}
