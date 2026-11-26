/** Patrón Strategy: cada cupón calcula su descuento a su manera (OCP). */
export interface EstrategiaDescuento {
  readonly codigo: string;
  readonly descripcion: string;
  calcular(subtotal: number): number;
}
