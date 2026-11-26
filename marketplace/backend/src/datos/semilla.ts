import { Figura } from '../dominio/productos/Figura';
import { Jersey } from '../dominio/productos/Jersey';
import { Manga } from '../dominio/productos/Manga';
import { Poster } from '../dominio/productos/Poster';
import { Producto } from '../dominio/productos/Producto';

/** Catálogo inicial de mercancía de fans de Haikyuu!! (precios en MXN). */
export function crearProductosIniciales(): Producto[] {
  return [
    new Figura({ id: 'f-hinata', nombre: 'Figura Shoyo Hinata', descripcion: 'Hinata en pleno salto de ataque rápido.', precioBase: 549, stock: 12, equipo: 'Karasuno', personaje: 'Shoyo Hinata' }, 18),
    new Figura({ id: 'f-kageyama', nombre: 'Figura Tobio Kageyama', descripcion: 'El rey de la cancha colocando un balón perfecto.', precioBase: 549, stock: 10, equipo: 'Karasuno', personaje: 'Tobio Kageyama' }, 18),
    new Figura({ id: 'f-nishinoya', nombre: 'Figura Yu Nishinoya', descripcion: 'El libero de Karasuno en recepción baja.', precioBase: 499, stock: 2, equipo: 'Karasuno', personaje: 'Yu Nishinoya' }, 16),
    new Figura({ id: 'f-kuroo', nombre: 'Figura Tetsuro Kuroo', descripcion: 'Capitán de Nekoma listo para el bloqueo.', precioBase: 589, stock: 8, equipo: 'Nekoma', personaje: 'Tetsuro Kuroo' }, 19),
    new Figura({ id: 'f-oikawa', nombre: 'Figura Tooru Oikawa', descripcion: 'El gran rey con su saque devastador.', precioBase: 599, stock: 6, equipo: 'Aoba Johsai', personaje: 'Tooru Oikawa' }, 19),
    new Figura({ id: 'f-bokuto', nombre: 'Figura Koutarou Bokuto', descripcion: 'El as de Fukurodani en su mejor remate.', precioBase: 599, stock: 7, equipo: 'Fukurodani', personaje: 'Koutarou Bokuto' }, 19),
    new Jersey({ id: 'j-karasuno', nombre: 'Jersey Karasuno #10', descripcion: 'Jersey negro con detalles naranja, número de Hinata.', precioBase: 899, stock: 15, equipo: 'Karasuno', personaje: 'Shoyo Hinata' }, 10),
    new Jersey({ id: 'j-nekoma', nombre: 'Jersey Nekoma #1', descripcion: 'Jersey rojo de Nekoma, número de Kuroo.', precioBase: 899, stock: 9, equipo: 'Nekoma', personaje: 'Tetsuro Kuroo' }, 1),
    new Jersey({ id: 'j-aoba', nombre: 'Jersey Aoba Johsai #1', descripcion: 'Jersey turquesa, número del capitán Oikawa.', precioBase: 899, stock: 9, equipo: 'Aoba Johsai', personaje: 'Tooru Oikawa' }, 1),
    new Jersey({ id: 'j-fukurodani', nombre: 'Jersey Fukurodani #4', descripcion: 'Jersey de Fukurodani, número de Bokuto.', precioBase: 899, stock: 8, equipo: 'Fukurodani', personaje: 'Koutarou Bokuto' }, 4),
    new Poster({ id: 'p-karasuno', nombre: 'Póster Karasuno — Los cuervos vuelan', descripcion: 'Todo el equipo de Karasuno en una sola lámina.', precioBase: 199, stock: 30, equipo: 'Karasuno', personaje: 'Equipo completo' }, 'Mate'),
    new Poster({ id: 'p-shiratorizawa', nombre: 'Póster Ushijima — Shiratorizawa', descripcion: 'El as más fuerte de Miyagi.', precioBase: 219, stock: 20, equipo: 'Shiratorizawa', personaje: 'Wakatoshi Ushijima' }, 'Brillante'),
    new Poster({ id: 'p-inarizaki', nombre: 'Póster Hermanos Miya — Inarizaki', descripcion: 'Atsumu y Osamu en acción.', precioBase: 219, stock: 18, equipo: 'Inarizaki', personaje: 'Atsumu Miya' }, 'Mate'),
    new Manga({ id: 'm-01', nombre: 'Haikyuu!! Tomo 1', descripcion: 'Donde todo empieza: Hinata conoce a Kageyama.', precioBase: 189, stock: 25, equipo: 'Karasuno', personaje: 'Shoyo Hinata' }, 1),
    new Manga({ id: 'm-10', nombre: 'Haikyuu!! Tomo 10', descripcion: 'Karasuno vs. Nekoma: comienza la batalla del basurero.', precioBase: 189, stock: 14, equipo: 'Nekoma', personaje: 'Tetsuro Kuroo' }, 10),
    new Manga({ id: 'm-45', nombre: 'Haikyuu!! Tomo 45', descripcion: 'El gran final de la historia.', precioBase: 199, stock: 11, equipo: 'Karasuno', personaje: 'Shoyo Hinata' }, 45),
  ];
}
