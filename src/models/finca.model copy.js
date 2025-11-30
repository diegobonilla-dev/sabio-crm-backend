import { Schema, model } from 'mongoose';

// --- ESQUEMA EMBEBIDO #1: LOTE ---
// No es un modelo, es un sub-documento.
// Representa la tabla 'lotes_zona' de los docs.
const loteSchema = new Schema({
  nombre_lote: {
    type: String,
    required: true,
    trim: true
  }
});

// --- ESQUEMA EMBEBIDO #2: ZONA ---
// No es un modelo, es un sub-documento.
// Representa la tabla 'zonas' de los docs.
// ¡Y ANIDA el esquema de Lotes!
const zonaSchema = new Schema({
  nombre_zona: {
    type: String,
    required: true,
    trim: true
  },
  imagen_zona: {
    //TODO: Más adelante aquí pondremos la URL de Cloudinary o S3
    type: String 
  },
  // Cada Zona tiene su propio array de Lotes
  lotes: [loteSchema] 
});

// --- ESQUEMA PRINCIPAL: FINCA ---
// Este SÍ es un modelo. Esta será la colección en MongoDB.
const fincaSchema = new Schema({
  // --- Relaciones de Propiedad y Supervisión ---
  
  // 1. El Dueño (Relación 1-a-Muchos con Empresa)
  empresa_owner: {
    type: Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  
  // 2. Los Corporativos (Relación Muchos-a-Muchos)
  // Guardamos un array de IDs que apuntan a 'Corporativo'.
  corporativos_asociados: [{
    type: Schema.Types.ObjectId,
    ref: 'Corporativo'
  }],
  
  // --- Datos de la Finca (Campos de 'fincas' en los docs) ---
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: Number,
    required: true
  },
  municipio: {
    type: String,
    trim: true
  },
  departamento: {
    type: String,
    trim: true
  },
  cultivo_principal: {
    type: String,
    trim: true
  },
  // (Omitimos 'poligonos' por ahora para simplificar, TODO:lo añadiremos después)

  // --- LA ESTRUCTURA EMBEBIDA ---
  // Aquí es donde anidamos el esquema de Zonas.
  // Un documento 'Finca' contendrá un array de 'Zonas',
  // y cada 'Zona' contendrá un array de 'Lotes'.
  zonas: [zonaSchema]

}, {
  timestamps: true
});

const Finca = model('Finca', fincaSchema);
export default Finca;