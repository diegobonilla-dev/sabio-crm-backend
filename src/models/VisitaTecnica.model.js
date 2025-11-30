import { Schema, model } from 'mongoose';

// --- SUB-ESQUEMA: GANADERÍA (Leche / Carne) ---
const datosGanaderiaSchema = new Schema({
  aforo_promedio_kg_m2: { type: Number },
  dias_ocupacion_promedio: { type: Number },
  dias_descanso_promedio: { type: Number },
  carga_animal_ugg: { type: Number },
  condicion_corporal_promedio: { type: Number, min: 1, max: 5 }, 
  produccion_actual: {
    cantidad: { type: Number },
    unidad: { type: String, enum: ['Litros/Dia', 'Kg/Dia', 'Animales/Sacrificio'] }
  },
  suplementacion_kg_animal: { type: Number },
  observaciones_pasturas: { type: String }
}, { _id: false });

// --- SUB-ESQUEMA: AGRICULTURA (Frutales / Flores) ---
const datosAgriculturaSchema = new Schema({
  estado_fenologico: { type: String }, // Ej. "Floración", "Llenado"
  plantas_por_ha: { type: Number },
  estimacion_cosecha_kg: { type: Number },
  calidad_fruto_flor: { type: String }, // Ej. "Grado A", "Exportación"
  monitoreo_plagas: [{
    nombre_plaga: { type: String },
    porcentaje_incidencia: { type: Number },
    severidad: { type: String, enum: ['Leve', 'Moderada', 'Alta'] }
  }]
}, { _id: false });

// --- ESQUEMA PRINCIPAL ---
const visitaTecnicaSchema = new Schema({
  finca: { type: Schema.Types.ObjectId, ref: 'Finca', required: true },
  tecnico: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  fecha: { type: Date, default: Date.now },
  
  motivo_visita: { 
    type: String, 
    required: true,
    enum: ['Diagnostico Inicial', 'Seguimiento', 'Urgencia', 'Cierre de Ciclo']
  },

  // --- CAMPOS POLIMÓRFICOS (Opcionales según el caso) ---
  datos_ganaderia: { type: datosGanaderiaSchema },
  datos_agricultura: { type: datosAgriculturaSchema },

  // --- GENERALES ---
  recomendaciones_generales: { type: String, required: true },
  
  // Tareas que deja el técnico al mayordomo/operario
  tareas_asignadas: [{
    descripcion: String,
    responsable: String,
    fecha_limite: Date,
    completada: { type: Boolean, default: false }
  }],

  // Evidencia (URLs de imágenes/PDFs)
  archivos_adjuntos: [String]

}, { timestamps: true });

const VisitaTecnica = model('VisitaTecnica', visitaTecnicaSchema);
export default VisitaTecnica;