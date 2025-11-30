// Importamos el modelo que definimos en el Paso 6
import User from '../models/user.model.js';


/**
 * @name createUser
 * @description Crea un nuevo usuario en la base de datos.
 */
export const createUser = async (req, res) => {
  try {
    // 1. Obtenemos los datos del body (lo que Postman envía)
    const { name, email, password, role } = req.body;

    // 2. Validamos que los datos básicos estén
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Faltan campos obligatorios (name, email, password, role)' });
    }

    // 3. Creamos una nueva instancia del modelo User
    const newUser = new User({
      name,
      email,
      password, 
      role
    });

    // 4. Guardamos el nuevo usuario en MongoDB Atlas
    const userSaved = await newUser.save();

    // 5. Respondemos al frontend con el usuario creado
    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: userSaved
    });

  } catch (error) {
    // Manejo de errores (ej. email duplicado)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * @name getUsers
 * @description Obtiene todos los usuarios de la base de datos.
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};