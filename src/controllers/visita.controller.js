import VisitaTecnica from '../models/VisitaTecnica.model.js';
import Finca from '../models/finca.model.js';

export const createVisita = async (req, res) => {
  try {
    const { fincaId, motivo_visita, datos_ganaderia, datos_agricultura, recomendaciones_generales, tareas_asignadas } = req.body;

    // 1. Validar básicos
    if (!fincaId || !motivo_visita || !recomendaciones_generales) {
      return res.status(400).json({ message: 'Finca, motivo y recomendaciones son obligatorios' });
    }

    // 2. Buscar la Finca para saber su TIPO
    const finca = await Finca.findById(fincaId);
    if (!finca) {
      return res.status(404).json({ message: 'Finca no encontrada' });
    }

    // 3. Validación Cruzada (Cross-Validation)
    // Si la finca es de Ganadería, advertimos si faltan datos de ganadería
    if (finca.tipo_produccion === 'Ganaderia' && !datos_ganaderia) {
      return res.status(400).json({ message: 'Para fincas ganaderas, se requieren datos_ganaderia' });
    }
    if (finca.tipo_produccion === 'Cultivo' && !datos_agricultura) {
      return res.status(400).json({ message: 'Para cultivos, se requieren datos_agricultura' });
    }

    // 4. Crear la Visita
    const nuevaVisita = new VisitaTecnica({
      finca: fincaId,
      tecnico: req.user._id, // El técnico logueado
      motivo_visita,
      datos_ganaderia: (finca.tipo_produccion === 'Ganaderia' || finca.tipo_produccion === 'Mixto') ? datos_ganaderia : undefined,
      datos_agricultura: (finca.tipo_produccion === 'Cultivo' || finca.tipo_produccion === 'Mixto') ? datos_agricultura : undefined,
      recomendaciones_generales,
      tareas_asignadas
    });

    const visitaGuardada = await nuevaVisita.save();
    res.status(201).json({ message: 'Visita técnica registrada exitosamente', visita: visitaGuardada });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};