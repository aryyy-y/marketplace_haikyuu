import Database from 'better-sqlite3';

export type BaseDatos = Database.Database;

/** Abre (o crea) la base SQLite y deja las tablas listas. Usa ':memory:' para pruebas. */
export function abrirBaseDatos(ruta: string): BaseDatos {
  const db = new Database(ruta);
  db.exec(`
    CREATE TABLE IF NOT EXISTS productos (
      id TEXT PRIMARY KEY,
      categoria TEXT NOT NULL,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      precio_base REAL NOT NULL,
      stock INTEGER NOT NULL,
      equipo TEXT NOT NULL,
      personaje TEXT NOT NULL,
      extra TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS ordenes (
      id TEXT PRIMARY KEY,
      cliente_id TEXT NOT NULL,
      lineas TEXT NOT NULL,
      subtotal REAL NOT NULL,
      descuento REAL NOT NULL,
      total REAL NOT NULL,
      metodo_pago TEXT NOT NULL,
      referencia_pago TEXT NOT NULL,
      estado TEXT NOT NULL,
      fecha TEXT NOT NULL
    );
  `);
  return db;
}
