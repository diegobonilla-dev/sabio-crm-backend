//src/routes/user.routes.js
import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  changeUserPassword,
  deleteUser,
  getUserDependencies
} from '../controllers/user.controller.js';
import { protect, adminOnly } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags:
 *       - Users
 *     description: Crea un nuevo usuario para el sistema SaBio (admin, vendedor, tecnico, etc.).
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Diego Bonilla"
 *               email:
 *                 type: string
 *                 example: "diego.vendedor@sabio.com"
 *               password:
 *                 type: string
 *                 example: "PasswordSeguro123"
 *               role:
 *                 type: string
 *                 enum:
 *                   - sabio_admin
 *                   - sabio_vendedor
 *                   - sabio_tecnico
 *                   - sabio_laboratorio
 *                   - cliente_owner
 *                   - cliente_corporate
 *                 example: "sabio_vendedor"
 *     responses:
 *       '201':
 *         description: Usuario creado exitosamente.
 *       '400':
 *         description: Faltan campos obligatorios o el correo ya existe.
 *       '500':
 *         description: Error interno del servidor.
 */

// --- Ruta Pública ---
// POST /api/v1/users
// Cualquiera puede crear un usuario (por ahora)
router.post('/', createUser);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags:
 *       - Users
 *     description: Retorna una lista de todos los usuarios registrados en el sistema.
 *     responses:
 *       '200':
 *         description: Lista de usuarios obtenida.
 *       '500':
 *         description: Error interno del servidor.
 */

// --- Rutas Protegidas (cualquier usuario autenticado) ---
// GET /api/v1/users
// Solo los usuarios con un token válido podrán acceder
router.get('/', protect, getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags:
 *       - Users
 *     description: Retorna los datos de un usuario específico por su ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "690a4216fafb41cfca8d23c0"
 *     responses:
 *       '200':
 *         description: Usuario obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       '401':
 *         description: No autenticado o token inválido.
 *       '404':
 *         description: Usuario no encontrado.
 */

// GET /api/v1/users/:id
// Obtener un usuario específico por ID
router.get('/:id', protect, getUserById);

// --- Rutas de Solo Administrador ---

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza un usuario (Solo Admin)
 *     tags:
 *       - Users
 *     description: Actualiza los datos de un usuario existente. Solo administradores pueden usar este endpoint.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *         example: "690a4216fafb41cfca8d23c0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Diego Bonilla Actualizado"
 *               email:
 *                 type: string
 *                 example: "diego.nuevo@sabio.com"
 *               role:
 *                 type: string
 *                 enum:
 *                   - sabio_admin
 *                   - sabio_vendedor
 *                   - sabio_tecnico
 *                   - sabio_laboratorio
 *                   - cliente_owner
 *                   - cliente_corporate
 *                 example: "sabio_tecnico"
 *               empresa:
 *                 type: string
 *                 description: ID de empresa (solo si role es cliente_owner)
 *               corporativo:
 *                 type: string
 *                 description: ID de corporativo (solo si role es cliente_corporate)
 *     responses:
 *       '200':
 *         description: Usuario actualizado exitosamente.
 *       '400':
 *         description: Error de validación.
 *       '401':
 *         description: No autenticado.
 *       '403':
 *         description: Acceso denegado. Solo administradores o no puedes cambiar tu propio rol.
 *       '404':
 *         description: Usuario no encontrado.
 */

// PUT /api/v1/users/:id
// Actualizar usuario (solo admin)
router.put('/:id', protect, adminOnly, updateUser);

/**
 * @swagger
 * /api/v1/users/{id}/password:
 *   put:
 *     summary: Cambia la contraseña de un usuario (Solo Admin)
 *     tags:
 *       - Users
 *     description: Permite a un administrador cambiar la contraseña de cualquier usuario.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "690a4216fafb41cfca8d23c0"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *                 example: "NuevaPassword123"
 *     responses:
 *       '200':
 *         description: Contraseña actualizada exitosamente.
 *       '400':
 *         description: La contraseña debe tener al menos 6 caracteres.
 *       '401':
 *         description: No autenticado.
 *       '403':
 *         description: Acceso denegado. Solo administradores.
 *       '404':
 *         description: Usuario no encontrado.
 */

// PUT /api/v1/users/:id/password
// Cambiar contraseña de un usuario (solo admin)
router.put('/:id/password', protect, adminOnly, changeUserPassword);

/**
 * @swagger
 * /api/v1/users/{id}/dependencies:
 *   get:
 *     summary: Verifica las dependencias de un usuario (Solo Admin)
 *     tags:
 *       - Users
 *     description: Verifica si un usuario tiene leads, empresas o fincas asignadas antes de eliminarlo.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *         example: "690a4216fafb41cfca8d23c0"
 *     responses:
 *       '200':
 *         description: Dependencias verificadas exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 canDelete:
 *                   type: boolean
 *                   description: Indica si el usuario puede ser eliminado
 *                 dependencies:
 *                   type: object
 *                   properties:
 *                     leads:
 *                       type: number
 *                       description: Número de leads asignados
 *                     empresas:
 *                       type: number
 *                       description: Número de empresas donde es account manager
 *                     fincas:
 *                       type: number
 *                       description: Número de fincas asignadas
 *       '401':
 *         description: No autenticado.
 *       '403':
 *         description: Acceso denegado. Solo administradores.
 */

// GET /api/v1/users/:id/dependencies
// Verificar dependencias antes de eliminar (solo admin)
router.get('/:id/dependencies', protect, adminOnly, getUserDependencies);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Elimina un usuario (Solo Admin)
 *     tags:
 *       - Users
 *     description: Elimina un usuario del sistema si no tiene dependencias (leads, empresas, fincas asignadas).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *         example: "690a4216fafb41cfca8d23c0"
 *     responses:
 *       '200':
 *         description: Usuario eliminado exitosamente.
 *       '400':
 *         description: No se puede eliminar. El usuario tiene dependencias que deben ser reasignadas primero.
 *       '401':
 *         description: No autenticado.
 *       '403':
 *         description: Acceso denegado. Solo administradores o no puedes eliminar tu propia cuenta.
 *       '404':
 *         description: Usuario no encontrado.
 */

// DELETE /api/v1/users/:id
// Eliminar usuario (solo admin)
router.delete('/:id', protect, adminOnly, deleteUser);

export default router;