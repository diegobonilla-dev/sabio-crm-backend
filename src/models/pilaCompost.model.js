//src/models/pilaCompost.model.js
import { Schema, model } from 'mongoose';

// --- ESQUEMA EMBEBIDO: SEGUIMIENTO ---
// Esto representa la tabla 'seguimiento_compost'.
// Embebemos el seguimiento DENTRO de la pila a la que pertenece.
const seguimientoSchema = new Schema({
  creado_por: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  volteo: {
    type: Boolean,
    default: false
  },
  temp_prom: { type: Number },
  hum_prom: { type: Number },
  observaciones: { type: String, trim: true },
  imagen: { type: String } // URL de Cloudinary/S3
}, { timestamps: true });


// --- ESQUEMA PRINCIPAL: PILA DE COMPOST ---
const pilaCompostSchema = new Schema({
  // --- Relaciones ---
  finca: {
    type: Schema.Types.ObjectId,
    ref: 'Finca',
    required: true
  },
  // La plantilla que se usó (opcional, puede ser una pila "libre")
  plantilla_usada: {
    type: Schema.Types.ObjectId,
    ref: 'PlantillaCompost',
    default: null
  },
  creada_por: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // --- Datos de la Pila (Instancia) ---
  nombre: {
    type: String,
    required: true,
    trim: true,
    example: "Pila Lote 1 (Lunes)"
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    enum: ['activa', 'maduracion', 'terminada'],
    default: 'activa'
  },
  
  // (Opcional) Notas sobre cómo esta pila varió de la plantilla
  variaciones_plantilla: {
    type: String,
    trim: true
  },

  // --- EL SEGUIMIENTO EMBEBIDO ---
  // Un array de todos los seguimientos hechos a ESTA pila.
  // Esto es súper rápido para leer.
  seguimiento: [seguimientoSchema] 

}, {
  timestamps: true
});

const PilaCompost = model('PilaCompost', pilaCompostSchema);
export default PilaCompost;