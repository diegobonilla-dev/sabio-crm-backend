//src/routes/laboratorio.routes.js
import { Router } from 'express';
import { createMuestra,addResultadosToMuestra } from '../controllers/laboratorio.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de laboratorio están protegidas
router.use(protect);

/**
 * @swagger
 * /api/v1/lab/muestras:
 *   post:
 *     summary: Registra una nueva muestra de laboratorio
 *     tags:
 *       - Operativo (Laboratorio)
 *     description: Crea un nuevo documento 'Muestra' (Master Sample) y lo asocia a una Finca y/o Pila de Compost.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fincaId:
 *                 type: string
 *                 description: ID de la Finca de donde proviene la muestra.
 *                 example: "690b6d..."
 *               pila_compost:
 *                 type: string
 *                 description: (Opcional) ID de la PilaCompost si es muestra de compost.
 *                 example: "690b7a..."
 *               nombre_muestra:
 *                 type: string
 *                 example: "Muestra Suelo Lote 1A"
 *               tipo_muestra:
 *                 type: string
 *                 enum:
 *                   - Suelo
 *                   - Compost
 *                   - Bioreactor
 *                   - Foliar
 *                 example: "Suelo"
 *               fecha_toma:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-06"
 *     responses:
 *       '201':
 *         description: Muestra registrada exitosamente.
 *       '404':
 *         description: Finca no encontrada.
 */
router.post('/muestras', createMuestra);

/**
 * @swagger
 * /api/v1/lab/muestras/{muestraId}/resultados:
 *   patch:
 *     summary: Añade resultados de análisis a una Muestra
 *     tags:
 *       - Operativo (Laboratorio)
 *     description: Actualiza una muestra existente con bloques de resultados (ej. conteo de bacterias, análisis químico).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: muestraId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la Muestra a la que se añadirán los resultados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: "Envía solo los bloques de resultados que quieras actualizar."
 *             properties:
 *               conteo_bacterias:
 *                 type: object
 *                 properties:
 *                   promedio:
 *                     type: number
 *                   desviacion_estandar:
 *                     type: number
 *                 example:
 *                   promedio: 1500
 *                   desviacion_estandar: 120
 *               resultados_quimicos:
 *                 type: object
 *                 properties:
 *                   ph:
 *                     type: number
 *                   materia_organica:
 *                     type: number
 *                 example:
 *                   ph: 6.8
 *                   materia_organica: 5.2
 *     responses:
 *       '200':
 *         description: Resultados añadidos exitosamente.
 *       '404':
 *         description: Muestra no encontrada.
 */
router.patch('/muestras/:muestraId/resultados', addResultadosToMuestra);

export default router;