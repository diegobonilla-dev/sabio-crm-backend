# Punto 2 y 3 (Recalculado): Esfuerzo en Días y Plan de Sprints (Gestor de Seguimiento)

Este plan desglosa las Historias de Usuario (HUs) validadas del "Gestor de Seguimiento", estimando el esfuerzo basado en **1 desarrollador Full-Stack (Semisenior) a tiempo completo**.

**Definición de Esfuerzo (Días):**
* **0.5 Días:** Tarea que toma media jornada (4h) o menos.
* **1.0 Días:** Tarea que toma una jornada laboral completa (8h).
* **2.0 Días:** Tarea compleja que requiere 2 días completos.
* **5.0 Días:** Una semana completa de trabajo (considerada una Épica Pequeña).

---

## Sprint 1: Visibilidad Central (Total: 5.5 Días)

**Objetivo:** Dar al gestor la visibilidad central de sus clientes y la "Hoja de Vida" (Backend).

### Historia Técnica 1.1: Dashboard (HU-1)
* **Sub-Tarea 1.1.1 (Backend):** Crear Middleware de Roles y Permisos (`role.middleware.js`).
    * **Descripción:** Crear un middleware `checkRole('sabio_tecnico', 'sabio_admin')` que restrinja el acceso a endpoints específicos.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 1.1.2 (Backend):** Crear `endpoint` de Dashboard (`GET /api/v1/dashboard/gestor`).
    * **Descripción:** Endpoint que busca las fincas/empresas asignadas al `req.user`. Debe calcular un "% de avance" (lógica de negocio a definir, por ahora `placeholder`).
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 1.1.3 (Frontend):** Crear vista de Dashboard (`/dashboard/gestor`).
    * **Descripción:** Página en Next.js (protegida por rol) que consume el *endpoint* 1.1.2 y muestra la lista de empresas, estado y % de avance.
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 1.2: Hoja de Vida (HU-4)
* **Sub-Tarea 1.2.1 (Backend):** Crear `endpoint` de Hoja de Vida (`GET /api/v1/empresas/:id/hoja-de-vida`).
    * **Descripción:** Endpoint que reúne *toda* la información de una empresa: Fincas (con sus Divisiones), Pilas de Compost (con Seguimientos), Muestras (con Resultados) y Aplicaciones. Requerirá múltiples `$lookup` y `populate` de Mongoose.
    * **Esfuerzo:** **2.0 Días**
* **Sub-Tarea 1.2.2 (Frontend):** Crear vista de Hoja de Vida (`/empresas/[id]`) - **Estructura**.
    * **Descripción:** Crear la página dinámica, consumir el endpoint 1.2.1 y renderizar la información principal (Info de Finca). Crear la estructura de pestañas (Compost, Muestras, etc.) pero sin rellenar.
    * **Esfuerzo:** **1.0 Días**

---

## Sprint 2: Trazabilidad y Muestras (Total: 5.0 Días)

**Objetivo:** Completar la "Hoja de Vida" (Frontend) e implementar el seguimiento de insumos y QR de muestras.

### Historia Técnica 2.1: Gestión de Insumos (HU-5)
* **Sub-Tarea 2.1.1 (Backend):** Crear Modelo `InventarioEntrega`.
    * **Descripción:** Nuevo *schema* de Mongoose que registre `(productoId, fincaId, cantidad, fecha_entrega, responsableId)`.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 2.1.2 (Backend):** Crear `endpoints` de Inventario (`POST /inventario/entregas`, `GET /fincas/:id/inventario`).
    * **Descripción:** Endpoints para registrar una entrega y para consultar el historial de entregas de una finca.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 2.1.3 (Frontend):** Integrar Gestión de Inventario.
    * **Descripción:** Formulario (quizás en un modal) para registrar una entrega y crear la pestaña "Inventario" en la Hoja de Vida (HU-4) que muestre este historial.
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 2.2: Flujo de Muestras (HU-3)
* **Sub-Tarea 2.2.1 (Backend):** Instalar `qrcode` y crear `endpoint` de QR (`GET /lab/muestras/:id/qr`).
    * **Descripción:** Instalar `npm install qrcode`. Crear un *endpoint* que devuelva una imagen PNG de un QR (basado en el ID de la muestra o una URL del frontend).
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 2.2.2 (Frontend):** Integrar generación de QR.
    * **Descripción:** Botón en la vista de Muestras (Hoja de Vida) que llame al *endpoint* 2.2.1 y muestre el QR en un modal para imprimir/descargar.
    * **Esfuerzo:** **0.5 Días**

### Historia Técnica 2.3: Completar Hoja de Vida (Frontend) (HU-4)
* **Sub-Tarea 2.3.1 (Frontend):** Rellenar Pestañas de Hoja de Vida.
    * **Descripción:** Usando los datos del endpoint `hoja-de-vida` (creado en Sprint 1), renderizar las vistas de las pestañas "Compost", "Muestras" y "Aplicaciones".
    * **Esfuerzo:** **2.0 Días**

---

## Sprint 3: Gestión de Tareas (Total: 5.0 Días)

**Objetivo:** Implementar el módulo completo de Tareas (CRUD, calendario y plantillas).

### Historia Técnica 3.1: CRUD de Tareas (HU-12, HU-13, HU-16)
* **Sub-Tarea 3.1.1 (Backend):** Crear Modelo `Tarea`.
    * **Descripción:** Schema `(titulo, descripcion, fincaId, divisionPrimariaId, divisionSecundariaId, status['pendiente', 'completada'], dueDate, asignadoAId, tipo['manual', 'plantilla'])`.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 3.1.2 (Backend):** Endpoints CRUD para `Tarea` (`GET /tareas`, `POST /tareas`, `PATCH /tareas/:id`, `DELETE /tareas/:id`).
    * **Descripción:** Endpoints completos para gestionar tareas, con filtros (por finca, por usuario, por fecha).
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 3.2: Calendario de Tareas (HU-14)
* **Sub-Tarea 3.2.1 (Frontend):** Instalar y configurar librería de calendario (ej. `react-big-calendar`).
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 3.2.2 (Frontend):** Crear vista de Calendario (`/calendario`).
    * **Descripción:** Consumir `GET /tareas` y mostrarlas en el calendario. Implementar clic para ver detalle y (opcional) drag-and-drop para cambiar `dueDate` (llamando a `PATCH`).
    * **Esfuerzo:** **2.0 Días**

### Historia Técnica 3.3: Plantillas de Tareas (HU-8)
* **Sub-Tarea 3.3.1 (Backend):** Crear Modelo `PlantillaTarea`.
    * **Descripción:** Schema `(nombre_plantilla, tareas: [{titulo, descripcion, dias_despues_de_inicio}])`.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 3.3.2 (Backend):** Endpoint `POST /fincas/:id/aplicar-plantilla-tareas`.
    * **Descripción:** Lógica que lee una `PlantillaTarea`, calcula las fechas basadas en un `fecha_inicio` y crea múltiples `Tareas` reales.
    * **Esfuerzo:** **0.5 Días**

---

## Sprint 4: Geolocalización y Configuración (Total: 5.0 Días)

**Objetivo:** Implementar la visualización de mapas y la configuración de franjas horarias.

### Historia Técnica 4.1: Geolocalización (HU-17, HU-19, HU-20)
* **Sub-Tarea 4.1.1 (Backend):** Modificar Modelos para `GeoJSON`.
    * **Descripción:** Añadir campos de `coordenadas` (tipo GeoJSON Point) a los modelos `Muestra` y a los sub-schemas `divisionPrimaria` y `divisionSecundaria` en `finca.model.js`.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 4.1.2 (Backend):** Endpoints `PATCH` para guardar coordenadas.
    * **Descripción:** Crear endpoints para actualizar las coordenadas de una muestra, una división primaria o una división secundaria.
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 4.1.3 (Frontend):** Instalar y configurar librería de mapas (ej. `react-leaflet`).
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 4.1.4 (Frontend):** Crear vista de Mapa (`/mapa`).
    * **Descripción:** Consumir datos de fincas/muestras y mostrar pines (`Marker`) en el mapa. Implementar clic en el pin para ver un `Popup` con información.
    * **Esfuerzo:** **2.0 Días**

### Historia Técnica 4.2: Configuración de Franjas (HU-2)
* **Sub-Tarea 4.2.1 (Backend):** Modificar Modelo `Empresa` y crear `endpoint` de configuración.
    * **Descripción:** Añadir campo `configuracion_notificaciones: { franja_horaria_inicio: String, franja_horaria_fin: String }` al `empresa.model.js` y crear `PATCH /empresas/:id/configuracion`.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 4.2.2 (Frontend):** Crear vista de Configuración.
    * **Descripción:** Vista en el perfil de la Empresa (para el Gestor) donde pueda editar estas franjas.
    * **Esfuerzo:** **0.5 Días**

---

## Épicas / Sprints Futuros (Tareas > 5 Días o Dependencias Externas)

* **ÉPICA 1 (WhatsApp/N8N):** Integración de Chatbot (Cubre HU-2, HU-6, HU-9, HU-25).
    * **Esfuerzo Estimado:** **10.0+ Días**
* **ÉPICA 2 (IA / Audio):** Transcripción y análisis de audio (Cubre HU-7).
    * **Esfuerzo Estimado:** **8.0+ Días**
* **ÉPICA 3 (Clima):** Integración API Externa de Clima (Cubre HU-18).
    * **Esfuerzo Estimado:** **3.0 Días**
* **ÉPICA 4 (Archivos):** Subida de archivos a Cloudinary/S3 (Cubre HU-15, HU-23, HU-24).
    * **Esfuerzo Estimado:** **3.0 Días**
* **ÉPICA 5 (Alertas):** Sistema de Notificaciones proactivas (CRON Jobs) (Cubre HU-3, HU-9, HU-10, HU-21).
    * **Esfuerzo Estimado:** **5.0 Días**