//src/models/empresa.model.js
import { Schema, model } from 'mongoose';

const empresaSchema = new Schema({
  // El "Account Manager" o técnico principal asignado a este cliente
  account_manager: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Guardamos la referencia al prospecto original para trazabilidad
  lead_origen: {
    type: Schema.Types.ObjectId,
    ref: 'Lead'
  },
  
  // --- Datos de la Empresa (Cliente) ---
  nombre_comercial: {
    type: String,
    required: true,
    trim: true
  },

  razon_social: {
    type: String,
    trim: true
  },

  NIT: {
    type: String,
    trim: true,
    unique: true,
    sparse: true // Permite valores nulos pero únicos si existen
  },

  plan_activo: {
    type: Boolean,
    default: true
  },

  // --- Contacto Principal ---
  contacto_principal: {
    nombre: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true },
    cargo: { type: String, trim: true }
  },

  // --- Contacto de Contabilidad ---
  contacto_contabilidad: {
    nombre: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    telefono: { type: String, trim: true }
  },

  // --- Relaciones ---
  // La jerarquía principal del negocio.
  // Una Empresa tiene MUCHAS Fincas.
  // Guardamos solo las referencias (IDs) porque las Fincas serán
  // documentos muy grandes y complejos por sí mismos.
  fincas: [{
    type: Schema.Types.ObjectId,
    ref: 'Finca'
  }]
}, {
  timestamps: true
});

const Empresa = model('Empresa', empresaSchema);
export default Empresa;