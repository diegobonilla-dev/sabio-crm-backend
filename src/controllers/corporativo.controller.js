import Corporativo from '../models/corporativo.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// CREATE - Crear un corporativo
export const createCorporativo = asyncHandler(async (req, res) => {
  const { nombre, descripcion, tipo } = req.body;

  // Validar campos obligatorios
  if (!nombre) {
    res.status(400);
    throw new Error('El nombre es obligatorio');
  }

  // Verificar si ya existe un corporativo con ese nombre
  const corporativoExistente = await Corporativo.findOne({ nombre });
  if (corporativoExistente) {
    res.status(400);
    throw new Error('Ya existe un corporativo con ese nombre');
  }

  // Crear el corporativo
  const nuevoCorporativo = new Corporativo({
    nombre,
    descripcion,
    tipo
  });

  const corporativoGuardado = await nuevoCorporativo.save();

  res.status(201).json({
    message: 'Corporativo creado exitosamente',
    corporativo: corporativoGuardado
  });
});

// READ ALL - Obtener todos los corporativos
export const getCorporativos = asyncHandler(async (req, res) => {
  const corporativos = await Corporativo.find()
    .populate('fincas_asociadas', 'nombre tipo_produccion')
    .sort({ createdAt: -1 });

  res.status(200).json(corporativos);
});

// READ ONE - Obtener un corporativo por ID
export const getCorporativoById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const corporativo = await Corporativo.findById(id)
    .populate('fincas_asociadas', 'nombre tipo_produccion municipio departamento');

  if (!corporativo) {
    res.status(404);
    throw new Error('Corporativo no encontrado');
  }

  res.status(200).json(corporativo);
});

// UPDATE - Actualizar un corporativo
export const updateCorporativo = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, tipo } = req.body;

  const corporativo = await Corporativo.findById(id);

  if (!corporativo) {
    res.status(404);
    throw new Error('Corporativo no encontrado');
  }

  // Verificar si el nuevo nombre ya existe (si se está cambiando)
  if (nombre && nombre !== corporativo.nombre) {
    const nombreExistente = await Corporativo.findOne({ nombre });
    if (nombreExistente) {
      res.status(400);
      throw new Error('Ya existe un corporativo con ese nombre');
    }
  }

  // Actualizar campos
  if (nombre) corporativo.nombre = nombre;
  if (descripcion !== undefined) corporativo.descripcion = descripcion;
  if (tipo !== undefined) corporativo.tipo = tipo;

  const corporativoActualizado = await corporativo.save();

  res.status(200).json({
    message: 'Corporativo actualizado exitosamente',
    corporativo: corporativoActualizado
  });
});

// DELETE - Eliminar un corporativo
export const deleteCorporativo = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const corporativo = await Corporativo.findById(id);

  if (!corporativo) {
    res.status(404);
    throw new Error('Corporativo no encontrado');
  }

  // Verificar si tiene fincas asociadas
  if (corporativo.fincas_asociadas && corporativo.fincas_asociadas.length > 0) {
    res.status(400);
    throw new Error(`No se puede eliminar. El corporativo tiene ${corporativo.fincas_asociadas.length} finca(s) asociada(s)`);
  }

  await Corporativo.findByIdAndDelete(id);

  res.status(200).json({
    message: 'Corporativo eliminado exitosamente',
    corporativoId: id
  });
});
