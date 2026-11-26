import { useState } from 'react'
import type { Carrito } from '../types'
import { dinero } from './ProductCard'

interface Props {
  carrito: Carrito
  onCerrar: () => void
  onCantidad: (itemId: string, cantidad: number) => void
  onOpcion: (itemId: string, opcion: string) => void
  onQuitar: (itemId: string) => void
  onCupon: (codigo: string) => void
  onQuitarCupon: () => void
  onPagar: () => void
}

export default function CartDrawer(p: Props) {
  const [codigo, setCodigo] = useState('')
  const { carrito } = p

  return (
    <div className="overlay" onClick={p.onCerrar}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header className="drawer-head">
          <h2>Tu carrito</h2>
          <button className="icon-btn" onClick={p.onCerrar} aria-label="Cerrar">✕</button>
        </header>

        {carrito.items.length === 0 ? (
          <p className="empty">Tu carrito está vacío. ¡Agrega algo del equipo! 🏐</p>
        ) : (
          <>
            <ul className="items">
              {carrito.items.map((i) => (
                <li key={i.id} className="item">
                  <div className="item-top">
                    <strong>{i.producto.nombre}</strong>
                    <button className="link danger" onClick={() => p.onQuitar(i.id)}>Eliminar</button>
                  </div>
                  <label className="field inline">
                    <span>{i.producto.etiquetaOpcion}</span>
                    <select value={i.opcion} onChange={(e) => p.onOpcion(i.id, e.target.value)}>
                      {i.producto.opciones.map((o) => (
                        <option key={o.nombre} value={o.nombre}>{o.nombre}</option>
                      ))}
                    </select>
                  </label>
                  <div className="item-bottom">
                    <div className="qty">
                      <button disabled={i.cantidad <= 1} onClick={() => p.onCantidad(i.id, i.cantidad - 1)}>−</button>
                      <span>{i.cantidad}</span>
                      <button disabled={i.cantidad >= i.producto.stock} onClick={() => p.onCantidad(i.id, i.cantidad + 1)}>+</button>
                    </div>
                    <small className="muted">{dinero(i.precioUnitario)} c/u</small>
                    <strong>{dinero(i.subtotal)}</strong>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cupon">
              {carrito.cupon ? (
                <p>
                  🎟️ <strong>{carrito.cupon.codigo}</strong> — {carrito.cupon.descripcion}{' '}
                  <button className="link danger" onClick={p.onQuitarCupon}>Quitar</button>
                </p>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if (codigo.trim()) { p.onCupon(codigo); setCodigo('') } }}>
                  <input placeholder="Cupón (ej. KARASUNO10)" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
                  <button className="btn ghost" type="submit">Aplicar</button>
                </form>
              )}
            </div>

            <dl className="totales">
              <div><dt>Subtotal ({carrito.piezas} {carrito.piezas === 1 ? 'pieza' : 'piezas'})</dt><dd>{dinero(carrito.subtotal)}</dd></div>
              {carrito.descuento > 0 && (
                <div className="desc-line"><dt>Descuento</dt><dd>−{dinero(carrito.descuento)}</dd></div>
              )}
              <div className="total"><dt>Total</dt><dd>{dinero(carrito.total)}</dd></div>
            </dl>
            <button className="btn block" onClick={p.onPagar}>Ir a pagar</button>
          </>
        )}
      </aside>
    </div>
  )
}
