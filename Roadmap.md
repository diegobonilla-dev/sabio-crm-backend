# Roadmap del Proyecto SaBio (Backend MERN) Flujo Base

## ✅ Fase 1: Configuración y Núcleo

- [x] **Tarea 1:** Inicialización del proyecto y estructura de carpetas (`/src`, `/models`, `/controllers`...).
- [x] **Tarea 2:** Instalación de dependencias (Express, Mongoose, Nodemon, Axios).
- [x] **Tarea 3:** Creación del servidor Express básico (`app.js`, `index.js`, scripts de npm).
- [x] **Tarea 4:** Conexión a la base de datos en MongoDB Atlas (`database.js`).
- [x] **Tarea 5:** Creación de los Modelos del CRM (`lead.model.js`, `actividad.model.js`).
- [x] **Tarea 6:** Creación de Modelos de Jerarquía (`user.model.js`, `empresa.model.js`, `corporativo.model.js`).
- [x] **Tarea 7:** Creación del Modelo Operativo Principal (`finca.model.js` con Zonas y Lotes embebidos).

## ✅ Fase 2: Seguridad y Documentación

- [x] **Tarea 8:** Definición y conexión de las rutas de la API (`index.routes.js`).
- [x] **Tarea 9:** Creación del primer controlador (`user.controller.js`) y prueba de guardado en la BD.
- [x] **Tarea 10:** Instalación y configuración de la documentación con **Swagger** (`swagger.js`).
- [x] **Tarea 11:** Hashing de contraseñas con **bcryptjs** (hook `pre.save` en `user.model.js`).
- [x] **Tarea 12:** Implementación de Login (`auth.controller.js`) y autenticación con **JWT**.
- [ ] **Tarea 13:** Implementar el login con **Google OAuth** (usando Passport.js).
- [x] **Tarea 14:** Creación del middleware `protect` para asegurar rutas (`auth.middleware.js`).
- [x] **Tarea 15:** Limpieza de contraseñas en las respuestas JSON (método `toJSON` en `user.model.js`).

## ⏳ Fase 3: Lógica Basica de Negocio (En Progreso)

- [x] **Tarea 16:** Construir el Flujo del CRM (Crear y Obtener Leads).
- [x] **Tarea 17:** Construir el Flujo Operativo (Conversión de Lead a Empresa, CRUD de Fincas, Zonas y Lotes).
- [x] **Tarea 18:** Construir el Flujo de "Plantillas vs. Instancias" (Compost y Bioreactor).
- [x] **Tarea 19:** Construir el Flujo de Laboratorio (Subida de muestras y resultados).
- [x] **Tarea 20:** Construir el Flujo de Operaciones de Campo (Aplicaciones, Ganado).
- [ ] **Tarea 21:** Implementar Subida de Archivos (ej. para `imagen_zona` con Cloudinary/S3).
- [ ] **Tarea 22:** Implementar sistema de permisos basado en Roles (Middleware de Roles).

## ⬜ Fase 4: Migración y Despliegue (Pendiente)

- [ ] **Tarea 23:** Escribir el **script de migración** para mover los datos de Xano a nuestra nueva DB.
- [ ] **Tarea 24:** Despliegue del backend (en Render, Vercel, o AWS, sin decidir).
- [ ] **Tarea 25:** Configurar CI/CD (GitHub Actions).

## ⬜ Fase 5: Frontend (Next.js) (Pendiente)

- [ ] **Tarea 26:** Inicializar proyecto Next.js.
- [ ] **Tarea 27:** Definir la librería de UI (ej. Chakra, Shadcn, TailwindCSS).
- [ ] **Tarea 28:** Configurar la gestión de estado (Context API, Zustand, o Redux).
- [ ] **Tarea 29:** Crear servicio de API (instancia de Axios) y hooks de datos (SWR / React-Query).
- [ ] **Tarea 30:** Construir Layouts de App (Dashboard Admin, Dashboard Cliente).
