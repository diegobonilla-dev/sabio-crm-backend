# Planeación: Estrategia de Pruebas y Manejo de Errores

Este documento define la estrategia de control de calidad (QA) y el manejo de errores estandarizado para el backend.

## 1. Estrategia de Pruebas (Testing)

Adoptaremos un enfoque de "pirámide de pruebas" enfocado en la velocidad y la fiabilidad.

### Nivel 1: Pruebas Unitarias (Unit Tests)
* **Herramienta:** **Jest**.
* **Objetivo:** Probar la lógica de negocio *pura* y aislada (ej. funciones de utilidad, lógica de negocio compleja dentro de un controlador) sin tocar la base de datos o la red.
* **Cuándo:** Se implementarán para lógica de negocio crítica (ej. una función que calcule los KPIs del Gerente).

### Nivel 2: Pruebas de Integración (Integration Tests)
* **Herramientas:** **Jest** + **Supertest** + **MongoDB Memory Server**.
* **Objetivo:** Este será **nuestro foco principal**. Probaremos el flujo completo de la API (Ruta $\rightarrow$ Middleware $\rightarrow$ Controlador $\rightarrow$ Base de Datos).
* **Cómo:**
    1.  `MongoDB Memory Server` levanta una base de datos real de MongoDB en la memoria RAM antes de cada prueba.
    2.  `Supertest` nos permite hacer peticiones HTTP (GET, POST, etc.) a nuestra aplicación de Express *sin* necesidad de levantar el servidor.
    3.  `Jest` ejecuta la prueba y verifica que la respuesta de la API y el estado de la base de datos en memoria sean los correctos.
* **Cuándo:** Crearemos un archivo `.test.js` por cada archivo de rutas (ej. `auth.routes.test.js`, `finca.routes.test.js`).

### Nivel 3: Pruebas de Extremo a Extremo (E2E Tests)
* **Herramienta:** **Postman (Pruebas Manuales)**.
* **Objetivo:** Validar que el *endpoint* desplegado (ej. en el entorno de Staging o Producción) funciona correctamente.
* **Cuándo:** Usaremos Postman (como lo hemos hecho hasta ahora) para validar manualmente cada *feature* nueva antes de hacer *merge* a la rama principal.

## 2. Manejo de Errores Estandarizado

Para asegurar que nuestro frontend siempre reciba una respuesta JSON predecible, implementaremos un manejador de errores global.

### 2.1. Middleware de Errores (`errorHandler.js`)

Crearemos un middleware que se coloca **al final** de `app.js`. Capturará todos los errores que ocurran en los controladores (gracias a `try...catch`) y los formateará.

**Acción Requerida (Paso Futuro):**
1.  Crear `/src/middlewares/errorHandler.js`.
2.  Este middleware buscará el `statusCode` del error (ej. 400, 404, 500) y enviará una respuesta JSON consistente:
    ```json
    {
      "message": "Mensaje de error claro",
      "stack": "..." // (Solo en modo desarrollo)
    }
    ```
3.  Añadir `app.use(errorHandler)` al final de `app.js`.

### 2.2. Utilidad `asyncHandler`

Para evitar escribir `try...catch` en *cada* función de controlador, crearemos una función de utilidad (wrapper) que envuelva nuestros controladores y maneje los errores automáticamente.

**Acción Requerida (Paso Futuro):**
1.  Crear `/src/utils/asyncHandler.js`.
2.  Refactorizar todos los controladores para usarlo.

**Ejemplo de refactor:**
```javascript
// Antes (en el controlador)
export const createLead = async (req, res) => {
  try {
    // ...lógica...
  } catch (error) {
    res.status(500).json(...);
  }
}

// Después (en el controlador)
import asyncHandler from '../utils/asyncHandler.js';

export const createLead = asyncHandler(async (req, res) => {
  // ...lógica...
  // Ya no necesitamos try...catch.
  // Si algo falla, asyncHandler lo captura y lo envía al errorHandler.
});