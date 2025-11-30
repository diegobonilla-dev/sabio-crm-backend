//src/models/muestra.model.js
import { Schema, model } from 'mongoose';

// --- ESQUEMAS EMBEBIDOS PARA CADA TIPO DE ANÁLISIS ---

// Basado en 'conteo_bacterias'
const conteoBacteriasSchema = new Schema({
  promedio: Number,
  desviacion_estandar: Number,
  // ... (podemos añadir más campos de los docs si es necesario)
});

// Basado en 'conteo_hongo_oomycet'
const conteoHongosSchema = new Schema({
  promedio_hongos: Number,
  ds_hongos: Number,
  promedio_oomycetos: Number,
  ds_oomycetos: Number,
});

// Basado en 'analisis_quimico_suelo'
const analisisQuimicoSchema = new Schema({
  ph: Number,
  materia_organica: Number,
  fosforo: Number,
  calcio: Number,
  magnesio: Number,
  potasio: Number,
  // ... (etc.)
});

// --- ESQUEMA PRINCIPAL: MUESTRA (Master Sample) ---
// Esto reemplaza a 'master_muestras' y 'metadata_muestras'
const muestraSchema = new Schema({
  // --- Vínculos (A qué pertenece esta muestra) ---
  finca: { type: Schema.Types.ObjectId, ref: 'Finca', required: true },
  zona: { type: Schema.Types.ObjectId }, // ID del sub-documento Zona
  pila_compost: { type: Schema.Types.ObjectId, ref: 'PilaCompost' },
  
  // --- Metadata ---
  nombre_muestra: { type: String, required: true, trim: true },
  tipo_muestra: {
    type: String,
    enum: ['Suelo', 'Compost', 'Bioreactor', 'Foliar'],
    required: true
  },
  fecha_toma: { type: Date, default: Date.now },
  registrada_por: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  estado: {
    type: String,
    enum: ['Recibida', 'En Proceso', 'Completada'],
    default: 'Recibida'
  },

  // --- RESULTADOS EMBEBIDOS ---
  // Aquí es donde guardamos todos los análisis relacionados
  resultados_quimicos: { type: analisisQuimicoSchema, default: null },
  conteo_bacterias: { type: conteoBacteriasSchema, default: null },
  conteo_hongos: { type: conteoHongosSchema, default: null },
  // (Añadiríamos 'analisis_fisico', 'info_fovs', 'macro_scan' de la misma manera)

}, { timestamps: true });

const Muestra = model('Muestra', muestraSchema);
export default Muestra;