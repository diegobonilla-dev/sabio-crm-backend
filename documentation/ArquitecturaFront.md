# Planeación: Arquitectura y Stack Frontend (Fase 5)

## 1. Framework Principal

* **Decisión:** **Next.js 14+ (App Router)**.
* **Razón:** Es el framework estándar de React para producción. Nos da SSR (Server-Side Rendering), SSG (Static-Site Generation), y *Server Components*, lo cual es ideal para dashboards. Se integra perfectamente con nuestro backend (`sabio-backend`) y Vercel.

## 2. Librería de UI y Estilos

* **Decisión:** **TailwindCSS** + **Shadcn/ui**.
* **Razón:**
    * **TailwindCSS:** Es la utilidad CSS estándar de la industria. Permite construir diseños personalizados rápidamente sin escribir CSS tradicional.
    * **Shadcn/ui:** No es una librería de componentes (como MUI o Chakra), sino una *colección de componentes* (ej. `Card`, `Button`, `Table`, `Dialog`) construidos sobre Tailwind. Copiamos y pegamos el código de sus componentes en nuestro proyecto, dándonos **control total** sobre su estilo y funcionamiento. Es la elección más moderna y flexible para Next.js.

## 3. Gestión de Estado Global (State Management)

* **Decisión:** **Zustand**.
* **Contexto:** Necesitamos un lugar para guardar el estado global, principalmente la información del usuario autenticado (el token JWT, `user.role`, `user.id`).
* **Razón:**
    * **Redux/Toolkit:** Demasiado *boilerplate* (complejidad) para nuestras necesidades.
    * **Context API:** Bueno, pero puede causar *re-renders* innecesarios en aplicaciones complejas.
    * **Zustand:** Es una librería minimalista, rápida y potente. Se aprende en 10 minutos y no requiere "Providers" en el árbol de componentes. Es la solución moderna y ligera ideal para este proyecto.

## 4. Fetching de Datos (Client-Side)

* **Decisión:** **TanStack Query (React Query)**.
* **Contexto:** Usaremos Axios para las peticiones HTTP, pero necesitamos una capa de *gestión* sobre esas peticiones.
* **Razón:** React Query maneja automáticamente el *caching* (guardar datos), *re-fetching* (actualizar datos al re-enfocar la ventana), estados de `isLoading`/`isError`, y mutaciones (POST/PATCH). Usar `useEffect` y `useState` para *fetching* manual es propenso a errores y mucho más lento de desarrollar.

## 5. Arquitectura de Carpetas (App Router)

Se propone la siguiente estructura dentro de la carpeta `/app` de Next.js:

/app
|
|-- /api/                    # (Si usamos Next.js para auth callbacks)
|
|-- /lib                     # Lógica reutilizable
|   |-- axios.js             # Instancia de Axios (con interceptores para el token JWT)
|   |-- hooks.js             # Hooks personalizados (ej. useAuth)
|   |-- store.js             # Tienda de Zustand (para el estado del usuario)
|
|-- /components              # Componentes de UI (reutilizables)
|   |-- /ui                  # Componentes de Shadcn/ui (Button, Card, etc.)
|   |-- /dashboard           # Componentes específicos del dashboard (ej. Sidebar, Header)
|
|-- / (root)                 # Página de Aterrizaje (Landing Page)
|   |-- layout.js
|   |-- page.js
|
|-- /(auth)/                 # Grupo de Rutas de Autenticación (Layout simple)
|   |-- /login
|   |   |-- page.js
|   |-- /register            # (Si aplica)
|
|-- /(app)/                  # Grupo de Rutas Protegidas (Dashboard Layout)
    |-- layout.js            # Layout principal (con Sidebar, Header, y chequeo de Auth)
    |-- /dashboard           # Página principal del dashboard (KPIs)
    |-- /crm                 # Dashboard Comercial (Pipeline)
    |-- /laboratorio         # Cola del Laboratorio
    |-- /admin               # Gestión de Usuarios y Productos
    |-- /fincas/[id]         # Hoja de Vida de la Finca