//src/routes/auth.routes.js
import { Router } from 'express';
import { login } from '../controllers/auth.controller.js';
import {
  forgotPassword,
  verifyOTP,
  resetPassword,
  resendOTP
} from '../controllers/passwordReset.controller.js';

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

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Solicita recuperación de contraseña
 *     tags:
 *       - Auth
 *     description: Envía un código OTP de 6 dígitos al email del usuario para recuperar su contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@ejemplo.com"
 *     responses:
 *       '200':
 *         description: Código enviado exitosamente
 *       '429':
 *         description: Límite de solicitudes excedido
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/v1/auth/verify-otp:
 *   post:
 *     summary: Verifica el código OTP
 *     tags:
 *       - Auth
 *     description: Valida el código OTP de 6 dígitos enviado al email del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@ejemplo.com"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: OTP verificado, retorna resetToken
 *       '400':
 *         description: OTP inválido o expirado
 */
router.post('/verify-otp', verifyOTP);

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña
 *     tags:
 *       - Auth
 *     description: Cambia la contraseña del usuario usando el resetToken obtenido al verificar el OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: "eyJ1c2VySWQiOiI2M..."
 *               newPassword:
 *                 type: string
 *                 example: "nuevaContraseña123"
 *     responses:
 *       '200':
 *         description: Contraseña actualizada exitosamente
 *       '400':
 *         description: Token inválido o expirado
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /api/v1/auth/resend-otp:
 *   post:
 *     summary: Reenvía el código OTP
 *     tags:
 *       - Auth
 *     description: Reenvía un nuevo código OTP al email del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@ejemplo.com"
 *     responses:
 *       '200':
 *         description: Nuevo código enviado
 */
router.post('/resend-otp', resendOTP);

export default router;