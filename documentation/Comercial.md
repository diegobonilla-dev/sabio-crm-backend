# Punto 4 (Comercial): Esfuerzo en Días y Plan de Sprints (Perfil Comercial)

Este plan desglosa las Historias de Usuario (HUs) del "Perfil Comercial", estimando el esfuerzo basado en **1 desarrollador Full-Stack (Semisenior) a tiempo completo**.

**Definición de Esfuerzo (Días):**
* **0.5 Días:** Tarea que toma media jornada (4h) o menos.
* **1.0 Días:** Tarea que toma una jornada laboral completa (8h).
* **2.0 Días:** Tarea compleja que requiere 2 días completos.
* **5.0 Días:** Una semana completa de trabajo.

---

## Sprint 1: Creación y Visualización de Leads (Total: 5.5 Días)

**Objetivo:** Implementar la creación de leads y el pipeline visual del CRM.

### Historia Técnica 1.1: Creación de Leads (HU-COMERCIAL-2)
* **Sub-Tarea 1.1.1 (Backend):** Crear Modelos `Lead` y `Actividad`.
    * **Descripción:** Definir los schemas en Mongoose.
    * **Esfuerzo:** **HECHO** (Completado en Paso 5).
* **Sub-Tarea 1.1.2 (Backend):** Crear `endpoint` `POST /api/v1/leads`.
    * **Descripción:** Endpoint protegido para crear un nuevo lead asignado al `req.user`.
    * **Esfuerzo:** **HECHO** (Completado en Paso 16).
* **Sub-Tarea 1.1.3 (Frontend):** Crear Formulario de Nuevo Lead.
    * **Descripción:** Un formulario (probablemente en un modal) en el dashboard comercial para registrar un nuevo lead.
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 1.2: Dashboard Pipeline (HU-COMERCIAL-1)
* **Sub-Tarea 1.2.1 (Backend):** Crear `endpoint` `GET /api/v1/leads`.
    * **Descripción:** Endpoint que filtra y devuelve solo los leads del vendedor logueado (o todos si es admin).
    * **Esfuerzo:** **HECHO** (Completado en Paso 16).
* **Sub-Tarea 1.2.2 (Frontend):** Instalar librería de Drag & Drop (ej. `react-beautiful-dnd`).
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 1.2.3 (Frontend):** Crear vista de Pipeline (`/dashboard/comercial`).
    * **Descripción:** Página en Next.js que consume `GET /leads` y renderiza columnas (Nuevo, Cotizado, etc.) con tarjetas de leads (tipo Trello).
    * **Esfuerzo:** **2.0 Días**

### Historia Técnica 1.3: Mover Leads (HU-COMERCIAL-4)
* **Sub-Tarea 1.3.1 (Backend):** Crear `endpoint` `PATCH /api/v1/leads/:id/etapa`.
    * **Descripción:** Endpoint que recibe un `leadId` y la nueva `etapa_funnel` para actualizar el lead.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 1.3.2 (Frontend):** Implementar lógica de Drag & Drop.
    * **Descripción:** Conectar la librería de D&D para que al soltar una tarjeta en una nueva columna, llame al *endpoint* 1.3.1 (PATCH) y actualice el estado local.
    * **Esfuerzo:** **1.5 Días**

---

## Sprint 2: Historial y Conversión (Total: 4.5 Días)

**Objetivo:** Implementar el registro de actividades (historial) y el flujo de conversión a cliente.

### Historia Técnica 2.1: Registro de Actividades (HU-COMERCIAL-3)
* **Sub-Tarea 2.1.1 (Backend):** Crear `endpoints` de Actividades (`POST /api/v1/leads/:leadId/actividades`, `GET /api/v1/leads/:leadId/actividades`).
    * **Descripción:** Endpoints para añadir una nueva actividad a un lead (llamada, email) y para obtener el historial de un lead.
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 2.1.2 (Frontend):** Crear Vista de Detalle de Lead.
    * **Descripción:** Un modal o panel lateral que se abre al hacer clic en un lead. Debe mostrar la info del lead y un *timeline* o lista de sus actividades (endpoint GET).
    * **Esfuerzo:** **1.5 Días**
* **Sub-Tarea 2.1.3 (Frontend):** Formulario de Nueva Actividad.
    * **Descripción:** Un formulario simple (dentro del modal de detalle) para añadir una nueva nota, llamada o reunión (endpoint POST).
    * **Esfuerzo:** **0.5 Días**

### Historia Técnica 2.2: Conversión de Lead a Cliente (HU-COMERCIAL-5)
* **Sub-Tarea 2.2.1 (Backend):** Crear `endpoint` `POST /api/v1/leads/:leadId/convertir`.
    * **Descripción:** Lógica que crea una `Empresa` y un `User` (cliente_owner) a partir de un `Lead`, y actualiza el estado del lead.
    * **Esfuerzo:** **HECHO** (Completado en Paso 17).
* **Sub-Tarea 2.2.2 (Frontend):** Implementar Botón de "Convertir".
    * **Descripción:** Un botón en el modal de detalle (o en la tarjeta del lead) que solo se activa si la etapa es "Ganado". Al hacer clic, pide la contraseña para el nuevo usuario y llama al *endpoint* de conversión.
    * **Esfuerzo:** **1.5 Días** (El manejo de este flujo de UI/UX tiene su complejidad).

---

## Épicas / Sprints Futuros (Tareas > 5 Días o Dependencias Externas)

* **ÉPICA 1 (Notificaciones):** Sistema de Alertas por Inactividad (Cubre HU-COMERCIAL-6).
    * **Descripción:** Requiere un CRON Job (tarea programada) en el backend que corra diariamente, busque leads sin actividad reciente y envíe una notificación (email o WhatsApp).
    * **Esfuerzo Estimado:** **5.0+ Días**