import { describe, expect, it } from 'vitest';
import { Carrito } from '../src/dominio/Carrito';
import { Catalogo } from '../src/dominio/Catalogo';
import { crearProductosIniciales } from '../src/datos/semilla';
import { PagoTarjeta } from '../src/dominio/pagos/metodos';
import { abrirBaseDatos } from '../src/repositorios/baseDatos';
import { RepositorioOrdenesSqlite } from '../src/repositorios/RepositorioOrdenesSqlite';
import { RepositorioProductosSqlite } from '../src/repositorios/RepositorioProductosSqlite';
import { ServicioCompra } from '../src/servicios/ServicioCompra';

describe('Persistencia en SQLite', () => {
  it('CP13: la orden y el stock se guardan y sobreviven a un "reinicio" del servidor', () => {
    const db = abrirBaseDatos(':memory:');
    const productos = new RepositorioProductosSqlite(db, crearProductosIniciales());
    const ordenes = new RepositorioOrdenesSqlite(db);
    const compra = new ServicioCompra(ordenes, productos);

    const carrito = new Carrito('cli-1');
    carrito.agregar(new Catalogo(productos).obtener('j-karasuno'), 2, 'XG');
    const orden = compra.comprar('cli-1', carrito, new PagoTarjeta('4242424242424242'));

    // "Reinicio": nuevos repositorios sobre la misma base.
    const productos2 = new RepositorioProductosSqlite(db, crearProductosIniciales());
    const ordenes2 = new RepositorioOrdenesSqlite(db);
    expect(productos2.obtener('j-karasuno')!.stock).toBe(13); // 15 - 2
    expect(productos2.obtener('j-karasuno')!.detalle()).toBe('Karasuno · Número 10');
    const guardadas = ordenes2.porCliente('cli-1');
    expect(guardadas).toHaveLength(1);
    expect(guardadas[0].id).toBe(orden.id);
    expect(guardadas[0].lineas[0].opcion).toBe('XG');
    expect(guardadas[0].total).toBe(orden.total);
  });
});
