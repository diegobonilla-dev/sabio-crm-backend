import Muestra from '../models/muestra.model.js';
import Finca from '../models/finca.model.js';

/**
 * @name createMuestra
 * @description Registra una nueva muestra de laboratorio.
 */
export const createMuestra = async (req, res) => {
  try {
    const { fincaId, pila_compost, nombre_muestra, tipo_muestra, fecha_toma } = req.body;

    // 1. Validar
    if (!fincaId || !nombre_muestra || !tipo_muestra) {
      return res.status(400).json({ message: 'fincaId, nombre_muestra y tipo_muestra son obligatorios' });
    }

    // 2. Verificar que la Finca exista
    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'Finca no encontrada' });
    }
    
    // (Añadiríamos validaciones para pila_compost, zona, etc. si fueran necesarias)

    // 3. Crear la nueva Muestra
    const newMuestra = new Muestra({
      finca: fincaId,
      pila_compost: pila_compost || null,
      nombre_muestra,
      tipo_muestra,
      fecha_toma: fecha_toma || new Date(),
      registrada_por: req.user._id // Usuario de laboratorio que la registra
      // Los resultados se crean vacíos por defecto
    });

    const savedMuestra = await newMuestra.save();
    res.status(201).json({ message: 'Muestra registrada exitosamente', muestra: savedMuestra });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};


/**
 * @name addResultadosToMuestra
 * @description Añade/actualiza los resultados de análisis a una Muestra existente.
 */
export const addResultadosToMuestra = async (req, res) => {
  try {
    const { muestraId } = req.params;
    
    // Obtenemos los bloques de resultados del body.
    // El frontend puede enviar uno, varios, o todos.
    const { resultados_quimicos, conteo_bacterias, conteo_hongos } = req.body;

    // 1. Buscar la muestra
    const muestra = await Muestra.findById(muestraId);
    if (!muestra) {
      return res.status(404).json({ message: 'Muestra no encontrada' });
    }

    // 2. (Verificación de Permisos - TODO)

    // 3. Actualizar los campos que vengan en el body
    if (resultados_quimicos) {
      muestra.resultados_quimicos = resultados_quimicos;
    }
    if (conteo_bacterias) {
      muestra.conteo_bacterias = conteo_bacterias;
    }
    if (conteo_hongos) {
      muestra.conteo_hongos = conteo_hongos;
    }

    // Cambiamos el estado de la muestra
    muestra.estado = 'En Proceso'; 

    // 4. Guardar la Muestra actualizada
    const savedMuestra = await muestra.save();

    res.status(200).json({ message: 'Resultados añadidos exitosamente', muestra: savedMuestra });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};