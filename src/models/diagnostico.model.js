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

// Subdocumento: Producto químico individual (Paso 3)
const productoQuimicoSchema = new Schema({
  nombre_producto: { type: String, trim: true },
  formula_npk: { type: String, trim: true },
  bultos_por_ha: { type: Number },
  periodo: { type: String, enum: ['rotacion', 'ciclo', 'anual'] },
  costo_por_bulto: { type: Number }
}, { _id: false });

// Subdocumento: Insecticida individual (Paso 3)
const insecticidaSchema = new Schema({
  nombre_comercial: { type: String, trim: true },
  ingrediente_activo: { type: String, trim: true },
  dosis: { type: Number },
  unidad_dosis: { type: String, enum: ['ml/200L', 'cc/L'] }
}, { _id: false });

// Subdocumento: Lote diferenciado (Paso 3)
const loteDiferenciadoSchema = new Schema({
  nombre_lote: { type: String, trim: true },
  usa_fertilizacion_quimica: { type: Boolean },
  productos_quimicos: [productoQuimicoSchema],
  usa_abono_organico: { type: Boolean },
  usa_fumigacion: { type: Boolean },
  insecticidas: [insecticidaSchema],
  observaciones: { type: String, trim: true }
}, { _id: true });

// ============================================
// PASO 4: MANEJO DE PASTOREO Y FORRAJES
// ============================================

// Subdocumento: Especie de pasto predominante
const especiePastoSchema = new Schema({
  especie: { type: String, trim: true },
  orden: { type: Number } // 1, 2, 3
}, { _id: false });

// Subdocumento: Punto de muestreo individual
const puntoMuestreoSchema = new Schema({
  coordenada_gps: { type: String, trim: true },
  pendiente_porcentaje: { type: Number, min: 0, max: 45 },
  aspecto_pendiente: {
    type: String,
    enum: ['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']
  },

  // VESS (Visual Evaluation of Soil Structure)
  vess_colchon_pasto: { type: Number, enum: [1, 2, 3] },
  vess_suelo: { type: Number, enum: [1, 2, 3, 4, 5] },

  // Características del suelo
  textura_predominante: {
    type: String,
    enum: ['Arenosa', 'Franca', 'Arcillosa']
  },
  color_predominante: {
    type: String,
    enum: ['Oscuro', 'Claro', 'Rojizo']
  },
  olor_predominante: {
    type: String,
    enum: ['Orgánico', 'Áspero', 'Ácido', 'Neutro']
  },

  // Compactación
  penetrometro_200psi_cm: { type: Number, min: 0, max: 90 },
  nivel_compactacion: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  evidencia_compactacion_superficial: { type: Boolean },

  // Condiciones
  drenaje: {
    type: String,
    enum: ['Adecuado', 'Deficiente']
  },
  evidencia_erosion: { type: Boolean },

  // Salud del pasto
  puntuacion_salud_pasto: { type: Number, enum: [0, 1, 2, 3] },
  especies_no_deseadas_presentes: { type: Boolean },
  nivel_especies_no_deseadas: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  sintomas_estres: [{
    type: String,
    enum: ['Sequía', 'Sobrepastoreo', 'Plagas', 'Ninguno']
  }],

  // Biodiversidad
  lombrices_rojas: { type: Number, default: 0 },
  lombrices_grises: { type: Number, default: 0 },
  lombrices_blancas: { type: Number, default: 0 },
  huevos_lombrices: { type: Number, default: 0 },
  tipos_diferentes_huevos: { type: Number, default: 0 },
  presencia_micelio_hongos: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },
  raices_activas_visibles: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },

  // Fotos (placeholders - URLs cuando se implemente upload)
  foto_salud_pasto_calidad: { type: String, trim: true },
  foto_salud_pasto_raiz: { type: String, trim: true },
  foto_perfil_suelo: { type: String, trim: true },

  // Observaciones
  observaciones_punto: { type: String, trim: true }
}, { _id: true });

// Subdocumento: Plaga/Enfermedad individual
const plagaEnfermedadSchema = new Schema({
  nombre: { type: String, trim: true },
  nivel_dano: {
    type: String,
    enum: ['sin_dano', 'leve', 'moderado', 'grave']
  }
}, { _id: false });

// Subdocumento: Lote evaluado (Paso 4 - Manejo de Pastoreo)
const loteEvaluadoPastoreoSchema = new Schema({
  nombre_lote: { type: String, trim: true },
  area_m2: { type: Number },
  topografia: {
    type: String,
    enum: ['Plano', 'Inclinación leve', 'Inclinación fuerte']
  },

  // Mediciones de forraje (opcional)
  mediciones_forraje: {
    se_realizaron: { type: Boolean, default: true },
    motivo_no_realizacion: { type: String, trim: true },

    // Mediciones de entrada
    aforo_entrada_kg_ms_m2: { type: Number },
    altura_entrada_cm: { type: Number },
    hora_muestreo_ms: { type: String, trim: true },

    // Mediciones de salida (opcional)
    aforo_salida_kg_ms_m2: { type: Number },
    altura_salida_cm: { type: Number },

    // Ofertas (calculables)
    oferta_forraje_verde_kg_vaca_dia: { type: Number },
    oferta_area_m2_vaca_dia: { type: Number },
    porcentaje_materia_seca: { type: Number },

    // Mediciones químicas
    grados_brix: { type: Number },
    ph_hoja: { type: Number },
    hora_muestreo_brix_ph: { type: String, trim: true }
  },

  // Puntos de muestreo (array dinámico, máximo 9)
  puntos_muestreo: [puntoMuestreoSchema],

  // Plagas y enfermedades
  plagas_enfermedades: [plagaEnfermedadSchema]
}, { _id: true });

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

  // Paso 3: Fertilización y Fumigación
  fertilizacion_fumigacion: {
    general: {
      // Fertilización química
      usa_fertilizacion_quimica: { type: Boolean },
      costo_ultimo_ano_fertilizacion: { type: Number },
      costo_fertilizacion_es_aproximado: { type: Boolean },
      productos_quimicos: [productoQuimicoSchema],

      // Abono orgánico
      usa_abono_organico: { type: Boolean },
      tipo_abono_organico: { type: String, enum: ['CASERO', 'COMERCIAL'] },
      costo_abono_organico: { type: Number },
      unidad_costo_abono: { type: String, enum: ['bulto', 'kg'] },

      // Fertilización foliar
      usa_fertilizante_foliar: { type: Boolean },
      tipos_aplicacion: [{ type: String }], // ['Granular', 'Liquido', 'Foliar']

      // Fumigación
      usa_fumigacion: { type: Boolean },
      sistemas_fumigacion: [{ type: String }],
      otro_sistema_fumigacion: { type: String, trim: true },
      costo_anual_venenos: { type: Number },
      costo_venenos_es_aproximado: { type: Boolean },

      // Productos de fumigación
      insecticidas: [insecticidaSchema],
      fungicida: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },
      coadyuvante: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },

      // Rotación
      tiene_plan_rotacion: { type: Boolean },
      rotacion_dias: { type: Number }
    },

    // Manejo diferencial opcional
    tiene_manejo_diferencial: { type: Boolean },
    cuantos_lotes_diferenciados: { type: Number, default: 0 },
    lotes_diferenciados: [loteDiferenciadoSchema]
  },

  // Paso 4: Manejo de Pastoreo y Forrajes
  manejo_pastoreo: {
    // Sección A: Información General
    general: {
      finca_hace_aforo: { type: Boolean },
      metodo_aforo: {
        type: String,
        enum: [
          'Platómetro',
          'Visual',
          'Corte y peso',
          'Bastón de aforo',
          'No se hace en la finca'
        ]
      },

      tipo_pastoreo: {
        type: String,
        enum: ['Rotacional', 'Continuo']
      },

      // Campos condicionales (solo si tipo_pastoreo === 'Rotacional')
      periodo_rotacion_dias: { type: Number },
      periodo_ocupacion_dias: { type: Number },
      franja_pastoreo_m2: { type: Number },

      // Especies de pasto (3 predominantes)
      especies_pasto: [especiePastoSchema], // Máximo 3

      cobertura_general: {
        type: String,
        enum: ['Alta', 'Media', 'Baja']
      },
      uniformidad_general: {
        type: String,
        enum: ['Buena', 'Irregular']
      }
    },

    // Sección B: Lotes Evaluados
    cuantos_lotes_evaluados: { type: Number, default: 0 },
    lotes_evaluados: [loteEvaluadoPastoreoSchema]
  },

  // Paso 5-10: (definir según necesidad)
  fertilizacion: Schema.Types.Mixed, // DEPRECATED - Se movió a fertilizacion_fumigacion en Paso 3
  sanidad_animal: Schema.Types.Mixed,
  alimentacion: Schema.Types.Mixed,
  reproduccion: Schema.Types.Mixed,
  infraestructura: Schema.Types.Mixed
});

// Subdocumento: Lote frutal individual (para Paso 2 de Frutales)
const loteFrutalSchema = new Schema({
  nombre_lote: { type: String, trim: true },

  // Información del cultivo
  arboles_por_ha: { type: Number },
  edad_siembra: { type: Number }, // Años desde plantación
  edad_produccion: { type: Number }, // Años en producción real
  notas_edad: { type: String, trim: true }, // Notas sobre resiembras/variaciones

  // Producción
  rendimiento_ha: { type: Number }, // kg/ha
  periodo_rendimiento: { type: String, enum: ['Anual', 'Por ciclo', 'Por cosecha', 'Traviesa'], default: 'Anual' },
  produccion_promedio_arbol: { type: Number }, // kg/árbol (opcional/calculable)

  // Calidad y pérdidas
  porcentaje_exportacion: { type: Number }, // % fruta de primera calidad
  tasa_descarte: { type: Number }, // % descarte por plaga/enfermedad

  // Riego y costos
  tipo_riego: { type: String, enum: ['Gravedad', 'Aspersores', 'Goteo', 'Manguera'], trim: true },
  precio_venta_kg: { type: Number }
}, { _id: true });

// ============================================
// PASO 4: MANEJO DE CULTIVO (FRUTALES) - SCHEMAS
// ============================================

// Subdocumento: Especie predominante frutal (Paso 4)
const especiePredomianteFrutalSchema = new Schema({
  especie: { type: String, trim: true },
  orden: { type: Number } // 1, 2, 3, 4
}, { _id: false });

// Subdocumento: Punto de muestreo individual (Frutales - Paso 4)
const puntoMuestreoFrutalSchema = new Schema({
  coordenada_gps: { type: String, trim: true },
  pendiente_porcentaje: { type: Number, min: 0, max: 45 },
  aspecto_pendiente: {
    type: String,
    enum: ['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']
  },

  // VESS (Visual Evaluation of Soil Structure)
  vess_colchon_pasto: { type: Number, enum: [1, 2, 3] },
  vess_suelo: { type: Number, enum: [1, 2, 3, 4, 5] },

  // Características del suelo
  textura_predominante: {
    type: String,
    enum: ['Arenosa', 'Franca', 'Arcillosa']
  },
  color_predominante: {
    type: String,
    enum: ['Oscuro', 'Claro', 'Rojizo']
  },
  olor_predominante: {
    type: String,
    enum: ['Orgánico', 'Áspero', 'Ácido', 'Neutro']
  },

  // Compactación
  penetrometro_200psi_cm: { type: Number, min: 0, max: 90 },
  nivel_compactacion: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  evidencia_compactacion_superficial: { type: Boolean },

  // Condiciones
  drenaje: {
    type: String,
    enum: ['Adecuado', 'Deficiente']
  },
  evidencia_erosion: { type: Boolean },

  // Salud del árbol/cultivo
  puntuacion_salud_arbol: { type: Number, enum: [0, 1, 2, 3] },
  especies_no_deseadas_presentes: { type: Boolean },
  nivel_especies_no_deseadas: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  sintomas_estres: [{
    type: String,
    enum: ['Sequía', 'Sobrepastoreo', 'Plagas', 'Ninguno']
  }],

  // Biodiversidad
  lombrices_rojas: { type: Number, default: 0 },
  lombrices_grises: { type: Number, default: 0 },
  lombrices_blancas: { type: Number, default: 0 },
  huevos_lombrices: { type: Number, default: 0 },
  tipos_diferentes_huevos: { type: Number, default: 0 },
  presencia_micelio_hongos: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },
  raices_activas_visibles: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },

  // Conductividad eléctrica
  conductividad_electrica: { type: Number },

  // Fotos (placeholders - URLs cuando se implemente upload)
  foto_salud_arbol: { type: String, trim: true },
  foto_perfil_suelo: { type: String, trim: true },

  // Observaciones
  observaciones_punto: { type: String, trim: true }
}, { _id: true });

// Subdocumento: Plaga/Enfermedad individual (Frutales - Paso 4)
const plagaEnfermedadFrutalSchema = new Schema({
  nombre: { type: String, trim: true },
  nivel_dano: {
    type: String,
    enum: ['sin_dano', 'leve', 'moderado', 'grave']
  }
}, { _id: false });

// Subdocumento: Lote evaluado (Frutales - Paso 4)
const loteEvaluadoFrutalSchema = new Schema({
  // Datos básicos
  nombre_lote: { type: String, trim: true },

  // Sistema productivo del lote
  numero_arboles_ha: { type: Number },
  edad_cultivo_siembra: { type: Number }, // Años desde plantación
  edad_cultivo_produccion: { type: Number }, // Años en producción real
  notas_resiembras: { type: String, trim: true },
  rendimiento_kg_ha: { type: Number },
  periodo_rendimiento: {
    type: String,
    enum: ['Anual', 'Por ciclo', 'Por cosecha', 'Traviesa']
  },
  produccion_promedio_arbol: { type: Number }, // kg/árbol (calculable)
  porcentaje_exportacion: { type: Number, min: 0, max: 100 }, // % fruta primera calidad
  tasa_descarte: { type: Number, min: 0, max: 100 }, // % descarte por plaga/enfermedad
  tipo_riego: {
    type: String,
    enum: ['Gravedad', 'Aspersores', 'Goteo', 'Manguera']
  },
  precio_venta_kg: { type: Number },

  // Información del lote
  area_lote_m2: { type: Number },
  coordenadas_gps_centro: { type: String, trim: true },
  topografia_general: {
    type: String,
    enum: ['Plano', 'Inclinación leve', 'Inclinación fuerte']
  },

  // Puntos de muestreo (array dinámico, máximo 9)
  puntos_muestreo: [puntoMuestreoFrutalSchema],

  // Plagas y enfermedades
  plagas_enfermedades: [plagaEnfermedadFrutalSchema],
  otras_plagas_observadas: { type: String, trim: true }
}, { _id: true });

// Subdocumento: Nutriente individual (para Flores)
const nutrienteSchema = new Schema({
  nombre: { type: String, trim: true },
  cantidad: { type: Number },
  valor: { type: Number }
}, { _id: false });

// ============================================
// PASO 4: MANEJO DE CULTIVO (FLORES) - SCHEMAS
// ============================================

// Subdocumento: Especie predominante floral (Paso 4)
const especiePredomianteFloralSchema = new Schema({
  especie: { type: String, trim: true },
  orden: { type: Number } // 1, 2, 3, 4
}, { _id: false });

// Subdocumento: Punto de muestreo individual (Flores - Paso 4)
const puntoMuestreoFloralSchema = new Schema({
  coordenada_gps: { type: String, trim: true },
  pendiente_porcentaje: { type: Number, min: 0, max: 100 },
  aspecto_pendiente: {
    type: String,
    enum: ['N', 'S', 'E', 'O', 'NE', 'NO', 'SE', 'SO']
  },

  // VESS (Visual Evaluation of Soil Structure)
  vess_colchon_pasto: { type: Number, enum: [1, 2, 3] },
  vess_suelo: { type: Number, enum: [1, 2, 3, 4, 5] },

  // Características del suelo
  textura_predominante: {
    type: String,
    enum: ['Arenosa', 'Franca', 'Arcillosa']
  },
  color_predominante: {
    type: String,
    enum: ['Oscuro', 'Claro', 'Rojizo']
  },
  olor_predominante: {
    type: String,
    enum: ['Orgánico', 'Áspero', 'Ácido', 'Neutro']
  },

  // Compactación
  penetrometro_200psi_cm: { type: Number, min: 0, max: 90 },
  nivel_compactacion: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  evidencia_compactacion_superficial: { type: Boolean },

  // Condiciones
  drenaje: {
    type: String,
    enum: ['Adecuado', 'Deficiente']
  },
  evidencia_erosion: { type: Boolean },

  // Salud de la cobertura/cultivo
  puntuacion_salud_cobertura: { type: Number, enum: [0, 1, 2, 3] },
  especies_no_deseadas_presentes: { type: Boolean },
  nivel_especies_no_deseadas: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  },
  sintomas_estres: [{
    type: String,
    enum: ['Sequía', 'Sobrepastoreo', 'Plagas', 'Ninguno']
  }],

  // Biodiversidad
  lombrices_rojas: { type: Number, default: 0 },
  lombrices_grises: { type: Number, default: 0 },
  lombrices_blancas: { type: Number, default: 0 },
  huevos_lombrices: { type: Number, default: 0 },
  tipos_diferentes_huevos: { type: Number, default: 0 },
  presencia_micelio_hongos: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },
  raices_activas_visibles: {
    type: String,
    enum: ['Abundante', 'Moderado', 'Poco', 'Ninguno']
  },

  // Conductividad eléctrica
  conductividad_electrica: { type: Number },

  // Fotos (placeholders - URLs cuando se implemente upload)
  foto_salud_cultivo: { type: String, trim: true },
  foto_perfil_suelo: { type: String, trim: true },

  // Observaciones
  observaciones_punto: { type: String, trim: true }
}, { _id: true });

// Subdocumento: Plaga/Enfermedad individual (Flores - Paso 4)
const plagaEnfermedadFloralSchema = new Schema({
  nombre: { type: String, trim: true },
  nivel_dano: {
    type: String,
    enum: ['sin_dano', 'leve', 'moderado', 'grave']
  }
}, { _id: false });

// Subdocumento: Bloque evaluado (Flores - Paso 4)
const bloqueEvaluadoFloralSchema = new Schema({
  // Datos básicos
  nombre_bloque: { type: String, trim: true },

  // Información del bloque
  area_bloque_m2: { type: Number },
  coordenadas_gps_centro: { type: String, trim: true },
  topografia_general: {
    type: String,
    enum: ['Plano', 'Inclinación leve', 'Inclinación fuerte']
  },

  // Puntos de muestreo (array dinámico, máximo 9)
  puntos_muestreo: [puntoMuestreoFloralSchema],

  // Plagas y enfermedades
  plagas_enfermedades: [plagaEnfermedadFloralSchema],
  otras_plagas_observadas: { type: String, trim: true }
}, { _id: true });

// Subdocumento: Bloque floral individual (para Paso 2 de Flores)
const bloqueFloralSchema = new Schema({
  nombre_bloque: { type: String, trim: true },

  // Producción
  tallos_cosechados: { type: Number },
  porcentaje_exportacion: { type: Number }, // % Calidad Extra
  tiempo_ciclo_cosecha: { type: Number }, // Meses
  tasa_descarte: { type: Number }, // % Rechazo en poscosecha

  // Nutrientes y costos
  nutrientes: [nutrienteSchema], // Array de nutrientes/fertilizantes
  precio_venta_kg: { type: Number },

  // Indicadores económicos del bloque
  costo_por_tallo: { type: Number },
  ingreso_neto_m2: { type: Number },
  porcentaje_costos_variables: { type: Number },
  productividad_mano_obra: { type: Number } // Tallos/jornal
}, { _id: true });

// Subdocumentos para otros tipos (definir después)
const datosFloresSchema = new Schema({
  // Paso 2: Sistema Productivo Flores
  sistema_productivo: {
    cuantos_bloques_productivos: { type: Number, default: 0 },
    bloques: [bloqueFloralSchema]  // Array de bloques florales dinámicos
  },

  // Paso 3: Fertilización y Fumigación
  fertilizacion_fumigacion: {
    general: {
      // Fertilización química
      usa_fertilizacion_quimica: { type: Boolean },
      costo_ultimo_ano_fertilizacion: { type: Number },
      costo_fertilizacion_es_aproximado: { type: Boolean },
      productos_quimicos: [productoQuimicoSchema],

      // Abono orgánico
      usa_abono_organico: { type: Boolean },
      tipo_abono_organico: { type: String, enum: ['CASERO', 'COMERCIAL'] },
      costo_abono_organico: { type: Number },
      unidad_costo_abono: { type: String, enum: ['bulto', 'kg'] },

      // Fertilización foliar
      usa_fertilizante_foliar: { type: Boolean },
      tipos_aplicacion: [{ type: String }],

      // Fumigación
      usa_fumigacion: { type: Boolean },
      sistemas_fumigacion: [{ type: String }],
      otro_sistema_fumigacion: { type: String, trim: true },
      costo_anual_venenos: { type: Number },
      costo_venenos_es_aproximado: { type: Boolean },

      // Productos de fumigación
      insecticidas: [insecticidaSchema],
      fungicida: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },
      coadyuvante: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },

      // Rotación
      tiene_plan_rotacion: { type: Boolean },
      rotacion_dias: { type: Number }
    },

    // Manejo diferencial opcional
    tiene_manejo_diferencial: { type: Boolean },
    cuantos_lotes_diferenciados: { type: Number, default: 0 },
    lotes_diferenciados: [loteDiferenciadoSchema]
  },

  // Paso 4: Manejo de Cultivo (Flores)
  manejo_cultivo: {
    // Sección A: Información General (opcional, nivel finca)
    general: {
      metodo_plateo: [{ type: String }], // Múltiple: Guadaña, Manual, Herbicida, No se hace
      deshierbe: [{ type: String }], // Múltiple: Guadaña, Manual, Herbicida, No se hace
      frecuencia_plateo: {
        type: String,
        enum: ['Mensual', 'Bimestral', 'Trimestral', 'Dos veces al año']
      },
      especies_predominantes: [especiePredomianteFloralSchema], // Máximo 4
      plantas_resembradas: { type: Number },
      tipo_podas: [{ type: String }], // Múltiple: SANITARIA, FORMACION, PRODUCCION
      ultimas_podas_realizadas: { type: String, trim: true },
      cantidad_fertilizante_sintetico_por_cama: { type: Number },
      usa_abono_organico: { type: Boolean },
      tipos_abono_organico: { type: String, trim: true },
      cantidad_abono_organico_por_cama: { type: Number }
    },

    // Sección B: Bloques Evaluados
    cuantos_bloques_evaluados: { type: Number, default: 0 },
    bloques_evaluados: [bloqueEvaluadoFloralSchema]
  },

  // Paso 5-10: (definir según necesidad)
  manejo_sanitario: Schema.Types.Mixed,
  fertilizacion: Schema.Types.Mixed, // DEPRECATED - Se movió a fertilizacion_fumigacion en Paso 3
  cosecha_poscosecha: Schema.Types.Mixed
});

const datosFrutalesSchema = new Schema({
  // Paso 2: Sistema Productivo Frutales
  sistema_productivo: {
    cuantos_lotes_productivos: { type: Number, default: 0 },
    lotes: [loteFrutalSchema]  // Array de lotes frutales dinámicos
  },

  // Paso 3: Fertilización y Fumigación
  fertilizacion_fumigacion: {
    general: {
      // Fertilización química
      usa_fertilizacion_quimica: { type: Boolean },
      costo_ultimo_ano_fertilizacion: { type: Number },
      costo_fertilizacion_es_aproximado: { type: Boolean },
      productos_quimicos: [productoQuimicoSchema],

      // Abono orgánico
      usa_abono_organico: { type: Boolean },
      tipo_abono_organico: { type: String, enum: ['CASERO', 'COMERCIAL'] },
      costo_abono_organico: { type: Number },
      unidad_costo_abono: { type: String, enum: ['bulto', 'kg'] },

      // Fertilización foliar
      usa_fertilizante_foliar: { type: Boolean },
      tipos_aplicacion: [{ type: String }],

      // Fumigación
      usa_fumigacion: { type: Boolean },
      sistemas_fumigacion: [{ type: String }],
      otro_sistema_fumigacion: { type: String, trim: true },
      costo_anual_venenos: { type: Number },
      costo_venenos_es_aproximado: { type: Boolean },

      // Productos de fumigación
      insecticidas: [insecticidaSchema],
      fungicida: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },
      coadyuvante: {
        nombre_comercial: { type: String, trim: true },
        ingrediente_activo: { type: String, trim: true },
        dosis: { type: Number }
      },

      // Rotación
      tiene_plan_rotacion: { type: Boolean },
      rotacion_dias: { type: Number }
    },

    // Manejo diferencial opcional
    tiene_manejo_diferencial: { type: Boolean },
    cuantos_lotes_diferenciados: { type: Number, default: 0 },
    lotes_diferenciados: [loteDiferenciadoSchema]
  },

  // Paso 4: Manejo de Cultivo (Frutales)
  manejo_cultivo: {
    // Sección A: Información General (opcional, nivel finca)
    general: {
      metodo_plateo: [{ type: String }], // Múltiple: Guadaña, Manual, Herbicida, No se hace
      deshierbe: [{ type: String }], // Múltiple: Guadaña, Manual, Herbicida, No se hace
      frecuencia_plateo: {
        type: String,
        enum: ['Mensual', 'Bimestral', 'Trimestral', 'Dos veces al año']
      },
      especies_predominantes: [especiePredomianteFrutalSchema], // Máximo 4
      arboles_resembrados: { type: Number },
      tipo_podas: [{ type: String }], // Múltiple: SANITARIA, FORMACION, PRODUCCION
      ultimas_podas_realizadas: { type: String, trim: true },
      cantidad_fertilizante_sintetico_por_arbol: { type: Number }, // gramos
      usa_abono_organico: { type: Boolean },
      tipos_abono_organico: { type: String, trim: true },
      cantidad_abono_organico_por_arbol: { type: Number } // gramos
    },

    // Sección B: Lotes Evaluados
    cuantos_lotes_evaluados: { type: Number, default: 0 },
    lotes_evaluados: [loteEvaluadoFrutalSchema]
  },

  // Paso 5-10: (definir según necesidad)
  manejo_sanitario: Schema.Types.Mixed,
  fertilizacion: Schema.Types.Mixed, // DEPRECATED - Se movió a fertilizacion_fumigacion en Paso 3
  cosecha_poscosecha: Schema.Types.Mixed
});

const datosCafeSchema = new Schema({
  datos: Schema.Types.Mixed
});

const datosAguacateSchema = new Schema({
  datos: Schema.Types.Mixed
});

// PASO 5: INDICADORES P4G (Común para todos los tipos de finca)
const indicadoresP4GSchema = new Schema({
  // Sección A: Resiliencia Percibida (escala 1-5)
  resiliencia_percibida: {
    preparacion_cambios_climaticos: {
      type: Number,
      min: 1,
      max: 5
    },
    conocimientos_manejo_sostenible: {
      type: Number,
      min: 1,
      max: 5
    },
    capacidad_recuperacion_clima_extremo: {
      type: Number,
      min: 1,
      max: 5
    },
    estabilidad_economica_inversion: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // Sección B: Impacto Social y de Género
  impacto_social_genero: {
    quien_toma_decisiones: {
      type: String,
      enum: ['Solo hombres', 'Solo mujeres', 'Conjunto hombre-mujer', 'Otros']
    },

    // Beneficiarios directos SaBio
    hombres_beneficiarios_directos_sabio: {
      type: Number,
      min: 0,
      default: 0
    },
    hombres_trabajadores_empresa: {
      type: Number,
      min: 0,
      default: 0
    },
    mujeres_beneficiarias_directas_sabio: {
      type: Number,
      min: 0,
      default: 0
    },
    mujeres_trabajadoras_empresa: {
      type: Number,
      min: 0,
      default: 0
    },

    // Beneficiarios indirectos
    hombres_beneficiarios_indirectos: {
      type: Number,
      min: 0,
      default: 0
    },
    mujeres_beneficiarias_indirectas: {
      type: Number,
      min: 0,
      default: 0
    },

    // Generación de nuevos empleos
    genera_nuevos_empleos: {
      type: Boolean,
      default: false
    },
    empleos_masculinos_nuevos: {
      type: Number,
      min: 0
    },
    empleos_femeninos_nuevos: {
      type: Number,
      min: 0
    },
    tipo_empleos_nuevos: {
      type: String,
      trim: true
    },

    // NPS - Net Promoter Score
    probabilidad_recomendar_sabio: {
      type: Number,
      min: 0,
      max: 10
    },
    razon_calificacion: {
      type: String,
      trim: true
    }
  }
}, { _id: false });

// PASO 6: SOSTENIBILIDAD Y DISPOSICIÓN AL CAMBIO (Común para todos los tipos de finca)
const sostenibilidadSchema = new Schema({
  // Conocimiento de prácticas regenerativas
  conoce_practicas_regenerativas: {
    type: Boolean
  },
  cuales_practicas_regenerativas: {
    type: String,
    trim: true
  },

  // Participación en proyectos sostenibles
  ha_participado_proyectos_sostenibles: {
    type: Boolean
  },
  cuales_proyectos_sostenibles: {
    type: String,
    trim: true
  },

  // Interés en innovaciones
  interes_innovaciones: {
    type: String,
    enum: ['Sí', 'No', 'Parcial']
  },

  // Consulta experiencias de otras fincas
  pregunta_experiencias_otras_fincas: {
    type: Boolean
  },

  // Asistencia técnica
  cuenta_asistencia_tecnica: {
    type: Boolean
  },
  proveedor_asistencia: {
    type: String,
    trim: true
  },

  // Metas/visión para la finca
  metas_vision_finca: {
    type: String,
    enum: ['Ninguna definida', 'Productividad', 'Regeneración', 'Sucesión familiar']
  },

  // Actitud hacia microbiología del suelo
  actitud_microbiologia_suelo: {
    type: String,
    enum: ['Abierto', 'Escéptico', 'Entusiasta']
  },

  // Nivel de tecnificación
  nivel_tecnificacion: {
    type: String,
    enum: ['Bajo', 'Medio', 'Alto']
  }
}, { _id: false });

// PASO 7: BIOFÁBRICA DEL CLIENTE (Común para todos los tipos de finca)
const biofabricaSchema = new Schema({
  // Sección 1: Experiencia Previa y Dificultades
  experiencia_previa: {
    tiene_experiencia: {
      type: Boolean
    },
    resultado_anterior: {
      type: String,
      enum: ['Bien', 'Mal']
    },
    dificultades_encontradas: [{
      type: String,
      enum: ['Tiempo', 'Costo', 'Insumos', 'Claridad', 'Disciplina', 'Ver resultados']
    }]
  },

  // Sección 2: Procesos y Prácticas Actuales
  procesos_actuales: {
    tiene_biofabrica_compostadero: {
      type: Boolean,
      default: false
    },
    tiene_lombricultivo: {
      type: Boolean,
      default: false
    },
    tiene_fermentos: {
      type: Boolean,
      default: false
    },
    tiene_bokashi: {
      type: Boolean,
      default: false
    },
    tiene_compostaje: {
      type: Boolean,
      default: false
    },
    tiene_cultivos_microbios: {
      type: Boolean,
      default: false
    },
    ha_invertido_infraestructura: {
      type: Boolean,
      default: false
    }
  },

  // Sección 3: Observaciones y Evidencia
  observaciones: {
    detalle_proceso_observado: {
      type: String,
      trim: true
    },
    nivel_organizacion_tecnificacion: {
      type: String,
      enum: ['Artesanal', 'Básico', 'Organizado', 'Tecnificado']
    },
    nivel_registro: {
      type: String,
      enum: ['No hay', 'Poco en papel', 'Se monitorea constante', 'Digital']
    },
    potencial_escalabilidad: {
      type: String,
      enum: ['Bajo', 'Medio', 'Alto']
    },
    puntos_criticos: [{
      type: String,
      enum: ['Calidad de agua', 'Tiempo de proceso', 'Calidad de insumos', 'Otros']
    }],
    foto_evidencia: {
      type: String  // Base64 o URL
    },
    video_evidencia: {
      type: String  // URL
    }
  }
}, { _id: false });

// PASO 8: OBSERVACIONES Y SEGUIMIENTO (Común para todos los tipos de finca)
const medidaControlSchema = new Schema({
  descripcion: {
    type: String,
    trim: true
  }
}, { _id: true });

const recomendacionSchema = new Schema({
  descripcion: {
    type: String,
    trim: true
  }
}, { _id: true });

const observacionesSeguimientoSchema = new Schema({
  // Observaciones técnicas
  observaciones_tecnicas_visita: {
    type: String,
    trim: true
  },
  sintomas_visibles_adicionales: {
    type: String,
    trim: true
  },

  // Medidas de control (array dinámico)
  medidas_control: [medidaControlSchema],

  // Recomendaciones (array dinámico)
  recomendaciones: [recomendacionSchema],

  // Próxima visita
  proxima_visita_programada: {
    type: Date
  },

  // Muestras enviadas a laboratorio (dinámicas según lotes)
  muestras_suelo_lotes: [{
    nombre_lote: { type: String, trim: true },
    seleccionado: { type: Boolean, default: false }
  }],
  muestra_forraje: {
    type: Boolean,
    default: false
  },
  muestra_agua: {
    type: Boolean,
    default: false
  },

  // Información de muestras
  codigo_muestras: {
    type: String,
    trim: true
  },
  analisis_requeridos: {
    type: String,
    trim: true
  },

  // Fotografías y archivos
  fotografias_tomadas_descripcion: {
    type: String,
    trim: true
  },
  links_archivos: {
    type: String,
    trim: true
  },

  // Observaciones del productor
  observaciones_productor: {
    type: String,
    trim: true
  }
}, { _id: false });

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
  datos_aguacate: datosAguacateSchema,

  // PASO 5: Indicadores P4G (común para todos los tipos)
  indicadores_p4g: indicadoresP4GSchema,

  // PASO 6: Sostenibilidad y Disposición al Cambio (común para todos los tipos)
  sostenibilidad: sostenibilidadSchema,

  // PASO 7: Biofábrica del Cliente (común para todos los tipos)
  biofabrica: biofabricaSchema,

  // PASO 8: Observaciones y Seguimiento (común para todos los tipos)
  observaciones_seguimiento: observacionesSeguimientoSchema

}, {
  timestamps: true
});

const Diagnostico = model('Diagnostico', diagnosticoSchema);
export default Diagnostico;
