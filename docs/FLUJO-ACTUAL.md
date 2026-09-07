# Flujo actual — shopping-cart-backend

Esquema del flujo **tal como está hoy**. Las cajas/líneas **rotas o a medias** van marcadas. Este documento no implementa cambios.

El plan de mejoras está en `docs/PLAN-MEJORAS.md`.

---

## Entrada HTTP

```
Cliente HTTP
    │
    ▼
src/index.ts
  cors() ── express.json() ── morgan('dev')
    │
    ├── GET /api  → "Hello world!"          [placeholder]
    ├── /api + auth.routes
    ├── /api + user.routes
    ├── /api + product.routes
    ├── /api + cart.routes
    ├── errorHandler
    └── [NO] 404 catch-all                  [falta]
    └── [NO] /health                        [falta]
```

```
                    ┌─────────────────────────────────────────┐
                    │              MIDDLEWARES                 │
                    │  validate(schema)  → solo req.body      │
                    │  errorHandler      → AppError vs Error  │
                    │  [NO] authenticate JWT                  │
                    │  [NO] authorize(role)                   │
                    └─────────────────────────────────────────┘
```

---

## Auth (el más completo, igual con agujeros)

```
POST /api/auth/register
  → validate(signupSchema)     ✓ Joi
  → AuthController.signup      ✓ catchAsync
  → AuthService.signup
  → User.create + bcrypt
  → JSON 201 { user }          ✗ incluye password hash

POST /api/auth/login
  → validate(loginSchema)      ✓ Joi
  → AuthController.login       ✗ 401 sin return (doble res)
  → AuthService.login
  → bcrypt.compare + jwt.sign(JWT_SECRET)
  → { token, user }            ✗ JWT_SECRET no validado / no en Compose
                               ✗ throw Error → 500, no 401
```

El token **se emite** pero **nunca se consume**. No hay middleware que ponga `req.user`.

---

## Users (CRUD a medias, sin auth ni Joi)

```
GET    /api/users                 → getAll          [ABIERTO, sin token]
GET    /api/users/user/:id        → getById         [sin validate params]
DELETE /api/users/delete-user/:id → deleteById      [ABIERTO]
PUT    /api/users/update-user     → COMENTADO       [incompleto]
                                    UserService.updateUser existe, no se expone
```

---

## Products (Joi en create/update; sin auth; HTTP mal)

```
GET    /api/products                         → getAll     ✗ status 201
GET    /api/products/product/:id             → getById    ✗ 201, sin validate id
POST   /api/products/create-new-product      → create     ✓ Joi  ✗ sin auth/admin
PUT    /api/products/update-product          → update     ✓ Joi  ✗ id en body
DELETE /api/products/delete-product/:id      → delete     ✗ 201, sin auth
```

---

## Cart (el más roto)

```
POST /api/cart/add-to-cart
GET  /api/cart
         │
         ▼
  CartController
    userId = req.user.id        ✗ nadie setea req.user → crash
    try/catch console.log       ✗ no responde (request colgada)
    [NO] Joi
         │
         ▼
  CartService.addToCart / getCart
    Product.findByPk            ✓ 404 si no existe
    Cart.create siempre         ✗ no upsert, no stock, no unique
    [NO] update qty / remove / clear
```

---

## Capas (lo que hay vs lo que falta)

```
  Request
     │
     ▼
  routes          ✓  4 routers, sin /api/v1
     │
     ▼
  middlewares     ~  validate + errorHandler
                     [NO] auth, [NO] authorize
     │
     ▼
  controllers     ~  catchAsync (auth/user/products)
                     cart distinto; successResponse sin usar
     │
     ▼
  services        ✓  hablan directo a modelos
     │               [NO] repositorios  (ok por tamaño)
     ▼
  models          ~  User, Product, Cart
  Sequelize          associations solo al importar cart.model
                     sequelize.sync() en boot  [NO migraciones]
     │
     ▼
  PostgreSQL
```

### Boot

```
index.ts importa db.ts  →  Sequelize(process.env.*)
         │
         ▼
dotenv.config()         ✗ TARDE: env local undefined
         │
sequelize.authenticate() + sync({ force: false })
         │
listen(PORT)
         │
catch → setTimeout → process.exit(1)   ✗ no reintenta de verdad
```

---

## Leyenda

| Marca | Significado |
|---|---|
| ✓ | Implementado y usable |
| ~ | Existe, a medias o inconsistente |
| ✗ | Roto, inseguro o incompleto |
| **[NO]** | No existe; próximo a añadir según el plan |

**Prioridad de cierre (plan):** JWT middleware → env/dotenv + `JWT_SECRET` → no filtrar password → login/cart errors → Joi en cart/users → migraciones → Docker.
