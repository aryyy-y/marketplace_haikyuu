import { Catalogo } from '../src/dominio/Catalogo';
import { Carrito } from '../src/dominio/Carrito';
import { crearProductosIniciales } from '../src/datos/semilla';
import { RepositorioOrdenesMemoria } from '../src/repositorios/RepositorioOrdenes';
import { RepositorioProductosMemoria } from '../src/repositorios/RepositorioProductos';
import { ServicioCompra } from '../src/servicios/ServicioCompra';

/** Escenario limpio para cada prueba (catálogo nuevo, carrito vacío). */
export function escenario() {
  const productos = new RepositorioProductosMemoria(crearProductosIniciales());
  const catalogo = new Catalogo(productos);
  const ordenes = new RepositorioOrdenesMemoria();
  return { catalogo, ordenes, compra: new ServicioCompra(ordenes, productos), carrito: new Carrito('cliente-1') };
}
