import { randomUUID } from 'node:crypto';
import { ErrorDominio } from '../errores';
import { MetodoPago, ResultadoPago } from './MetodoPago';

const ref = (prefijo: string) => `${prefijo}-${randomUUID().slice(0, 8).toUpperCase()}`;

/** Aprueba al instante. Rechaza tarjetas inválidas o que terminan en 0000. */
export class PagoTarjeta implements MetodoPago {
  readonly nombre = 'Tarjeta';
  private readonly numero: string;

  constructor(numero: string) { this.numero = numero.replace(/\s|-/g, ''); }

  procesar(_monto: number): ResultadoPago {
    if (!/^\d{16}$/.test(this.numero)) {
      return { estado: 'rechazado', referencia: '', mensaje: 'Número de tarjeta inválido' };
    }
    if (this.numero.endsWith('0000')) {
      return { estado: 'rechazado', referencia: '', mensaje: 'Fondos insuficientes' };
    }
    return { estado: 'aprobado', referencia: ref('TARJ'), mensaje: 'Pago aprobado' };
  }
}

/** Genera una referencia; el pago queda pendiente hasta confirmarse. */
export class PagoTransferencia implements MetodoPago {
  readonly nombre = 'Transferencia';
  procesar(_monto: number): ResultadoPago {
    return { estado: 'pendiente', referencia: ref('SPEI'), mensaje: 'Esperando transferencia' };
  }
}

export class PagoEfectivo implements MetodoPago {
  readonly nombre = 'Efectivo (tienda)';
  procesar(_monto: number): ResultadoPago {
    return { estado: 'pendiente', referencia: ref('EFEC'), mensaje: 'Paga en tienda con tu referencia' };
  }
}

export class FabricaPagos {
  static crear(tipo: string, datos: { numeroTarjeta?: string } = {}): MetodoPago {
    switch (tipo) {
      case 'tarjeta': return new PagoTarjeta(datos.numeroTarjeta ?? '');
      case 'transferencia': return new PagoTransferencia();
      case 'efectivo': return new PagoEfectivo();
      default: throw new ErrorDominio(`Método de pago no soportado: ${tipo}`);
    }
  }
}
