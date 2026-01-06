import { Schema, model } from 'mongoose';

const ubicacionSchema = new Schema({
  departamento: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  codigo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  municipios: [{
    type: String,
    required: true,
    trim: true,
    uppercase: true
  }]
}, {
  timestamps: true
});

// Índice para búsquedas rápidas
ubicacionSchema.index({ departamento: 1 });

const Ubicacion = model('Ubicacion', ubicacionSchema);
export default Ubicacion;
