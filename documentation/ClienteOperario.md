# Planificación Técnica: Cliente Operario (Field Worker)

**Perfil:** Trabajador de campo encargado de la ejecución de labores y recolección de datos primarios.
**Enfoque:** Movilidad, facilidad de uso, rapidez de captura y funcionamiento sin conexión.

---

## 1. Matriz RICE y Priorización

| ID | Historia de Usuario | Reach (Alcance) | Impact (Impacto) | Confidence (Confianza) | Effort (Esfuerzo) | RICE Score | Prioridad |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **HUC-06** | **Registrar Ejecución de Tareas (Datos)** | 100% (Todos los operarios) | 3 (Alto - Core del negocio) | 100% (Backend listo) | 3 (Medio - UI/UX) | **100** | **ALTA (Sprint 1)** |
| **HUC-05** | **Visualizar Tareas Diarias** | 100% | 2 (Medio - Organización) | 80% (Requiere modelo Tarea) | 2 (Bajo) | **80** | **ALTA (Sprint 1)** |
| **HUC-07** | **Reportar Incidencias** | 50% (Ocasional) | 2 (Medio - Preventivo) | 90% | 1 (Bajo) | **90** | **MEDIA (Sprint 2)** |
| **HUC-08** | **Modo Offline (Sincronización)** | 100% (Crítico en campo) | 3 (Alto - Usabilidad) | 70% (Complejidad técnica) | 5 (Muy Alto) | **42** | **MEDIA-ALTA (Sprint 2-3)** |

> **Nota sobre el RICE:** Aunque `HUC-08` tiene un score numérico bajo debido al alto esfuerzo, es un **habilitador crítico** para que el sistema sea viable en zonas rurales. Se debe empezar la investigación técnica (Spike) en el Sprint 1.

---

## 2. Roadmap y Sprints Sugeridos

### Sprint 1: "Captura de Datos Core" (Enfoque en HUC-05 y HUC-06)
**Objetivo:** Que el operario pueda saber qué hacer y registrar lo que hizo (usando los endpoints de `Compost` y `Operaciones` ya creados).

### Sprint 2: "Resiliencia y Feedback" (Enfoque en HUC-07 y HUC-08 Parte 1)
**Objetivo:** Permitir el reporte de problemas y establecer la base de datos local para el modo offline.

### Sprint 3: "Sincronización Robusta" (Enfoque en HUC-08 Parte 2)
**Objetivo:** Sincronización bidireccional de datos y manejo de conflictos.

---

## 3. Desglose Detallado de Historias

### HUC-05: Visualizar Tareas Diarias
> **Como** Operario de campo, **quiero** ver una lista clara de mis tareas asignadas para el día (ej. "Voltear pila 3", "Fertilizar Lote 1"), **para** saber exactamente dónde debo ir y qué debo llevar.

* **Estimación Total:** 3 Días
* **Dependencias:** `user.model.js` (Roles)

#### Historias Técnicas y Tareas
1.  **HT-BACK-01: Crear Modelo de Planificación/Tarea** (1 día)
    * *Nota:* Actualmente tenemos `Aplicacion` (el hecho realizado). Necesitamos `Tarea` (lo planeado).
    * Crear `tarea.model.js` (asignado_a, finca, tipo, estado, fecha_programada).
    * Crear endpoint `GET /api/v1/tareas/mis-tareas` (filtrado por `req.user._id`).
2.  **HT-FRONT-01: Vista de Dashboard Operario** (2 días)
    * Crear Card de "Resumen del Día".
    * Listado de tareas con estados visuales (Pendiente, Completado).
    * Filtros simples (Hoy, Atrasados).

---

### HUC-06: Registrar Ejecución de Tareas (Data Entry)
> **Como** Operario, **quiero** registrar los datos de la labor realizada (kg aplicados, temperatura medida) en un formulario simple, **para** alimentar el sistema de trazabilidad.

* **Estimación Total:** 4 Días
* **Dependencias:** `compost.routes.js`, `operaciones.routes.js` (¡Ya existen!)

#### Historias Técnicas y Tareas
1.  **HT-FRONT-02: Formularios Dinámicos de Ejecución** (3 días)
    * Integrar endpoint `POST /api/v1/compost/pilas/:id/seguimiento`.
    * Integrar endpoint `POST /api/v1/operaciones/aplicaciones`.
    * **UX:** Crear componente "Wizard" paso a paso para no abrumar en pantallas pequeñas.
2.  **HT-FRONT-03: Validación de Inputs en Campo** (1 día)
    * Validar que `cantidad_aplicada` sea lógica.
    * Validar fechas.

---

### HUC-07: Reportar Incidencias
> **Como** Operario, **quiero** tomar una foto y escribir una nota rápida si veo algo raro (plagas, daño en infraestructura), **para** alertar al técnico o gerente.

* **Estimación Total:** 2 Días

#### Historias Técnicas y Tareas
1.  **HT-BACK-02: Endpoint de Incidencias** (0.5 días)
    * Crear modelo `Incidencia` (foto, nota, gravedad, ubicacion GPS).
    * Crear endpoint `POST /api/v1/incidencias`.
2.  **HT-FRONT-04: Interfaz de Reporte Rápido** (1.5 días)
    * Botón flotante de "Alerta" siempre visible.
    * Integración con la API de Cámara del dispositivo.
    * Captura automática de Geolocalización.

---

### HUC-08: Modo Offline (Sincronización)
> **Como** Operario en una zona sin señal, **quiero** poder ver mis tareas y guardar registros en mi celular, **para** que la app funcione sin internet y los datos se suban cuando vuelva a tener conexión.

* **Estimación Total:** 8-10 Días (Alta Complejidad)

#### Historias Técnicas y Tareas
1.  **HT-ARCH-01: Configuración de Local-First (PWA)** (2 días)
    * Configurar Service Workers en Next.js (`next-pwa`).
    * Estrategia de Cacheo para assets estáticos y API de "Mis Tareas".
2.  **HT-FRONT-05: Persistencia Local (IndexedDB)** (3 días)
    * Implementar librería (ej. `Dexie.js` o `TanStack Query` con persistencia).
    * Crear "Cola de Sincronización": Cuando se guarda una `Aplicacion` offline, se guarda en la cola local.
3.  **HT-FRONT-06: Manager de Sincronización (Sync Logic)** (3 días)
    * Detectar evento `online`.
    * Iterar sobre la cola local y enviar peticiones al Backend secuencialmente.
    * Manejo de errores (¿qué pasa si el servidor rechaza un dato guardado hace 3 horas?).
4.  **HT-UI-01: Indicadores de Estado de Conexión** (1 día)
    * Banner visual: "Estás trabajando sin conexión".
    * Indicador de "Sincronizando..." y "Todo al día".

---

## 4. Resumen de Esfuerzo (Cliente Operario)

* **Total Días Estimados (Desarrollo):** ~18 días laborables (para 1 Dev Fullstack).
* **Sprints Recomendados:** 2 Sprints de 2 semanas (o 3 de 1.5 semanas).
* **Complejidad:** Media-Alta (Principalmente por el requerimiento Offline).