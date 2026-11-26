import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import CartDrawer from './components/CartDrawer'
import CheckoutModal, { Confirmacion } from './components/CheckoutModal'
import ProductCard from './components/ProductCard'
import type { Carrito, Filtros, Orden, Producto } from './types'
import './App.css'

const CARRITO_VACIO: Carrito = { items: [], piezas: 0, cupon: null, subtotal: 0, descuento: 0, total: 0 }
const NOMBRES_CAT: Record<string, string> = {
  figura: 'Figuras', jersey: 'Jerseys', poster: 'Pósters', manga: 'Manga',
}

export default function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [filtros, setFiltros] = useState<Filtros>({ q: '', categoria: '', equipo: '' })
  const [opcionesFiltro, setOpcionesFiltro] = useState<{ categorias: string[]; equipos: string[] }>({ categorias: [], equipos: [] })
  const [carrito, setCarrito] = useState<Carrito>(CARRITO_VACIO)
  const [verCarrito, setVerCarrito] = useState(false)
  const [verPago, setVerPago] = useState(false)
  const [orden, setOrden] = useState<Orden | null>(null)
  const [aviso, setAviso] = useState<{ texto: string; error: boolean } | null>(null)

  const avisar = (texto: string, error = false) => {
    setAviso({ texto, error })
    setTimeout(() => setAviso(null), 3500)
  }

  /** Ejecuta una acción sobre el carrito y muestra el error del backend si falla. */
  const accion = async (fn: () => Promise<Carrito>, ok?: string) => {
    try {
      setCarrito(await fn())
      if (ok) avisar(ok)
    } catch (e) {
      avisar((e as Error).message, true)
    }
  }

  const cargarProductos = useCallback(() => {
    api.productos(filtros).then(setProductos).catch((e) => avisar(e.message, true))
  }, [filtros])

  useEffect(() => {
    api.filtros().then(setOpcionesFiltro).catch(() => {})
    api.carrito().then(setCarrito).catch(() => {})
  }, [])

  useEffect(() => {
    const t = setTimeout(cargarProductos, 200) // pequeña espera al escribir
    return () => clearTimeout(t)
  }, [cargarProductos])

  const confirmarCompra = async (metodo: string, tarjeta?: string) => {
    try {
      const o = await api.comprar(metodo, tarjeta)
      setOrden(o)
      setVerPago(false)
      setVerCarrito(false)
      setCarrito(await api.carrito())
      cargarProductos() // el stock cambió
    } catch (e) {
      avisar((e as Error).message, true)
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">🏐 <span>Haikyuu!!</span> Market</div>
        <input
          className="search"
          type="search"
          placeholder="Busca un personaje, equipo o producto…"
          value={filtros.q}
          onChange={(e) => setFiltros({ ...filtros, q: e.target.value })}
        />
        <button className="cart-btn" onClick={() => setVerCarrito(true)}>
          🛒 Carrito {carrito.piezas > 0 && <b className="badge">{carrito.piezas}</b>}
        </button>
      </header>

      <section className="hero">
        <h1>¡Vuela alto con tu equipo favorito!</h1>
        <p>Figuras, jerseys, pósters y manga de Haikyuu!!</p>
      </section>

      <main className="layout">
        <aside className="filtros">
          <h3>Categoría</h3>
          <div className="pills">
            <button className={!filtros.categoria ? 'on' : ''} onClick={() => setFiltros({ ...filtros, categoria: '' })}>Todas</button>
            {opcionesFiltro.categorias.map((c) => (
              <button key={c} className={filtros.categoria === c ? 'on' : ''} onClick={() => setFiltros({ ...filtros, categoria: c })}>
                {NOMBRES_CAT[c] ?? c}
              </button>
            ))}
          </div>
          <h3>Equipo</h3>
          <div className="pills">
            <button className={!filtros.equipo ? 'on' : ''} onClick={() => setFiltros({ ...filtros, equipo: '' })}>Todos</button>
            {opcionesFiltro.equipos.map((e) => (
              <button key={e} className={filtros.equipo === e ? 'on' : ''} onClick={() => setFiltros({ ...filtros, equipo: e })}>{e}</button>
            ))}
          </div>
        </aside>

        <div className="grid">
          {productos.length === 0 && <p className="empty">No encontramos nada con esos filtros 🥲</p>}
          {productos.map((p) => (
            <ProductCard
              key={p.id}
              producto={p}
              onAgregar={(prod, opcion) => accion(() => api.agregar(prod.id, opcion), `${prod.nombre} agregado al carrito`)}
            />
          ))}
        </div>
      </main>

      {verCarrito && (
        <CartDrawer
          carrito={carrito}
          onCerrar={() => setVerCarrito(false)}
          onCantidad={(id, cantidad) => accion(() => api.cambiar(id, { cantidad }))}
          onOpcion={(id, opcion) => accion(() => api.cambiar(id, { opcion }))}
          onQuitar={(id) => accion(() => api.quitar(id))}
          onCupon={(codigo) => accion(() => api.cupon(codigo), 'Cupón aplicado')}
          onQuitarCupon={() => accion(() => api.quitarCupon())}
          onPagar={() => setVerPago(true)}
        />
      )}
      {verPago && <CheckoutModal carrito={carrito} onCerrar={() => setVerPago(false)} onConfirmar={confirmarCompra} />}
      {orden && <Confirmacion orden={orden} onCerrar={() => setOrden(null)} />}
      {aviso && <div className={`toast ${aviso.error ? 'error' : ''}`}>{aviso.texto}</div>}
    </>
  )
}
