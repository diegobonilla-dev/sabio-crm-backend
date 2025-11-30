# Roadmap del Proyecto SaBio (Fase 2 - Post-MVP)

**Resumen de Estimación (Fase 2):**
Esta fase incluye las *features* avanzadas y las integraciones externas que se excluyeron del MVP para acelerar el lanzamiento. El objetivo es construir el resto de las HUs y añadir las integraciones clave (Alertas, Mapas, Tareas y WhatsApp).

* **Trabajo Total Fase 2 (Backend + Frontend):** **~45.0 Días**

---

## Sprint 6: Dashboards, OAuth y Mejoras Visuales (Total: 8.5 Días)

**Objetivo:** Implementar los dashboards de KPI, el login con Google y el pipeline visual del CRM.

| ID (HU) | Tarea | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-GERENTE-1** | **(Backend)** Endpoint `GET /dashboard/gerente` (KPIs de negocio). | 1.5 |
| **HU-GERENTE-1** | **(Frontend)** Vista Dashboard Gerente (Gráficos y KPIs). | 1.0 |
| **HU-GESTOR-1** | **(Backend)** Endpoint `GET /dashboard/gestor` (KPIs de seguimiento). | 1.0 |
| **HU-GESTOR-1** | **(Frontend)** Vista Dashboard Gestor (Gráficos y KPIs). | 1.0 |
| **HU-COMERCIAL-1** | **(Frontend)** Refactor: Convertir "Lista de Leads" en "Pipeline Drag & Drop". | 2.0 |
| **Paso 13** | **(Backend)** Implementar Google OAuth (Passport.js). | 1.0 |
| **Paso 13** | **(Frontend)** Botón y lógica de "Login con Google". | 1.0 |

---

## Sprint 7: Módulo de Tareas y Calendario (Total: 6.0 Días)

**Objetivo:** Implementar el módulo completo de gestión de tareas.

| ID (HU) | Tarea | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-GESTOR-12, 13, 16** | **(Backend)** Modelo `Tarea` y Endpoints CRUD (`GET`, `POST`, `PATCH`, `DELETE` /tareas). | 1.5 |
| **HU-GESTOR-8** | **(Backend)** Modelo `PlantillaTarea` y Endpoint `POST /fincas/:id/aplicar-plantilla-tareas`. | 1.0 |
| **HU-GESTOR-14** | **(Frontend)** Vista de Calendario (ej. `react-big-calendar`) que consume `GET /tareas`. | 2.0 |
| **HU-GESTOR-12** | **(Frontend)** UI para crear Tareas manuales y aplicar Plantillas de Tareas. | 1.5 |

---

## Sprint 8: Módulos Avanzados (Geo, Inventario, Archivos) (Total: 8.5 Días)

**Objetivo:** Implementar la geolocalización, la gestión de inventario y la subida de archivos.

| ID (HU) | Tarea | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-GESTOR-5** | **(Backend)** Modelo `InventarioEntrega` y Endpoints CRUD. | 1.0 |
| **HU-GESTOR-5** | **(Frontend)** Vista de Gestión de Inventario (Formulario y Tabla). | 1.0 |
| **HU-GESTOR-17, 19** | **(Backend)** Modificar Modelos (Finca, Muestra) para GeoJSON y Endpoints `PATCH` para guardar coordenadas. | 1.5 |
| **HU-GESTOR-20** | **(Frontend)** Vista de Mapa (ej. `react-leaflet`) con pines de Fincas/Muestras. | 2.0 |
| **N/A** | **(Backend)** Configurar `multer` y `cloudinary` (o S3) para subida de archivos. | 1.5 |
| **N/A** | **(Backend)** Crear Endpoints para subir imágenes (ej. `PATCH /zonas/:id/imagen`). | 1.0 |
| **N/A** | **(Frontend)** Integrar lógica de subida de archivos en los formularios (Zona, Seguimiento, etc.). | 0.5 |

---

## Sprint 9: Integraciones (Alertas, Clima, Audio) (Total: 7.0 Días)

**Objetivo:** Implementar sistemas proactivos (Alertas) e integraciones de datos externas.

| ID (HU) | Tarea | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-COMERCIAL-6** | **(Backend)** Sistema de Alertas (CRON Job) para inactividad de Leads. | 2.0 |
| **HU-GESTOR-9, 10, 21** | **(Backend)** Sistema de Alertas (CRON Job) para tareas vencidas, muestras sin resultados, etc. | 2.0 |
| **HU-GESTOR-18** | **(Backend)** Integración API Externa de Clima y Endpoint `GET /finca/:id/clima`. | 1.5 |
| **HU-GESTOR-18** | **(Frontend)** Componente de Clima en la Hoja de Vida. | 0.5 |
| **HU-GESTOR-7** | **(Backend)** (Épica Pequeña) Integración API de Transcripción de Audio (ej. AssemblyAI). | 1.0 |

---

## Épica (Sprint 10+): Integración con WhatsApp/N8N (Total: 15.0+ Días)

**Objetivo:** Implementar la funcionalidad principal de reporte del cliente vía WhatsApp.

| ID (HU) | Tarea | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-CLIENTE-7 a 29** | **(Backend)** Crear Endpoint de Webhook (`POST /webhook/n8n`) para recibir mensajes. | 1.0 |
| **HU-CLIENTE-7 a 29** | **(Backend)** Lógica de "Router" de Webhook (Identificar al usuario por `senderId` de WhatsApp). | 2.0 |
| **HU-CLIENTE-7 a 29** | **(Backend)** Lógica de NLP (Procesamiento de Lenguaje Natural) para interpretar comandos (ej. "reportar lluvia lote 1"). | 5.0 |
| **HU-CLIENTE-7 a 29** | **(Backend)** Lógica de creación de registros (Lluvia, Plaga, Seguimiento) basada en los mensajes. | 4.0 |
| **HU-CLIENTE-7 a 29** | **(Backend)** Lógica de respuesta (vía N8N) para confirmar o pedir correcciones. | 3.0 |