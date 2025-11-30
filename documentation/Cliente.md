# Punto 4 (Cliente): Esfuerzo en Días y Plan de Sprints (Perfil Cliente)

Este plan desglosa las Historias de Usuario (HUs) del "Perfil Cliente", estimando el esfuerzo basado en **1 desarrollador Full-Stack (Semisenior) a tiempo completo**.

**Nota Clave:** El Perfil "Cliente" (Dueño y Corporativo) es principalmente un *consumidor* y *registrador* de datos. Muchos de los *endpoints* de Backend necesarios (ej. crear pila, crear aplicación, hoja de vida) ya fueron construidos o planificados para el "Gestor de Seguimiento". Por lo tanto, el esfuerzo de Backend aquí se centra en **refinar permisos**, mientras que el esfuerzo de Frontend es para construir sus **vistas específicas**.

**Definición de Esfuerzo (Días):**
* **0.5 Días:** Media jornada (4h) o menos.
* **1.0 Días:** Una jornada laboral completa (8h).
* **2.0 Días:** Dos días completos.
* **5.0 Días:** Una semana completa.

---

## Sprint 1: Portal del Cliente (Dashboard y Hoja de Vida) (Total: 6.5 Días)

**Objetivo:** Crear el portal de visualización principal para el cliente, donde puede ver el resumen y el detalle completo de sus fincas.

### Historia Técnica 1.1: Permisos de Cliente (Backend)
* **Sub-Tarea 1.1.1 (Backend):** Refactorizar Middleware de Permisos.
    * **Descripción:** Actualizar el middleware `protect` (o crear uno nuevo) para validar que un `cliente_owner` solo pueda acceder a los datos de la `empresa` asociada a su token, y un `cliente_corporate` solo a las fincas de su `corporativo`.
    * **Esfuerzo:** **1.5 Días** (Esto es crítico y complejo, afecta a todos los endpoints).

### Historia Técnica 1.2: Dashboard del Cliente (HU-CLIENTE-1)
* **Sub-Tarea 1.2.1 (Backend):** Crear `endpoint` `GET /api/v1/dashboard/cliente`.
    * **Descripción:** Endpoint (protegido por rol `cliente_owner`/`cliente_corporate`) que obtiene los datos resumidos (KPIs, estado de muestras, tareas pendientes) solo para las fincas del cliente autenticado.
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 1.2.2 (Frontend):** Crear Vista de Dashboard de Cliente (`/dashboard/cliente`).
    * **Descripción:** Página principal del cliente que consume el *endpoint* 1.2.1 y muestra tarjetas de resumen (KPIs, Muestras, Tareas).
    * **Esfuerzo:** **1.5 Días**

### Historia Técnica 1.3: Hoja de Vida del Cliente (HU-CLIENTE-2, HU-CLIENTE-6)
* **Sub-Tarea 1.3.1 (Backend):** Reutilizar `endpoint` `GET /api/v1/empresas/:id/hoja-de-vida`.
    * **Descripción:** Asegurarse de que el *endpoint* creado para el Gestor (Sprint 1.2 Gestor) sea accesible por el Cliente *solo si es su propia empresa*.
    * **Esfuerzo:** **HECHO** (Cubierto por Tarea 1.1.1).
* **Sub-Tarea 1.3.2 (Frontend):** Crear Vista de Hoja de Vida (Cliente).
    * **Descripción:** Reutilizar los componentes de la "Hoja de Vida" del Gestor, pero con una vista simplificada. Incluir la pestaña "Resultados de Muestras" (HU-CLIENTE-6).
    * **Esfuerzo:** **2.5 Días** (Reutilización y adaptación de vistas).

---

## Sprint 2: Registro de Datos (Web) (Total: 4.0 Días)

**Objetivo:** Permitir al cliente registrar las operaciones de campo (compost y aplicaciones) desde la plataforma web.

### Historia Técnica 2.1: Registrar Aplicación de Insumos (HU-CLIENTE-3)
* **Sub-Tarea 2.1.1 (Backend):** Reutilizar `endpoint` `POST /operaciones/aplicaciones`.
    * **Descripción:** Asegurarse de que el *endpoint* (Paso 20) sea accesible por el Cliente para sus propias fincas/lotes.
    * **Esfuerzo:** **HECHO** (Cubierto por Tarea 1.1.1).
* **Sub-Tarea 2.1.2 (Frontend):** Crear Formulario de "Nueva Aplicación".
    * **Descripción:** Un formulario simple (probablemente en la "Hoja de Vida") donde el cliente selecciona la finca, lote, producto (de un dropdown) y registra la cantidad.
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 2.2: Registrar Pila de Compost (HU-CLIENTE-4)
* **Sub-Tarea 2.2.1 (Backend):** Reutilizar `endpoint` `POST /compost/pilas`.
    * **Descripción:** Asegurarse de que el *endpoint* (Paso 18) sea accesible por el Cliente.
    * **Esfuerzo:** **HECHO** (Cubierto por Tarea 1.1.1).
* **Sub-Tarea 2.2.2 (Frontend):** Crear Formulario de "Nueva Pila de Compost".
    * **Descripción:** Formulario para registrar una nueva pila en una finca, seleccionando opcionalmente una plantilla de SaBio.
    * **Esfuerzo:** **1.0 Días**

### Historia Técnica 2.3: Registrar Seguimiento de Compost (HU-CLIENTE-5)
* **Sub-Tarea 2.3.1 (Backend):** Reutilizar `endpoint` `POST /compost/pilas/:pilaId/seguimiento`.
    * **Descripción:** Asegurarse de que el *endpoint* (Paso 18) sea accesible por el Cliente.
    * **Esfuerzo:** **HECHO** (Cubierto por Tarea 1.1.1).
* **Sub-Tarea 2.3.2 (Frontend):** Crear Formulario de "Nuevo Seguimiento".
    * **Descripción:** Formulario en la vista de detalle de una Pila de Compost para añadir temperatura, humedad, observaciones, etc.
    * **Esfuerzo:** **1.0 Días**

---

## Épica / Sprint Futuro (Tareas > 5 Días o Dependencias Externas)

* **ÉPICA 1 (WhatsApp/N8N):** Integración de Chatbot (Cubre HU-CLIENTE-7 hasta HU-CLIENTE-29).
    * **Descripción:** Esta es la funcionalidad *principal* del cliente. Involucra la creación de un *endpoint* de Webhook para recibir mensajes de N8N/WhatsApp, lógica de NLP (Procesamiento de Lenguaje Natural) para entender "Reporto lluvia lote 1" o "foto de plaga", y la creación de registros (Lluvia, Plaga, etc.) en la base de datos.
    * **Esfuerzo Estimado:** **15.0+ Días** (Este es el módulo más grande y complejo de todo el proyecto SaBio).