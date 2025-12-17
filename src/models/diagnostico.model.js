import { Schema, model } from 'mongoose';

// Subdocumento: Información General (común a todos)
const informacionGeneralSchema = new Schema({
  telefono_cliente: { type: String, trim: true },
  coordenadas_gps: { type: String, trim: true },
  area_dedicada: { type: Number },
  area_reserva: { type: Number },
  numero_divisiones: { type: Number },
  tiene_mapas: { type: Boolean, default: false },
  tendencia_climatica: { type: String, trim: true },
  tiene_registros: { type: Boolean, default: false }
});

// Subdocumento: Lote individual (para Paso 2)
const loteSchema = new Schema({
  nombre_lote: { type: String, trim: true },
  total_litros_dia: { type: Number },
  numero_vacas_ordeno: { type: Number },
  precio_venta_leche: { type: Number },
  concentrado_total_kg: { type: Number },
  precio_concentrado_kg: { type: Number },
  usa_suplemento: { type: Boolean, default: false },
  tipo_suplemento: { type: String, trim: true },
  raza_predominante: { type: String, trim: true },
  peso_promedio_vacas: { type: Number }
}, { _id: true });

// Subdocumento: Datos específicos Ganadería (10 pasos)
const datosGanaderiaSchema = new Schema({
  // Paso 2: Sistema Productivo y Animales
  sistema_productivo: {
    cuantos_lotes_alta_produccion: { type: Number, default: 0 },
    lotes: [loteSchema]  // Array de lotes dinámicos
  },

  // Paso 3: Manejo de Pastoreo
  manejo_pastoreo: {
    sistema_pastoreo: String,
    rotacion_dias: Number
  },

  // Paso 4-10: (definir según necesidad)
  fertilizacion: Schema.Types.Mixed,
  sanidad_animal: Schema.Types.Mixed,
  alimentacion: Schema.Types.Mixed,
  reproduccion: Schema.Types.Mixed,
  infraestructura: Schema.Types.Mixed,
  aspectos_economicos: Schema.Types.Mixed,
  observaciones: Schema.Types.Mixed
});

// Subdocumentos para otros tipos (definir después)
const datosFloresSchema = new Schema({
  // TODO: Definir campos específicos
  datos: Schema.Types.Mixed
});

const datosFrutalesSchema = new Schema({
  datos: Schema.Types.Mixed
});

const datosCafeSchema = new Schema({
  datos: Schema.Types.Mixed
});

const datosAguacateSchema = new Schema({
  datos: Schema.Types.Mixed
});

// Modelo principal
const diagnosticoSchema = new Schema({
  // Relaciones
  finca: {
    type: Schema.Types.ObjectId,
    ref: 'Finca',
    required: true
  },

  tecnico_responsable: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Metadata
  tipo_diagnostico: {
    type: String,
    enum: ['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate'],
    required: true
  },

  fecha_visita: {
    type: Date,
    required: true
  },

  hora_inicio: {
    type: String,
    required: true
  },

  estado: {
    type: String,
    enum: ['Borrador', 'En_Progreso', 'Completado'],
    default: 'Borrador'
  },

  // Información común
  informacion_general: informacionGeneralSchema,

  // Datos específicos (solo uno se llenará según tipo_diagnostico)
  datos_ganaderia: datosGanaderiaSchema,
  datos_flores: datosFloresSchema,
  datos_frutales: datosFrutalesSchema,
  datos_cafe: datosCafeSchema,
  datos_aguacate: datosAguacateSchema

}, {
  timestamps: true
});

const Diagnostico = model('Diagnostico', diagnosticoSchema);
export default Diagnostico;
