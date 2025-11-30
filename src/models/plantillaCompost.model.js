//src/models/plantillaCompost.model.js
import { Schema, model } from 'mongoose';

const plantillaCompostSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  // Creada por un técnico de SaBio
  creada_por: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Guías generales (como esta en los docs)
  pct_material_verde: { type: Number },
  pct_material_cafe: { type: Number },
  pct_material_nitrogeno: { type: Number },
  
  notas_preparacion: {
    type: String,
    trim: true
  },
  estado: {
    type: String,
    enum: ['activa', 'inactiva', 'archivada'],
    default: 'activa'
  }
}, {
  timestamps: true
});

const PlantillaCompost = model('PlantillaCompost', plantillaCompostSchema);
export default PlantillaCompost;