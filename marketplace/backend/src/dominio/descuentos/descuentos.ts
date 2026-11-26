import { CuponInvalidoError } from '../errores';
import { redondear } from '../utils';
import { EstrategiaDescuento } from './EstrategiaDescuento';

export class SinDescuento implements EstrategiaDescuento {
  readonly codigo = '';
  readonly descripcion = 'Sin descuento';
  calcular(): number { return 0; }
}

export class DescuentoPorcentaje implements EstrategiaDescuento {
  constructor(
    readonly codigo: string,
    readonly descripcion: string,
    private readonly porcentaje: number,
  ) {}
  calcular(subtotal: number): number { return redondear(subtotal * this.porcentaje / 100); }
}

export class DescuentoMontoFijo implements EstrategiaDescuento {
  constructor(
    readonly codigo: string,
    readonly descripcion: string,
    private readonly monto: number,
  ) {}
  calcular(subtotal: number): number { return Math.min(this.monto, subtotal); }
}

/** Fábrica de cupones disponibles. Agregar uno nuevo = agregar una línea. */
export class FabricaDescuentos {
  private static readonly cupones: EstrategiaDescuento[] = [
    new DescuentoPorcentaje('KARASUNO10', '10 % de descuento — Equipo Karasuno', 10),
    new DescuentoPorcentaje('NEKOMA15', '15 % de descuento — Equipo Nekoma', 15),
    new DescuentoMontoFijo('VOLEY100', '$100 de descuento', 100),
  ];

  static porCodigo(codigo: string): EstrategiaDescuento {
    const c = this.cupones.find((x) => x.codigo === codigo.trim().toUpperCase());
    if (!c) throw new CuponInvalidoError(codigo);
    return c;
  }
}
