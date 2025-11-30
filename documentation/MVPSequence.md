# Roadmap del Proyecto SaBio (MVP)

## Resumen de Estimación (MVP Fase 1)

Basado en nuestro progreso y las HUs validadas, he re-priorizado todas las tareas para enfocarnos en un **Producto Mínimo Viable (MVP)**. El objetivo es lanzar la plataforma web que resuelva el flujo central de **Ventas $\rightarrow$ Operaciones $\rightarrow$ Laboratorio** y la visualización de la "Hoja de Vida" del cliente.

* **Trabajo Completado (Backend Core):** ~10 Días (Paso 1-20, configuración, modelos y endpoints CRUD básicos).
* **Trabajo Restante para MVP (Backend + Frontend):** **~24.5 Días**
* **Duración Total Estimada (MVP):** **~34.5 Días**

---

## Tareas Excluidas del MVP (Fase 2 y 3)

Para lograr un MVP en ~5 semanas, las siguientes épicas y *features* (que son "nice-to-have" o muy complejas) se moverán a una Fase 2:

* **TODA la Integración con WhatsApp/N8N:** Es una épica masiva. El MVP requerirá que los clientes y gestores ingresen datos manualmente en la app web.
* **Dashboards de KPIs:** Los dashboards de Gerente (HU-GERENTE-1) y Gestor (HU-GESTOR-1) se posponen. Las vistas de "Lista" son suficientes para el MVP.
* **Pipeline Visual (Drag & Drop):** El pipeline de Comercial (HU-COMERCIAL-1) se implementará como una lista simple.
* **Módulo de Tareas y Calendario:** Toda la gestión de tareas (HU-GESTOR-8, 12, 13, 14, 16) es un módulo separado y será Fase 2.
* **Geolocalización y Mapas:** (HU-GESTOR-17, 19, 20).
* **Google OAuth:** (Paso 13 del roadmap). El login con Email/Password es suficiente.
* **Notificaciones y Alertas:** (HU-COMERCIAL-6, HU-GESTOR-9, 10, 21).
* **Gestión de Inventario (HU-GESTOR-5):** Se pospone para simplificar el MVP.
* **Integraciones (Audio, Clima):** (HU-GESTOR-7, 18).

---

## Plan del MVP (Tareas Restantes por Sprint)

### Sprint 1: Completar Lógica de Backend (Total: 5.0 Días)

**Objetivo:** Terminar todos los *endpoints* de Backend necesarios para el MVP.

| ID (HU) | Tarea (Backend) | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **N/A** | **(Backend)** Crear Middleware de Roles (`checkRole`). | 0.5 |
| **HU-GERENTE-3** | **(Backend)** Endpoints `GET`, `PATCH`, `DELETE` para Catálogo de Productos. | 1.0 |
| **HU-GERENTE-2** | **(Backend)** Endpoints `PATCH`, `DELETE` para Gestión de Usuarios. | 1.0 |
| **HU-GESTOR-4** | **(Backend)** Endpoint `GET /empresas/:id/hoja-de-vida` (Agregación). | 2.0 |
| **HU-LAB-2** | **(Backend)** Endpoint `GET /api/v1/lab/muestras` (Cola de Lab). | 0.5 |

### Sprint 2: Frontend - Setup y Módulo de Admin (Total: 6.0 Días)

**Objetivo:** Iniciar la app de Next.js, implementar login y crear las vistas de administración.

| ID (HU) | Tarea (Frontend) | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **N/A** | **(Frontend)** Setup Next.js: Axios, State (Zustand/Context), UI (Tailwind/Chakra), Layouts. | 2.0 |
| **N/A** | **(Frontend)** Vistas de Autenticación (Login, Protección de Rutas). | 1.0 |
| **HU-GERENTE-2** | **(Frontend)** Vista de Admin: Gestión de Usuarios (Tabla, Filtros, Modal de Edición). | 1.5 |
| **HU-GERENTE-3** | **(Frontend)** Vista de Admin: Gestión de Catálogo de Productos (Tabla, Modal de Crear/Editar). | 1.5 |

### Sprint 3: Frontend - Módulo Comercial (CRM) (Total: 4.0 Días)

**Objetivo:** Implementar el flujo de ventas MVP.

| ID (HU) | Tarea (Frontend) | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-COMERCIAL-1** | **(Frontend)** Vista Comercial: **Lista simple** de Leads (NO pipeline drag & drop). | 1.0 |
| **HU-COMERCIAL-2** | **(Frontend)** Formulario/Modal: "Nuevo Lead". | 1.0 |
| **HU-COMERCIAL-3** | **(Frontend)** Vista Detalle Lead: Historial de Actividades (Formulario y Timeline). | 1.0 |
| **HU-COMERCIAL-5** | **(Frontend)** Modal: "Convertir Lead" (Pide password para nuevo usuario). | 1.0 |

### Sprint 4: Frontend - Operaciones (Data Entry) (Total: 4.0 Días)

**Objetivo:** Permitir al Cliente y Gestor registrar la información de campo.

| ID (HU) | Tarea (Frontend) | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **N/A** | **(Frontend)** Vista Cliente/Gestor: Lista de Fincas y sus Divisiones (árbol o vistas anidadas). | 1.0 |
| **N/A** | **(Frontend)** Formulario: "Nueva Finca" y "Nueva División" (Primaria/Secundaria). | 1.0 |
| **HU-CLIENTE-4, 5** | **(Frontend)** Formulario: "Nueva Pila de Compost" y "Nuevo Seguimiento de Compost". | 1.0 |
| **HU-CLIENTE-3** | **(Frontend)** Formulario: "Nueva Aplicación de Producto" (usa catálogo de `HU-GERENTE-3`). | 1.0 |

### Sprint 5: Frontend - Laboratorio y Hoja de Vida (Total: 5.5 Días)

**Objetivo:** Cerrar el ciclo: Laboratorio carga resultados y el Cliente/Gestor los ve.

| ID (HU) | Tarea (Frontend) | Esfuerzo (Días) |
| :--- | :--- | :--- |
| **HU-LAB-2** | **(Frontend)** Vista Laboratorio: Cola de Muestras (Tabla con filtros por estado). | 1.5 |
| **HU-LAB-3, 4** | **(Frontend)** Formulario: "Cargar Resultados de Muestra" (Formulario dinámico). | 2.0 |
| **HU-GESTOR-3** | **(Frontend)** Integrar Botón/Modal de "Generar QR" en la cola de Laboratorio. | 0.5 |
| **HU-GESTOR-4** | **(Frontend)** Vista Gestor/Cliente: **Hoja de Vida** (Consumir y renderizar endpoint de agregación). | 2.0 |