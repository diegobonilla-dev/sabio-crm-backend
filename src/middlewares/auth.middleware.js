//src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = async (req, res, next) => {
  let token;

  try {
    // 1. Verificar si la petición tiene el "header" de autorización
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // 2. Extraer el token (viene como "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar la validez del token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Buscar al usuario del token en la BD y adjuntarlo a 'req'
      // El '.select('-password')' es clave: le decimos a Mongoose que traiga al usuario
      // pero que EXCLUYA la contraseña.
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no encontrado' });
      }

      // 5. Si todo está bien, ¡deja pasar al siguiente middleware o controlador!
      next();

    } else {
      // Si no hay header 'Authorization' o no empieza con 'Bearer'
      throw new Error('No autorizado, no hay token');
    }
  } catch (error) {
    res.status(401).json({ message: 'No autorizado, token inválido', error: error.message });
  }
};

/**
 * @name adminOnly
 * @description Middleware que verifica que el usuario autenticado sea un administrador.
 * Debe usarse DESPUÉS del middleware 'protect'.
 */
export const adminOnly = asyncHandler(async (req, res, next) => {
  // Verificar que req.user existe (debe venir del middleware protect)
  if (!req.user) {
    res.status(401);
    throw new Error('No autenticado');
  }

  // Verificar que el rol sea sabio_admin
  if (req.user.role !== 'sabio_admin') {
    res.status(403);
    throw new Error('Acceso denegado. Solo administradores.');
  }

  // Si es admin, continuar
  next();
});