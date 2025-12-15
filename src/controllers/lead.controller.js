//src/controllers/lead.controller.js
import Lead from '../models/lead.model.js';
import User from '../models/user.model.js';
import Empresa from '../models/empresa.model.js';
import asyncHandler from '../utils/asyncHandler.js'; 

/**
 * @name createLead
 * @description Crea un nuevo prospecto (Lead) y lo asigna al vendedor logueado.
 */
export const createLead = asyncHandler(async (req, res) => {
  const { empresa_nombre, contacto_nombre, email, telefono, origen } = req.body;
  const ownerId = req.user._id;

  if (!empresa_nombre || !contacto_nombre) {
    res.status(400);
    throw new Error('Nombre de empresa y contacto son obligatorios');
  }

  const newLead = new Lead({
    owner: ownerId,
    empresa_nombre,
    contacto_nombre,
    email,
    telefono,
    origen
  });

  const savedLead = await newLead.save();

  await User.findByIdAndUpdate(ownerId, { $push: { leads_asignados: savedLead._id } });

  res.status(201).json({ message: 'Lead creado exitosamente', lead: savedLead });
});

/**
 * @name getLeads
 * @description Obtiene los leads. Si es Admin ve todos, si es Vendedor ve solo los suyos.
 */
export const getLeads = asyncHandler(async (req, res) => {
  let query = {};

  if (req.user.role === 'sabio_vendedor') {
    query = { owner: req.user._id };
  }

  const leads = await Lead.find(query)
    .populate('owner', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json(leads);
});

/**
 * @name getLeadById
 * @description Obtiene un lead específico por ID
 */
export const getLeadById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id)
    .populate('owner', 'name email')
    .populate('empresa_convertida', 'nombre_comercial NIT');

  if (!lead) {
    res.status(404);
    throw new Error('Lead no encontrado');
  }

  res.status(200).json(lead);
});

/**
 * @name updateLead
 * @description Actualiza un lead
 */
export const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    empresa_nombre,
    contacto_nombre,
    email,
    telefono,
    etapa_funnel,
    origen,
    motivo_perdida,
    notas
  } = req.body;

  const lead = await Lead.findById(id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead no encontrado');
  }

  // Actualizar campos
  if (empresa_nombre) lead.empresa_nombre = empresa_nombre;
  if (contacto_nombre) lead.contacto_nombre = contacto_nombre;
  if (email) lead.email = email;
  if (telefono) lead.telefono = telefono;
  if (etapa_funnel) lead.etapa_funnel = etapa_funnel;
  if (origen) lead.origen = origen;
  if (motivo_perdida !== undefined) lead.motivo_perdida = motivo_perdida;
  if (notas !== undefined) lead.notas = notas;

  const leadActualizado = await lead.save();

  res.status(200).json({
    message: 'Lead actualizado exitosamente',
    lead: leadActualizado
  });
});

/**
 * @name deleteLead
 * @description Elimina un lead
 */
export const deleteLead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const lead = await Lead.findById(id);

  if (!lead) {
    res.status(404);
    throw new Error('Lead no encontrado');
  }

  // Verificar si el lead ya fue convertido
  if (lead.empresa_convertida) {
    res.status(400);
    throw new Error('No se puede eliminar un lead que ya fue convertido a empresa');
  }

  await Lead.findByIdAndDelete(id);

  // Remover referencia del usuario
  await User.findByIdAndUpdate(lead.owner, {
    $pull: { leads_asignados: id }
  });

  res.status(200).json({
    message: 'Lead eliminado exitosamente',
    leadId: id
  });
});

/**
 * @name convertLeadToEmpresa
 * @description Convierte un Lead en una Empresa y un Usuario (cliente_owner).
 */
export const convertLeadToEmpresa = asyncHandler(async (req, res) => {
  const { leadId } = req.params;
  const { password, nit, razon_social } = req.body;

  // Validaciones
  if (!password) {
    res.status(400);
    throw new Error('La contraseña para el nuevo usuario es obligatoria');
  }

  if (!nit) {
    res.status(400);
    throw new Error('El NIT es obligatorio');
  }

  const lead = await Lead.findById(leadId);
  if (!lead) {
    res.status(404);
    throw new Error('Lead no encontrado');
  }
  if (lead.empresa_convertida) {
    res.status(400);
    throw new Error('Este Lead ya fue convertido');
  }

  // Crear Empresa con los nuevos campos
  const nuevaEmpresa = new Empresa({
    account_manager: req.user._id,
    lead_origen: lead._id,
    nombre_comercial: lead.empresa_nombre,
    razon_social: razon_social || lead.empresa_nombre, // Usa empresa_nombre por defecto
    NIT: nit,
    contacto_principal: {
      nombre: lead.contacto_nombre,
      email: lead.email,
      telefono: lead.telefono,
      cargo: 'Propietario'
    }
  });
  const empresaGuardada = await nuevaEmpresa.save();

  // Crear Usuario cliente_owner con teléfono
  const nuevoUsuarioCliente = new User({
    name: lead.contacto_nombre,
    email: lead.email,
    telefono: lead.telefono,
    password: password,
    role: 'cliente_owner',
    empresa: empresaGuardada._id
  });
  await nuevoUsuarioCliente.save();

  // Actualizar Lead
  lead.etapa_funnel = 'Ganado';
  lead.empresa_convertida = empresaGuardada._id;
  await lead.save();

  res.status(201).json({
    message: 'Lead convertido exitosamente',
    empresa: empresaGuardada
  });
});