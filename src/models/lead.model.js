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
    trim: true,
    lowercase: true,
    // Opcional: validación simple de email
    match: [/.+\@.+\..+/, 'Por favor, introduce un email válido']
  },
  telefono: {
    type: String,
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

// Creamos y exportamos el modelo
const Lead = model('Lead', leadSchema);
export default Lead;