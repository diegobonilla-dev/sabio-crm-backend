//src/routes/lead.routes.js
import { Router } from 'express';
import { createLead, getLeads, convertLeadToEmpresa } from '../controllers/lead.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// --- NOTA IMPORTANTE ---
// ¡Todas las rutas de Leads están protegidas!
// Nadie puede crear o ver un lead si no está autenticado.
router.use(protect);

/**
 * @swagger
 * /api/v1/leads:
 *   post:
 *     summary: Crea un nuevo Lead (Prospecto)
 *     tags:
 *       - CRM (Leads)
 *     description: Crea un nuevo Lead y lo asigna automáticamente al usuario (vendedor) autenticado.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empresa_nombre:
 *                 type: string
 *                 example: "Finca La Esperanza"
 *               contacto_nombre:
 *                 type: string
 *                 example: "Juan Valdez"
 *               email:
 *                 type: string
 *                 example: "juan@laesperanza.com"
 *               telefono:
 *                 type: string
 *                 example: "3001234567"
 *               origen:
 *                 type: string
 *                 example: "Referido"
 *     responses:
 *       '201':
 *         description: Lead creado exitosamente.
 *       '400':
 *         description: Faltan campos obligatorios.
 *       '401':
 *         description: No autorizado (token inválido o no provisto).
 */
router.post('/', createLead);

/**
 * @swagger
 * /api/v1/leads:
 *   get:
 *     summary: Obtiene los Leads
 *     tags:
 *       - CRM (Leads)
 *     description: Obtiene una lista de leads. Si el usuario es 'sabio_admin' ve todos. Si es 'sabio_vendedor', ve solo los asignados a él.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de leads obtenida.
 *       '401':
 *         description: No autorizado.
 */
router.get('/', getLeads);

/**
 * @swagger
 * /api/v1/leads/{leadId}/convertir:
 *   post:
 *     summary: Convierte un Lead "Ganado" en Empresa + Usuario
 *     tags:
 *       - CRM (Leads)
 *     description: Cambia el estado del Lead a 'Ganado' y crea una nueva Empresa y un nuevo Usuario (cliente_owner) con los datos del lead.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: El ID del Lead a convertir.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: La contraseña deseada para el nuevo usuario 'cliente_owner'.
 *                 example: "ClientePass123"
 *               nit:
 *                 type: string
 *                 description: (Opcional) El NIT de la nueva empresa.
 *                 example: "900123456-7"
 *     responses:
 *       '201':
 *         description: Lead convertido exitosamente. Retorna la nueva empresa.
 *       '400':
 *         description: El Lead ya fue convertido o falta la contraseña.
 *       '404':
 *         description: Lead no encontrado.
 */

router.post('/:leadId/convertir', convertLeadToEmpresa);

export default router;