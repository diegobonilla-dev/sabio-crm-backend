# Punto 4 (Gerente): Análisis RICE y Plan de Sprints (Perfil Gerente)

Este plan desglosa las Historias de Usuario (HUs) del "Perfil Gerente", priorizadas por la metodología **RICE** (Reach, Impact, Confidence, Effort) y estimadas en **Días de Esfuerzo** (asumiendo 1 desarrollador Semisenior Full-Stack).

## Análisis de Priorización RICE (Gerente)

| ID | Historia de Usuario (Resumen) | Reach (1-3) | Impact (1-3) | Confidence (1-3) | Effort (Días) | RICE Score | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-GERENTE-5** | Como Gerente, quiero poder crear un proyecto nuevo (cliente). | 2 (Alta) | 3 (Crítico) | 3 (Alta) | **0.5** | **36.0** | **1 - ¡Máxima!** |
| **HU-GERENTE-4** | Como Gerente, quiero ver la "Hoja de Vida" de un cliente. | 3 (Alta) | 3 (Crítico) | 3 (Alta) | **1.0** | **27.0** | **2 - Muy Alta** |
| **HU-GERENTE-3** | Como Gerente, quiero gestionar el catálogo de productos. | 2 (Alta) | 3 (Crítico) | 3 (Alta) | **1.5** | **12.0** | **3 - Alta** |
| **HU-GERENTE-2** | Como Gerente, quiero gestionar los usuarios y roles del sistema. | 3 (Alta) | 3 (Crítico) | 3 (Alta) | **3.0** | **9.0** | **4 - Media** |
| **HU-GERENTE-1** | Como Gerente, quiero ver un dashboard con KPIs del negocio. | 3 (Alta) | 3 (Crítico) | 2 (Media) | **2.5** | **7.2** | **5 - Baja** |

**Conclusión del RICE:** Las prioridades más altas son las HUs que **reutilizan trabajo que ya hemos hecho** (Crear Proyecto/Cliente, Ver Hoja de Vida, Catálogo de Productos). La gestión de usuarios es nueva pero esencial, y el Dashboard, aunque importante, es menos prioritario porque los KPIs de negocio deben definirse con más claridad (Confidence media).

---

## Sprint 1: Control Total del Sistema (Total: 6.0 Días)

**Objetivo:** Implementar las funciones de administración y visualización de más alto valor para el Gerente.

### Historia Técnica 1.1: Flujo de Creación de Clientes (HU-GERENTE-5)
* **Sub-Tarea 1.1.1 (Backend):** Reutilizar `endpoint` `POST /api/v1/leads/:leadId/convertir`.
    * **Descripción:** La lógica de "Crear un proyecto" es idéntica a la "Conversión de Lead" del Comercial.
    * **Esfuerzo:** **HECHO** (Completado en Paso 17).
* **Sub-Tarea 1.1.2 (Frontend):** Crear Vista/Botón de "Crear Cliente".
    * **Descripción:** Adaptar el flujo de conversión del Comercial para que el Gerente también pueda ejecutarlo, quizás desde un botón "Nuevo Cliente" en el dashboard de Gerente.
    * **Esfuerzo:** **0.5 Días**

### Historia Técnica 1.2: Ver Hoja de Vida (HU-GERENTE-4)
* **Sub-Tarea 1.2.1 (Backend):** Reutilizar `endpoint` `GET /api/v1/empresas/:id/hoja-de-vida`.
    * **Descripción:** Asegurar que el rol `sabio_admin` tenga acceso a este *endpoint*.
    * **Esfuerzo:** **HECHO** (Cubierto por `role.middleware.js` del Sprint 1 del Gestor).
* **Sub-Tarea 1.2.2 (Frontend):** Reutilizar Vista de Hoja de Vida.
    * **Descripción:** Permitir al Gerente acceder a la misma vista de Hoja de Vida que el Gestor (probablemente desde el Dashboard de Gerente).
    * **Esfuerzo:** **1.0 Días** (Adaptar rutas y permisos del frontend).

### Historia Técnica 1.3: Catálogo de Productos (HU-GERENTE-3)
* **Sub-Tarea 1.3.1 (Backend):** Reutilizar `endpoints` `POST /operaciones/productos` y `GET /operaciones/productos`.
    * **Descripción:** Asegurar que el rol `sabio_admin` tenga acceso. (Necesitaremos crear el `GET` y `PATCH` para editar/ver).
    * **Esfuerzo:** **HECHO** (POST creado en Paso 20).
* **Sub-Tarea 1.3.2 (Backend):** Crear `endpoints` `GET`, `PATCH`, `DELETE` para `/operaciones/productos`.
    * **Descripción:** Crear la lógica de controlador y rutas para listar, editar y desactivar productos del catálogo.
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 1.3.3 (Frontend):** Crear Vista de Gestión de Catálogo.
    * **Descripción:** Una página (`/admin/productos`) con una tabla de productos y formularios (modales) para crear/editar.
    * **Esfuerzo:** **1.5 Días**

---

## Sprint 2: Administración y KPIs (Total: 5.5 Días)

**Objetivo:** Construir el dashboard de Gerente y el panel de administración de usuarios.

### Historia Técnica 2.1: Gestión de Usuarios (HU-GERENTE-2)
* **Sub-Tarea 2.1.1 (Backend):** Reutilizar `endpoint` `GET /api/v1/users`.
    * **Descripción:** Asegurar que `sabio_admin` reciba *todos* los usuarios (incluidos clientes).
    * **Esfuerzo:** **HECHO** (Cubierto por `role.middleware.js`).
* **Sub-Tarea 2.1.2 (Backend):** Crear `endpoints` `PATCH /api/v1/users/:id/role` y `DELETE /api/v1/users/:id`.
    * **Descripción:** Endpoints (solo Admin) para cambiar el rol de un usuario o desactivarlo.
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 2.1.3 (Frontend):** Crear Vista de Gestión de Usuarios.
    * **Descripción:** Página (`/admin/usuarios`) con una tabla de todos los usuarios del sistema, con filtros y botones para editar rol o desactivar.
    * **Esfuerzo:** **2.0 Días**

### Historia Técnica 2.2: Dashboard de Gerente (HU-GERENTE-1)
* **Sub-Tarea 2.2.1 (Backend):** Crear `endpoint` `GET /api/v1/dashboard/gerente`.
    * **Descripción:** Endpoint (solo Admin) que realiza agregaciones de alto nivel en MongoDB (ej. `Leads.count()`, `Empresas.count()`, `Muestras.count({estado: 'En Proceso'})`).
    * **Esfuerzo:** **1.5 Días** (Las agregaciones de MongoDB son complejas).
* **Sub-Tarea 2.2.2 (Frontend):** Crear Vista de Dashboard de Gerente.
    * **Descripción:** Página (`/dashboard/admin`) que consume el *endpoint* 2.2.1 y muestra KPIs en tarjetas y gráficos simples.
    * **Esfuerzo:** **1.0 Días**