import axios from 'axios';

/**
 * Servicio para interactuar con el Image Service (microservicio de imágenes)
 */
class ImageService {
  constructor() {
    this.baseURL = process.env.IMAGE_SERVICE_URL;
    this.apiKey = process.env.IMAGE_SERVICE_API_KEY;

    if (!this.baseURL || !this.apiKey) {
      console.warn('⚠️  IMAGE_SERVICE_URL o IMAGE_SERVICE_API_KEY no configurados');
    }

    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'x-api-key': this.apiKey,
      },
      timeout: 30000, // 30 segundos
    });
  }

  /**
   * Verifica si el Image Service está configurado y disponible
   */
  isConfigured() {
    return !!(this.baseURL && this.apiKey);
  }

  /**
   * Sube una imagen al Image Service
   * @param {Buffer|ReadStream} imageFile - Archivo de imagen
   * @param {Object} options - Opciones de subida
   * @param {string} options.category - Categoría de la imagen (ej: 'diagnosticos', 'empresas', 'general')
   * @param {string} options.filename - Nombre original del archivo (opcional)
   * @returns {Promise<Object>} Objeto con URLs y metadata de la imagen
   */
  async uploadImage(imageFile, options = {}) {
    if (!this.isConfigured()) {
      throw new Error('Image Service no está configurado. Configura IMAGE_SERVICE_URL y IMAGE_SERVICE_API_KEY');
    }

    try {
      const FormData = (await import('form-data')).default;
      const formData = new FormData();

      formData.append('image', imageFile, options.filename);
      if (options.category) {
        formData.append('category', options.category);
      }

      const response = await this.client.post('/upload', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error al subir imagen al Image Service:', error.message);
      if (error.response) {
        throw new Error(`Image Service error: ${error.response.data?.message || error.response.statusText}`);
      }
      throw error;
    }
  }

  /**
   * Sube múltiples imágenes en paralelo
   * @param {Array<{file: Buffer|ReadStream, options: Object}>} images - Array de imágenes con sus opciones
   * @returns {Promise<Array<Object>>} Array con las respuestas de cada imagen
   */
  async uploadMultipleImages(images) {
    if (!this.isConfigured()) {
      throw new Error('Image Service no está configurado');
    }

    const uploadPromises = images.map(({ file, options }) =>
      this.uploadImage(file, options).catch((error) => ({
        error: true,
        message: error.message,
      }))
    );

    return Promise.all(uploadPromises);
  }

  /**
   * Verifica el estado de salud del Image Service
   * @returns {Promise<Object>} Estado del servicio
   */
  async healthCheck() {
    if (!this.isConfigured()) {
      return { healthy: false, message: 'No configurado' };
    }

    try {
      const response = await this.client.get('/health');
      return {
        healthy: response.data.healthy || response.status === 200,
        ...response.data,
      };
    } catch (error) {
      return {
        healthy: false,
        message: error.message,
      };
    }
  }

  /**
   * Construye la URL completa de una imagen
   * @param {string} path - Path relativo de la imagen
   * @returns {string} URL completa
   */
  getImageURL(path) {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${this.baseURL}${path.startsWith('/') ? '' : '/'}${path}`;
  }
}

// Exportar instancia única (singleton)
export default new ImageService();
