# Punto 4 (Laboratorio): Análisis RICE y Plan de Sprints (Perfil Laboratorio)

Este plan desglosa las Historias de Usuario (HUs) del "Perfil Laboratorio", priorizadas por la metodología **RICE** (Reach, Impact, Confidence, Effort) y estimadas en **Días de Esfuerzo** (asumiendo 1 desarrollador Semisenior Full-Stack).

## Análisis de Priorización RICE (Laboratorio)

| ID | Historia de Usuario (Resumen) | Reach (1-3) | Impact (1-3) | Confidence (1-3) | Effort (Días) | RICE Score | Prioridad |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-LAB-1** | Como lab, quiero generar un QR/etiqueta para la muestra. | 3 (Alta) | 3 (Crítico) | 3 (Alta) | **1.0** | **27.0** | **1 - ¡Máxima!** |
| **HU-LAB-3** | Como lab, quiero cargar los resultados de los análisis. | 3 (Alta) | 3 (Crítico) | 3 (Alta) | **2.0** | **13.5** | **2 - Muy Alta** |
| **HU-LAB-2** | Como lab, quiero ver la cola de muestras pendientes. | 3 (Alta) | 3 (Crítico) | 3 (Alta) | **2.5** | **10.8** | **3 - Alta** |
| **HU-LAB-4** | Como lab, quiero marcar una muestra como "completada". | 3 (Alta) | 2 (Alta) | 3 (Alta) | **1.0** | **18.0** | **(Incluida en HU-LAB-3)** |

**Conclusión del RICE:** El flujo de trabajo del laboratorio es lineal y crítico. La prioridad máxima es **identificar** la muestra (HU-LAB-1) y **cargar sus resultados** (HU-LAB-3). Ver la cola (HU-LAB-2) es esencial para gestionar el trabajo, y marcar como "completada" (HU-LAB-4) es parte del flujo de "cargar resultados".

---

## Sprint 1: Flujo de Trabajo del Laboratorio (Total: 6.0 Días)

**Objetivo:** Implementar la interfaz completa para el personal de laboratorio, permitiéndoles gestionar la cola de muestras y cargar resultados.

### Historia Técnica 1.1: Ver Cola de Muestras (HU-LAB-2)
* **Sub-Tarea 1.1.1 (Backend):** Crear `endpoint` `GET /api/v1/lab/muestras`.
    * **Descripción:** Endpoint (protegido para rol `sabio_laboratorio`) que retorna una lista de todas las muestras, con filtros por `estado` (ej. 'Recibida', 'En Proceso').
    * **Esfuerzo:** **1.0 Días**
* **Sub-Tarea 1.1.2 (Frontend):** Crear Vista de Cola de Laboratorio (`/dashboard/laboratorio`).
    * **Descripción:** Una página con una tabla/lista de todas las muestras. Debe tener pestañas o filtros para "Pendientes", "En Proceso" y "Completadas".
    * **Esfuerzo:** **1.5 Días**

### Historia Técnica 1.2: Cargar Resultados (HU-LAB-3) y Marcar Completada (HU-LAB-4)
* **Sub-Tarea 1.2.1 (Backend):** Reutilizar `endpoint` `PATCH /lab/muestras/:muestraId/resultados`.
    * **Descripción:** Asegurarse de que el *endpoint* (Paso 19.5) sea accesible por el rol `sabio_laboratorio`.
    * **Esfuerzo:** **HECHO** (Completado en Paso 19.5).
* **Sub-Tarea 1.2.2 (Backend):** Crear `endpoint` `PATCH /lab/muestras/:muestraId/completar`.
    * **Descripción:** Endpoint simple que cambia el `estado` de la muestra a 'Completada'.
    * **Esfuerzo:** **0.5 Días**
* **Sub-Tarea 1.2.3 (Frontend):** Crear Vista de "Cargar Resultados" (`/laboratorio/[muestraId]`).
    * **Descripción:** Una página de formulario compleja que se abre al hacer clic en una muestra. Debe tener secciones (acordeones o pestañas) para cada tipo de análisis (Químico, Bacterias, Hongos) y consumir el *endpoint* 1.2.1 (PATCH) para guardar.
    * **Esfuerzo:** **2.0 Días**
* **Sub-Tarea 1.2.4 (Frontend):** Implementar Botón "Marcar como Completada".
    * **Descripción:** Un botón en la vista 1.2.3 que llama al *endpoint* 1.2.2 (PATCH) para finalizar el proceso.
    * **Esfuerzo:** **0.5 Días**

### Historia Técnica 1.3: Generar Etiquetas/QR (HU-LAB-1)
* **Sub-Tarea 1.3.1 (Backend):** Crear `endpoint` `GET /lab/muestras/:id/qr`.
    * **Descripción:** Reutilizar la Tarea 2.2.1 del Sprint del Gestor.
    * **Esfuerzo:** **HECHO** (Cubierto por Sprint 2 - Gestor).
* **Sub-Tarea 1.3.2 (Frontend):** Botón de Generar Etiqueta/QR.
    * **Descripción:** Un botón en la Vista de Cola (1.1.2) o Detalle (1.2.3) que llama al *endpoint* de QR y muestra la imagen en un modal para imprimirla.
    * **Esfuerzo:** **0.5 Días**