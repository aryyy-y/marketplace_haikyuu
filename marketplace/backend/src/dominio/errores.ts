/** Error base del dominio. Lleva un código HTTP sugerido para la capa API. */
export class ErrorDominio extends Error {
  constructor(mensaje: string, public readonly status: number = 400) {
    super(mensaje);
    this.name = new.target.name;
  }
}

export class ProductoNoEncontradoError extends ErrorDominio {
  constructor(id: string) { super(`Producto no encontrado: ${id}`, 404); }
}
export class ItemNoEncontradoError extends ErrorDominio {
  constructor(id: string) { super(`El carrito no tiene el ítem: ${id}`, 404); }
}
export class StockInsuficienteError extends ErrorDominio {
  constructor(nombre: string, disponible: number) {
    super(`Stock insuficiente para "${nombre}" (disponible: ${disponible})`, 409);
  }
}
export class CantidadInvalidaError extends ErrorDominio {
  constructor() { super('La cantidad debe ser un entero mayor o igual a 1'); }
}
export class OpcionInvalidaError extends ErrorDominio {
  constructor(opcion: string, validas: readonly string[]) {
    super(`Opción "${opcion}" no válida. Opciones: ${validas.join(', ')}`);
  }
}
export class CuponInvalidoError extends ErrorDominio {
  constructor(codigo: string) { super(`Cupón no válido: ${codigo}`); }
}
export class CarritoVacioError extends ErrorDominio {
  constructor() { super('El carrito está vacío'); }
}
export class PagoRechazadoError extends ErrorDominio {
  constructor(motivo: string) { super(`Pago rechazado: ${motivo}`, 402); }
}
