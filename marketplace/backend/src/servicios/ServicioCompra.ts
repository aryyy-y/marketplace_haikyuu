import { randomUUID } from 'node:crypto';
import { Carrito } from '../dominio/Carrito';
import { CarritoVacioError, PagoRechazadoError, StockInsuficienteError } from '../dominio/errores';
import { MetodoPago } from '../dominio/pagos/MetodoPago';
import { Orden } from '../dominio/Orden';
import { RepositorioOrdenes } from '../repositorios/RepositorioOrdenes';
import { RepositorioProductos } from '../repositorios/RepositorioProductos';

/** Orquesta el checkout: valida stock, cobra, descuenta inventario y crea la orden. */
export class ServicioCompra {
  constructor(
    private readonly ordenes: RepositorioOrdenes,
    private readonly productos: RepositorioProductos,
  ) {}

  comprar(clienteId: string, carrito: Carrito, metodo: MetodoPago): Orden {
    if (carrito.estaVacio) throw new CarritoVacioError();

    // 1) Revalidar stock (pudo cambiar desde que se agregó al carrito).
    for (const item of carrito.items) {
      if (!item.producto.hayStock(item.cantidad)) {
        throw new StockInsuficienteError(item.producto.nombre, item.producto.stock);
      }
    }

    // 2) Cobrar (simulado). Si se rechaza no se toca nada.
    const pago = metodo.procesar(carrito.total);
    if (pago.estado === 'rechazado') throw new PagoRechazadoError(pago.mensaje);

    // 3) Descontar inventario y crear la orden.
    carrito.items.forEach((i) => {
      i.producto.descontarStock(i.cantidad);
      this.productos.guardar(i.producto);
    });
    const orden = new Orden(
      randomUUID(),
      clienteId,
      carrito.items.map((i) => ({
        productoId: i.producto.id,
        nombre: i.producto.nombre,
        opcion: i.opcion,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario,
        subtotal: i.subtotal,
      })),
      carrito.subtotal,
      carrito.descuento,
      carrito.total,
      metodo.nombre,
      pago.referencia,
      pago.estado === 'aprobado' ? 'pagada' : 'pendiente_pago',
    );
    this.ordenes.guardar(orden);
    carrito.vaciar();
    return orden;
  }
}
