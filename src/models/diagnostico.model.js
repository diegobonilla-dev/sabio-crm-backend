import { Schema, model } from 'mongoose';

// Subdocumento: Información General (común a todos)
const informacionGeneralSchema = new Schema({
  // Contacto principal
  telefono_cliente: { type: String, trim: true },

  // Contacto de quien atiende la visita (nuevo)
  nombre_quien_atiende: { type: String, trim: true },
  telefono_quien_atiende: { type: String, trim: true },

  // Compradores/Corporativos (nuevo)
  compradores_corporativos: [{ type: String, trim: true }],

  // Caja de compensación (nuevo)
  caja_compensacion: { type: String, trim: true },

  // Ubicación y dimensiones
  coordenadas_gps: { type: String, trim: true },
  area_dedicada: { type: Number }, // Label dinámico en UI según tipo de finca
  area_reserva: { type: Number },
  numero_divisiones: { type: Number }, // "Potreros", "Bloques", etc. según tipo

  // Información adicional
  tiene_mapas: { type: Boolean, default: false },
  tendencia_climatica: { type: String, trim: true },
  tiene_registros: { type: Boolean, default: false }
});

// Subdocumento: Suplemento individual
const suplementoSchema = new Schema({
  tipo: { type: String, trim: true },
  kgDia: { type: Number },
  precioKg: { type: Number }
}, { _id: false });

// Subdocumento: Materia seca individual
const materiaSecaSchema = new Schema({
  tipo: { type: String, trim: true },
  porcentaje: { type: Number }
}, { _id: false });

// Subdocumento: Lote individual (para Paso 2)
// Representa una unidad productiva en el diagnóstico (ej: grupo de vacas en ordeño)
const loteSchema = new Schema({
  nombre_lote: { type: String, trim: true },

  // Producción de leche
  total_litros: { type: Number },
  periodo_litros: { type: String, enum: ['litros_dia', 'litros_mes'], default: 'litros_dia' },
  total_litros_305_dias: { type: Number }, // Opcional

  // Animales
  numero_vacas_ordeno: { type: Number },
  raza_predominante: { type: String, trim: true },
  peso_promedio_vaca: { type: Number },

  // Costos de producción
  precio_venta_leche: { type: Number },
  concentrado_total_kg_dia: { type: Number },
  precio_concentrado_kg: { type: Number },

  // Suplementación
  usa_suplemento: { type: Boolean, default: false },
  suplementos: [suplementoSchema], // Array de suplementos

  // Materia seca
  materia_seca: [materiaSecaSchema] // Array de tipos de materia seca
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
