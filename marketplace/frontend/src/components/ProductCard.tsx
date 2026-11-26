import { useState } from 'react'
import type { Producto } from '../types'

export const dinero = (n: number) =>
  n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })

const ICONOS: Record<Producto['categoria'], string> = {
  figura: '🏆', jersey: '👕', poster: '🖼️', manga: '📖',
}
export const COLORES: Record<string, [string, string]> = {
  Karasuno: ['#111111', '#f97316'],
  Nekoma: ['#7f1d1d', '#ef4444'],
  'Aoba Johsai': ['#0f766e', '#5eead4'],
  Fukurodani: ['#1f2937', '#9ca3af'],
  Shiratorizawa: ['#4c1d95', '#a78bfa'],
  Inarizaki: ['#171717', '#a3a3a3'],
}

interface Props {
  producto: Producto
  onAgregar: (producto: Producto, opcion: string) => void
}

export default function ProductCard({ producto, onAgregar }: Props) {
  const [opcion, setOpcion] = useState(producto.opciones[0].nombre)
  const [a, b] = COLORES[producto.equipo] ?? ['#222', '#888']
  const precio = producto.opciones.find((o) => o.nombre === opcion)?.precio ?? producto.precioBase
  const agotado = producto.stock === 0

  return (
    <article className="card">
      <div className="card-art" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }}>
        <span className="card-icon">{ICONOS[producto.categoria]}</span>
        <span className="chip">{producto.equipo}</span>
      </div>
      <div className="card-body">
        <h3>{producto.nombre}</h3>
        <p className="muted">{producto.detalle}</p>
        <p className="desc">{producto.descripcion}</p>
        <label className="field">
          <span>{producto.etiquetaOpcion}</span>
          <select value={opcion} onChange={(e) => setOpcion(e.target.value)}>
            {producto.opciones.map((o) => (
              <option key={o.nombre} value={o.nombre}>{o.nombre} — {dinero(o.precio)}</option>
            ))}
          </select>
        </label>
        <div className="card-foot">
          <div>
            <strong className="precio">{dinero(precio)}</strong>
            <small className={producto.stock <= 3 ? 'low' : 'muted'}>
              {agotado ? 'Agotado' : producto.stock <= 3 ? `¡Solo quedan ${producto.stock}!` : `${producto.stock} disponibles`}
            </small>
          </div>
          <button className="btn" disabled={agotado} onClick={() => onAgregar(producto, opcion)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  )
}
