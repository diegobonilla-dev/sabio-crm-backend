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
  nombre: {
    type: String,
    required: true,
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
  
  // --- Contacto de Contabilidad  ---
  // Esta es una buena decisión de diseño:
  // Como los datos de contabilidad son pequeños y solo pertenecen a ESTA empresa,
  // los *embebemos* directamente en el documento. No necesitamos una colección separada.
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