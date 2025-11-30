//src/models/actividad.model.js
import { Schema, model } from 'mongoose';

const actividadSchema = new Schema({
  // A qué Lead pertenece esta actividad
  lead: {
    type: Schema.Types.ObjectId,
    ref: 'Lead',
    required: true
  },
  // Quién del equipo SaBio la realizó
  creada_por: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tipo de actividad
  tipo: {
    type: String,
    enum: ['Llamada', 'Email', 'Reunion', 'WhatsApp', 'Nota'],
    required: true
  },
  // El contenido de la actividad
  notas: {
    type: String,
    trim: true,
    required: true
  },
  // (Opcional) Para agendar actividades a futuro
  fecha_vencimiento: {
    type: Date
  }
}, {
  timestamps: true // 'createdAt' nos dice cuándo se registró la actividad
});

const Actividad = model('Actividad', actividadSchema);
export default Actividad;