import PlantillaCompost from '../models/plantillaCompost.model.js';
import PilaCompost from '../models/pilaCompost.model.js';
import Finca from '../models/finca.model.js';

/**
 * @name createPlantilla
 * @description Crea una nueva plantilla de compost (receta maestra).
 */
export const createPlantilla = async (req, res) => {
  try {
    const { nombre, descripcion, pct_material_verde, pct_material_cafe, pct_material_nitrogeno, notas_preparacion } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ message: 'El nombre de la plantilla es obligatorio' });
    }

    const newPlantilla = new PlantillaCompost({
      nombre,
      descripcion,
      creada_por: req.user._id, // Usuario 'sabio' que la crea
      pct_material_verde,
      pct_material_cafe,
      pct_material_nitrogeno,
      notas_preparacion
    });

    const savedPlantilla = await newPlantilla.save();
    res.status(201).json({ message: 'Plantilla creada exitosamente', plantilla: savedPlantilla });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * @name createPila
 * @description Crea una nueva Pila (instancia) en una Finca, opcionalmente basada en una Plantilla.
 */
export const createPila = async (req, res) => {
  try {
    const { fincaId, plantilla_usada, nombre, variaciones_plantilla } = req.body;

    // 1. Validar
    if (!fincaId || !nombre) {
      return res.status(400).json({ message: 'El fincaId y el nombre de la pila son obligatorios' });
    }

    // 2. Verificar que la finca exista
    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'La Finca especificada no existe' });
    }
    
    // 3. (Opcional) Verificar que la plantilla exista, si se proveyó
    if (plantilla_usada) {
      const plantilla = await PlantillaCompost.findById(plantilla_usada);
      if (!plantilla) {
        return res.status(404).json({ message: 'La Plantilla especificada no existe' });
      }
    }

    // 4. Crear la Pila
    const newPila = new PilaCompost({
      finca: fincaId,
      plantilla_usada: plantilla_usada || null,
      creada_por: req.user._id, // El usuario que la está creando
      nombre,
      variaciones_plantilla
      // El 'seguimiento' se crea vacío por defecto
    });

    const savedPila = await newPila.save();
    res.status(201).json({ message: 'Pila de compost creada exitosamente', pila: savedPila });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


/**
 * @name addSeguimientoToPila
 * @description Añade un nuevo registro de seguimiento a una Pila de Compost existente.
 */
export const addSeguimientoToPila = async (req, res) => {
  try {
    const { pilaId } = req.params;
    const { volteo, temp_prom, hum_prom, observaciones } = req.body;

    // 1. Buscar la pila
    const pila = await PilaCompost.findById(pilaId);
    if (!pila) {
      return res.status(404).json({ message: 'Pila de compost no encontrada' });
    }

    // 2. (Verificación de Permisos - TODO)
    // Más adelante verificaremos que req.user tenga permiso sobre esta pila

    // 3. Crear el nuevo sub-documento de seguimiento
    const nuevoSeguimiento = {
      creado_por: req.user._id,
      volteo: volteo || false,
      temp_prom,
      hum_prom,
      observaciones
      // 'fecha' se añade por defecto (gracias al schema)
    };

    // 4. Usar $push para añadir el seguimiento al array 'seguimiento' de la Pila
    pila.seguimiento.push(nuevoSeguimiento);

    // 5. Guardar la Pila actualizada (el documento raíz)
    await pila.save();

    // 6. Devolver solo el registro de seguimiento recién creado
    const seguimientoCreado = pila.seguimiento[pila.seguimiento.length - 1];
    res.status(201).json({ message: 'Seguimiento añadido exitosamente', seguimiento: seguimientoCreado });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};