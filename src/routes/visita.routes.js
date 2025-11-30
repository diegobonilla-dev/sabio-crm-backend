import { Router } from 'express';
import { createVisita } from '../controllers/visita.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(protect);

/**
 * @swagger
 * /api/v1/visitas:
 * post:
 * summary: Registra una nueva Visita Técnica
 * tags: [Operativo (Visitas)]
 * description: Registra los hallazgos de una visita. Valida el tipo de datos según el tipo de producción de la finca.
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * fincaId:
 * type: string
 * example: "690b6d..."
 * motivo_visita:
 * type: string
 * enum: [Diagnostico Inicial, Seguimiento, Urgencia, Cierre de Ciclo]
 * example: "Seguimiento"
 * recomendaciones_generales:
 * type: string
 * example: "Aumentar rotación en potrero 3."
 * datos_ganaderia:
 * type: object
 * properties:
 * aforo_promedio_kg_m2:
 * type: number
 * example: 1.5
 * carga_animal_ugg:
 * type: number
 * example: 2.3
 * datos_agricultura:
 * type: object
 * description: "Enviar solo si es finca agrícola"
 * responses:
 * '201':
 * description: Visita registrada.
 * '400':
 * description: Faltan datos requeridos para el tipo de finca.
 */
router.post('/', createVisita);

export default router;