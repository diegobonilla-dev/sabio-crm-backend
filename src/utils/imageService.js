import axios from 'axios';
import FormData from 'form-data';

/**
 * Cliente para integración con el microservicio de imágenes
 *
 * Variables de entorno requeridas en /backend/.env:
 * - IMAGE_SERVICE_URL=https://images.tudominio.com
 * - IMAGE_SERVICE_API_KEY=tu-api-key-aqui
 */

const IMAGE_SERVICE_URL = process.env.IMAGE_SERVICE_URL || 'http://localhost:3002';
const IMAGE_SERVICE_API_KEY = process.env.IMAGE_SERVICE_API_KEY;

/**
 * Upload de imagen al microservicio
 * @param {Buffer|Stream} fileBuffer - Buffer o stream del archivo
 * @param {string} folder - Carpeta destino (avatars, diagnostics, products, etc.)
 * @returns {Promise<object>} - Objeto con URLs de las imágenes
 *
 * @example
 * const result = await uploadImage(fileBuffer, 'diagnostics');
 * console.log(result.url); // URL de la imagen optimizada
 * console.log(result.thumbnail); // URL del thumbnail
 */
export const uploadImage = async (fileBuffer, folder = 'general') => {
  try {
    if (!IMAGE_SERVICE_API_KEY) {
      throw new Error('IMAGE_SERVICE_API_KEY no configurada en variables de entorno');
    }

    const formData = new FormData();
    formData.append('image', fileBuffer, {
      filename: 'image.jpg',
      contentType: 'image/jpeg',
    });
    formData.append('folder', folder);

    const response = await axios.post(`${IMAGE_SERVICE_URL}/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'X-API-KEY': IMAGE_SERVICE_API_KEY,
      },
      timeout: 30000, // 30 segundos timeout
    });

    if (!response.data.success) {
      throw new Error('Upload falló en el servicio de imágenes');
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || 'Error desconocido';
      throw new Error(`Error al subir imagen: ${errorMsg}`);
    }
    throw new Error(`Error al subir imagen: ${error.message}`);
  }
};

/**
 * Eliminar imagen del microservicio
 * @param {string} imagePath - Path relativo de la imagen (ej: 'diagnostics/2025/12/file.webp')
 * @returns {Promise<object>} - Lista de archivos eliminados
 *
 * @example
 * const result = await deleteImage('diagnostics/2025/12/1735689600-a3f2c1.webp');
 * console.log(result.deleted); // Array de archivos eliminados
 */
export const deleteImage = async (imagePath) => {
  try {
    if (!IMAGE_SERVICE_API_KEY) {
      throw new Error('IMAGE_SERVICE_API_KEY no configurada en variables de entorno');
    }

    const encodedPath = encodeURIComponent(imagePath);
    const response = await axios.delete(`${IMAGE_SERVICE_URL}/api/images/${encodedPath}`, {
      headers: {
        'X-API-KEY': IMAGE_SERVICE_API_KEY,
      },
      timeout: 10000,
    });

    if (!response.data.success) {
      throw new Error('Delete falló en el servicio de imágenes');
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || 'Error desconocido';
      throw new Error(`Error al eliminar imagen: ${errorMsg}`);
    }
    throw new Error(`Error al eliminar imagen: ${error.message}`);
  }
};

/**
 * Obtener estadísticas del servicio de imágenes
 * @returns {Promise<object>} - Estadísticas generales
 *
 * @example
 * const stats = await getImageStats();
 * console.log(stats.totalImages);
 * console.log(stats.totalSize);
 */
export const getImageStats = async () => {
  try {
    if (!IMAGE_SERVICE_API_KEY) {
      throw new Error('IMAGE_SERVICE_API_KEY no configurada en variables de entorno');
    }

    const response = await axios.get(`${IMAGE_SERVICE_URL}/api/stats`, {
      headers: {
        'X-API-KEY': IMAGE_SERVICE_API_KEY,
      },
      timeout: 10000,
    });

    if (!response.data.success) {
      throw new Error('Stats falló en el servicio de imágenes');
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || 'Error desconocido';
      throw new Error(`Error al obtener estadísticas: ${errorMsg}`);
    }
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
};

/**
 * Listar imágenes con paginación
 * @param {object} options - Opciones de listado { folder, page, limit, sort }
 * @returns {Promise<object>} - { images, pagination }
 *
 * @example
 * const result = await listImages({ folder: 'diagnostics', page: 1, limit: 20 });
 * console.log(result.images);
 * console.log(result.pagination);
 */
export const listImages = async (options = {}) => {
  try {
    if (!IMAGE_SERVICE_API_KEY) {
      throw new Error('IMAGE_SERVICE_API_KEY no configurada en variables de entorno');
    }

    const { folder, page = 1, limit = 20, sort = 'date' } = options;

    const params = new URLSearchParams({
      page,
      limit,
      sort,
    });

    if (folder) {
      params.append('folder', folder);
    }

    const response = await axios.get(`${IMAGE_SERVICE_URL}/api/images?${params.toString()}`, {
      headers: {
        'X-API-KEY': IMAGE_SERVICE_API_KEY,
      },
      timeout: 10000,
    });

    if (!response.data.success) {
      throw new Error('List falló en el servicio de imágenes');
    }

    return response.data.data;
  } catch (error) {
    if (error.response) {
      const errorMsg = error.response.data?.error?.message || 'Error desconocido';
      throw new Error(`Error al listar imágenes: ${errorMsg}`);
    }
    throw new Error(`Error al listar imágenes: ${error.message}`);
  }
};

/**
 * Convertir Base64 a Buffer (para migrar imágenes existentes)
 * @param {string} base64String - String Base64 (data:image/jpeg;base64,...)
 * @returns {Buffer} - Buffer del archivo
 *
 * @example
 * const buffer = base64ToBuffer(diagnostico.foto_evidencia);
 * const result = await uploadImage(buffer, 'diagnostics');
 */
export const base64ToBuffer = (base64String) => {
  if (!base64String || typeof base64String !== 'string') {
    throw new Error('String Base64 inválido');
  }

  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    throw new Error('Formato Base64 inválido. Se espera: data:image/jpeg;base64,...');
  }

  return Buffer.from(matches[2], 'base64');
};

/**
 * Extraer path relativo de una URL del servicio de imágenes
 * @param {string} imageUrl - URL completa (ej: https://images.tudominio.com/uploads/diagnostics/2025/12/file.webp)
 * @returns {string} - Path relativo (ej: diagnostics/2025/12/file.webp)
 *
 * @example
 * const path = extractPathFromUrl('https://images.tudominio.com/uploads/diagnostics/2025/12/file.webp');
 * await deleteImage(path);
 */
export const extractPathFromUrl = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') {
    throw new Error('URL inválida');
  }

  // Extraer path después de /uploads/
  const match = imageUrl.match(/\/uploads\/(.+)$/);

  if (!match) {
    throw new Error('URL no contiene /uploads/ en el path esperado');
  }

  return match[1];
};

/**
 * Health check del servicio de imágenes
 * @returns {Promise<boolean>} - true si el servicio está disponible
 */
export const checkImageServiceHealth = async () => {
  try {
    const response = await axios.get(`${IMAGE_SERVICE_URL}/health`, {
      timeout: 5000,
    });

    return response.data.status === 'ok';
  } catch (error) {
    console.error('Image service health check falló:', error.message);
    return false;
  }
};

export default {
  uploadImage,
  deleteImage,
  getImageStats,
  listImages,
  base64ToBuffer,
  extractPathFromUrl,
  checkImageServiceHealth,
};
