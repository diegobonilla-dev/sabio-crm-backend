import { Router } from 'express';
import {
  createCorporativo,
  getCorporativos,
  getCorporativoById,
  updateCorporativo,
  deleteCorporativo
} from '../controllers/corporativo.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Solo admin y vendedores pueden gestionar corporativos
router.use(protect);

/**
 * @swagger
 * /api/v1/corporativos:
 *   post:
 *     summary: Crear un nuevo corporativo
 *     tags:
 *       - Corporativos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Corporativo creado exitosamente
 */
router.post('/', createCorporativo);

/**
 * @swagger
 * /api/v1/corporativos:
 *   get:
 *     summary: Listar todos los corporativos
 *     tags:
 *       - Corporativos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de corporativos
 */
router.get('/', getCorporativos);

/**
 * @swagger
 * /api/v1/corporativos/{id}:
 *   get:
 *     summary: Obtener un corporativo por ID
 *     tags:
 *       - Corporativos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Corporativo encontrado
 */
router.get('/:id', getCorporativoById);

/**
 * @swagger
 * /api/v1/corporativos/{id}:
 *   put:
 *     summary: Actualizar un corporativo
 *     tags:
 *       - Corporativos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Corporativo actualizado exitosamente
 */
router.put('/:id', updateCorporativo);

/**
 * @swagger
 * /api/v1/corporativos/{id}:
 *   delete:
 *     summary: Eliminar un corporativo
 *     tags:
 *       - Corporativos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Corporativo eliminado exitosamente
 */
router.delete('/:id', deleteCorporativo);

export default router;
