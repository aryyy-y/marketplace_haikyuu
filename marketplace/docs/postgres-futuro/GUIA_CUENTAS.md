# Guía del punto 1: cuentas y plataformas

Cada integrante crea su cuenta de GitHub. Las demás cuentas (Railway, Supabase, Cloudflare) las puede crear una sola persona del equipo y compartir el acceso.

## 1. GitHub

1. Crear cuenta en https://github.com/signup (cada integrante).
2. Una persona crea el repositorio: **New repository** → nombre `marketplace-anime` → Private o Public → marcar *Add a README*.
3. Invitar a los integrantes: **Settings → Collaborators → Add people** → escribir el usuario de GitHub de cada uno. Cada persona acepta la invitación desde su correo.
4. Subir los archivos del proyecto (`README.md`, `schema.sql`, `docker-compose.yml`, `src/models.ts`):
   ```bash
   git clone https://github.com/<usuario>/marketplace-anime.git
   cd marketplace-anime
   # copiar los archivos aquí
   git add .
   git commit -m "Esquema inicial de base de datos"
   git push
   ```
5. En el `README.md`, llenar la tabla de integrantes. El tema ya está especificado: *Marketplace enfocado en Haikyuu!!*

## 2. Railway (backend y base de datos)

1. Entrar a https://railway.com y elegir **Login with GitHub**.
2. **New Project → Provision PostgreSQL**. Esto crea la base de datos en la nube.
3. En el servicio de PostgreSQL, pestaña **Variables**: copiar `DATABASE_URL`. Se usará como variable de entorno del backend.
4. Cargar el esquema en Railway (con `psql` instalado):
   ```bash
   psql "<DATABASE_URL>" -f schema.sql
   ```
5. Más adelante: **New → GitHub Repo** para desplegar el backend desde el repositorio.

## 3. Supabase (almacenamiento de fotos)

1. Entrar a https://supabase.com → **Sign in with GitHub**.
2. **New project** (guardar la contraseña de la base que pide).
3. Menú **Storage → New bucket**: crear `fotografias` (público, para mostrar las fotos) y `episodios`.
4. En **Project Settings → API**, copiar `Project URL` y la `service_role key`. La `service_role key` solo va en el backend, nunca en el frontend.

## 4. Cloudflare (frontend y workers)

1. Crear cuenta en https://dash.cloudflare.com/sign-up.
2. **Workers & Pages → Create → Pages → Connect to Git** y elegir el repositorio.
3. Configuración de build para React + Vite: comando `npm run build`, directorio de salida `dist`.

## Variables de entorno (`.env`, NO subir a GitHub)

```
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MERCADOPAGO_ACCESS_TOKEN=
```

Agregar `.env` al archivo `.gitignore`.

## Checklist de entrega

- [ ] Todos los integrantes tienen cuenta de GitHub y aceptaron la invitación
- [ ] Repositorio creado y README con el tema
- [ ] Railway con PostgreSQL funcionando
- [ ] Supabase con los buckets creados
- [ ] Cloudflare conectado al repositorio
