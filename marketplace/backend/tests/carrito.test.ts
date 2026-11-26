import { describe, expect, it } from 'vitest';
import { CantidadInvalidaError, ItemNoEncontradoError, OpcionInvalidaError, StockInsuficienteError } from '../src/dominio/errores';
import { escenario } from './helpers';

describe('Carrito', () => {
  it('CP1: agrega productos al carrito y suma cantidades del mismo producto/opción', () => {
    const { carrito, catalogo } = escenario();
    const hinata = catalogo.obtener('f-hinata');
    carrito.agregar(hinata, 1);
    carrito.agregar(hinata, 2);
    expect(carrito.items).toHaveLength(1);
    expect(carrito.items[0].cantidad).toBe(3);
    carrito.agregar(hinata, 1, 'Edición coleccionista'); // opción distinta = ítem distinto
    expect(carrito.items).toHaveLength(2);
  });

  it('CP2: elimina productos del carrito', () => {
    const { carrito, catalogo } = escenario();
    const item = carrito.agregar(catalogo.obtener('m-01'));
    carrito.agregar(catalogo.obtener('p-karasuno'));
    carrito.eliminar(item.id);
    expect(carrito.items).toHaveLength(1);
    expect(() => carrito.eliminar(item.id)).toThrow(ItemNoEncontradoError);
  });

  it('CP3: modifica cantidades y rechaza valores inválidos o sobre el stock', () => {
    const { carrito, catalogo } = escenario();
    const item = carrito.agregar(catalogo.obtener('f-nishinoya')); // stock 2
    carrito.modificarCantidad(item.id, 2);
    expect(item.cantidad).toBe(2);
    expect(() => carrito.modificarCantidad(item.id, 3)).toThrow(StockInsuficienteError);
    expect(() => carrito.modificarCantidad(item.id, 0)).toThrow(CantidadInvalidaError);
    expect(() => carrito.modificarCantidad(item.id, 1.5)).toThrow(CantidadInvalidaError);
  });

  it('CP4: modifica características (talla) y recalcula el precio; XG cuesta +10 %', () => {
    const { carrito, catalogo } = escenario();
    const item = carrito.agregar(catalogo.obtener('j-karasuno'), 1, 'M');
    expect(item.subtotal).toBe(899);
    carrito.cambiarOpcion(item.id, 'XG');
    expect(item.opcion).toBe('XG');
    expect(item.subtotal).toBe(988.9);
    expect(() => carrito.cambiarOpcion(item.id, 'XXXL')).toThrow(OpcionInvalidaError);
  });

  it('CP5: calcula subtotales y total correctamente', () => {
    const { carrito, catalogo } = escenario();
    carrito.agregar(catalogo.obtener('f-hinata'), 2);                 // 549 x 2 = 1098
    carrito.agregar(catalogo.obtener('p-karasuno'), 1, 'A2');         // 199 x 1.5 = 298.5
    carrito.agregar(catalogo.obtener('m-01'), 3, 'Tapa dura');        // 189 x 1.4 = 264.6 x 3 = 793.8
    expect(carrito.items.map((i) => i.subtotal)).toEqual([1098, 298.5, 793.8]);
    expect(carrito.subtotal).toBe(2190.3);
    expect(carrito.total).toBe(2190.3);
  });

  it('CP6: aplica cupones (porcentaje y monto fijo) y rechaza los inválidos', () => {
    const { carrito, catalogo } = escenario();
    carrito.agregar(catalogo.obtener('j-nekoma'), 2); // 1798
    carrito.aplicarCupon('karasuno10');
    expect(carrito.descuento).toBe(179.8);
    expect(carrito.total).toBe(1618.2);
    carrito.aplicarCupon('VOLEY100');
    expect(carrito.total).toBe(1698);
    expect(() => carrito.aplicarCupon('NOEXISTE')).toThrow();
  });
});
