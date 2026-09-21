# BaldeCash — Módulo de solicitudes de financiamiento

Prueba técnica FullStack Developer Junior. API que registra y consulta solicitudes de
financiamiento de laptops/equipos electrónicos, más una interfaz web para enviarlas y revisarlas.

**Estado actual:** Paso 3 completado: frontend en Next.js (App Router) con
formulario de solicitud y listado paginado, consumiendo la API del backend.
Este README se actualiza al final de cada fase.

## Stack

- **Backend:** NestJS (TypeScript), Node.js 22+.
- **Base de datos:** PostgreSQL 16, vía Prisma ORM 7.
- **Frontend:** Next.js (App Router) + TypeScript + Tailwind CSS.

## Estructura del repositorio

```
baldecash-solicitudes/
├── backend/    # API NestJS + Prisma
├── frontend/   # Next.js (App Router)
└── README.md
```

Se usan dos carpetas independientes, sin herramientas de monorepo (Nx/Turborepo): para el
alcance de esta prueba, ese tooling agrega complejidad que no aporta a los criterios de
evaluación (funcionalidad, calidad de código, diseño de API/datos, validaciones, git).

## Opción rápida: todo con un solo comando (Docker)

```bash
git clone <URL_DEL_REPO>
cd baldecash-solicitudes
docker compose up --build
```

Levanta PostgreSQL, el backend (con migraciones y seed automáticos) y el frontend.
Cuando los 3 contenedores estén listos:
- API: `http://localhost:3000`
- Frontend: `http://localhost:3001`

**No lo corras al mismo tiempo que la sección "PostgreSQL local" de abajo** — ambos
intentan usar el puerto `5435` para la base de datos y van a chocar (el mismo problema
de puerto ocupado que documentamos más abajo). Usa esta opción de Docker completo **o**
la guía paso a paso manual, no las dos a la vez.

## Cómo levantar el proyecto desde cero

### Requisitos previos

- Node.js 22 o superior.
- Docker (para levantar PostgreSQL local) — o una instancia de PostgreSQL propia.

### 1. Clonar e instalar dependencias

```bash
git clone <URL_DEL_REPO>
cd baldecash-solicitudes/backend
npm install
```

> Nota: si `npm install` falla con un error del tipo `Cannot read properties of null
> (reading 'edgesOut')`, es un bug conocido de npm 10.9.x resolviendo el árbol de
> dependencias de este proyecto. Solución: `npx npm@11 install`.

### 2. Variables de entorno

```bash
cp .env.example .env
```

| Variable       | Descripción                                    | Valor por defecto (docker-compose)                              |
| -------------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| `DATABASE_URL` | Cadena de conexión a PostgreSQL.                 | `postgresql://baldecash:baldecash@localhost:5435/baldecash`       |

### 3. Levantar PostgreSQL

```bash
docker compose up -d
```

Esto levanta un contenedor `postgres:16-alpine` en el puerto `5435` con las credenciales
de `.env.example`.

### 4. Generar el cliente de Prisma, migrar y sembrar datos

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

- `generate` crea el cliente tipado en `src/generated/prisma` (no se versiona en git).
- `migrate dev` crea y aplica la migración inicial (`prisma/migrations/`), versionada en git.
- `db seed` inserta 3 solicitudes de ejemplo (una por cada estado: pendiente, aprobada,
  rechazada), definidas en `prisma/seed.ts`. Desde Prisma ORM v7 el seed ya no se ejecuta
  automáticamente tras `migrate dev`; hay que invocarlo explícitamente.

Verificación opcional: `npx prisma studio` para inspeccionar la tabla `solicitudes`.

### 5. Levantar la API

```bash
npm run start:dev
```

### 6. Levantar el frontend

En otra terminal:

```bash
cd ../frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Abre `http://localhost:3001`:
- `/` — formulario de solicitud.
- `/solicitudes` — listado paginado con filtro por estado.

## Opcionales resueltos

- [x] Tests unitarios del cálculo de la cuota.
- [x] `PATCH /solicitudes/:id/estado` para cambiar el estado desde el listado.
- [x] Tasa de interés como variable de entorno (`TASA_INTERES_ANUAL`) en vez de valor fijo.
- [x] `docker-compose.yml` que levante el proyecto completo (DB + backend + frontend) con un solo comando.

## Endpoints de la API

| Endpoint | Descripción |
| --- | --- |
| `POST /solicitudes` | Crea una solicitud. Valida los datos, calcula la cuota mensual y persiste con estado `pendiente`. Devuelve `201` con el registro creado (incluida la cuota). |
| `GET /solicitudes?page=&limit=&estado=` | Lista solicitudes paginadas. `estado` es opcional (`pendiente`, `aprobada`, `rechazada`). Devuelve `{ data, total, page, limit }`. |
| `PATCH /solicitudes/:id/estado` | Cambia el estado de una solicitud. Body: `{ "estado": "aprobada" }`. Devuelve `404` si el id no existe. |

Errores de validación devuelven `422` con el detalle de cada campo:
```json
{
  "statusCode": 422,
  "message": "Error de validación",
  "errores": [
    { "campo": "monto", "motivo": "El monto mínimo es S/ 1,000" }
  ]
}
```

## Tests

```bash
npm run test
```

Cubre el cálculo de la cuota (`calcularCuotaMensual`): el ejemplo del enunciado
(P=3000, n=12 → 283.68), los límites de plazo (6 y 24 meses) y que a mayor plazo la
cuota mensual baja.

## Decisiones técnicas — Paso 1 (base de datos)

- **PostgreSQL sobre MySQL/SQLite:** motor más común en producción con NestJS + Prisma;
  su tipo `DECIMAL` nativo evita errores de redondeo en montos y cuotas (relevante dado el
  ejemplo de validación S/ 283.68 del enunciado).
- **Prisma ORM 7** con el generador `prisma-client` (no `prisma-client-js`, deprecado) y
  adaptador de driver `@prisma/adapter-pg`: es el modelo de conexión estándar de Prisma 7,
  requiere `prisma.config.ts` para la configuración de conexión/migraciones en vez de
  variables sueltas en `schema.prisma`.
- **Proyecto NestJS en ESM** (`"type": "module"`, `module: nodenext` en `tsconfig.json`):
  así lo genera el template actual de `@nestjs/cli`, y es el modo que la documentación
  oficial de Prisma 7 recomienda para NestJS — se mantuvo el default del scaffold en vez
  de forzarlo a CommonJS.
- **`monto` y `cuotaMensual` como `Decimal`, no `Float`:** `Float` usa punto flotante
  binario y puede introducir errores de redondeo en dinero; `Decimal` es exacto.
- **`dni` y `telefono` como `String`, no `Int`:** son identificadores, nunca se suman ni
  restan, y un entero perdería ceros a la izquierda.
- **Enum `EstadoSolicitud` en minúsculas** (`pendiente`, `aprobada`, `rechazada`): el
  valor que Prisma devuelve coincide literalmente con el contrato de la API pedido en el
  enunciado, sin necesitar una capa de mapeo adicional.
- **`id` autoincremental** en vez de UUID: simplifica la paginación y es suficiente para
  el alcance de la prueba.
- **Migraciones versionadas con `prisma migrate dev`** (no `db push` ni SQL a mano): el
  enunciado lo exige explícitamente; el historial de archivos `.sql` queda en
  `prisma/migrations/` y viaja con el repositorio.
- **Función `calcularCuotaMensual`** extraída a `src/common/calcular-cuota.util.ts` desde
  este paso (en vez de escribirla solo dentro del seeder): la reutiliza tanto
  `prisma/seed.ts` como el servicio del backend en el Paso 2, evitando duplicar la
  fórmula de amortización francesa en dos lugares.

## Problemas reales que aparecieron al levantar el proyecto (documentados, no escondidos)

- **Puerto 5432 ocupado:** ya había otro PostgreSQL corriendo en la máquina de desarrollo
  en ese puerto. Se cambió el mapeo de `docker-compose.yml` a `5433`, y luego a `5435` al
  detectar que también había algo más escuchando en `5433`. **Lección:** al cambiar el
  puerto en `docker-compose.yml` hay que actualizar `DATABASE_URL` en `.env` (y
  `.env.example`) en el mismo commit — un desalineamiento entre ambos causó un error de
  autenticación (`P1000`) que en realidad era "me conecté a un Postgres que no es el mío".
- **`esbuild`/binario de plataforma incorrecta:** las dependencias se instalaron una vez
  desde un entorno Linux distinto a la máquina de desarrollo (macOS/arm64), dejando
  binarios nativos (`@esbuild/linux-arm64`) incompatibles. Se resolvió reinstalando con
  `rm -rf node_modules package-lock.json && npm install` directamente en la máquina de
  destino.
- **`npm install` con la versión por defecto de `prisma`:** el paquete `prisma` en npm
  apunta hoy (`latest`) a un release candidate de la v8, que no soporta `schema.prisma`
  clásico. Se fijó la versión exacta `prisma@7.10.0` en `package.json`.

La fórmula de la cuota se verificó de forma aislada contra el ejemplo del enunciado
(P=3000, n=12 → S/ 283.68) antes de sembrar los datos, y la migración inicial
(`prisma/migrations/20260921001808_init/`) fue generada por el propio CLI de Prisma
(`prisma migrate dev`), no escrita a mano.

## Decisiones técnicas — Paso 3 (frontend)

- **App Router** (`app/`) en vez de Pages Router: es el estándar actual de Next.js.
- **Dos rutas simples** (`/` para el formulario, `/solicitudes` para el listado) en vez de
  una sola página con pestañas: URLs directas para cada vista, sin necesidad de manejar
  estado de "vista activa".
- **`fetch` nativo + `useState`/`useEffect`**, sin librerías de data-fetching (React Query,
  SWR) ni de formularios (React Hook Form): para dos formularios/vistas simples,
  agregar esas dependencias es complejidad que no se justifica en el alcance de esta prueba.
- **`lib/api.ts` como única capa de acceso a la API**: los componentes no llaman `fetch`
  directamente ni conocen el formato de error del backend; `ApiValidationError` encapsula
  el caso 422 para que el formulario solo tenga que hacer `catch` y mapear `campo → motivo`.
- **Tailwind CSS** para estilos: utilidades directas en el JSX, sin CSS aparte que mantener
  sincronizado, coherente con "prioriza que sea claro y usable" del enunciado (no se evalúa
  estética).
- **CORS habilitado en el backend** (`app.enableCors`) apuntando a `http://localhost:3001`
  vía `FRONTEND_URL`, en vez de un proxy o un dominio wildcard — explícito y suficiente para
  desarrollo local.

## Herramientas de IA utilizadas

- **Claude** (Anthropic): configuración inicial del proyecto backend (scaffold NestJS,
  configuración de Prisma 7 + PostgreSQL, modelo de datos, seeder), y redacción de este
  README, guiado paso a paso con explicación de cada decisión técnica.
