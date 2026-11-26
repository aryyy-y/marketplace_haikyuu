import { Figura } from '../dominio/productos/Figura';
import { Jersey } from '../dominio/productos/Jersey';
import { Manga } from '../dominio/productos/Manga';
import { Poster } from '../dominio/productos/Poster';
import { DatosProducto, Producto } from '../dominio/productos/Producto';
import { BaseDatos } from './baseDatos';
import { RepositorioProductos } from './RepositorioProductos';

interface Fila {
  id: string; categoria: string; nombre: string; descripcion: string;
  precio_base: number; stock: number; equipo: string; personaje: string; extra: string;
}

/**
 * Guarda los productos en SQLite. Los carga una sola vez a memoria (para que el
 * carrito y el repositorio compartan los mismos objetos) y escribe el stock al guardar.
 */
export class RepositorioProductosSqlite implements RepositorioProductos {
  private readonly cache = new Map<string, Producto>();

  /** Si la tabla está vacía, la llena con `iniciales`. */
  constructor(private readonly db: BaseDatos, iniciales: Producto[] = []) {
    const hay = (db.prepare('SELECT COUNT(*) AS n FROM productos').get() as { n: number }).n;
    if (hay === 0) iniciales.forEach((p) => this.insertar(p));
    const filas = db.prepare('SELECT * FROM productos').all() as Fila[];
    filas.forEach((f) => this.cache.set(f.id, this.aProducto(f)));
  }

  listar() { return [...this.cache.values()]; }
  obtener(id: string) { return this.cache.get(id); }

  guardar(p: Producto) {
    this.db.prepare('UPDATE productos SET stock = ? WHERE id = ?').run(p.stock, p.id);
  }

  private insertar(p: Producto) {
    this.db.prepare(
      `INSERT INTO productos (id, categoria, nombre, descripcion, precio_base, stock, equipo, personaje, extra)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(p.id, p.categoria, p.nombre, p.descripcion, p.precioBase, p.stock, p.equipo, p.personaje, String(this.extra(p)));
  }

  /** Dato propio de cada subclase (altura, número, acabado o tomo). */
  private extra(p: Producto): string | number {
    if (p instanceof Figura) return p.alturaCm;
    if (p instanceof Jersey) return p.numero;
    if (p instanceof Poster) return p.acabado;
    if (p instanceof Manga) return p.tomo;
    return '';
  }

  private aProducto(f: Fila): Producto {
    const datos: DatosProducto = {
      id: f.id, nombre: f.nombre, descripcion: f.descripcion, precioBase: f.precio_base,
      stock: f.stock, equipo: f.equipo as DatosProducto['equipo'], personaje: f.personaje,
    };
    switch (f.categoria) {
      case 'figura': return new Figura(datos, Number(f.extra));
      case 'jersey': return new Jersey(datos, Number(f.extra));
      case 'poster': return new Poster(datos, f.extra);
      case 'manga': return new Manga(datos, Number(f.extra));
      default: throw new Error(`Categoría desconocida en la base: ${f.categoria}`);
    }
  }
}
