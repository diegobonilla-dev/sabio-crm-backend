// Archivo: /src/routes/finca.routes.js (Actualizado)

import { Router } from 'express';
import {
  createFinca,
  getFincas,
  getFincaById,
  updateFinca,
  deleteFinca,
  asociarCorporativo,
  addDivisionPrimaria,
  addDivisionSecundaria
} from '../controllers/finca.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(protect);

// CRUD básico
router.get('/', getFincas);
router.get('/:id', getFincaById);
router.put('/:id', updateFinca);
router.delete('/:id', deleteFinca);

// Asociar corporativo
router.post('/:fincaId/corporativos/:corporativoId', asociarCorporativo);

/**
 * @swagger
 * /api/v1/fincas/{empresaId}:
 *   post:
 *     summary: Crea una nueva Finca
 *     tags:
 *       - Operativo (Fincas)
 *     description: Crea una nueva finca y la asocia a una Empresa existente.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: empresaId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la Empresa dueña de la finca.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Finca La Pradera"
 *               area:
 *                 type: number
 *                 example: 100
 *               tipo_produccion:
 *                 type: string
 *                 enum:
 *                   - Cultivo
 *                   - Ganaderia
 *                   - Mixto
 *                   - Otro
 *                 example: "Ganaderia"
 *               municipio:
 *                 type: string
 *                 example: "Medellín"
 *     responses:
 *       '201':
 *         description: Finca creada exitosamente.
 */
router.post('/:empresaId', createFinca);

/**
 * @swagger
 * /api/v1/fincas/{fincaId}/divisiones-primarias:
 *   post:
 *     summary: Añade una División Primaria (Zona/Potrero) a una Finca
 *     tags:
 *       - Operativo (Fincas)
 *     description: Crea un sub-documento de División Primaria (ej. Zona, Potrero) dentro de una Finca.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fincaId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la Finca.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Potrero La Vaca Loca"
 *               imagen:
 *                 type: string
 *                 example: "http://url.com/imagen.jpg"
 *     responses:
 *       '201':
 *         description: División Primaria añadida exitosamente.
 *       '404':
 *         description: Finca no encontrada.
 */
router.post('/:fincaId/divisiones-primarias', addDivisionPrimaria);

/**
 * @swagger
 * /api/v1/fincas/{fincaId}/divisiones-primarias/{divisionPrimariaId}/divisiones-secundarias:
 *   post:
 *     summary: Añade una División Secundaria (Lote/Franja) a una División Primaria
 *     tags:
 *       - Operativo (Fincas)
 *     description: Crea un sub-documento de División Secundaria (ej. Lote, Franja) dentro de una División Primaria.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fincaId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la Finca.
 *       - in: path
 *         name: divisionPrimariaId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID de la División Primaria (ej. Zona, Potrero).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Franja 1A"
 *     responses:
 *       '201':
 *         description: División Secundaria añadida exitosamente.
 *       '404':
 *         description: Finca o División Primaria no encontrada.
 */
router.post('/:fincaId/divisiones-primarias/:divisionPrimariaId/divisiones-secundarias', addDivisionSecundaria);

export default router;