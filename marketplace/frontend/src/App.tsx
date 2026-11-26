import { useCallback, useEffect, useRef, useState } from 'react'
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

interface ProductoSugerencia {
  id: string | number
  nombre: string
  equipo?: string
  precio?: number
  precioBase?: number
  imagen?: string
  img?: string
  variantes?: Array<{ precio?: number }>
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
  const [verSugerencias, setVerSugerencias] = useState(false)

  const searchBoxRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

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

  // Cierra el desplegable si haces clic fuera del buscador
  useEffect(() => {
    const onClickFuera = (e: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target as Node)) {
        setVerSugerencias(false)
      }
    }
    document.addEventListener('mousedown', onClickFuera)
    return () => document.removeEventListener('mousedown', onClickFuera)
  }, [])

  const seleccionarSugerencia = (nombre: string) => {
    setFiltros({ ...filtros, q: nombre })
    setVerSugerencias(false)
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

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

  const hayTexto = filtros.q.trim().length > 0

  return (
    <>
      <header className="topbar">
        <div className="brand">🏐 <span>Haikyuu!!</span> Market</div>

        <div className="search-wrap" ref={searchBoxRef}>
          <input
            className="search"
            type="search"
            placeholder="Busca un personaje, equipo o producto…"
            value={filtros.q}
            onFocus={() => setVerSugerencias(true)}
            onChange={(e) => {
              setFiltros({ ...filtros, q: e.target.value })
              setVerSugerencias(true)
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setVerSugerencias(false)
                gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              if (e.key === 'Escape') setVerSugerencias(false)
            }}
          />

          {verSugerencias && hayTexto && (
            <div className="search-dropdown">
              <div className="search-dropdown-head">
                <span>Resultados para “{filtros.q.trim()}”</span>
                <span>{productos.length}</span>
              </div>

              {productos.length === 0 ? (
                <div className="search-empty">Sin coincidencias en la cancha 🏐</div>
              ) : (
                <ul className="search-list">
                  {productos.slice(0, 6).map((p) => {
                    const item = p as unknown as ProductoSugerencia
                    const imgSrc = item.imagen ?? item.img ?? ''
                    const precioBase =
                      item.variantes?.[0]?.precio ?? item.precio ?? item.precioBase ?? 0

                    return (
                      <li key={String(item.id)}>
                        <button
                          type="button"
                          className="search-item"
                          onClick={() => seleccionarSugerencia(item.nombre)}
                        >
                          {imgSrc ? (
                            <img src={imgSrc} alt={item.nombre} className="search-thumb" />
                          ) : (
                            <span className="search-thumb-placeholder">🏐</span>
                          )}
                          <div className="search-info">
                            <strong>{item.nombre}</strong>
                            <small>{item.equipo ?? 'Haikyuu!!'}</small>
                          </div>
                          <span className="search-price">${Number(precioBase).toFixed(2)}</span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

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

        <div className="grid" ref={gridRef}>
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