//src/routes/auth.routes.js
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Inicia sesión en el sistema
 *     tags:
 *       - Auth
 *     description: Autentica a un usuario (de cualquier rol) usando email y contraseña. Retorna un JSON Web Token (JWT) si las credenciales son válidas.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "diego.admin@sabio.com"
 *               password:
 *                 type: string
 *                 example: "unpasswordseguro"
 *     responses:
 *       '200':
 *         description: Login exitoso. Retorna un token.
 *       '401':
 *         description: Credenciales inválidas.
 *       '400':
 *         description: Faltan email o contraseña.
 *       '500':
 *         description: Error interno del servidor.
 */
router.post('/login', login);

export default router;