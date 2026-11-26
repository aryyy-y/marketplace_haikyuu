import { Producto } from '../dominio/productos/Producto';

export interface RepositorioProductos {
  listar(): Producto[];
  obtener(id: string): Producto | undefined;
  /** Persiste los cambios del producto (por ejemplo, el stock tras una compra). */
  guardar(producto: Producto): void;
}

export class RepositorioProductosMemoria implements RepositorioProductos {
  private readonly productos = new Map<string, Producto>();
  constructor(iniciales: Producto[] = []) { iniciales.forEach((p) => this.productos.set(p.id, p)); }
  listar() { return [...this.productos.values()]; }
  obtener(id: string) { return this.productos.get(id); }
  guardar(producto: Producto) { this.productos.set(producto.id, producto); }
}
