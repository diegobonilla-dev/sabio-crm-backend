// Archivo: /src/models/finca.model.js (Actualizado)

import { Schema, model } from 'mongoose';

// --- ESQUEMA EMBEBIDO #1: DIVISION TERCIARIA ---
// Nivel más granular (Franja, Cama, Plato, Surco, etc.)
// Se usa para mapeo biológico en diagnósticos
const divisionTerciariaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  }
});

// --- ESQUEMA EMBEBIDO #2: DIVISION SECUNDARIA ---
// Nivel intermedio (Potrero, Nave, Sección, etc.)
const divisionSecundariaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  // Cada División Secundaria tiene su propio array de Divisiones Terciarias
  divisiones_terciarias: [divisionTerciariaSchema]
});

// --- ESQUEMA EMBEBIDO #3: DIVISION PRIMARIA ---
// Nivel más alto de organización (Lote, Bloque, etc.)
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

  // --- LA ESTRUCTURA EMBEBIDA GENÉRICA (3 NIVELES) ---
  // Nomenclatura según tipo_produccion:
  // Ganaderia: Lote → Potrero → Franja
  // Flores: Bloque → Nave → Cama
  // Frutales: Lote → Sección → Plato
  divisiones_primarias: [divisionPrimariaSchema]

}, {
  timestamps: true
});

const Finca = model('Finca', fincaSchema);
export default Finca;
