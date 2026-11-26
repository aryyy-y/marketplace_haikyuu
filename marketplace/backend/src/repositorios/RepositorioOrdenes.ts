import { Orden } from '../dominio/Orden';

export interface RepositorioOrdenes {
  guardar(orden: Orden): void;
  porCliente(clienteId: string): Orden[];
}

export class RepositorioOrdenesMemoria implements RepositorioOrdenes {
  private readonly ordenes: Orden[] = [];
  guardar(orden: Orden) { this.ordenes.push(orden); }
  porCliente(clienteId: string) {
    return this.ordenes.filter((o) => o.clienteId === clienteId).reverse();
  }
}
