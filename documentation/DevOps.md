# Planeación: Estrategia de Despliegue (Paso 39)

Este documento define la estrategia para desplegar (lanzar) el backend y el frontend del MVP.

## 1. Stack de Despliegue

### Backend (Node.js / Express)
* **Servicio:** **Render** (o una alternativa PaaS - Plataforma como Servicio - similar, como Railway).
* **Razón:** Render es una plataforma moderna que se integra directamente con GitHub. Es más simple que AWS EC2 y más robusto que Vercel para servidores Node.js persistentes. Detectará nuestro `package.json` y ejecutará `npm install` y `npm run start` automáticamente.
* **Base de Datos:** Ya está decidido: **MongoDB Atlas** (separado del servidor).

### Frontend (Next.js)
* **Servicio:** **Vercel**.
* **Razón:** Es la plataforma creada *por* los desarrolladores de Next.js. Ofrece la mejor integración, rendimiento (CDN global) y despliegue continuo (CI/CD) para Next.js de forma nativa.

## 2. Proceso de Despliegue Continuo (CI/CD)

No haremos despliegues manuales subiendo archivos. Usaremos la integración nativa de Git.

1.  **Rama `main` (Producción):**
    * Cualquier *commit* o *merge* a la rama `main` disparará automáticamente un despliegue a producción.
    * Vercel (Frontend) y Render (Backend) se conectarán a esta rama.

2.  **Rama `develop` (Staging/Pruebas):**
    * (Recomendado - Fase 2) Crearemos una rama `develop`.
    * Cualquier *commit* a `develop` desplegará en un entorno de "staging" (ej. `staging.sabio.app`).
    * Aquí es donde el equipo de SaBio (Gestores, Gerente) probará las nuevas *features* antes de que pasen a `main`.

## 3. Gestión de Variables de Entorno (Producción)

Este es el paso más crítico de la seguridad.

* El archivo `.env` **NUNCA** se sube a GitHub.
* **En Render (Backend):** Usaremos el dashboard de Render para configurar las variables de entorno (`MONGO_URI`, `JWT_SECRET`) de forma segura.
* **En Vercel (Frontend):** Usaremos el dashboard de Vercel para configurar las variables de entorno del frontend (ej. `NEXT_PUBLIC_API_URL=https://sabio-backend.onrender.com/api/v1`).

## 4. Checklist de Puesta en Marcha (Go-Live)

1.  [ ] Configurar la cuenta de Render y Vercel.
2.  [ ] Conectar Render al repositorio de GitHub (`sabio-backend`, rama `main`).
3.  [ ] Configurar las variables de entorno (`MONGO_URI`, `JWT_SECRET`) en Render.
4.  [ ] Disparar el primer despliegue del Backend.
5.  [ ] Conectar Vercel al repositorio de GitHub (`sabio-frontend`, rama `main`).
6.  [ ] Configurar las variables de entorno (`NEXT_PUBLIC_API_URL`) en Vercel.
7.  [ ] Disparar el primer despliegue del Frontend.
8.  [ ] (Opcional) Comprar y configurar un dominio personalizado (ej. `app.sabio.com`).