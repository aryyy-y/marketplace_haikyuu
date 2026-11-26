export type EstadoPago = 'aprobado' | 'pendiente' | 'rechazado';

export interface ResultadoPago {
  estado: EstadoPago;
  referencia: string;
  mensaje: string;
}

/** Contrato de los pagos simulados (no hay pasarela real). */
export interface MetodoPago {
  readonly nombre: string;
  procesar(monto: number): ResultadoPago;
}
