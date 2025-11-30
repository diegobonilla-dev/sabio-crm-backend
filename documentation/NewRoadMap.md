# Roadmap del Proyecto SaBio (Backend MERN)

## ✅ Fase 1: Configuración y Núcleo

- [x] **Paso 1:** Inicialización del proyecto y estructura de carpetas (`/src`, `/models`, `/controllers`...).
- [x] **Paso 2:** Instalación de dependencias (Express, Mongoose, Nodemon, Axios).
- [x] **Paso 3:** Creación del servidor Express básico (`app.js`, `index.js`, scripts de npm).
- [x] **Paso 4:** Conexión a la base de datos en MongoDB Atlas (`database.js`).
- [x] **Paso 5:** Creación de los Modelos del CRM (`lead.model.js`, `actividad.model.js`).
- [x] **Paso 6:** Creación de Modelos de Jerarquía (`user.model.js`, `empresa.model.js`, `corporativo.model.js`).
- [x] **Paso 7:** Creación del Modelo Operativo Principal (`finca.model.js` con Zonas y Lotes embebidos).
- [x] **Paso 7.Refactor:** Refactorización de `Finca` a `divisiones_primarias` y `secundarias` (basado en `NOTES.md`).

## ✅ Fase 2: Seguridad y Documentación

- [x] **Paso 8:** Definición y conexión de las rutas de la API (`index.routes.js`).
- [x] **Paso 9:** Creación del primer controlador (`user.controller.js`) y prueba de guardado en la BD.
- [x] **Paso 10:** Instalación y configuración de la documentación con **Swagger** (`swagger.js`).
- [x] **Paso 11:** Hashing de contraseñas con **bcryptjs** (hook `pre.save` en `user.model.js`).
- [x] **Paso 12:** Implementación de Login (`auth.controller.js`) y autenticación con **JWT**.
- [x] **Paso 14:** Creación del middleware `protect` para asegurar rutas (`auth.middleware.js`).
- [x] **Paso 15:** Limpieza de contraseñas en las respuestas JSON (método `toJSON` en `user.model.js`).
- [ ] **Paso 13 (Pendiente):** Implementar el login con **Google OAuth** (usando Passport.js).

## ⏳ Fase 3: Lógica de Negocio - Backend (En Progreso)

- [x] **Paso 16:** Flujo del CRM (Crear y Obtener Leads) (Cubre `HU-COMERCIAL-2`).
- [x] **Paso 17:** Flujo Operativo (Conversión de Lead a Empresa, CRUD de Fincas, Divisiones Primarias y Secundarias) (Cubre `HU-COMERCIAL-5`).
- [x] **Paso 18:** Flujo de Compost (Crear Plantillas, Pilas y Seguimiento) (Cubre `HU-CLIENTE-4`, `HU-CLIENTE-5`).
- [x] **Paso 19:** Flujo de Laboratorio (Crear Muestra y Añadir Resultados) (Cubre `HU-LAB-1`, `HU-LAB-3`).
- [x] **Paso 20:** Flujo de Operaciones de Campo (Crear Producto y Aplicación) (Cubre `HU-CLIENTE-3`, `HU-GERENTE-3`).
- [ ] **Paso 21 (Nuevo):** Flujo de Inventario (Crear Modelo `InventarioEntrega`, Endpoints de registro y consulta) (Cubre `HU-GESTOR-5`).
- [ ] **Paso 22 (Nuevo):** Flujo de Gestión de Tareas/Actividades (Crear Modelo `Tarea`, Endpoints CRUD) (Cubre `HU-COMERCIAL-3`, `HU-GESTOR-8`, `HU-GESTOR-12`, `HU-GESTOR-13`, `HU-GESTOR-16`).
- [ ] **Paso 23 (Nuevo):** Flujo de Configuración (Endpoints `PATCH /empresas/:id/configuracion` para `franja_horaria`) (Cubre `HU-GESTOR-2`).
- [ ] **Paso 24 (Nuevo):** Endpoints de Agregación (Dashboards y Hoja de Vida).
    - [ ] `GET /api/v1/dashboard/gestor` (Cubre `HU-GESTOR-1`, `HU-GESTOR-10`, `HU-GESTOR-21`, `HU-GESTOR-22`).
    - [ ] `GET /api/v1/dashboard/gerente` (Cubre `HU-GERENTE-1`).
    - [ ] `GET /api/v1/dashboard/cliente` (Cubre `HU-CLIENTE-1`).
    - [ ] `GET /api/v1/dashboard/comercial` (Cubre `HU-COMERCIAL-1`).
    - [ ] `GET /api/v1/empresas/:id/hoja-de-vida` (Cubre `HU-GESTOR-4`, `HU-CLIENTE-2`, `HU-GERENTE-4`, `HU-GESTOR-11`).
- [ ] **Paso 25 (Nuevo):** Middleware de Roles (`checkRole`) (Cubre `HU-GERENTE-2` y protege todos los endpoints).
- [ ] **Paso 26 (Nuevo):** Endpoint de Generación de QR (`GET /lab/muestras/:id/qr`) (Cubre `HU-GESTOR-3`, `HU-LAB-1`).

## ⬜ Fase 4: Integraciones Externas (Pendiente)

- [ ] **Paso 27:** Configuración del Webhook Receiver (para N8N / WhatsApp).
- [ ] **Paso 28:** Lógica de Chatbot (Procesamiento de reportes de Clientes, notas de voz, fotos) (Cubre `HU-CLIENTE-1` a `HU-CLIENTE-29`, `HU-GESTOR-6`, `HU-GESTOR-25`).
- [ ] **Paso 29:** Lógica de Notificaciones (Alertas de inactividad, recordatorios) (Cubre `HU-GESTOR-9`, `HU-COMERCIAL-6`).
- [ ] **Paso 30:** Integración Climática (API Externa) (Cubre `HU-GESTOR-18`).

## ⬜ Fase 5: Frontend (Next.js) (Pendiente)

- [ ] **Paso 31:** Setup (Axios, State, UI, Layouts).
- [ ] **Paso 32:** Vistas de Autenticación (Login, Google).
- [ ] **Paso 33:** Módulo Comercial (Pipeline visual, Lista de Leads, Registro de Actividades) (Cubre `HU-COMERCIAL-1, 3, 4`).
- [ ] **Paso 34:** Módulo Gestor (Dashboard, Hoja de Vida, Calendario, Mapa, Gestión de Tareas) (Cubre `HU-GESTOR-1, 4, 12, 14`).
- [ ] **Paso 35:** Módulo Cliente (Dashboard simple, Historial de Muestras) (Cubre `HU-CLIENTE-1, 2, 6`).
- [ ] **Paso 36:** Módulo Laboratorio (Cola de muestras, Carga de resultados) (Cubre `HU-LAB-2, 3, 4`).
- [ ] **Paso 37:** Módulo Gerente (Dashboard General, Gestión de Usuarios, Catálogo de Productos) (Cubre `HU-GERENTE-1, 2, 3`).

## ⬜ Fase 6: Migración y Despliegue (Pendiente)

- [ ] **Paso 38:** Escribir el **script de migración** para mover los datos de Xano a nuestra nueva DB.
- [ ] **Paso 39:** Despliegue del backend (en Render, Vercel, o AWS).
- [ ] **Paso 40:** Configurar CI/CD (GitHub Actions).