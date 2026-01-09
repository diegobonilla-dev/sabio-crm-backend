# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SaBio Backend is a CRM and operations management system for regenerative agriculture. It manages leads, client companies (Empresas), farms (Fincas), corporate supervisors (Corporativos), and farm activities.

## Development Commands

```bash
# Development (with auto-reload)
npm run dev

# Production start
npm start
```

## Environment Variables

Required variables in `.env`:
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token generation and verification
- `PORT` (optional) - Server port, defaults to 3000

## Core Architecture

### API Structure
- Base API path: `/api/v1`
- Swagger documentation: `/api-docs`
- All protected routes require JWT Bearer token in `Authorization` header

### Data Models & Relationships

**User Model** ([src/models/user.model.js](src/models/user.model.js))
- Role-based access: `sabio_admin`, `sabio_vendedor`, `sabio_tecnico`, `sabio_laboratorio`, `cliente_owner`, `cliente_corporate`
- Users with `cliente_owner` role must reference an Empresa
- Users with `cliente_corporate` role must reference a Corporativo
- Passwords are automatically hashed on save using bcrypt
- Password comparison method: `user.comparePassword(password)`
- toJSON automatically excludes password and __v fields

**Lead Model** ([src/models/lead.model.js](src/models/lead.model.js))
- CRM funnel stages: `Nuevo`, `Contactado`, `Cotizado`, `Negociacion`, `Ganado`, `Perdido`
- References owner (User with `sabio_vendedor` role)
- When won, converts to Empresa via `empresa_convertida` field
- Has many Actividades (activities)

**Empresa Model** ([src/models/empresa.model.js](src/models/empresa.model.js))
- Represents client companies (post-sale)
- References account_manager (User) and lead_origen (Lead)
- Has many Fincas (farms)
- Embeds contacto_contabilidad subdocument

**Finca Model** ([src/models/finca.model.js](src/models/finca.model.js))
- Represents farms with hierarchical structure: Finca → Zonas → Lotes
- Belongs to one Empresa (empresa_owner)
- Many-to-many relationship with Corporativos (corporativos_asociados)
- Uses embedded subdocuments for Zonas and Lotes (not separate collections)

**Corporativo Model** ([src/models/corporativo.model.js](src/models/corporativo.model.js))
- Represents corporate entities that supervise multiple farms (e.g., Starbucks)
- Many-to-many relationship with Fincas (fincas_asociadas)

**Actividad Model** ([src/models/actividad.model.js](src/models/actividad.model.js))
- CRM activity tracking for Leads
- Types: `Llamada`, `Email`, `Reunion`, `WhatsApp`, `Nota`
- References Lead and User (creada_por)

### Authentication Flow

**JWT Authentication** ([src/middlewares/auth.middleware.js](src/middlewares/auth.middleware.js))
- Protected routes use `protect` middleware
- Expects `Authorization: Bearer <token>` header
- Decoded user is attached to `req.user` (without password)
- Token verification uses `JWT_SECRET` from environment

**Login** ([src/controllers/auth.controller.js](src/controllers/auth.controller.js))
- Password verification uses `user.comparePassword()` method
- JWT token generated with user ID as payload

### Route Organization

Routes are modularized under [src/routes/](src/routes/):
- [index.routes.js](src/routes/index.routes.js) - Main router combining all route modules
- [auth.routes.js](src/routes/auth.routes.js) - Authentication endpoints (`/api/v1/auth`)
- [user.routes.js](src/routes/user.routes.js) - User CRUD endpoints (`/api/v1/users`)
- [lead.routes.js](src/routes/lead.routes.js) - Lead/CRM endpoints (`/api/v1/leads`)
- [finca.routes.js](src/routes/finca.routes.js) - Farm operations endpoints (`/api/v1/fincas`)

### Application Structure

- [src/app.js](src/app.js) - Express app configuration (middlewares, CORS, routes, Swagger)
- [src/index.js](src/index.js) - Server startup (loads .env, connects DB, starts server)
- Server listens on `PORT` environment variable or defaults to 3000

### Hierarchical Finca Operations

Fincas use nested operations for the Finca → Zona → Lote hierarchy:
- `POST /api/v1/fincas/:empresaId` - Create a new Finca for an Empresa
- `POST /api/v1/fincas/:fincaId/zonas` - Add a Zona to a Finca (embedded subdocument)
- `POST /api/v1/fincas/:fincaId/zonas/:zonaId/lotes` - Add a Lote to a Zona (embedded subdocument)

## Important Implementation Notes

### Model Conventions
- Use ES module syntax (`import`/`export`) - this project has `"type": "module"` in package.json
- All models use timestamps: `{ timestamps: true }` for automatic createdAt/updatedAt
- Mongoose references use `Schema.Types.ObjectId` with `ref` to model name
- Conditional required fields use functions: `required: function() { return this.role === 'cliente_owner'; }`

### Embedded vs Referenced Documents
- **Embedded**: Lotes within Zonas, Zonas within Fincas, contacto_contabilidad within Empresa
- **Referenced**: All other relationships (User-Empresa, Lead-Empresa, Finca-Corporativo, etc.)

### Database Connection
- Database initialization happens in [src/config/database.js](src/config/database.js)
- Connection is established on server start in [src/index.js](src/index.js)
- Process exits with code 1 if MongoDB connection fails

### Swagger Documentation
- Configuration in [src/config/swagger.js](src/config/swagger.js)
- Swagger comments are read from all files in `src/routes/*.js`
- Bearer authentication is configured globally for all endpoints
- Individual routes can override with `security: []` in Swagger comments

### Testing
- No test framework is currently configured
- `npm test` will fail with "Error: no test specified"
- Future test setup should consider Jest or Mocha for unit/integration tests
