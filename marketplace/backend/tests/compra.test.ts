import { describe, expect, it } from 'vitest';
import { CarritoVacioError, PagoRechazadoError, StockInsuficienteError } from '../src/dominio/errores';
import { FabricaPagos, PagoTarjeta } from '../src/dominio/pagos/metodos';
import { escenario } from './helpers';

describe('Compra / Orden', () => {
  it('CP9: genera una orden con tarjeta aprobada, descuenta stock y vacía el carrito', () => {
    const { carrito, catalogo, compra, ordenes } = escenario();
    const hinata = catalogo.obtener('f-hinata'); // stock 12
    carrito.agregar(hinata, 2);
    carrito.agregar(catalogo.obtener('m-01'), 1, 'Tapa dura');
    carrito.aplicarCupon('KARASUNO10');
    const totalEsperado = carrito.total;

    const orden = compra.comprar('cliente-1', carrito, new PagoTarjeta('4242 4242 4242 4242'));

    expect(orden.estado).toBe('pagada');
    expect(orden.total).toBe(totalEsperado);
    expect(orden.lineas).toHaveLength(2);
    expect(orden.referenciaPago).toMatch(/^TARJ-/);
    expect(hinata.stock).toBe(10);
    expect(carrito.estaVacio).toBe(true);
    expect(ordenes.porCliente('cliente-1')).toHaveLength(1);
  });

  it('CP10: un pago rechazado no crea orden, no descuenta stock y conserva el carrito', () => {
    const { carrito, catalogo, compra, ordenes } = escenario();
    const kageyama = catalogo.obtener('f-kageyama');
    carrito.agregar(kageyama, 1);
    expect(() => compra.comprar('cliente-1', carrito, new PagoTarjeta('4242 4242 4242 0000')))
      .toThrow(PagoRechazadoError);
    expect(() => compra.comprar('cliente-1', carrito, new PagoTarjeta('123')))
      .toThrow(PagoRechazadoError);
    expect(kageyama.stock).toBe(10);
    expect(carrito.items).toHaveLength(1);
    expect(ordenes.porCliente('cliente-1')).toHaveLength(0);
  });

  it('CP11: transferencia/efectivo generan orden pendiente de pago con referencia', () => {
    const { carrito, catalogo, compra } = escenario();
    carrito.agregar(catalogo.obtener('p-inarizaki'));
    const orden = compra.comprar('cliente-1', carrito, FabricaPagos.crear('transferencia'));
    expect(orden.estado).toBe('pendiente_pago');
    expect(orden.referenciaPago).toMatch(/^SPEI-/);
    expect(() => FabricaPagos.crear('bitcoin')).toThrow();
  });

  it('CP12: no se puede comprar con carrito vacío ni sin stock suficiente', () => {
    const { carrito, catalogo, compra } = escenario();
    expect(() => compra.comprar('cliente-1', carrito, FabricaPagos.crear('efectivo')))
      .toThrow(CarritoVacioError);

    const nishi = catalogo.obtener('f-nishinoya'); // stock 2
    carrito.agregar(nishi, 2);
    nishi.descontarStock(1); // alguien más compró uno mientras tanto
    expect(() => compra.comprar('cliente-1', carrito, FabricaPagos.crear('efectivo')))
      .toThrow(StockInsuficienteError);
  });
});
