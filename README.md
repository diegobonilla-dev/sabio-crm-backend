# Backend del Proyecto SaBio

Este repositorio contiene el backend oficial del proyecto SaBio, construido con el stack MERN (Node.js, Express, MongoDB) para gestionar el CRM y las operaciones de agricultura regenerativa.

## ✨ Features Principales

* **API RESTful** modular construida con Express.js.
* **Base de Datos NoSQL** optimizada con Mongoose y MongoDB Atlas.
* **Autenticación y Seguridad** basada en JSON Web Tokens (JWT) y `bcryptjs`.
* **Sistema de Roles** (Admin, Vendedor, Técnico, Cliente, etc.).
* **Módulo CRM** para la gestión de Leads, Actividades y Conversión de Clientes.
* **Módulo Operativo** (Empresas, Fincas, Divisiones Genéricas, Compost, Muestras de Laboratorio, Aplicaciones).
* **Documentación de API** autogenerada con Swagger (OpenAPI).

---

## 🚀 Empezando

### Prerrequisitos

* Node.js (v18+ recomendado)
* Una cuenta de MongoDB Atlas (el M0 *free tier* es suficiente)
* Git

### Instalación

1.  Clona el repositorio (si aún no lo has hecho):
    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    ```

2.  Entra al directorio del proyecto:
    ```bash
    cd sabio-backend
    ```

3.  Instala las dependencias de Node.js:
    ```bash
    npm install
    ```

### Configuración de Entorno

1.  Crea un archivo `.env` en la raíz del proyecto (`/sabio-backend/.env`).
2.  Añade las siguientes variables de entorno. (Usaremos este archivo para crear un `.env.example` en el siguiente paso).

    ```
    # Puerto del servidor
    PORT=4000
    
    # URI de conexión de MongoDB Atlas
    MONGO_URI=mongodb+srv://tu_usuario:tu_password@tu_cluster.mongodb.net/sabioDB
    
    # Clave secreta para firmar los JWT (usa un texto largo y aleatorio)
    JWT_SECRET=tuClaveSecretaLargaYUnica
    ```

---

## 🏃 Ejecución

### Modo Desarrollo

Ejecuta el servidor con `nodemon`, que se reiniciará automáticamente con cada cambio.

```bash
npm run dev
```

### Modo Producción

Ejecuta el servidor en modo producción.

```bash
npm run start
```

## API Endpoints

* **URL Base de la API:** `http://localhost:4000/api/v1`
* **Documentación (Swagger):** `http://localhost:4000/api-docs`

