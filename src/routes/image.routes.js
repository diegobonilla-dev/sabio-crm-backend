import { Router } from 'express';
import {
  uploadImage,
  uploadMultipleImages,
  healthCheck,
} from '../controllers/image.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Gestión de imágenes a través del Image Service
 */

/**
 * Ruta para subir una sola imagen
 * Requiere autenticación
 */
router.post('/upload', verifyToken, upload.single('image'), uploadImage);

/**
 * Ruta para subir múltiples imágenes
 * Requiere autenticación
 */
router.post(
  '/upload-multiple',
  verifyToken,
  upload.array('images', 10), // Máximo 10 imágenes
  uploadMultipleImages
);

/**
 * Ruta para verificar el estado del Image Service
 * No requiere autenticación (útil para monitoreo)
 */
router.get('/health', healthCheck);

export default router;
