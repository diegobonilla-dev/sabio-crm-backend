# Planificación Técnica: Cliente Ejecutivo (Owner / Corporativo)

**Perfil:** Dueño de finca, Gerente Agrícola o Representante Corporativo (ej. Starbucks).
**Enfoque:** Inteligencia de negocios (BI), trazabilidad, supervisión remota y ROI.
**Roles Backend:** `cliente_owner`, `cliente_corporate`.

---

## 1. Matriz RICE y Priorización

| ID | Historia de Usuario | Reach (Alcance) | Impact (Impacto) | Confidence (Confianza) | Effort (Esfuerzo) | RICE Score | Prioridad |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **HUC-01** | **Dashboard de Estado General** | 100% (Todos los ejecutivos) | 3 (Alto - Valor principal) | 100% (Datos ya existen) | 4 (Alto - Agregaciones complejas) | **75** | **ALTA (Sprint 1)** |
| **HUC-03** | **Gestión de Equipo (Invitar)** | 100% (Bloqueante) | 3 (Alto - Habilita operarios) | 100% | 2 (Bajo) | **150** | **ALTA (Sprint 1)** |
| **HUC-02** | **Reportes Comparativos (Evolución)** | 80% | 3 (Alto - Muestra regeneración) | 80% (Requiere histórico) | 4 (Alto) | **48** | **MEDIA (Sprint 2)** |
| **HUC-04** | **Exportación de Datos (PDF/Excel)** | 40% | 2 (Medio - Cumplimiento) | 100% | 3 (Medio) | **26** | **BAJA (Sprint 2)** |

> **Insight Arquitectónico:** `HUC-03` tiene el puntaje RICE más alto porque es un "Quick Win" estratégico: el Ejecutivo no puede ver datos si no puede invitar a sus Operarios a llenar esos datos. Debe ser la primera funcionalidad a desarrollar.

---

## 2. Roadmap y Sprints Sugeridos

### Sprint 1: "Control y Visibilidad" (Enfoque en HUC-03 y HUC-01)
**Objetivo:** Que el dueño pueda armar su equipo digitalmente y tener una "foto" instantánea del estado actual de sus fincas (Semáforos de salud).

### Sprint 2: "Análisis de Evolución" (Enfoque en HUC-02 y HUC-04)
**Objetivo:** Demostrar el valor de la agricultura regenerativa mediante gráficas de tendencia (ej. "Aumento de Materia Orgánica en 6 meses").

---

## 3. Desglose Detallado de Historias

### HUC-03: Gestión de Equipo (Invitar Operarios)
> **Como** Dueño de Finca, **quiero** invitar a mis trabajadores por correo electrónico y asignarles una finca específica, **para** que ellos puedan empezar a registrar datos operativos.

* **Estimación Total:** 3 Días
* **Dependencias:** `user.controller.js`, `auth.controller.js`

#### Historias Técnicas y Tareas
1.  **HT-BACK-03: Endpoint de Invitación** (1 día)
    * Crear modelo `Invitacion` (email, rol, finca_id, token, estado, fecha_expiracion).
    * Endpoint `POST /api/v1/users/invite`: Genera token y envía email (usando Nodemailer/SendGrid).
    * Endpoint `POST /api/v1/auth/accept-invite`: Valida token y permite al usuario poner su password.
2.  **HT-FRONT-07: UI de Gestión de Usuarios** (2 días)
    * Tabla de usuarios activos (Nombre, Rol, Finca).
    * Modal de "Invitar Nuevo Usuario": Select de Finca (traído de `GET /fincas`) y campo de email.

---

### HUC-01: Dashboard de Estado General
> **Como** Ejecutivo, **quiero** ver un tablero con indicadores clave (KPIs) como "Promedio de Brix", "Alertas Activas" y "Ejecución de Tareas", **para** saber si mi inversión va por buen camino sin ir al campo.

* **Estimación Total:** 5 Días (Alta carga de Backend)
* **Dependencias:** MongoDB Aggregation Framework

#### Historias Técnicas y Tareas
1.  **HT-BACK-04: Pipelines de Agregación (KPIs)** (3 días)
    * Endpoint `GET /api/v1/analytics/dashboard/:fincaId`.
    * **KPI 1 (Salud):** Calcular promedio de últimos `analisis_quimico` (Brix, MO).
    * **KPI 2 (Operativo):** Contar `tareas` pendientes vs completadas esta semana.
    * **KPI 3 (Alertas):** Contar `incidencias` abiertas.
    * *Reto Técnico:* Optimizar consultas para no leer toda la colección histórica.
2.  **HT-FRONT-08: Maquetación de Dashboard (Gráficas)** (2 días)
    * Implementar librería de gráficas (ej. `Recharts` o `Chart.js`).
    * Componentes: Tarjetas de KPI, Gráfico de Torta (Estado de Tareas), Semáforo de Salud de Suelo.

---

### HUC-02: Reportes Comparativos (Evolución)
> **Como** Corporativo (ej. Starbucks), **quiero** comparar la calidad del suelo de la "Finca A" entre Enero y Junio, **para** verificar si están cumpliendo con las prácticas regenerativas.

* **Estimación Total:** 4 Días

#### Historias Técnicas y Tareas
1.  **HT-BACK-05: Endpoint de Histórico Comparativo** (2 días)
    * Endpoint `GET /api/v1/analytics/comparative`.
    * Query Params: `fincaId`, `startDate`, `endDate`, `variable` (ej. 'ph', 'carbono').
    * Lógica: Buscar `Muestras` en ese rango y extraer el valor específico embebido.
2.  **HT-FRONT-09: Visor de Tendencias** (2 días)
    * Gráfico de Línea (Eje X: Tiempo, Eje Y: Variable).
    * Filtros dinámicos (Selector de fechas, Selector de Lote).

---

### HUC-04: Exportación de Datos
> **Como** Gerente, **quiero** descargar un PDF con el resumen mensual, **para** presentarlo en la junta directiva.

* **Estimación Total:** 3 Días

#### Historias Técnicas y Tareas
1.  **HT-BACK-06: Generador de PDF (Backend)** (2 días)
    * Librería `pdfkit` o `puppeteer`.
    * Crear plantilla HTML/EJS para el reporte.
    * Endpoint `GET /api/v1/reports/monthly/:fincaId/download`.
2.  **HT-FRONT-10: Botón de Descarga** (1 día)
    * Manejo de descarga de BLOBs en el cliente.

---

## 4. Resumen de Esfuerzo (Cliente Ejecutivo)

* **Total Días Estimados (Desarrollo):** ~15 días laborables.
* **Sprints Recomendados:** 1 Sprint de 2 semanas (Fuerte enfoque en Backend/Data).
* **Complejidad:** Media (El reto está en las consultas de MongoDB, no en la UI).