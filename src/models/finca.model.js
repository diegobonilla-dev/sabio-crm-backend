// Archivo: /src/models/finca.model.js (Actualizado)

import { Schema, model } from 'mongoose';

// --- ESQUEMA EMBEBIDO #1: DIVISION SECUNDARIA (Antes Lote) ---
// Representa la división más pequeña (Lote, Franja, Cama, etc.)
const divisionSecundariaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  }
});

// --- ESQUEMA EMBEBIDO #2: DIVISION PRIMARIA (Antes Zona) ---
// Representa la división principal (Zona, Potrero, Parcela, etc.)
const divisionPrimariaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  imagen: {
    type: String // URL de Cloudinary o S3
  },
  // Cada División Primaria tiene su propio array de Divisiones Secundarias
  divisiones_secundarias: [divisionSecundariaSchema] 
});

// --- ESQUEMA PRINCIPAL: FINCA ---
const fincaSchema = new Schema({
  // --- Relaciones de Propiedad y Supervisión ---
  empresa_owner: {
    type: Schema.Types.ObjectId,
    ref: 'Empresa',
    required: true
  },
  corporativos_asociados: [{
    type: Schema.Types.ObjectId,
    ref: 'Corporativo'
  }],
  
  // --- Datos de la Finca ---
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
  
  // --- CAMPO CLAVE PARA LA FLEXIBILIDAD (de NOTES.md) ---
  tipo_produccion: {
    type: String,
    trim: true,
    enum: ['Ganaderia', 'Flores', 'Frutales', 'Cafe', 'Aguacate', 'Mixto', 'Otro'],
    default: 'Ganaderia'
  },
  cultivo_principal: {
    type: String,
    trim: true
  },

  // --- NUEVOS CAMPOS MÓDULO 4 ---
  vereda: {
    type: String,
    trim: true
  },

  coordenadas_gps: {
    type: String,
    trim: true
  },

  // --- LA ESTRUCTURA EMBEBIDA GENÉRICA ---
  // Reemplaza a 'zonas'
  divisiones_primarias: [divisionPrimariaSchema]

}, {
  timestamps: true
});

const Finca = model('Finca', fincaSchema);
export default Finca;