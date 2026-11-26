import { Carrito } from '../dominio/Carrito';

/** Un carrito por cliente (el id lo genera el navegador). */
export class RepositorioCarritos {
  private readonly carritos = new Map<string, Carrito>();
  obtenerOCrear(clienteId: string): Carrito {
    let c = this.carritos.get(clienteId);
    if (!c) { c = new Carrito(clienteId); this.carritos.set(clienteId, c); }
    return c;
  }
}
