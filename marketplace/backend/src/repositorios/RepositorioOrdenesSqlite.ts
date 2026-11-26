import { Orden, EstadoOrden, LineaOrden } from '../dominio/Orden';
import { BaseDatos } from './baseDatos';
import { RepositorioOrdenes } from './RepositorioOrdenes';

interface Fila {
  id: string; cliente_id: string; lineas: string; subtotal: number; descuento: number;
  total: number; metodo_pago: string; referencia_pago: string; estado: string; fecha: string;
}

export class RepositorioOrdenesSqlite implements RepositorioOrdenes {
  constructor(private readonly db: BaseDatos) {}

  guardar(o: Orden) {
    this.db.prepare(
      `INSERT INTO ordenes (id, cliente_id, lineas, subtotal, descuento, total, metodo_pago, referencia_pago, estado, fecha)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(o.id, o.clienteId, JSON.stringify(o.lineas), o.subtotal, o.descuento, o.total,
      o.metodoPago, o.referenciaPago, o.estado, o.fecha.toISOString());
  }

  porCliente(clienteId: string): Orden[] {
    const filas = this.db
      .prepare('SELECT * FROM ordenes WHERE cliente_id = ? ORDER BY fecha DESC')
      .all(clienteId) as Fila[];
    return filas.map((f) => new Orden(
      f.id, f.cliente_id, JSON.parse(f.lineas) as LineaOrden[], f.subtotal, f.descuento,
      f.total, f.metodo_pago, f.referencia_pago, f.estado as EstadoOrden, new Date(f.fecha),
    ));
  }
}
