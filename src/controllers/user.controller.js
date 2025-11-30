//src/controllers/user.controller.js
// Importamos el modelo que definimos en el Paso 6
import User from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';


/**
 * @name createUser
 * @description Crea un nuevo usuario en la base de datos.
 */
// ¡Envuelve la función en asyncHandler!
export const createUser = asyncHandler(async (req, res) => {

  const { name, email, password, role, empresa, corporativo } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400); // Solo definimos el status
    throw new Error('Faltan campos obligatorios (name, email, password, role)'); // Lanzamos el error
  }

  const newUser = new User({
    name,
    email,
    password,
    role,
    empresa,
    corporativo
  });

  const userSaved = await newUser.save();

  res.status(201).json({
    message: 'Usuario creado exitosamente',
    user: userSaved
  });
}); // <-- Cierra el asyncHandler

/**
 * @name getUsers
 * @description Obtiene todos los usuarios de la base de datos.
 */
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .populate('empresa', 'nombre NIT')
    .populate('corporativo', 'nombre')
    .populate('fincas_asignadas_tecnico', 'nombre');
  res.status(200).json(users);
});

/**
 * @name getUserById
 * @description Obtiene un usuario por su ID.
 */
export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id)
    .select('-password')
    .populate('empresa', 'nombre NIT')
    .populate('corporativo', 'nombre')
    .populate('fincas_asignadas_tecnico', 'nombre');

  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  res.status(200).json(user);
});

/**
 * @name updateUser
 * @description Actualiza un usuario existente.
 */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, empresa, corporativo } = req.body;

  // VALIDACIÓN: Admin no puede cambiar su propio rol
  if (req.user._id.toString() === id && role && role !== req.user.role) {
    res.status(403);
    throw new Error('No puedes cambiar tu propio rol');
  }

  // Verificar si usuario existe
  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  // Actualizar campos
  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;

  // Campos condicionales según rol
  if (role === 'cliente_owner' && empresa) {
    user.empresa = empresa;
  }
  if (role === 'cliente_corporate' && corporativo) {
    user.corporativo = corporativo;
  }

  const updatedUser = await user.save();

  res.status(200).json({
    message: 'Usuario actualizado exitosamente',
    user: updatedUser
  });
});

/**
 * @name changeUserPassword
 * @description Cambia la contraseña de un usuario.
 */
export const changeUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  // El modelo ya tiene el hook pre-save que hashea la password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: 'Contraseña actualizada exitosamente'
  });
});

/**
 * @name checkUserDependencies
 * @description Verifica si un usuario tiene dependencias (leads, empresas, fincas).
 */
const checkUserDependencies = async (userId) => {
  // Importamos dinámicamente para evitar dependencias circulares
  const Lead = (await import('../models/lead.model.js')).default;
  const Empresa = (await import('../models/empresa.model.js')).default;

  const dependencies = {
    leads: 0,
    empresas: 0,
    fincas: 0
  };

  // Verificar leads asignados
  dependencies.leads = await Lead.countDocuments({ owner: userId });

  // Verificar empresas donde es account_manager
  dependencies.empresas = await Empresa.countDocuments({ account_manager: userId });

  // Verificar fincas asignadas como técnico (en el array fincas_asignadas_tecnico)
  const user = await User.findById(userId);
  if (user && user.fincas_asignadas_tecnico) {
    dependencies.fincas = user.fincas_asignadas_tecnico.length;
  }

  return dependencies;
};

/**
 * @name getUserDependencies
 * @description Endpoint que retorna las dependencias de un usuario.
 */
export const getUserDependencies = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const dependencies = await checkUserDependencies(id);

  const hasDependencies =
    dependencies.leads > 0 ||
    dependencies.empresas > 0 ||
    dependencies.fincas > 0;

  res.status(200).json({
    canDelete: !hasDependencies,
    dependencies
  });
});

/**
 * @name deleteUser
 * @description Elimina un usuario si no tiene dependencias.
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // No permitir auto-eliminación
  if (req.user._id.toString() === id) {
    res.status(403);
    throw new Error('No puedes eliminar tu propia cuenta');
  }

  // Verificar dependencias
  const dependencies = await checkUserDependencies(id);
  const hasDependencies =
    dependencies.leads > 0 ||
    dependencies.empresas > 0 ||
    dependencies.fincas > 0;

  if (hasDependencies) {
    res.status(400);
    const errorMsg = `No se puede eliminar. El usuario tiene: ${dependencies.leads} lead(s), ${dependencies.empresas} empresa(s), ${dependencies.fincas} finca(s) asignada(s). Reasigna primero.`;
    throw new Error(errorMsg);
  }

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  res.status(200).json({
    message: 'Usuario eliminado exitosamente',
    userId: id
  });
});