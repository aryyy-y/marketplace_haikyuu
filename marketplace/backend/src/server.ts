import path from 'node:path';
import fs from 'node:fs';
import { crearApp } from './api/app';
import { Catalogo } from './dominio/Catalogo';
import { crearProductosIniciales } from './datos/semilla';
import { abrirBaseDatos } from './repositorios/baseDatos';
import { RepositorioCarritos } from './repositorios/RepositorioCarritos';
import { RepositorioOrdenesSqlite } from './repositorios/RepositorioOrdenesSqlite';
import { RepositorioProductosSqlite } from './repositorios/RepositorioProductosSqlite';
import { ServicioCompra } from './servicios/ServicioCompra';

// Base de datos SQLite en un solo archivo (se crea sola la primera vez).
const ruta = process.env.DB_PATH ?? path.join(__dirname, '..', 'data', 'marketplace.db');
fs.mkdirSync(path.dirname(ruta), { recursive: true });
const db = abrirBaseDatos(ruta);

const productos = new RepositorioProductosSqlite(db, crearProductosIniciales());
const ordenes = new RepositorioOrdenesSqlite(db);
const app = crearApp({
  catalogo: new Catalogo(productos),
  carritos: new RepositorioCarritos(),
  ordenes,
  compra: new ServicioCompra(ordenes, productos),
});

const puerto = Number(process.env.PORT ?? 3000);
app.listen(puerto, () => console.log(`API Haikyuu Market en http://localhost:${puerto}`));
