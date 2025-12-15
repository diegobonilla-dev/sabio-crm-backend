//src/models/lead.model.js
import { Schema, model } from 'mongoose';

const leadSchema = new Schema({
  // Vendedor (del equipo SaBio) que gestiona este prospecto
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Esto crea una referencia al modelo 'User' que haremos después
    required: true
  },
  
  // Datos del prospecto
  empresa_nombre: {
    type: String,
    required: [true, 'El nombre de la empresa es obligatorio'],
    trim: true
  },
  contacto_nombre: {
    type: String,
    required: [true, 'El nombre del contacto es obligatorio'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Por favor, introduce un email válido']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    trim: true
  },
  
  // El corazón del CRM: El embudo de ventas
  etapa_funnel: {
    type: String,
    enum: ['Nuevo', 'Contactado', 'Cotizado', 'Negociacion', 'Ganado', 'Perdido'],
    default: 'Nuevo'
  },
  
  // De dónde vino este prospecto
  origen: {
    type: String,
    trim: true,
    enum: ['Web', 'Referido', 'Llamada directa', 'Evento', 'Redes sociales', 'Otro'],
    default: 'Otro'
  },

  // Motivo de pérdida (opcional)
  motivo_perdida: {
    type: String,
    trim: true
  },

  // Notas adicionales
  notas: {
    type: String,
    trim: true
  },

  // --- Relaciones ---

  // 1. Conexión con Actividades: Un Lead tiene MUCHAS actividades.
  // Guardamos un array de IDs que apuntan a la colección 'Actividad'.
  actividades: [{
    type: Schema.Types.ObjectId,
    ref: 'Actividad'
  }],
  
  // 2. Conexión con la Empresa (Post-Venta):
  // Cuando se "Gana", aquí guardamos el ID de la 'Empresa' que se creó.
  empresa_convertida: {
    type: Schema.Types.ObjectId,
    ref: 'Empresa',
    default: null
  }
}, {
  // timestamps: true añade automáticamente 'createdAt' y 'updatedAt'
  timestamps: true
});

// Índices para búsquedas eficientes
leadSchema.index({ owner: 1, etapa_funnel: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ empresa_nombre: 1 });

// Creamos y exportamos el modelo
const Lead = model('Lead', leadSchema);
export default Lead;