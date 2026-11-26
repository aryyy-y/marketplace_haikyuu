import { ProductoNoEncontradoError } from './errores';
import { Categoria, Equipo, Producto } from './productos/Producto';
import { RepositorioProductos } from '../repositorios/RepositorioProductos';
import { normalizar } from './utils';

export interface FiltroCatalogo {
  texto?: string;
  categoria?: Categoria;
  equipo?: Equipo;
  precioMax?: number;
}

/** Consulta, busca y filtra productos. Depende de la interfaz del repositorio (DIP). */
export class Catalogo {
  constructor(private readonly repo: RepositorioProductos) {}

  obtener(id: string): Producto {
    const p = this.repo.obtener(id);
    if (!p) throw new ProductoNoEncontradoError(id);
    return p;
  }

  consultar(filtro: FiltroCatalogo = {}): Producto[] {
    const q = filtro.texto ? normalizar(filtro.texto) : '';
    return this.repo.listar().filter((p) => {
      if (filtro.categoria && p.categoria !== filtro.categoria) return false;
      if (filtro.equipo && p.equipo !== filtro.equipo) return false;
      if (filtro.precioMax !== undefined && p.precioBase > filtro.precioMax) return false;
      if (q) {
        const pajar = normalizar(`${p.nombre} ${p.personaje} ${p.equipo} ${p.descripcion}`);
        return pajar.includes(q);
      }
      return true;
    });
  }

  categorias(): Categoria[] {
    return [...new Set(this.repo.listar().map((p) => p.categoria))];
  }
  equipos(): Equipo[] {
    return [...new Set(this.repo.listar().map((p) => p.equipo))];
  }
}
