import { Router } from 'express';
import { getDepartamentos, getMunicipiosByDepartamento } from '../controllers/ubicacion.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Proteger todas las rutas de ubicaciones
router.use(protect);

/**
 * @swagger
 * /api/v1/ubicaciones/departamentos:
 *   get:
 *     summary: Obtiene todos los departamentos de Colombia
 *     tags:
 *       - Ubicaciones
 *     description: Retorna la lista completa de 33 departamentos con sus códigos DANE
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de departamentos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   departamento:
 *                     type: string
 *                     example: "ANTIOQUIA"
 *                   codigo:
 *                     type: string
 *                     example: "05"
 */
router.get('/departamentos', getDepartamentos);

/**
 * @swagger
 * /api/v1/ubicaciones/municipios/{departamento}:
 *   get:
 *     summary: Obtiene todos los municipios de un departamento
 *     tags:
 *       - Ubicaciones
 *     description: Retorna la lista completa de municipios para un departamento específico
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: departamento
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del departamento (puede ser en mayúsculas o minúsculas)
 *         example: "ANTIOQUIA"
 *     responses:
 *       '200':
 *         description: Lista de municipios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 departamento:
 *                   type: string
 *                   example: "ANTIOQUIA"
 *                 codigo:
 *                   type: string
 *                   example: "05"
 *                 municipios:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["MEDELLÍN", "ENVIGADO", "ITAGÜÍ"]
 *       '404':
 *         description: Departamento no encontrado
 */
router.get('/municipios/:departamento', getMunicipiosByDepartamento);

export default router;
