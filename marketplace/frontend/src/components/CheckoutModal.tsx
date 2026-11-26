import { useState } from 'react'
import type { Carrito, Orden } from '../types'
import { dinero } from './ProductCard'

interface Props {
  carrito: Carrito
  onCerrar: () => void
  onConfirmar: (metodo: string, tarjeta?: string) => Promise<void>
}

const METODOS = [
  { id: 'tarjeta', nombre: '💳 Tarjeta' },
  { id: 'transferencia', nombre: '🏦 Transferencia' },
  { id: 'efectivo', nombre: '💵 Efectivo en tienda' },
]

export default function CheckoutModal({ carrito, onCerrar, onConfirmar }: Props) {
  const [metodo, setMetodo] = useState('tarjeta')
  const [tarjeta, setTarjeta] = useState('4242 4242 4242 4242')
  const [enviando, setEnviando] = useState(false)

  const enviar = async () => {
    setEnviando(true)
    await onConfirmar(metodo, metodo === 'tarjeta' ? tarjeta : undefined)
    setEnviando(false)
  }

  return (
    <div className="overlay center" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Finalizar compra</h2>
        <p className="muted">Pago simulado: no se cobra nada real.</p>
        <div className="metodos">
          {METODOS.map((m) => (
            <button key={m.id} className={`metodo ${metodo === m.id ? 'on' : ''}`} onClick={() => setMetodo(m.id)}>
              {m.nombre}
            </button>
          ))}
        </div>
        {metodo === 'tarjeta' && (
          <label className="field">
            <span>Número de tarjeta</span>
            <input value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} placeholder="16 dígitos" />
            <small className="muted">Prueba: termina en 0000 = rechazada.</small>
          </label>
        )}
        <p className="pagar-total">Total a pagar: <strong>{dinero(carrito.total)}</strong></p>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onCerrar}>Cancelar</button>
          <button className="btn" disabled={enviando} onClick={enviar}>
            {enviando ? 'Procesando…' : 'Confirmar compra'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function Confirmacion({ orden, onCerrar }: { orden: Orden; onCerrar: () => void }) {
  return (
    <div className="overlay center" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{orden.estado === 'pagada' ? '¡Compra realizada! 🎉' : 'Orden creada ⏳'}</h2>
        <p className="muted">
          {orden.estado === 'pagada'
            ? 'Tu pago fue aprobado.'
            : 'Tu orden queda pendiente hasta que se confirme el pago.'}
        </p>
        <ul className="resumen">
          {orden.lineas.map((l, i) => (
            <li key={i}>
              <span>{l.cantidad} × {l.nombre} <small className="muted">({l.opcion})</small></span>
              <span>{dinero(l.subtotal)}</span>
            </li>
          ))}
        </ul>
        {orden.descuento > 0 && <p className="desc-line">Descuento: −{dinero(orden.descuento)}</p>}
        <p className="pagar-total">Total: <strong>{dinero(orden.total)}</strong></p>
        <p className="muted">Método: {orden.metodoPago} · Referencia: <code>{orden.referenciaPago}</code></p>
        <button className="btn block" onClick={onCerrar}>Seguir comprando</button>
      </div>
    </div>
  )
}
