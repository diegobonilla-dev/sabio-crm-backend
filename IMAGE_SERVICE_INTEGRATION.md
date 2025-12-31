# 📸 Integración del Image Service con el Backend

## 🎯 Descripción

El backend de SaBio ahora está integrado con el **Image Service**, un microservicio independiente que gestiona el upload, optimización y servicio de imágenes.

---

## ⚙️ Configuración

### 1. Variables de entorno

Agrega estas variables en tu archivo `.env`:

```bash
IMAGE_SERVICE_URL=http://fowokk8sockwkso4swcso0w4.31.97.215.37.sslip.io
IMAGE_SERVICE_API_KEY=+Vy1Oj52EZVfPAvFqs0ZzeUqTMBhGg5+U9MiZtd8tTk=
```

### 2. Instalar dependencias

```bash
npm install
```

Esto instalará las nuevas dependencias:
- `multer`: Para manejar uploads multipart/form-data
- `form-data`: Para enviar imágenes al Image Service

---

## 🚀 Uso desde el Frontend

### Endpoint: Subir una imagen

**POST** `/api/v1/images/upload`

**Headers:**
```
Authorization: Bearer <tu-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `image`: Archivo de imagen (JPEG, PNG, GIF, WEBP)
- `category`: (opcional) Categoría de la imagen. Valores: `diagnosticos`, `empresas`, `fincas`, `general` (default)

**Ejemplo con axios (React):**

```javascript
const uploadImage = async (file, category = 'general') => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', category);

  try {
    const response = await axios.post(
      'http://tu-backend.com/api/v1/images/upload',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Imagen subida:', response.data);
    // response.data.data contiene las URLs de la imagen
    return response.data.data;
  } catch (error) {
    console.error('Error al subir imagen:', error);
  }
};
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "url": "http://.../.../imagen.webp",
    "thumbnail": "http://.../.../imagen-thumb.webp",
    "small": "http://.../.../imagen-small.webp",
    "size": 47284,
    "width": 720,
    "height": 856,
    "folder": "general",
    "filename": "1767199955974-ey9eKL.webp",
    "path": "general/2025/12/1767199955974-ey9eKL.webp"
  }
}
```

---

### Endpoint: Subir múltiples imágenes

**POST** `/api/v1/images/upload-multiple`

**Headers:**
```
Authorization: Bearer <tu-jwt-token>
Content-Type: multipart/form-data
```

**Body (Form Data):**
- `images[]`: Array de archivos de imagen (máximo 10)
- `category`: (opcional) Categoría de las imágenes

**Ejemplo con axios (React):**

```javascript
const uploadMultipleImages = async (files, category = 'general') => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });
  formData.append('category', category);

  try {
    const response = await axios.post(
      'http://tu-backend.com/api/v1/images/upload-multiple',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Imágenes subidas:', response.data);
    return response.data.data.results;
  } catch (error) {
    console.error('Error al subir imágenes:', error);
  }
};
```

**Respuesta exitosa:**

```json
{
  "success": true,
  "data": {
    "successful": 3,
    "failed": 0,
    "results": [
      {
        "url": "http://.../.../imagen1.webp",
        "thumbnail": "http://.../.../imagen1-thumb.webp",
        "small": "http://.../.../imagen1-small.webp",
        ...
      },
      {
        "url": "http://.../.../imagen2.webp",
        ...
      }
    ]
  }
}
```

---

### Endpoint: Health Check del Image Service

**GET** `/api/v1/images/health`

**Headers:** (ninguno necesario)

**Ejemplo:**

```javascript
const checkImageServiceHealth = async () => {
  const response = await axios.get('http://tu-backend.com/api/v1/images/health');
  console.log('Image Service health:', response.data);
};
```

**Respuesta:**

```json
{
  "healthy": true,
  "status": "running",
  "uptime": 12345
}
```

---

## 💻 Uso desde los Controllers

Puedes usar el servicio de imágenes directamente en tus controllers:

```javascript
import imageService from '../services/imageService.js';

// Ejemplo: Subir imagen de diagnóstico
export const createDiagnosticoWithImage = async (req, res) => {
  try {
    // 1. Subir la imagen al Image Service
    const imageData = await imageService.uploadImage(req.file.buffer, {
      category: 'diagnosticos',
      filename: req.file.originalname,
    });

    // 2. Crear el diagnóstico con la URL de la imagen
    const diagnostico = new Diagnostico({
      ...req.body,
      imagenUrl: imageData.url,
      imagenThumbnail: imageData.thumbnail,
    });

    await diagnostico.save();

    res.json({
      success: true,
      data: diagnostico,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
```

---

## 📝 Categorías de imágenes

Las categorías organizan las imágenes en el Image Service:

- `diagnosticos`: Imágenes de diagnósticos de fincas
- `empresas`: Logos y fotos de empresas
- `fincas`: Fotos de fincas
- `general`: Cualquier otra imagen (default)

---

## 🔒 Seguridad

- ✅ Todas las rutas requieren autenticación JWT (excepto health check)
- ✅ Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)
- ✅ Tamaño máximo: 10 MB por archivo
- ✅ Comunicación con Image Service protegida por API Key

---

## 🛠️ Troubleshooting

### Error: "Image Service no está configurado"

Verifica que las variables de entorno estén configuradas:

```bash
echo $IMAGE_SERVICE_URL
echo $IMAGE_SERVICE_API_KEY
```

### Error: "Tipo de archivo no permitido"

Solo se permiten archivos de imagen. Verifica el tipo MIME del archivo.

### Error: "File too large"

El límite es 10 MB por archivo. Optimiza la imagen antes de subirla.

---

## 📊 Estructura de archivos creados

```
backend/
├── src/
│   ├── services/
│   │   └── imageService.js         # Servicio para comunicarse con Image Service
│   ├── controllers/
│   │   └── image.controller.js     # Controlador de endpoints de imágenes
│   ├── routes/
│   │   └── image.routes.js         # Rutas de imágenes
│   └── middlewares/
│       └── upload.middleware.js    # Configuración de multer
├── .env.example                     # Variables de entorno actualizadas
└── IMAGE_SERVICE_INTEGRATION.md    # Esta documentación
```

---

## ✅ Siguiente paso: Deploy

1. **Agrega las variables de entorno en Coolify:**
   - Ve a tu proyecto Backend en Coolify
   - Agrega las variables `IMAGE_SERVICE_URL` y `IMAGE_SERVICE_API_KEY`

2. **Redeploy el backend:**
   ```bash
   git add .
   git commit -m "Add Image Service integration"
   git push origin main
   ```

3. **Verifica que funciona:**
   - Prueba el endpoint de health: `GET /api/v1/images/health`
   - Sube una imagen de prueba: `POST /api/v1/images/upload`

---

¡Listo! Ahora tu backend puede gestionar imágenes a través del Image Service 🎉
