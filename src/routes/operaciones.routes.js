//src/routes/operaciones.routes.js
import { Router } from 'express';
import { createProducto, createAplicacion } from '../controllers/operaciones.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de operaciones están protegidas
router.use(protect);

/**
 * @swagger
 * /api/v1/operaciones/productos:
 *   post:
 *     summary: Crea un nuevo Producto en el catálogo
 *     tags:
 *       - Operativo (Operaciones)
 *     description: Añade un nuevo producto (fertilizante, pesticida, etc.) al catálogo general del sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_producto:
 *                 type: string
 *                 example: "Urea (Fertilizante)"
 *               tipo_producto:
 *                 type: string
 *                 enum:
 *                   - Fertilizante
 *                   - Pesticida
 *                   - Fungicida
 *                   - Herbicida
 *                   - Foliar
 *                   - Otro
 *                 example: "Fertilizante"
 *               composicion_n:
 *                 type: number
 *                 example: 46
 *               tiempo_carencia_dias:
 *                 type: number
 *                 example: 15
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente.
 */
router.post('/productos', createProducto);

/**
 * @swagger
 * /api/v1/operaciones/aplicaciones:
 *   post:
 *     summary: Registra una nueva Aplicación de producto
 *     tags:
 *       - Operativo (Operaciones)
 *     description: Registra un evento de aplicación de un producto del catálogo en un lote específico.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *                 example: "690b8f..."
 *               fincaId:
 *                 type: string
 *                 example: "690b6d..."
 *               loteId:
 *                 type: string
 *                 example: "690b8e..."
 *               cantidad_aplicada:
 *                 type: number
 *                 example: 50
 *               unidad_medida:
 *                 type: string
 *                 enum:
 *                   - kg
 *                   - litros
 *                   - sacos
 *                   - contenedores
 *                 example: "kg"
 *               contexto_aplicacion:
 *                 type: string
 *                 enum:
 *                   - Cultivo
 *                   - Ganaderia
 *                 example: "Cultivo"
 *               observaciones:
 *                 type: string
 *                 example: "Aplicación en surcos."
 *     responses:
 *       '201':
 *         description: Aplicación registrada exitosamente.
 *       '404':
 *         description: Finca, Lote o Producto no encontrado.
 */
router.post('/aplicaciones', createAplicacion);

export default router;