# Punto 2 y 3: Cálculo de Esfuerzo, Sprints y Tareas (Gestor de Seguimiento)

Aquí se desglosan las HUs validadas del "Gestor de Seguimiento" en un plan de acción técnico.

**Definición de Esfuerzo (Puntos de Historia):**
Usaremos una escala de Fibonacci modificada (1, 2, 3, 5, 8, 13) donde:
* **1:** Tarea trivial (ej. cambiar texto, ajustar un endpoint existente).
* **2:** Tarea sencilla (ej. un endpoint CRUD nuevo sobre un modelo existente).
* **3:** Tarea media (ej. un endpoint con lógica de negocio simple, modificar varios archivos).
* **5:** Tarea compleja (ej. un endpoint con agregaciones de MongoDB, lógica de negocio nueva).
* **8:** Tarea muy compleja (ej. requiere refactorización mayor, múltiples agregaciones).
* **13+:** Épica (Debe dividirse, ej. integración con un servicio externo como WhatsApp).

---

## Sprint 1: El Dashboard del Gestor (Foco: HU-1, HU-4)

**Objetivo:** Dar al gestor la visibilidad central de sus clientes.

### Historia Técnica 1.1: Dashboard (HU-1)
*Como Gestor, quiero ver un resumen de mis empresas asignadas y su estado de avance.*

* **Sub-Tarea 1.1.1 (Backend):** Crear Middleware de Roles y Permisos (`role.middleware.js`).
    * **Descripción:** Crear un middleware `checkRole('sabio_tecnico', 'sabio_admin')` que restrinja el acceso.
    * **Esfuerzo:** **3 Puntos**
* **Sub-Tarea 1.1.2 (Backend):** Crear `endpoint` de Dashboard (`GET /api/v1/dashboard/gestor`).
    * **Descripción:** Endpoint que busca las fincas asignadas al `req.user`. Debe calcular un "% de avance" (lógica a definir, por ahora `placeholder`).
    * **Esfuerzo:** **5 Puntos** (La lógica de agregación del "avance" es compleja).
* **Sub-Tarea 1.1.3 (Frontend):** Crear vista de Dashboard (`/dashboard/gestor`).
    * **Descripción:** Página en Next.js que consume el *endpoint* 1.1.2 y muestra la lista de empresas, estado y % de avance.
    * **Esfuerzo:** **3 Puntos**

### Historia Técnica 1.2: Hoja de Vida (HU-4)
*Como Gestor, quiero hacer clic en una empresa y ver su "Hoja de Vida" detallada.*

* **Sub-Tarea 1.2.1 (Backend):** Crear `endpoint` de Hoja de Vida (`GET /api/v1/empresas/:id/hoja-de-vida`).
    * **Descripción:** Endpoint que reúne *toda* la información de una empresa: Fincas (con sus Zonas/Lotes), Pilas de Compost (y sus seguimientos), Muestras (y sus resultados), y Aplicaciones. Usará `$lookup` y `populate` de Mongoose.
    * **Esfuerzo:** **8 Puntos** (Es la agregación más compleja del sistema).
* **Sub-Tarea 1.2.2 (Frontend):** Crear vista de Hoja de Vida (`/empresas/[id]`).
    * **Descripción:** Página dinámica en Next.js que consume el *endpoint* 1.2.1 y renderiza toda la información de forma organizada (pestañas, tarjetas, etc.).
    * **Esfuerzo:** **5 Puntos**

**Total Esfuerzo Sprint 1:** 24 Puntos

---

## Sprint 2: Trazabilidad y Gestión (Foco: HU-5, HU-3)

**Objetivo:** Implementar el seguimiento de insumos y el flujo de muestras.

### Historia Técnica 2.1: Gestión de Insumos (HU-5)
*Como Gestor, quiero registrar los insumos que entrego a una finca y ver su historial.*

* **Sub-Tarea 2.1.1 (Backend):** Crear Modelo `InventarioEntrega`.
    * **Descripción:** Nuevo *schema* de Mongoose que registre `(productoId, fincaId, cantidad, fecha_entrega, responsableId)`.
    * **Esfuerzo:** **2 Puntos**
* **Sub-Tarea 2.1.2 (Backend):** Crear `endpoints` de Inventario (`POST /inventario/entregas`, `GET /fincas/:id/inventario`).
    * **Descripción:** Endpoints para registrar una entrega y para consultar el historial de entregas y aplicaciones de una finca.
    * **Esfuerzo:** **3 Puntos**
* **Sub-Tarea 2.1.3 (Frontend):** Crear vista de Gestión de Inventario.
    * **Descripción:** Formulario para registrar una entrega y una tabla/vista en la "Hoja de Vida" (HU-4) que muestre el historial de inventario.
    * **Esfuerzo:** **3 Puntos**

### Historia Técnica 2.2: Flujo de Muestras (HU-3)
*Como Gestor, quiero generar un QR para una muestra y enviar recordatorios.*

* **Sub-Tarea 2.2.1 (Backend):** Instalar `qrcode` y crear `endpoint` de QR (`GET /lab/muestras/:id/qr`).
    * **Descripción:** Instalar `npm install qrcode`. Crear un *endpoint* que devuelva una imagen QR basada en el ID de la muestra o una URL del frontend.
    * **Esfuerzo:** **3 Puntos**
* **Sub-Tarea 2.2.2 (Frontend):** Integrar generación de QR.
    * **Descripción:** Botón en la vista de Muestras que llame al *endpoint* 2.2.1 y muestre el QR para imprimir/descargar.
    * **Esfuerzo:** **2 Puntos**
* **Sub-Tarea 2.2.3 (ÉPICA - Backend):** Configurar servicio de Notificaciones (Recordatorios).
    * **Descripción:** Investigar e integrar un servicio de WhatsApp (ej. Twilio) y configurar un CRON Job (tareas programadas) para enviar recordatorios.
    * **Esfuerzo:** **13+ Puntos** (Se mueve a un Sprint futuro o Épica separada).

**Total Esfuerzo Sprint 2:** 13 Puntos (sin la Épica)

---

## Sprint 3: Interacción con Cliente (Foco: HU-2)

**Objetivo:** Gestionar las franjas horarias (Esta HU es compleja y de menor impacto relativo).

### Historia Técnica 3.1: Franjas Horarias (HU-2)
*Como Gestor, quiero definir franjas horarias para que los clientes reporten (vía WhatsApp).*

* **Sub-Tarea 3.1.1 (Backend):** Modificar Modelo `Empresa`.
    * **Descripción:** Añadir un campo `configuracion_notificaciones: { franja_horaria_inicio: String, franja_horaria_fin: String }` al `empresa.model.js`.
    * **Esfuerzo:** **1 Punto**
* **Sub-Tarea 3.1.2 (Backend):** Crear `endpoint` de configuración (`PATCH /empresas/:id/configuracion`).
    * **Descripción:** Endpoint (protegido para Gestores) que permita editar esta configuración.
    * **Esfuerzo:** **2 Puntos**
* **Sub-Tarea 3.1.3 (Frontend):** Crear vista de Configuración.
    * **Descripción:** Vista en el perfil de la Empresa (para el Gestor) donde pueda editar estas franjas.
    * **Esfuerzo:** **2 Puntos**
* **Sub-Tarea 3.1.4 (ÉPICA - Backend):** Integración con Chatbot (WhatsApp).
    * **Descripción:** Lógica en el receptor de WhatsApp que lea esta configuración y rechace o marque reportes fuera de horario.
    * **Esfuerzo:** **13+ Puntos** (Se mueve a la Épica del Chatbot).

**Total Esfuerzo Sprint 3:** 5 Puntos (sin la Épica)