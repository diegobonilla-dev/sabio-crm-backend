import Ubicacion from '../models/ubicacion.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name getDepartamentos
 * @description Retorna lista de todos los departamentos de Colombia con sus códigos
 */
export const getDepartamentos = asyncHandler(async (req, res) => {
  const ubicaciones = await Ubicacion.find({})
    .select('departamento codigo')
    .sort({ departamento: 1 });

  res.status(200).json(ubicaciones);
});

/**
 * @name getMunicipiosByDepartamento
 * @description Retorna todos los municipios de un departamento específico
 */
export const getMunicipiosByDepartamento = asyncHandler(async (req, res) => {
  const { departamento } = req.params;

  const ubicacion = await Ubicacion.findOne({
    departamento: departamento.toUpperCase()
  });

  if (!ubicacion) {
    res.status(404);
    throw new Error('Departamento no encontrado');
  }

  res.status(200).json({
    departamento: ubicacion.departamento,
    codigo: ubicacion.codigo,
    municipios: ubicacion.municipios
  });
});
