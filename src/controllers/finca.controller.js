//src/controllers/finca.controller.js
import Finca from '../models/finca.model.js';
import Empresa from '../models/empresa.model.js';
import Corporativo from '../models/corporativo.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name createFinca
 * @description Crea una nueva finca y la asocia a una Empresa.
 */
export const createFinca = asyncHandler(async (req, res) => {
  const { empresaId } = req.params;
  const { nombre, area, municipio, departamento, cultivo_principal, tipo_produccion, vereda, coordenadas_gps } = req.body;

  if (!nombre || !area) {
    res.status(400);
    throw new Error('Nombre y área son obligatorios');
  }

  const newFinca = new Finca({
    empresa_owner: empresaId,
    nombre,
    area,
    municipio,
    departamento,
    cultivo_principal,
    tipo_produccion,
    vereda,
    coordenadas_gps
  });
  const savedFinca = await newFinca.save();

  await Empresa.findByIdAndUpdate(empresaId, { $push: { fincas: savedFinca._id } });

  res.status(201).json({ message: 'Finca creada exitosamente', finca: savedFinca });
});

/**
 * @name getFincas
 * @description Lista fincas con lógica de permisos por rol
 */
export const getFincas = asyncHandler(async (req, res) => {
  let query = {};

  // Lógica de permisos
  if (req.user.role === 'cliente_owner') {
    // Solo fincas de su empresa
    query.empresa_owner = req.user.empresa;
  } else if (req.user.role === 'cliente_empleado') {
    // Solo fincas asignadas
    query._id = { $in: req.user.fincas_acceso };
  } else if (req.user.role === 'corporativo_usuario' && req.user.corporativo) {
    // Fincas del corporativo
    const corp = await Corporativo.findById(req.user.corporativo);
    if (corp && corp.fincas_asociadas) {
      query._id = { $in: corp.fincas_asociadas };
    }
  }
  // sabio_admin y sabio_vendedor ven todas las fincas (query vacío)

  const fincas = await Finca.find(query)
    .populate('empresa_owner', 'nombre_comercial NIT')
    .populate('corporativos_asociados', 'nombre tipo')
    .sort({ createdAt: -1 });

  res.status(200).json(fincas);
});

/**
 * @name getFincaById
 * @description Obtiene una finca por ID
 */
export const getFincaById = asyncHandler(async (req, res) => {
  const finca = await Finca.findById(req.params.id)
    .populate('empresa_owner')
    .populate('corporativos_asociados');

  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  res.status(200).json(finca);
});

/**
 * @name updateFinca
 * @description Actualiza una finca
 */
export const updateFinca = asyncHandler(async (req, res) => {
  const finca = await Finca.findById(req.params.id);

  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const camposPermitidos = [
    'nombre',
    'area',
    'municipio',
    'departamento',
    'tipo_produccion',
    'cultivo_principal',
    'vereda',
    'coordenadas_gps'
  ];

  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      finca[campo] = req.body[campo];
    }
  });

  const fincaActualizada = await finca.save();

  res.status(200).json({
    message: 'Finca actualizada exitosamente',
    finca: fincaActualizada
  });
});

/**
 * @name deleteFinca
 * @description Elimina una finca
 */
export const deleteFinca = asyncHandler(async (req, res) => {
  const finca = await Finca.findByIdAndDelete(req.params.id);

  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  // Remover de la empresa
  await Empresa.findByIdAndUpdate(finca.empresa_owner, {
    $pull: { fincas: finca._id }
  });

  res.status(200).json({
    message: 'Finca eliminada exitosamente',
    fincaId: req.params.id
  });
});

/**
 * @name asociarCorporativo
 * @description Asocia un corporativo a una finca
 */
export const asociarCorporativo = asyncHandler(async (req, res) => {
  const { fincaId, corporativoId } = req.params;

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const corporativo = await Corporativo.findById(corporativoId);
  if (!corporativo) {
    res.status(404);
    throw new Error('Corporativo no encontrado');
  }

  // Agregar a ambos lados de la relación
  if (!finca.corporativos_asociados.includes(corporativoId)) {
    finca.corporativos_asociados.push(corporativoId);
    await finca.save();
  }

  if (!corporativo.fincas_asociadas.includes(fincaId)) {
    corporativo.fincas_asociadas.push(fincaId);
    await corporativo.save();
  }

  res.status(200).json({
    message: 'Corporativo asociado exitosamente',
    finca: await Finca.findById(fincaId).populate('corporativos_asociados')
  });
});


/**
 * @name addDivisionPrimaria
 * @description (Antes addZonaToFinca) Añade una división primaria (Zona, Potrero, etc.)
 */
export const addDivisionPrimaria = asyncHandler(async (req, res) => {
  const { fincaId } = req.params;
  const { nombre, imagen } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error('El nombre es obligatorio');
  }

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const nuevaDivision = {
    nombre,
    imagen: imagen || null
  };

  finca.divisiones_primarias.push(nuevaDivision);
  await finca.save();

  const divisionCreada = finca.divisiones_primarias[finca.divisiones_primarias.length - 1];
  res.status(201).json({ message: 'División Primaria añadida exitosamente', division: divisionCreada });
});


/**
 * @name addDivisionSecundaria
 * @description (Antes addLoteToZona) Añade una división secundaria (Lote, Franja, etc.)
 */
export const addDivisionSecundaria = asyncHandler(async (req, res) => {
  const { fincaId, divisionPrimariaId } = req.params;
  const { nombre } = req.body;

  if (!nombre) {
    res.status(400);
    throw new Error('El nombre es obligatorio');
  }

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const divisionPrimaria = finca.divisiones_primarias.id(divisionPrimariaId);
  if (!divisionPrimaria) {
    res.status(404);
    throw new Error('División Primaria no encontrada en esta finca');
  }

  const nuevaDivision = {
    nombre,
  };

  divisionPrimaria.divisiones_secundarias.push(nuevaDivision);
  await finca.save();

  const divisionCreada = divisionPrimaria.divisiones_secundarias[divisionPrimaria.divisiones_secundarias.length - 1];
  res.status(201).json({ message: 'División Secundaria añadida exitosamente', division: divisionCreada });
});