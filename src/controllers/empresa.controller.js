import Empresa from '../models/empresa.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name getEmpresas
 * @description Lista todas las empresas
 */
export const getEmpresas = asyncHandler(async (req, res) => {
  const empresas = await Empresa.find()
    .select('nombre_comercial razon_social NIT')
    .sort({ createdAt: -1 });

  res.status(200).json(empresas);
});

/**
 * @name getEmpresaById
 * @description Obtiene una empresa por ID
 */
export const getEmpresaById = asyncHandler(async (req, res) => {
  const empresa = await Empresa.findById(req.params.id);

  if (!empresa) {
    res.status(404);
    throw new Error('Empresa no encontrada');
  }

  res.status(200).json(empresa);
});
