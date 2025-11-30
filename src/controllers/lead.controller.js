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
    .populate('actividades');

  res.status(200).json(leads);
});

/**
 * @name convertLeadToEmpresa
 * @description Convierte un Lead en una Empresa y un Usuario (cliente_owner).
 */
export const convertLeadToEmpresa = asyncHandler(async (req, res) => {
  const { leadId } = req.params;
  const { password, nit } = req.body;

  if (!password) {
    res.status(400);
    throw new Error('La contraseña para el nuevo usuario es obligatoria');
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

  const nuevaEmpresa = new Empresa({
    account_manager: req.user._id,
    lead_origen: lead._id,
    nombre: lead.empresa_nombre,
    NIT: nit,
    contacto_contabilidad: {
      nombre: lead.contacto_nombre,
      email: lead.email,
      telefono: lead.telefono
    }
  });
  const empresaGuardada = await nuevaEmpresa.save();

  const nuevoUsuarioCliente = new User({
    name: lead.contacto_nombre,
    email: lead.email,
    password: password,
    role: 'cliente_owner',
    empresa: empresaGuardada._id
  });
  await nuevoUsuarioCliente.save();

  lead.etapa_funnel = 'Ganado';
  lead.empresa_convertida = empresaGuardada._id;
  await lead.save();

  res.status(201).json({ 
    message: 'Lead convertido exitosamente', 
    empresa: empresaGuardada 
  });
});