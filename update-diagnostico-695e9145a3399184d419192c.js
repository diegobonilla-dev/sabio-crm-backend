/**
 * Script para actualizar el diagnóstico incompleto
 * ID: 695e9145a3399184d419192c
 *
 * Ejecutar con:
 * node update-diagnostico-695e9145a3399184d419192c.js
 */

import mongoose from 'mongoose';
import Diagnostico from './src/models/diagnostico.model.js';

const DIAGNOSTICO_ID = '695e9145a3399184d419192c';

// Configuración de MongoDB
const MONGO_URI = 'mongodb+srv://diego_bonilla:URnoUR5peiQG6OJI@sabiocrm.ic0rhlo.mongodb.net/sabioDB?retryWrites=true&w=majority';

async function updateDiagnostico() {
  try {
    // Conectar a MongoDB
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // Buscar el diagnóstico
    const diagnostico = await Diagnostico.findById(DIAGNOSTICO_ID);

    if (!diagnostico) {
      console.error('❌ Diagnóstico no encontrado');
      process.exit(1);
    }

    console.log('📄 Diagnóstico encontrado:', diagnostico._id);
    console.log('📊 Estado actual:', diagnostico.estado);

    // Actualizar con los campos faltantes
    diagnostico.estado = 'Completado';

    diagnostico.indicadores_p4g = {
      resiliencia_percibida: {
        conocimientos_manejo_sostenible: 4,
        preparacion_cambios_climaticos: 4,
        capacidad_recuperacion_clima_extremo: 4,
        estabilidad_economica_inversion: 4
      },
      impacto_social_genero: {
        genera_nuevos_empleos: true,
        hombres_beneficiarios_directos_sabio: 2,
        mujeres_beneficiarias_directas_sabio: 2,
        hombres_trabajadores_empresa: 2,
        mujeres_trabajadoras_empresa: 2,
        hombres_beneficiarios_indirectos: 2,
        mujeres_beneficiarias_indirectas: 2,
        razon_calificacion: 'me gusta sabio',
        quien_toma_decisiones: 'Conjunto hombre-mujer',
        empleos_masculinos_nuevos: 1,
        empleos_femeninos_nuevos: 1,
        tipo_empleos_nuevos: 'operarios'
      }
    };

    diagnostico.sostenibilidad = {
      conoce_practicas_regenerativas: true,
      cuales_practicas_regenerativas: 'compost',
      ha_participado_proyectos_sostenibles: true,
      cuales_proyectos_sostenibles: 'certificacioncita',
      interes_innovaciones: 'Parcial',
      pregunta_experiencias_otras_fincas: false,
      cuenta_asistencia_tecnica: true,
      proveedor_asistencia: 'ICA',
      metas_vision_finca: 'Productividad',
      actitud_microbiologia_suelo: 'Abierto',
      nivel_tecnificacion: 'Medio'
    };

    diagnostico.biofabrica = {
      experiencia_previa: {
        dificultades_encontradas: [],
        tiene_experiencia: false
      },
      procesos_actuales: {
        tiene_lombricultivo: true,
        ha_invertido_infraestructura: true
      },
      observaciones: {
        puntos_criticos: ['Tiempo de proceso'],
        detalle_proceso_observado: 'me gusta la finca',
        video_evidencia: '',
        nivel_organizacion_tecnificacion: 'Básico',
        nivel_registro: 'Poco en papel',
        potencial_escalabilidad: 'Medio',
        foto_evidencia: 'http://localhost:3002/uploads/diagnosticos/2026/01/1767805253221-Fo_J-V.webp'
      }
    };

    diagnostico.observaciones_seguimiento = {
      medidas_control: [
        {
          descripcion: 'medida 1 colocada'
        }
      ],
      recomendaciones: [
        {
          descripcion: 'recomendacion 1 colocada'
        }
      ],
      muestras_suelo_lotes: [
        {
          nombre_lote: 'Lote 1',
          seleccionado: true
        }
      ],
      observaciones_tecnicas_visita: 'observaciones durante la visita',
      sintomas_visibles_adicionales: 'ningun sintoma',
      proxima_visita_programada: new Date('2026-02-07'),
      codigo_muestras: '',
      analisis_requeridos: '',
      fotografias_tomadas_descripcion: 'descripcion de las fotografias',
      links_archivos: 'no hay links',
      observaciones_productor: 'las observaciones del productor',
      muestra_forraje: true
    };

    diagnostico.validacion_cierre = {
      firma_tecnico: {
        nombre_completo: 'el tecnico',
        cedula: '12345',
        firma_digital: 'data:image/png;base64,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'
      },
      firma_productor: {
        nombre_completo: 'el usuario',
        cedula: '67890',
        firma_digital: 'data:image/png;base64,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'
      },
      resumen: {
        diagnosticos_completos: 1,
        muestras_enviadas: 2
      },
      fecha_finalizacion: new Date('2026-01-07'),
      hora_finalizacion: '11:55',
      revision_visita: 'mi dia estuvo genial',
      acepta_terminos: true
    };

    // Guardar cambios
    console.log('💾 Guardando cambios...');
    await diagnostico.save();

    console.log('✅ Diagnóstico actualizado exitosamente!');
    console.log('📊 Estado nuevo:', diagnostico.estado);
    console.log('✅ indicadores_p4g:', !!diagnostico.indicadores_p4g);
    console.log('✅ sostenibilidad:', !!diagnostico.sostenibilidad);
    console.log('✅ biofabrica:', !!diagnostico.biofabrica);
    console.log('✅ observaciones_seguimiento:', !!diagnostico.observaciones_seguimiento);
    console.log('✅ validacion_cierre:', !!diagnostico.validacion_cierre);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Ejecutar
updateDiagnostico();
