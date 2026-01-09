import Diagnostico from '../models/diagnostico.model.js';
import Finca from '../models/finca.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// CREATE
export const createDiagnostico = asyncHandler(async (req, res) => {
  const {
    finca,
    tipo_diagnostico,
    fecha_visita,
    hora_inicio,
    estado,
    informacion_general,
    datos_ganaderia,
    datos_flores,
    datos_frutales,
    datos_cafe,
    datos_aguacate,
    indicadores_p4g,
    sostenibilidad,
    biofabrica,
    observaciones_seguimiento,
    validacion_cierre
  } = req.body;

  // Validar campos obligatorios
  if (!finca || !tipo_diagnostico || !fecha_visita || !hora_inicio) {
    res.status(400);
    throw new Error('Faltan campos obligatorios');
  }

  // Verificar que la finca existe
  const fincaExists = await Finca.findById(finca);
  if (!fincaExists) {
    res.status(404);
    throw new Error('Finca no encontrada');
  }

  // LOG TEMPORAL PARA DEBUGGING - REMOVER EN PRODUCCIÓN
  console.log('🔍 Campos recibidos en req.body:', {
    finca: !!finca,
    tipo_diagnostico: !!tipo_diagnostico,
    estado: !!estado,
    indicadores_p4g: !!indicadores_p4g,
    sostenibilidad: !!sostenibilidad,
    biofabrica: !!biofabrica,
    observaciones_seguimiento: !!observaciones_seguimiento,
    validacion_cierre: !!validacion_cierre
  });

  // Crear diagnóstico
  const nuevoDiagnostico = new Diagnostico({
    finca,
    tecnico_responsable: req.user._id,
    tipo_diagnostico,
    fecha_visita,
    hora_inicio,
    estado,
    informacion_general,
    datos_ganaderia,
    datos_flores,
    datos_frutales,
    datos_cafe,
    datos_aguacate,
    indicadores_p4g,
    sostenibilidad,
    biofabrica,
    observaciones_seguimiento,
    validacion_cierre
  });

  const diagnosticoGuardado = await nuevoDiagnostico.save();

  // LOG TEMPORAL PARA DEBUGGING - REMOVER EN PRODUCCIÓN
  console.log('💾 Diagnóstico guardado en DB:', {
    _id: diagnosticoGuardado._id,
    estado: diagnosticoGuardado.estado,
    tiene_indicadores_p4g: !!diagnosticoGuardado.indicadores_p4g,
    tiene_sostenibilidad: !!diagnosticoGuardado.sostenibilidad,
    tiene_biofabrica: !!diagnosticoGuardado.biofabrica,
    tiene_observaciones: !!diagnosticoGuardado.observaciones_seguimiento,
    tiene_validacion: !!diagnosticoGuardado.validacion_cierre
  });

  res.status(201).json({
    message: 'Diagnóstico creado exitosamente',
    diagnostico: diagnosticoGuardado
  });
});

// READ ALL (con filtros por role)
export const getDiagnosticos = asyncHandler(async (req, res) => {
  let query = {};

  // Filtrar según rol del usuario
  if (req.user.role === 'sabio_tecnico') {
    query.tecnico_responsable = req.user._id;
  } else if (req.user.role === 'cliente_owner') {
    // Obtener fincas de su empresa
    const fincas = await Finca.find({ empresa_owner: req.user.empresa }).select('_id');
    const fincaIds = fincas.map(f => f._id);
    query.finca = { $in: fincaIds };
  } else if (req.user.role === 'cliente_empleado') {
    // Solo fincas asignadas
    query.finca = { $in: req.user.fincas_acceso };
  } else if (req.user.role === 'corporativo_usuario' && req.user.corporativo) {
    // Fincas del corporativo
    const Corporativo = (await import('../models/corporativo.model.js')).default;
    const corp = await Corporativo.findById(req.user.corporativo);
    query.finca = { $in: corp.fincas_asociadas };
  }
  // sabio_admin y sabio_vendedor ven todos

  const diagnosticos = await Diagnostico.find(query)
    .populate('finca', 'nombre tipo_produccion')
    .populate('tecnico_responsable', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(diagnosticos);
});

// READ ONE
export const getDiagnosticoById = asyncHandler(async (req, res) => {
  const diagnostico = await Diagnostico.findById(req.params.id)
    .populate('finca')
    .populate('tecnico_responsable', 'name email telefono');

  if (!diagnostico) {
    res.status(404);
    throw new Error('Diagnóstico no encontrado');
  }

  res.status(200).json(diagnostico);
});

// UPDATE
export const updateDiagnostico = asyncHandler(async (req, res) => {
  const diagnostico = await Diagnostico.findById(req.params.id);

  if (!diagnostico) {
    res.status(404);
    throw new Error('Diagnóstico no encontrado');
  }

  // Actualizar campos permitidos
  const camposPermitidos = [
    'fecha_visita',
    'hora_inicio',
    'estado',
    'informacion_general',
    'datos_ganaderia',
    'datos_flores',
    'datos_frutales',
    'datos_cafe',
    'datos_aguacate',
    'indicadores_p4g',
    'sostenibilidad',
    'biofabrica',
    'observaciones_seguimiento',
    'validacion_cierre'
  ];

  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      diagnostico[campo] = req.body[campo];
    }
  });

  const diagnosticoActualizado = await diagnostico.save();

  res.status(200).json({
    message: 'Diagnóstico actualizado exitosamente',
    diagnostico: diagnosticoActualizado
  });
});

// DELETE
export const deleteDiagnostico = asyncHandler(async (req, res) => {
  const diagnostico = await Diagnostico.findByIdAndDelete(req.params.id);

  if (!diagnostico) {
    res.status(404);
    throw new Error('Diagnóstico no encontrado');
  }

  res.status(200).json({
    message: 'Diagnóstico eliminado exitosamente',
    diagnosticoId: req.params.id
  });
});
