// Tipos TypeScript que corresponden a las tablas de schema.sql

export interface Rol {
  id: number;
  nombre: 'admin' | 'vendedor' | 'comprador';
  descripcion: string | null;
}

export interface Usuario {
  id: number;
  rol_id: number;
  nombre: string;
  email: string;
  password_hash: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion: string | null;
}

export type EstadoFotografia = 'disponible' | 'vendida' | 'oculta';

export interface Fotografia {
  id: number;
  categoria_id: number;
  titulo: string;
  descripcion: string | null;
  precio: number;
  storage_path: string;
  url_publica: string;
  estado: EstadoFotografia;
  created_at: string;
}

export type TipoRelacion = 'autor' | 'comprador' | 'favorito';

export interface UsuarioFotografia {
  id: number;
  usuario_id: number;
  fotografia_id: number;
  tipo_relacion: TipoRelacion;
  transaccion_id: number | null;
  created_at: string;
}

export type EstadoTransaccion =
  | 'pendiente'
  | 'aprobada'
  | 'rechazada'
  | 'cancelada'
  | 'reembolsada';

export interface Transaccion {
  id: number;
  usuario_id: number;
  fotografia_id: number;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  external_reference: string | null;
  monto: number;
  moneda: string;
  estado: EstadoTransaccion;
  created_at: string;
  updated_at: string;
}

export interface WebhookMercadoPago {
  id: number;
  transaccion_id: number | null;
  tipo_evento: string;
  mp_resource_id: string | null;
  payload: unknown;
  procesado: boolean;
  recibido_en: string;
}

export interface Serie {
  id: number;
  categoria_id: number | null;
  titulo: string;
  descripcion: string | null;
  portada_path: string | null;
  created_at: string;
}

export type EstadoEpisodio = 'borrador' | 'publicado' | 'oculto';

export interface Episodio {
  id: number;
  serie_id: number;
  usuario_id: number;
  temporada: number;
  numero: number;
  titulo: string;
  descripcion: string | null;
  duracion_seg: number | null;
  video_path: string | null;
  url_externa: string | null;
  estado: EstadoEpisodio;
  created_at: string;
}
