import Lead from '../models/lead.model.js';
import User from '../models/user.model.js';
import Empresa from '../models/empresa.model.js'

/**
 * @name createLead
 * @description Crea un nuevo prospecto (Lead) y lo asigna al vendedor logueado.
 */
export const createLead = async (req, res) => {
  try {
    // 1. Obtenemos los datos del body
    const { empresa_nombre, contacto_nombre, email, telefono, origen } = req.body;

    // 2. ¡La magia del middleware 'protect'!
    // Ya tenemos al usuario logueado en 'req.user'
    const ownerId = req.user._id;

    // 3. Validamos
    if (!empresa_nombre || !contacto_nombre) {
      return res.status(400).json({ message: 'Nombre de empresa y contacto son obligatorios' });
    }

    // 4. Creamos el nuevo Lead
    const newLead = new Lead({
      owner: ownerId,
      empresa_nombre,
      contacto_nombre,
      email,
      telefono,
      origen
    });

    // 5. Guardamos en la BD
    const savedLead = await newLead.save();

    // 6. (Opcional pero recomendado) Añadimos este lead a la lista del usuario
    await User.findByIdAndUpdate(ownerId, { $push: { leads_asignados: savedLead._id } });

    res.status(201).json({ message: 'Lead creado exitosamente', lead: savedLead });

  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

/**
 * @name getLeads
 * @description Obtiene los leads. Si es Admin ve todos, si es Vendedor ve solo los suyos.
 */
export const getLeads = async (req, res) => {
  try {
    let query = {};

    // Filtramos por rol
    if (req.user.role === 'sabio_vendedor') {
      // Un vendedor solo ve sus propios leads
      query = { owner: req.user._id };
    }
    // Si es 'sabio_admin', el query vacío {} trae todo

    const leads = await Lead.find(query)
      .populate('owner', 'name email') // Reemplaza el ID del owner por su nombre y email
      .populate('actividades'); // Trae las actividades relacionadas

    res.status(200).json(leads);

  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los leads', error: error.message });
  }
};

/**
 * @name convertLeadToEmpresa
 * @description Convierte un Lead en una Empresa y un Usuario (cliente_owner).
 */
export const convertLeadToEmpresa = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { password, nit } = req.body; // Password para el nuevo usuario cliente

    // 1. Validar datos
    if (!password) {
      return res.status(400).json({ message: 'La contraseña para el nuevo usuario es obligatoria' });
    }

    // 2. Buscar el Lead
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }
    if (lead.empresa_convertida) {
      return res.status(400).json({ message: 'Este Lead ya fue convertido' });
    }

    // 3. Crear la nueva Empresa
    const nuevaEmpresa = new Empresa({
      account_manager: req.user._id, // El vendedor/admin que lo convirtió
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

    // 4. Crear el nuevo Usuario (cliente_owner)
    const nuevoUsuarioCliente = new User({
      name: lead.contacto_nombre,
      email: lead.email,
      password: password, // El modelo 'User' se encargará de hashearlo
      role: 'cliente_owner',
      empresa: empresaGuardada._id // ¡Lo vinculamos a su empresa!
    });
    await nuevoUsuarioCliente.save();

    // 5. Actualizar el Lead
    lead.etapa_funnel = 'Ganado';
    lead.empresa_convertida = empresaGuardada._id;
    await lead.save();

    res.status(201).json({ 
      message: 'Lead convertido exitosamente', 
      empresa: empresaGuardada 
    });

  } catch (error) {
    // Manejo de error si el email del cliente ya existe
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El email de este lead ya está registrado como usuario' });
    }
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};