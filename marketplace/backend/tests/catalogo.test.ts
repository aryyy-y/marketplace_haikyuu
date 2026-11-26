import { describe, expect, it } from 'vitest';
import { ProductoNoEncontradoError } from '../src/dominio/errores';
import { escenario } from './helpers';

describe('Catálogo', () => {
  it('CP7: busca por texto (sin importar mayúsculas ni acentos) y filtra por categoría/equipo/precio', () => {
    const { catalogo } = escenario();
    expect(catalogo.consultar({ texto: 'KUROO' }).map((p) => p.id)).toContain('f-kuroo');
    expect(catalogo.consultar({ texto: 'capitan' }).length).toBeGreaterThan(0);
    expect(catalogo.consultar({ categoria: 'jersey' }).every((p) => p.categoria === 'jersey')).toBe(true);
    expect(catalogo.consultar({ equipo: 'Nekoma' }).every((p) => p.equipo === 'Nekoma')).toBe(true);
    expect(catalogo.consultar({ precioMax: 200 }).every((p) => p.precioBase <= 200)).toBe(true);
    expect(catalogo.consultar({ texto: 'zzzz' })).toEqual([]);
    expect(() => catalogo.obtener('nada')).toThrow(ProductoNoEncontradoError);
  });

  it('CP8: polimorfismo — cada tipo de producto calcula su precio y detalle a su manera', () => {
    const { catalogo } = escenario();
    const figura = catalogo.obtener('f-hinata');
    const poster = catalogo.obtener('p-karasuno');
    const manga = catalogo.obtener('m-01');
    expect(figura.precioUnitario('Edición coleccionista')).toBe(878.4); // x1.6
    expect(poster.precioUnitario('A1')).toBe(437.8);                    // x2.2
    expect(manga.precioUnitario('Tapa dura')).toBe(264.6);              // x1.4
    expect(new Set([figura.detalle(), poster.detalle(), manga.detalle()]).size).toBe(3);
  });
});
