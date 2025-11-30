# Registro de Decisiones de Arquitectura (ADR) - Proyecto SaBio

Este documento registra las decisiones arquitectónicas clave tomadas durante el desarrollo del backend de SaBio.

---

## ADR-001: Stack de Backend (MERN)

**Decisión:**
Se seleccionó un stack MERN personalizado (MongoDB, Express, Node.js) sobre la plataforma No-Code Xano.

**Contexto:**
El sistema existente en Xano utiliza una base de datos PostgreSQL. Si bien es funcional, presenta desafíos de rigidez (SQL), escalado horizontal y dependencia del proveedor (vendor lock-in). El negocio requiere una alta flexibilidad para modelar flujos de trabajo complejos de agricultura regenerativa.

**Razón:**
1.  **Flexibilidad del Esquema:** MongoDB (NoSQL) nos permite modelar datos jerárquicos complejos (ej. Fincas $\rightarrow$ Zonas $\rightarrow$ Lotes, Pilas $\rightarrow$ Seguimientos) de forma nativa en un solo documento, mejorando drásticamente el rendimiento de lectura.
2.  **Escalabilidad Horizontal:** MongoDB Atlas está diseñado para escalar horizontalmente, lo cual se alinea con el crecimiento del negocio (más fincas, más mediciones).
3.  **Propiedad del Código:** Movernos a un stack propio elimina la dependencia de Xano y convierte nuestra lógica de negocio en un activo intelectual propio.
4.  **Ecosistema:** El stack MERN (usando `type: "module"`) nos permite usar el mismo lenguaje (JavaScript/TypeScript) y la misma sintaxis de módulos (`import/export`) que en el frontend (Next.js), unificando el desarrollo.

---

## ADR-002: Estrategia de Diseño NoSQL (Embebido vs. Referenciado)

**Decisión:**
Adoptamos un enfoque híbrido.
1.  **Embebido (Anidado):** Para datos que "pertenecen" a su padre y no tienen sentido por sí solos (ej. `Seguimiento` dentro de `PilaCompost`; `Divisiones` dentro de `Finca`).
2.  **Referenciado (Linking):** Para entidades principales que se consultan por separado o se relacionan en modo "Muchos-a-Muchos" (ej. `User`, `Empresa`, `Finca`, `Lead`, `Producto`).

**Contexto:**
Una base de datos NoSQL puede volverse lenta si los documentos se hacen demasiado grandes (ej. > 16MB) o si los datos se duplican en exceso.

**Razón:**
* **Embebido (Pros):** Rendimiento de lectura atómico. Al pedir una `Finca`, obtenemos todas sus `Divisiones` en una sola consulta a la BD. Al pedir una `PilaCompost`, obtenemos todo su historial de seguimiento.
* **Referenciado (Pros):** Evita la duplicación de datos y mantiene los documentos en un tamaño manejable. Una `Finca` (que puede ser grande) no se duplica; solo se guarda su `_id` en el array `fincas` de la `Empresa`.

---

## ADR-003: Estructura Genérica de Fincas (Divisiones)

**Decisión:**
Se refactorizó el modelo `Finca` para usar arrays genéricos: `divisiones_primarias` y `divisiones_secundarias`, en lugar de `zonas` y `lotes`.

**Contexto:**
El archivo `NOTES.md` identificó que la terminología de la estructura de una finca varía según el tipo de producción (ej. `Zonas/Lotes` para Cultivos vs. `Potreros/Franjas` para Ganadería).

**Razón:**
1.  **Flexibilidad:** El backend no debe imponer una terminología de negocio. Almacena una estructura genérica.
2.  **Responsabilidad del Frontend:** El frontend (Next.js) será responsable de leer el campo `tipo_produccion` de la finca y renderizar las etiquetas apropiadas (ej. "Nueva Zona" o "Nuevo Potrero"). Esto nos permite soportar cualquier tipo de producción futura sin cambiar el backend.

---

## ADR-004: Autenticación (JWT + Roles)

**Decisión:**
Se implementará un sistema de autenticación propio usando JSON Web Tokens (JWT) y un campo `role` en el modelo `User`.

**Contexto:**
Necesitamos un sistema de seguridad que distinga entre usuarios internos (Admin, Vendedor) y externos (Cliente Dueño, Cliente Corporativo).

**Razón:**
1.  **Stateless (Sin Estado):** Los JWTs son *stateless*. El servidor no necesita guardar la sesión; toda la información del usuario (ID, Rol) viaja en el token, lo cual es perfecto para APIs RESTful y escalado horizontal.
2.  **Control de Acceso:** El campo `role` nos permite implementar *middlewares* de permisos granulares (ej. `checkRole('admin')`) para proteger *endpoints* específicos.
3.  **Flexibilidad:** Nos permite tener un solo modelo `User` que maneja todos los tipos de inicio de sesión.