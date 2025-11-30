//src/controllers/finca.controller.js
import Finca from '../models/finca.model.js';
import Empresa from '../models/empresa.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name createFinca
 * @description Crea una nueva finca y la asocia a una Empresa.
 */
export const createFinca = asyncHandler(async (req, res) => {
  const { empresaId } = req.params; 
  const { nombre, area, municipio, departamento, cultivo_principal, tipo_produccion } = req.body;

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
    tipo_produccion
  });
  const savedFinca = await newFinca.save();

  await Empresa.findByIdAndUpdate(empresaId, { $push: { fincas: savedFinca._id } });

  res.status(201).json({ message: 'Finca creada exitosamente', finca: savedFinca });
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