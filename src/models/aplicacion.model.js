//src/models/aplicacion.model.js
import { Schema, model } from 'mongoose';

const aplicacionSchema = new Schema({
  // --- Relaciones ---
  producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
  finca: { type: Schema.Types.ObjectId, ref: 'Finca', required: true },
  
  // Guardamos el ID del sub-documento Lote.
  // Es 'ObjectId' aunque sea sub-doc.
  lote: { type: Schema.Types.ObjectId, required: true }, 

  registrada_por: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // --- Datos del Evento ---
  fecha_aplicacion: { type: Date, default: Date.now },
  cantidad_aplicada: { type: Number, required: true },
  unidad_medida: { 
    type: String, 
    enum: ['kg', 'litros', 'sacos', 'contenedores'],
    required: true
  },
  
  // Contexto (reemplaza las 4 tablas de 'aplicaciones_...')
  contexto_aplicacion: {
    type: String,
    enum: ['Cultivo', 'Ganaderia'],
    required: true
  },
  estado_fenologico: { type: String, trim: true }, // ej. 'vegetativo', 'floracion'
  
  observaciones: { type: String, trim: true }
}, { timestamps: true });

const Aplicacion = model('Aplicacion', aplicacionSchema);
export default Aplicacion;