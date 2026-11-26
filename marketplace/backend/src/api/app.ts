import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { Carrito } from '../dominio/Carrito';
import { Catalogo } from '../dominio/Catalogo';
import { ErrorDominio } from '../dominio/errores';
import { FabricaPagos } from '../dominio/pagos/metodos';
import { Categoria, Equipo } from '../dominio/productos/Producto';
import { RepositorioCarritos } from '../repositorios/RepositorioCarritos';
import { RepositorioOrdenes } from '../repositorios/RepositorioOrdenes';
import { ServicioCompra } from '../servicios/ServicioCompra';
import { carritoDTO, ordenDTO, productoDTO } from './dto';

export interface Dependencias {
  catalogo: Catalogo;
  carritos: RepositorioCarritos;
  ordenes: RepositorioOrdenes;
  compra: ServicioCompra;
}

export function crearApp({ catalogo, carritos, ordenes, compra }: Dependencias) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const clienteId = (req: Request): string => {
    const id = req.header('x-client-id');
    if (!id) throw new ErrorDominio('Falta el header x-client-id');
    return id;
  };
  const carritoDe = (req: Request): Carrito => carritos.obtenerOCrear(clienteId(req));

  // ---- Catálogo
  app.get('/api/productos', (req, res) => {
    const { q, categoria, equipo, precioMax } = req.query;
    const lista = catalogo.consultar({
      texto: typeof q === 'string' ? q : undefined,
      categoria: typeof categoria === 'string' && categoria ? (categoria as Categoria) : undefined,
      equipo: typeof equipo === 'string' && equipo ? (equipo as Equipo) : undefined,
      precioMax: typeof precioMax === 'string' && precioMax ? Number(precioMax) : undefined,
    });
    res.json(lista.map(productoDTO));
  });
  app.get('/api/productos/:id', (req, res) => res.json(productoDTO(catalogo.obtener(req.params.id))));
  app.get('/api/filtros', (_req, res) =>
    res.json({ categorias: catalogo.categorias(), equipos: catalogo.equipos() }));

  // ---- Carrito
  app.get('/api/carrito', (req, res) => res.json(carritoDTO(carritoDe(req))));

  app.post('/api/carrito/items', (req, res) => {
    const { productoId, cantidad = 1, opcion } = req.body ?? {};
    carritoDe(req).agregar(catalogo.obtener(String(productoId)), Number(cantidad), opcion);
    res.status(201).json(carritoDTO(carritoDe(req)));
  });

  app.patch('/api/carrito/items/:itemId', (req, res) => {
    const carrito = carritoDe(req);
    const { cantidad, opcion } = req.body ?? {};
    let id = req.params.itemId;
    if (opcion !== undefined) id = carrito.cambiarOpcion(id, String(opcion)).id;
    if (cantidad !== undefined) carrito.modificarCantidad(id, Number(cantidad));
    res.json(carritoDTO(carrito));
  });

  app.delete('/api/carrito/items/:itemId', (req, res) => {
    const carrito = carritoDe(req);
    carrito.eliminar(req.params.itemId);
    res.json(carritoDTO(carrito));
  });

  app.post('/api/carrito/cupon', (req, res) => {
    const carrito = carritoDe(req);
    carrito.aplicarCupon(String(req.body?.codigo ?? ''));
    res.json(carritoDTO(carrito));
  });
  app.delete('/api/carrito/cupon', (req, res) => {
    const carrito = carritoDe(req);
    carrito.quitarCupon();
    res.json(carritoDTO(carrito));
  });

  // ---- Órdenes
  app.post('/api/ordenes', (req, res) => {
    const id = clienteId(req);
    const { metodoPago, numeroTarjeta } = req.body ?? {};
    const metodo = FabricaPagos.crear(String(metodoPago), { numeroTarjeta });
    const orden = compra.comprar(id, carritos.obtenerOCrear(id), metodo);
    res.status(201).json(ordenDTO(orden));
  });
  app.get('/api/ordenes', (req, res) => res.json(ordenes.porCliente(clienteId(req)).map(ordenDTO)));

  // ---- Errores
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ErrorDominio) return res.status(err.status).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}
