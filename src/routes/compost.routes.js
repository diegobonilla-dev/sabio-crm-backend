//src/routes/compost.routes.js
import { Router } from 'express';
import { createPlantilla, createPila, addSeguimientoToPila } from '../controllers/compost.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de compost están protegidas
router.use(protect);

/**
 * @swagger
 * /api/v1/compost/plantillas:
 *   post:
 *     summary: Crea una nueva Plantilla de Compost
 *     tags:
 *       - Operativo (Compost)
 *     description: Crea una nueva receta maestra (plantilla) para compost. (Ruta protegida, usualmente para 'sabio_admin' o 'sabio_tecnico').
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Plantilla Alta en Carbono v2"
 *               descripcion:
 *                 type: string
 *                 example: "Ideal para suelos arcillosos"
 *               pct_material_cafe:
 *                 type: number
 *                 example: 60
 *               pct_material_verde:
 *                 type: number
 *                 example: 40
 *     responses:
 *       '201':
 *         description: Plantilla creada exitosamente.
 */
router.post('/plantillas', createPlantilla);

/**
 * @swagger
 * /api/v1/compost/pilas:
 *   post:
 *     summary: Crea una nueva Pila de Compost (Instancia)
 *     tags:
 *       - Operativo (Compost)
 *     description: Registra una nueva pila de compost física en una finca.
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
 *                 description: ID de la Finca donde se crea la pila.
 *                 example: "690b6d..."
 *               nombre:
 *                 type: string
 *                 example: "Pila Lote 1 - 06 Nov"
 *               plantilla_usada:
 *                 type: string
 *                 description: (Opcional) ID de la PlantillaCompost usada.
 *                 example: "690b7a..."
 *               variaciones_plantilla:
 *                 type: string
 *                 example: "Se usó más material verde del recomendado."
 *     responses:
 *       '201':
 *         description: Pila creada exitosamente.
 *       '404':
 *         description: Finca o Plantilla no encontrada.
 */
router.post('/pilas', createPila);

// --- ¡NUEVA RUTA Y SWAGGER! ---
/**
 * @swagger
 * /api/v1/compost/pilas/{pilaId}/seguimiento:
 *   post:
 *     summary: Añade un registro de seguimiento a una Pila
 *     tags:
 *       - Operativo (Compost)
 *     description: Crea un sub-documento de seguimiento (temperatura, humedad, etc.) dentro del array 'seguimiento' de una Pila existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pilaId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la Pila de Compost a la que se añadirá el seguimiento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               volteo:
 *                 type: boolean
 *                 example: true
 *               temp_prom:
 *                 type: number
 *                 example: 65.5
 *               hum_prom:
 *                 type: number
 *                 example: 50
 *               observaciones:
 *                 type: string
 *                 example: "Olor a amoniaco leve."
 *     responses:
 *       '201':
 *         description: Seguimiento añadido exitosamente.
 *       '404':
 *         description: Pila de compost no encontrada.
 */
router.post('/pilas/:pilaId/seguimiento', addSeguimientoToPila);

export default router;