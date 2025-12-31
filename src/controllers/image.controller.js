import imageService from '../services/imageService.js';

/**
 * @swagger
 * /api/images/upload:
 *   post:
 *     summary: Subir una imagen al Image Service
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Archivo de imagen
 *               category:
 *                 type: string
 *                 description: Categoría de la imagen
 *                 enum: [diagnosticos, empresas, fincas, general]
 *                 default: general
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const uploadImage = async (req, res) => {
  try {
    if (!imageService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de imágenes no está configurado',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ninguna imagen',
      });
    }

    const category = req.body.category || 'general';

    const result = await imageService.uploadImage(req.file.buffer, {
      category,
      filename: req.file.originalname,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al subir la imagen',
    });
  }
};

/**
 * @swagger
 * /api/images/upload-multiple:
 *   post:
 *     summary: Subir múltiples imágenes al Image Service
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Archivos de imágenes
 *               category:
 *                 type: string
 *                 description: Categoría de las imágenes
 *                 enum: [diagnosticos, empresas, fincas, general]
 *                 default: general
 *     responses:
 *       200:
 *         description: Imágenes subidas exitosamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error del servidor
 */
export const uploadMultipleImages = async (req, res) => {
  try {
    if (!imageService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'El servicio de imágenes no está configurado',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionaron imágenes',
      });
    }

    const category = req.body.category || 'general';

    const images = req.files.map((file) => ({
      file: file.buffer,
      options: {
        category,
        filename: file.originalname,
      },
    }));

    const results = await imageService.uploadMultipleImages(images);

    const successfulUploads = results.filter((r) => !r.error);
    const failedUploads = results.filter((r) => r.error);

    res.json({
      success: true,
      data: {
        successful: successfulUploads.length,
        failed: failedUploads.length,
        results,
      },
    });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al subir las imágenes',
    });
  }
};

/**
 * @swagger
 * /api/images/health:
 *   get:
 *     summary: Verifica el estado del Image Service
 *     tags: [Images]
 *     responses:
 *       200:
 *         description: Estado del servicio
 */
export const healthCheck = async (req, res) => {
  try {
    const health = await imageService.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      healthy: false,
      message: error.message,
    });
  }
};
