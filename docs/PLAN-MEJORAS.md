# Plan de mejoras — shopping-cart-backend

Capas actuales: `routes → controllers → services → models`. Hay `schemas` (Joi), `dtos`, `middlewares` y `utils`. **No hay** repositorios, migraciones, tests, middleware de auth ni capa de config tipada.

Este documento es solo análisis y plan. **No implementa cambios.**

---

## Partes incompletas / a medias

| Feature | Evidencia |
|---|---|
| Auth JWT en rutas protegidas | `cart.controller.ts` usa `(req as any).user.id` pero **no existe** middleware que verifique el token ni asigne `req.user` |
| Update de usuario | `user.routes.ts:9` comentado; `UserService.updateUser` existe y no se expone |
| Carrito | Solo `add` + `get`. Falta update qty, remove, clear. Sin upsert ni control de stock |
| Roles | `User.role` (`user` \| `admin`) nunca se usa para autorizar |
| `successResponse` | Definido en `apiResponse.ts`, **nunca importado**. Controllers responden cada uno a su manera |
| Checkout / órdenes | No hay módulo |
| Tests | `package.json` script stub: `echo "Error: no test specified"` |
| README | Archivo vacío |
| Docker prod | `Dockerfile` hace `npm run build` y luego `CMD npm run dev`; línea `npm prune --production` comentada |

Patrón a medias: Joi en auth y products; **cero** validación en users y cart. `catchAsync` en auth/user/products; cart usa `try/catch` que no responde.

---

## 🔴 ALTA

### 1. Middleware JWT inexistente — carrito roto y API abierta

**Dónde:** `src/controllers/cart.controller.ts:7,25`; no hay `src/middlewares/auth*.ts`; `src/routes/*.ts`

**Por qué:** `addToCart`/`getCart` leen `req.user.id` sin que nadie lo setee → crash (`Cannot read properties of undefined`). Users y products (CRUD) no exigen token. Cualquiera lista/borra usuarios y crea productos.

**Cómo:** Middleware `authenticate` (`Authorization: Bearer`) que verifica JWT, tipa `req.user`, y se aplica a cart + mutaciones. `authorize('admin')` para create/update/delete de products y listado/borrado de users.

---

### 2. `dotenv.config()` después de instanciar Sequelize

**Dónde:** `src/index.ts:5` importa `./config/db`; `src/index.ts:12` llama `dotenv.config()`; `src/config/db.ts:10-19`

**Por qué:** `db.ts` lee `process.env` al cargar el módulo. En local sin Docker, `DB_*` llegan `undefined`. En Compose “funciona” porque el env ya está en el proceso.

**Cómo:** `import 'dotenv/config'` en la primera línea de `index.ts` (o `db.ts`), o módulo `src/config/env.ts` que valide y exporte config. Mover `dotenv` antes de cualquier import que use env.

---

### 3. `JWT_SECRET` no llega a Docker y no se valida

**Dónde:** `docker-compose.yml:23-30` (no pasa `JWT_SECRET`); `src/services/auth.service.ts:48-51`

**Por qué:** `jwt.sign(..., process.env.JWT_SECRET as string)` con `undefined` es secreto vacío/inestable. Login puede fallar o firmar inseguro.

**Cómo:** Inyectar `JWT_SECRET` en Compose. Fail-fast al boot si falta. Nunca castear a `string` sin check.

---

### 4. Signup devuelve el usuario con hash de password

**Dónde:** `src/services/auth.service.ts:23-24`; `src/controllers/auth.controller.ts:11-13`

**Por qué:** `User.create` + `return user` serializa `password`. Fuga de hash.

**Cómo:** Excluir `password` (`attributes` o DTO de respuesta). Mismo criterio que `UserService.getAllUsers`.

---

### 5. Login: errores genéricos + doble respuesta

**Dónde:** `src/services/auth.service.ts:34-46` (`throw new Error`); `src/controllers/auth.controller.ts:20-23`; `src/middlewares/errorHandler.ts:19-23`

**Por qué:** `Error` no es `AppError` → 500 en vez de 401. El handler mete `err.message` al cliente. En controller, si `!result` no hay `return` → posible `401` + `res.json(result)`.

**Cómo:** `AppError(..., 401)` con mensaje genérico (“Invalid credentials”). En handler, en prod no filtrar `err.message`. Tras `res.status(401)` hacer `return`.

---

### 6. Cart controller traga errores (request colgada)

**Dónde:** `src/controllers/cart.controller.ts:5-35`

**Por qué:** `catch { console.log(error) }` no llama `next` ni responde. El cliente espera hasta timeout. Inconsistente con `catchAsync`.

**Cómo:** Usar `catchAsync` + `AppError`. No tragar excepciones.

---

### 7. Validación Joi incompleta (body-only, rutas sin schema)

**Dónde:** `src/middlewares/validate.ts:12` (solo `req.body`); `src/routes/cart.routes.ts`; `src/routes/user.routes.ts`; `src/controllers/*` `parseInt(req.params.id)`

**Por qué:** Cart/users aceptan cualquier body. `id` en params no se valida → `NaN` a Sequelize. `validate` no cubre `params`/`query`.

**Cómo:** `validate({ body, params, query })`. Schemas para cart (`productId`, `quantity`) y params (`id: Joi.number().integer().positive()`). Aplicar en todas las rutas de escritura y las que usen `:id`.

---

### 8. `sequelize.sync()` en vez de migraciones

**Dónde:** `src/index.ts:47`; no existe `migrations/`

**Por qué:** `sync({ force: false })` no versiona schema ni altera columnas con seguridad. Comentarios con `sync()`/`drop()` son riesgo de pérdida de datos.

**Cómo:** `sequelize-cli` (o Umzug). Migraciones versionadas. Quitar `sync` del boot. Seeders aparte.

---

### 9. Docker contradictorio y sin hardening

**Dónde:** `Dockerfile`; `docker-compose.yml`; no hay `.dockerignore`

**Por qué:**

- Build `tsc` y arranque `npm run dev` (imagen de “prod” que es dev).
- `npm install` (no `npm ci`); sin multi-stage; sin user no-root.
- Compose: bind-mount, `depends_on` sin healthcheck, retry en `index.ts:56-60` que solo hace `process.exit(1)`.
- `version: '3.8'` obsoleto.

**Cómo:** Multi-stage: build → `node dist/index.js`. Dev: Compose + volume + `ts-node-dev`. Healthcheck Postgres (`pg_isready`) y `depends_on: condition: service_healthy`. `.dockerignore` (`node_modules`, `.env`, `dist`). No commitear secretos.

---

### 10. Superficie de seguridad HTTP

**Dónde:** `src/index.ts:15-17`; dependencias

**Por qué:** `cors()` abierto. Sin Helmet, rate limit, ni límite de JSON. Login brute-forceable. `.gitignore:3` tiene `dits` (typo) → `dist/` no se ignora.

**Cómo:** Helmet; CORS con origin explícito; `express.json({ limit })`; rate limit en `/auth/*`. Corregir `.gitignore` (`dist`). Auditar deps (`@types/cors` con espacio `"^ 2.8.19"`; `@types/joi` deprecado; Express 5 vs `@types/express@4`; `@types/sequelize@4` vs Sequelize 6).

---

## 🟡 MEDIA

### 11. Respuestas HTTP inconsistentes

**Dónde:** controllers; `src/utils/apiResponse.ts` sin uso

Ejemplos: `succes` (typo) vs `success`; GET products/getById/update/delete devuelven **201** (`products.controller.ts:20,30,41,52`); delete user `{ error: 'User was delete' }` (`user.controller.ts:23`); auth no usa el envelope del error handler.

**Cómo:** Usar `successResponse` (o similar) en todos los controllers. GET=200, create=201, delete=204 o 200 con mensaje. Un solo shape `{ success, message, data }`.

---

### 12. Lógica de carrito incompleta / incorrecta

**Dónde:** `src/services/cart.service.ts`; `src/models/cart.model.ts`

**Por qué:** Cada add crea fila nueva (sin unique `userId+productId`). No chequea `stock`. No hay update/remove. `updateAt` vs `updatedAt` (`cart.model.ts:12,23`). Sin transacción.

**Cómo:** Unique compuesto; upsert (sumar qty); validar stock; endpoints PATCH/DELETE; transacción al descontar stock (cuando exista checkout).

---

### 13. Roles y autorización no implementados

**Dónde:** `src/models/user.model.ts:9,47-50`; JWT payload solo `{ id, email }` (`auth.service.ts:49`)

**Pregunta abierta:** ¿CRUD de productos y users debe ser solo `admin`? ¿El carrito solo el dueño?

**Cómo:** Meter `role` en el JWT; middleware `authorize`. No confiar en `userId` del body.

---

### 14. Capa de config y pool Sequelize

**Dónde:** `src/config/db.ts` (sin `pool`); env suelto

**Cómo:** `env.ts` con Joi/Zod (PORT, DB_*, JWT_SECRET). Pool (`max`, `idle`, `acquire`). Logging de SQL solo en dev. No loguear config en prod (`db.ts:3-8`).

---

### 15. TypeScript: duplicación y `any`

**Dónde:** `ProductAttributes` en `models/product.model.ts` y `dtos/product.dto.ts`; `UpdateUserDto.name` vs modelo `username` (`user.dto.ts:8`); `errorHandler.ts:4` `err: any`; `catchAsync` `Promise<any>`; `(req as any).user`

**Cómo:** Un solo tipo de dominio. DTO de update alineado. Extender `Express.Request`. `unknown` en catch. Quitar `@types/joi` y `@types/sequelize` si no hacen falta.

---

### 16. Lint duplicado / Prettier ausente

**Dónde:** `eslint.config.js` (flat, plugins no están en `package.json`); `package.json` `eslintConfig` + script `ts-standard --fix`

**Por qué:** Tres fuentes de verdad. `eslint.config.js` probablemente no corre.

**Cómo:** Una herramienta (ESLint flat **o** ts-standard). Añadir Prettier o dejar que Standard formatee. `lint` en CI sin `--fix` ciego.

---

### 17. Rutas y versionado

**Dónde:** `src/index.ts:25-28` todo bajo `/api`; paths verbosos (`/products/create-new-product`, `/users/user/:id`)

**Cómo:** `/api/v1`. REST: `POST /products`, `GET /products/:id`, `PATCH /products/:id`, `DELETE /products/:id`. Update de product hoy manda `id` en body (`products.routes.ts:12`) — mejor en params.

---

### 18. Capa de datos y asociaciones

**Dónde:** services hablan a modelos; asociaciones solo al importar `cart.model.ts:66-69`

**Por qué:** Si alguien usa User/Product sin importar Cart, no hay asociaciones. No hay transacciones en flujos multi-tabla.

**Cómo:** `src/models/index.ts` que registre modelos + associations. Repositorio solo si el proyecto va a crecer (órdenes, pagos); hoy services finos bastan, pero hay que ser consistentes.

---

### 19. Sin 404 de ruta, sin shutdown, sin healthcheck app

**Dónde:** `src/index.ts`

**Cómo:** `GET /health` (db ping). Middleware 404. `SIGTERM` cierra HTTP + Sequelize.

---

### 20. Contratos Joi vs modelo

**Dónde:** `product.schema.ts:15` `price` integer vs `DECIMAL(10,2)`; `stock` `.positive()` rechaza 0; categorías copiadas en schema, model y DTO.

**Cómo:** `Joi.number().positive()` (decimales); stock `min(0)`. Enum de categorías en un solo módulo.

---

## 🟢 BAJA

### 21. Naming y typos

`ProdutsController`; `succes`; `productoData`; “User not foud”; “User was delete”; `products.service.ts` vs `product.model.ts`.

### 22. `tsconfig.json` boilerplate

~120 líneas comentadas. `target: es2016`. Activar `sourceMap`, `noUncheckedIndexedAccess`; target `ES2022` (Node 20).

### 23. Código muerto

Bloques comentados en `index.ts:31-42`, `catchAsync.ts:3-7`, `auth.service.ts:39-43`, `cart.controller.ts:8-9`. `export { Cart }` duplicado (`cart.model.ts:70`). `GET /api` → `"Hello world!"`.

### 24. README vacío

Setup Docker, env (`.env.example` ya lista vars), scripts, endpoints.

### 25. Tests (cuando existan)

Vitest o Jest + Supertest. Prioridad: auth, cart (stock/upsert), validate, errorHandler. Hoy cobertura = 0.

### 26. i18n de errores

Mezcla ES (`El email ya está en uso`) e EN (`Invalid credentials services`). Elegir un idioma.

---

## Preguntas abiertas (no asumir)

1. ¿El CRUD de productos/users es solo admin, o también usuarios autenticados?
2. Carrito: ¿una línea por producto (upsert) o líneas repetidas?
3. ¿Checkout/órdenes entra en el backlog cercano? (cambia transacciones y stock)
4. ¿Docker Compose es solo dev, o también el deploy?
5. ¿Stack de test preferido (Jest vs Vitest)?

---

## Resumen ejecutivo

El esqueleto (Express + Sequelize + Joi + capas routes/controllers/services) es razonable para un backend de carrito, pero **no está listo para uso real**. El agujero más grave es seguridad: no hay middleware JWT, el carrito asume `req.user` que nadie setea, y el CRUD de users/products está abierto. Sumado a eso: env mal cargado, `JWT_SECRET` ausente en Compose, signup que filtra el hash, errores de login mal tipados, y Docker que construye prod y corre `dev`. La calidad es desigual (Joi/catchAsync/AppError a medias, respuestas 201 en GET, cero tests, `sync` sin migraciones). Conviene cerrar auth + validación + env/Docker **antes** de seguir features (update user, checkout).
