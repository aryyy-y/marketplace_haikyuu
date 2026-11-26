export const redondear = (n: number): number => Math.round(n * 100) / 100;

/** Minúsculas y sin acentos, para búsquedas tolerantes. */
export const normalizar = (s: string): string =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
