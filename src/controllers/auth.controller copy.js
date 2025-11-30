import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

/**
 * @name login
 * @description Autentica un usuario y retorna un JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que vengan los datos
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }

    // 2. Buscar al usuario por email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' }); // 401 = No autorizado
    }

    // 3. Comparar la contraseña (usando el método que creamos en el modelo)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // 4. Si todo está OK, creamos el Token JWT
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET, // Usamos nuestra clave secreta del .env
      { expiresIn: '1d' } // El token expira en 1 día
    );

    // 5. Respondemos SÓLO con el token (¡Nunca la contraseña!)
    res.status(200).json({
      message: 'Login exitoso',
      token: token
    });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};