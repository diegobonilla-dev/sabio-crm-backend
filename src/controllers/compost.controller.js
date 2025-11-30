//src/controllers/compost.controller.js
import PlantillaCompost from '../models/plantillaCompost.model.js';
import PilaCompost from '../models/pilaCompost.model.js';
import Finca from '../models/finca.model.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @name createPlantilla
 * @description Crea una nueva plantilla de compost (receta maestra).
 */
export const createPlantilla = asyncHandler(async (req, res) => {
  const { nombre, descripcion, pct_material_verde, pct_material_cafe, pct_material_nitrogeno, notas_preparacion } = req.body;
  
  if (!nombre) {
    res.status(400);
    throw new Error('El nombre de la plantilla es obligatorio');
  }

  const newPlantilla = new PlantillaCompost({
    nombre,
    descripcion,
    creada_por: req.user._id,
    pct_material_verde,
    pct_material_cafe,
    pct_material_nitrogeno,
    notas_preparacion
  });

  const savedPlantilla = await newPlantilla.save();
  res.status(201).json({ message: 'Plantilla creada exitosamente', plantilla: savedPlantilla });
});

/**
 * @name createPila
 * @description Crea una nueva Pila (instancia) en una Finca, opcionalmente basada en una Plantilla.
 */
export const createPila = asyncHandler(async (req, res) => {
  const { fincaId, plantilla_usada, nombre, variaciones_plantilla } = req.body;

  if (!fincaId || !nombre) {
    res.status(400);
    throw new Error('El fincaId y el nombre de la pila son obligatorios');
  }

  const finca = await Finca.findById(fincaId);
  if (!finca) {
    res.status(404);
    throw new Error('La Finca especificada no existe');
  }
  
  if (plantilla_usada) {
    const plantilla = await PlantillaCompost.findById(plantilla_usada);
    if (!plantilla) {
      res.status(404);
      throw new Error('La Plantilla especificada no existe');
    }
  }

  const newPila = new PilaCompost({
    finca: fincaId,
    plantilla_usada: plantilla_usada || null,
    creada_por: req.user._id,
    nombre,
    variaciones_plantilla
  });

  const savedPila = await newPila.save();
  res.status(201).json({ message: 'Pila de compost creada exitosamente', pila: savedPila });
});

/**
 * @name addSeguimientoToPila
 * @description Añade un nuevo registro de seguimiento a una Pila de Compost existente.
 */
export const addSeguimientoToPila = asyncHandler(async (req, res) => {
  const { pilaId } = req.params;
  const { volteo, temp_prom, hum_prom, observaciones } = req.body;

  const pila = await PilaCompost.findById(pilaId);
  if (!pila) {
    res.status(404);
    throw new Error('Pila de compost no encontrada');
  }

  const nuevoSeguimiento = {
    creado_por: req.user._id,
    volteo: volteo || false,
    temp_prom,
    hum_prom,
    observaciones
  };

  pila.seguimiento.push(nuevoSeguimiento);
  await pila.save();

  const seguimientoCreado = pila.seguimiento[pila.seguimiento.length - 1];
  res.status(201).json({ message: 'Seguimiento añadido exitosamente', seguimiento: seguimientoCreado });
});