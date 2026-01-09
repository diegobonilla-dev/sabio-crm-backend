# SaBio CRM - Backend API

## Propósito
API RESTful para gestión de CRM agrícola con operaciones post-venta, diagnósticos de fincas, gestión de leads, empresas, usuarios y laboratorio.

## Stack Tecnológico
- **Runtime**: Node.js 20+ (ES Modules)
- **Framework**: Express.js 5.1.0
- **Base de Datos**: MongoDB + Mongoose 8.19.2
- **Autenticación**: JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.3
- **Documentación**: Swagger UI + swagger-jsdoc 6.2.8
- **Upload**: Multer 2.0.2
- **Email**: Nodemailer 7.0.11
- **HTTP Client**: Axios 1.13.1

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Conexión MongoDB
│   │   └── swagger.js           # Configuración OpenAPI
│   ├── controllers/             # Lógica de negocio (13 controllers)
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── lead.controller.js
│   │   ├── empresa.controller.js
│   │   ├── finca.controller.js
│   │   ├── corporativo.controller.js
│   │   ├── compost.controller.js
│   │   ├── laboratorio.controller.js
│   │   ├── operaciones.controller.js
│   │   ├── visita.controller.js
│   │   ├── diagnostico.controller.js
│   │   ├── image.controller.js
│   │   ├── passwordReset.controller.js
│   │   └── ubicacion.controller.js
│   ├── models/                  # Esquemas Mongoose (16 models)
│   │   ├── user.model.js
│   │   ├── lead.model.js
│   │   ├── empresa.model.js
│   │   ├── finca.model.js
│   │   ├── corporativo.model.js
│   │   ├── actividad.model.js
│   │   ├── diagnostico.model.js
│   │   ├── muestra.model.js
│   │   ├── pilaCompost.model.js
│   │   ├── plantillaCompost.model.js
│   │   ├── producto.model.js
│   │   ├── VisitaTecnica.model.js
│   │   ├── aplicacion.model.js
│   │   ├── passwordReset.model.js
│   │   └── ubicacion.model.js
│   ├── routes/                  # Definición de endpoints (14 routers)
│   │   ├── index.routes.js      # Agregador principal
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── lead.routes.js
│   │   ├── empresa.routes.js
│   │   ├── finca.routes.js
│   │   ├── corporativo.routes.js
│   │   ├── compost.routes.js
│   │   ├── laboratorio.routes.js
│   │   ├── operaciones.routes.js
│   │   ├── visita.routes.js
│   │   ├── diagnostico.routes.js
│   │   ├── image.routes.js
│   │   └── ubicacion.routes.js
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT verification + role-based access
│   │   ├── errorHandler.js      # Global error handling
│   │   └── upload.middleware.js # Multer configuration
│   ├── utils/
│   │   ├── asyncHandler.js      # Async/await wrapper
│   │   ├── emailService.js      # Nodemailer para reset password
│   │   └── imageService.js      # Cliente para image-service
│   ├── services/
│   │   └── imageService.js      # Clase para gestión de imágenes
│   ├── data/                    # Datos estáticos (departamentos/municipios)
│   ├── seeds/                   # Scripts de seed para BD
│   ├── scripts/                 # Utilidades (crear usuarios, reset password)
│   ├── templates/               # Templates HTML para emails
│   ├── app.js                   # Configuración Express
│   └── index.js                 # Entry point
├── .env                         # Variables de entorno (no versionado)
├── .env.example                 # Template de variables
└── package.json
```

## Arquitectura

### Patrón: MVC + Capas

```
Request → Routes → Middlewares → Controllers → Models → MongoDB
                         ↑
                    Services/Utils
```

### Flujo de Autenticación

1. POST /api/v1/auth/login con {email, password}
2. Validar contraseña con bcrypt.compare()
3. Generar JWT con HS256 (válido 1 día)
4. Cliente envía token en header: `Authorization: Bearer <token>`
5. Middleware `protect` verifica JWT y adjunta req.user
6. Middleware `adminOnly` valida rol

### Sistema de Roles

```javascript
- sabio_admin: Acceso total
- sabio_vendedor: Gestiona leads
- sabio_tecnico: Accede a empresas/fincas asignadas
- sabio_laboratorio: Módulo de muestras
- cliente_owner: Propietario de empresa
- cliente_empleado: Acceso limitado a fincas específicas
- corporativo_usuario: Usuario corporativo
```

## Modelos de Datos Principales

### Jerarquía de Dominio

```
User → Lead → Empresa → Finca → [Diagnósticos, Visitas, Compost, etc.]
                          ↕
                     Corporativo (M-N)
```

### Relaciones Clave

- **Lead → Empresa**: 1-1 (cuando se convierte)
- **Empresa → Fincas**: 1-N
- **Finca → Corporativos**: M-N (arrays de ObjectId)
- **Finca → Divisiones**: Subdocumentos anidados (primarias → secundarias → terciarias)
- **Lead → Actividades**: 1-N (embedded references)

## Rutas API (Prefix: /api/v1)

### Públicas
- POST /auth/login
- POST /auth/forgot-password
- POST /auth/verify-otp
- POST /auth/reset-password
- GET /ubicaciones (departamentos y municipios)
- GET /health

### Protegidas (require JWT)
- /users (CRUD usuarios, solo admin)
- /leads (CRUD leads, actividades)
- /empresas (CRUD empresas)
- /fincas (CRUD fincas, divisiones, corporativos)
- /corporativos (CRUD corporativos)
- /compost (gestión pilas compost)
- /lab (muestras laboratorio)
- /operaciones (operaciones agrícolas)
- /visitas (visitas técnicas)
- /diagnosticos (diagnósticos de fincas)
- /images (upload/delete imágenes vía microservicio)

## Variables de Entorno Requeridas

```env
# Servidor
PORT=4000

# Base de Datos
MONGO_URI=mongodb+srv://...

# Autenticación
JWT_SECRET=clave-secreta-larga

# Microservicio de Imágenes
IMAGE_SERVICE_URL=http://localhost:3002
IMAGE_SERVICE_API_KEY=api-key-imagen

# Email (opcional)
GMAIL_USER=usuario@gmail.com
GMAIL_APP_PASSWORD=app-password
```

## Comandos Importantes

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Crear usuario admin manualmente
node src/scripts/createUser.js
```

## Integración con Microservicio de Imágenes

El backend actúa como proxy para subir/eliminar imágenes:

```javascript
// src/services/imageService.js
class ImageService {
  async uploadImage(file, options = {}) {
    // POST a IMAGE_SERVICE_URL/upload
  }

  async deleteImage(imagePath) {
    // DELETE a IMAGE_SERVICE_URL/api/images/{encodedPath}
  }
}
```

## Patrones de Código Importantes

### 1. Validación de Rol en Consultas
```javascript
// Controllers filtran según rol del usuario
if (req.user.role === 'cliente_owner') {
  query.empresa_owner = req.user.empresa;
} else if (req.user.role === 'cliente_empleado') {
  query._id = { $in: req.user.fincas_acceso };
}
```

### 2. Populate con Proyecciones
```javascript
Lead.find(query)
  .populate('owner', 'name email')
  .populate('empresa_convertida', 'nombre_comercial NIT')
  .sort({ createdAt: -1 })
```

### 3. Hooks Pre-save
```javascript
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
});
```

### 4. Limpieza de Respuestas
```javascript
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};
```

## Manejo de Errores

### Middleware Global (errorHandler.js)
- CastError → 404 "Recurso no encontrado"
- E11000 (duplicación) → 400 "Error de duplicación"
- ValidationError → 400 con detalles
- Otros → statusCode definido o 500

### Wrapper Async
```javascript
// Evita try-catch en controllers
asyncHandler(async (req, res) => {
  // código async aquí
})
```

## Documentación API

Acceder a Swagger UI en desarrollo:
```
http://localhost:4000/api-docs
```

Los endpoints están documentados con comentarios JSDoc en los archivos de routes.

## Dependencias con Otros Servicios

### Requiere:
- MongoDB (MONGO_URI)
- Image Service (IMAGE_SERVICE_URL)

### Consumido por:
- Frontend (Next.js)
- Image Dashboard (solo login)

## Notas de Desarrollo

1. **Archivos copiados**: Existen archivos con sufijo "copy.js" que pueden ser residuos de iteraciones previas
2. **Módulos sin implementar**: Algunos controllers (compost, laboratorio, operaciones) pueden estar incompletos
3. **Seeds disponibles**: Usar `src/seeds/seed-colombia-locations.js` para poblar ubicaciones
4. **Logs**: No hay logging estructurado (considerar Winston o similar)
5. **Tests**: No hay suite de tests (agregar Jest o Mocha en futuro)

## Próximos Pasos Recomendados

- Implementar logging estructurado (Winston)
- Agregar tests unitarios y de integración
- Validar entrada con Joi o Zod en controllers
- Implementar refresh tokens
- Agregar rate limiting por endpoint
- Dockerizar para despliegue
