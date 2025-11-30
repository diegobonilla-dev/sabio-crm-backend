//src/controllers/laboratorio.controller.js
import Muestra from '../models/muestra.model.js';
import Finca from '../models/finca.model.js';
import asyncHandler from '../utils/asyncHandler.js'; // <-- Importado

/**
 * @name createMuestra
 * @description Registra una nueva muestra de laboratorio.
 */
export const createMuestra = asyncHandler(async (req, res) => {
  const { fincaId, pila_compost, nombre_muestra, tipo_muestra, fecha_toma } = req.body;

  if (!fincaId || !nombre_muestra || !tipo_muestra) {
    res.status(400);
    throw new Error('fincaId, nombre_muestra y tipo_muestra son obligatorios');
  }

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  const newMuestra = new Muestra({
    finca: fincaId,
    pila_compost: pila_compost || null,
    nombre_muestra,
    tipo_muestra,
    fecha_toma: fecha_toma || new Date(),
    registrada_por: req.user._id
  });

  const savedMuestra = await newMuestra.save();
  res.status(201).json({ message: 'Muestra registrada exitosamente', muestra: savedMuestra });
});


/**
 * @name addResultadosToMuestra
 * @description Añade/actualiza los resultados de análisis a una Muestra existente.
 */
export const addResultadosToMuestra = asyncHandler(async (req, res) => {
  const { muestraId } = req.params;
  const { resultados_quimicos, conteo_bacterias, conteo_hongos } = req.body;

  const muestra = await Muestra.findById(muestraId);
  if (!muestra) {
    res.status(404);
    throw new Error('Muestra no encontrada');
  }

  if (resultados_quimicos) {
    muestra.resultados_quimicos = resultados_quimicos;
  }
  if (conteo_bacterias) {
    muestra.conteo_bacterias = conteo_bacterias;
  }
  if (conteo_hongos) {
    muestra.conteo_hongos = conteo_hongos;
  }

  muestra.estado = 'En Proceso'; 

  const savedMuestra = await muestra.save();

  res.status(200).json({ message: 'Resultados añadidos exitosamente', muestra: savedMuestra });
});