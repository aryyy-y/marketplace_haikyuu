-- =====================================================
-- MARKETPLACE - Esquema de base de datos (PostgreSQL)
-- =====================================================

-- [A] Roles
CREATE TABLE roles (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(50)  NOT NULL UNIQUE,   -- admin, vendedor, comprador
    descripcion TEXT
);

-- [B] Usuarios
CREATE TABLE usuarios (
    id             SERIAL PRIMARY KEY,
    rol_id         INTEGER      NOT NULL REFERENCES roles(id),
    nombre         VARCHAR(100) NOT NULL,
    email          VARCHAR(150) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- [C] Categorias
CREATE TABLE categorias (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT
);

-- [D] Fotografias (el archivo vive en Supabase Storage)
CREATE TABLE fotografias (
    id            SERIAL PRIMARY KEY,
    categoria_id  INTEGER       NOT NULL REFERENCES categorias(id),
    titulo        VARCHAR(150)  NOT NULL,
    descripcion   TEXT,
    precio        NUMERIC(10,2) NOT NULL CHECK (precio >= 0),
    storage_path  VARCHAR(255)  NOT NULL,   -- ruta dentro del bucket de Supabase
    url_publica   TEXT          NOT NULL,   -- URL para mostrar en el frontend
    estado        VARCHAR(20)   NOT NULL DEFAULT 'disponible'
                  CHECK (estado IN ('disponible', 'vendida', 'oculta')),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- [F] Transacciones (Mercado Pago)
CREATE TABLE transacciones (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INTEGER       NOT NULL REFERENCES usuarios(id),
    fotografia_id       INTEGER       NOT NULL REFERENCES fotografias(id),
    mp_preference_id    VARCHAR(100),
    mp_payment_id       VARCHAR(100)  UNIQUE,
    external_reference  VARCHAR(100)  UNIQUE,
    monto               NUMERIC(10,2) NOT NULL,
    moneda              CHAR(3)       NOT NULL DEFAULT 'MXN',
    estado              VARCHAR(20)   NOT NULL DEFAULT 'pendiente'
                        CHECK (estado IN ('pendiente', 'aprobada', 'rechazada', 'cancelada', 'reembolsada')),
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- [E] Usuarios_Fotografias (relación N:M entre usuarios y fotografías)
CREATE TABLE usuarios_fotografias (
    id             SERIAL PRIMARY KEY,
    usuario_id     INTEGER     NOT NULL REFERENCES usuarios(id)    ON DELETE CASCADE,
    fotografia_id  INTEGER     NOT NULL REFERENCES fotografias(id) ON DELETE CASCADE,
    tipo_relacion  VARCHAR(20) NOT NULL
                   CHECK (tipo_relacion IN ('autor', 'comprador', 'favorito')),
    transaccion_id INTEGER     REFERENCES transacciones(id),  -- solo si tipo = 'comprador'
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (usuario_id, fotografia_id, tipo_relacion)
);

-- [F] Webhooks de Mercado Pago (bitácora de notificaciones recibidas)
CREATE TABLE webhooks_mercadopago (
    id              SERIAL PRIMARY KEY,
    transaccion_id  INTEGER     REFERENCES transacciones(id),
    tipo_evento     VARCHAR(50) NOT NULL,        -- payment, merchant_order, etc.
    mp_resource_id  VARCHAR(100),
    payload         JSONB       NOT NULL,
    procesado       BOOLEAN     NOT NULL DEFAULT FALSE,
    recibido_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- [G] Series
CREATE TABLE series (
    id           SERIAL PRIMARY KEY,
    categoria_id INTEGER      REFERENCES categorias(id),
    titulo       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    portada_path VARCHAR(255),              -- imagen de portada en Supabase Storage
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- [H] Episodios
CREATE TABLE episodios (
    id             SERIAL PRIMARY KEY,
    serie_id       INTEGER      NOT NULL REFERENCES series(id) ON DELETE CASCADE,
    usuario_id     INTEGER      NOT NULL REFERENCES usuarios(id),  -- quien lo sube
    temporada      INTEGER      NOT NULL DEFAULT 1,
    numero         INTEGER      NOT NULL,
    titulo         VARCHAR(150) NOT NULL,
    descripcion    TEXT,
    duracion_seg   INTEGER      CHECK (duracion_seg > 0),
    video_path     VARCHAR(255),            -- archivo en Supabase Storage (si es contenido propio)
    url_externa    TEXT,                    -- enlace a plataforma oficial (si aplica)
    estado         VARCHAR(20)  NOT NULL DEFAULT 'borrador'
                   CHECK (estado IN ('borrador', 'publicado', 'oculto')),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (serie_id, temporada, numero),
    CHECK (video_path IS NOT NULL OR url_externa IS NOT NULL)
);

-- Índices útiles
CREATE INDEX idx_episodios_serie ON episodios(serie_id);
CREATE INDEX idx_fotografias_categoria ON fotografias(categoria_id);
CREATE INDEX idx_transacciones_usuario ON transacciones(usuario_id);
CREATE INDEX idx_uf_fotografia         ON usuarios_fotografias(fotografia_id);
CREATE INDEX idx_webhooks_procesado    ON webhooks_mercadopago(procesado);

-- Datos iniciales
INSERT INTO roles (nombre, descripcion) VALUES
    ('admin',     'Administrador del marketplace'),
    ('vendedor',  'Sube y vende fotografías'),
    ('comprador', 'Compra fotografías');

INSERT INTO categorias (nombre, descripcion) VALUES
    ('Cosplay',        'Fotografías de cosplay de personajes de anime'),
    ('Figuras',        'Fotografías de figuras y coleccionables'),
    ('Fan photography','Fotos de eventos, convenciones y fans'),
    ('Haikyuu',        'Contenido enfocado en Haikyuu!!');
    