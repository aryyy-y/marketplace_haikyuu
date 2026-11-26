# Haikyuu!! Market 🏐

Marketplace de mercancía del anime **Haikyuu!!** (figuras, jerseys, pósters y manga). Proyecto final de Programación Orientada a Objetos.

## Integrantes

| Nombre completo | Matrícula | Usuario de GitHub |
|---|---|---|
| _(completar)_ | _(completar)_ | aryyy-y |
| _(completar)_ | _(completar)_ | _(completar)_ |

## Stack

- **Backend:** Node.js + TypeScript (POO) + Express.
- **Base de datos:** SQLite (`better-sqlite3`). Se crea sola en `backend/data/marketplace.db` la primera vez, con los productos iniciales. Guarda productos, stock y órdenes. El carrito vive en memoria.
- **Frontend:** React + TypeScript (Vite).
- **Pagos:** simulados (tarjeta, transferencia, efectivo).
- **Pruebas:** Vitest.

## Cómo correrlo

Necesitas Node.js 20 o superior y dos terminales.

```bash
# Terminal 1 — backend (http://localhost:3000)
cd backend
npm install
npm run dev

# Terminal 2 — frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```

> Para reiniciar la tienda (stock y órdenes) borra el archivo `backend/data/marketplace.db`.

## Pruebas

```bash
cd backend
npm test
```

13 casos de prueba (`backend/tests/`): agregar, eliminar, modificar cantidad y opción, subtotales/total, cupones, búsqueda y filtros, polimorfismo de precios, generación de orden, pago rechazado, pagos pendientes, validaciones de stock y persistencia en SQLite.

## Funcionalidades

- Catálogo de productos con búsqueda por texto y filtros por categoría y equipo.
- Carrito: agregar, eliminar, cambiar cantidad, cambiar talla/tamaño/edición.
- Subtotal, descuento (cupones `KARASUNO10`, `NEKOMA15`, `VOLEY100`) y total.
- Checkout simulado: genera una orden y descuenta el inventario.
  - Tarjeta: `4242 4242 4242 4242` aprueba; un número que termina en `0000` se rechaza.
  - Transferencia y efectivo: la orden queda pendiente de pago con una referencia.

## Documentación

- [Diagrama de clases UML y justificación de POO](docs/UML.md)
- Borrador de esquema PostgreSQL de la idea original (no se usa en esta versión): [`docs/postgres-futuro/`](docs/postgres-futuro/)

## Estructura

```
backend/src/dominio/       Clases del negocio (productos, carrito, orden, descuentos, pagos)
backend/src/repositorios/  Interfaces y versiones SQLite / en memoria
backend/src/servicios/     ServicioCompra (checkout)
backend/src/api/           Rutas Express y DTOs
backend/tests/             Casos de prueba
frontend/src/              Interfaz en React
docs/                      UML y esquema SQL futuro
```
