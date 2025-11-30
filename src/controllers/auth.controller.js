//src/controllers/auth.controller.js
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name login
 * @description Autentica un usuario y retorna un JWT.
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validar que vengan los datos
  if (!email || !password) {
    res.status(400);
    throw new Error('Email y contraseña son requeridos');
  }

  // 2. Buscar al usuario por email
  const user = await User.findOne({ email: email.toLowerCase() });

  // 3. Comparar la contraseña (usando el método que creamos en el modelo)
  // Comprobamos '!user' aquí para dar la misma respuesta genérica
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Credenciales inválidas');
  }

  // 4. Si todo está OK, creamos el Token JWT
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const token = jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { expiresIn: '1d' }
  );

  // 5. Respondemos SÓLO con el token
  res.status(200).json({
    message: 'Login exitoso',
    token: token
  });
});