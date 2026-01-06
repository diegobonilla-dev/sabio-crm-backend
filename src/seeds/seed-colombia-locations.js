/**
 * Script para poblar la base de datos con departamentos y municipios de Colombia
 * Fuente: DANE (Departamento Administrativo Nacional de Estadística)
 * Última actualización: 2023
 *
 * Uso:
 *   node src/seeds/seed-colombia-locations.js
 *
 * Estructura:
 *   - 33 divisiones administrativas (32 departamentos + Bogotá D.C.)
 *   - 1,123 municipios en total
 *   - Antioquia: 125 municipios (el departamento con más municipios)
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import Ubicacion from '../models/ubicacion.model.js';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
dotenv.config({ path: join(__dirname, '../../.env') });

// Importar datos
const dataPath = join(__dirname, '../data/colombia_departamentos_municipios.json');
const colombiaData = JSON.parse(readFileSync(dataPath, 'utf8'));

async function seedLocations() {
  try {
    console.log('🌎 Iniciando proceso de siembra de datos geográficos de Colombia...\n');

    // Conectar a MongoDB
    console.log('📡 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conexión establecida\n');

    // Verificar si ya existen datos
    const existingCount = await Ubicacion.countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  Ya existen ${existingCount} registros en la colección "ubicaciones".`);
      console.log('🗑️  Eliminando datos anteriores...');
      await Ubicacion.deleteMany({});
      console.log('✅ Datos eliminados\n');
    }

    // Insertar datos usando el modelo Mongoose
    console.log('📥 Insertando datos...');
    const result = await Ubicacion.insertMany(colombiaData);
    console.log(`✅ ${result.length} departamentos insertados exitosamente\n`);

    // Mostrar estadísticas
    console.log('📊 ESTADÍSTICAS:');
    console.log('================');
    const totalDepartamentos = await Ubicacion.countDocuments();
    console.log(`Total de departamentos: ${totalDepartamentos}`);

    const totalMunicipios = colombiaData.reduce((sum, dept) => sum + dept.municipios.length, 0);
    console.log(`Total de municipios: ${totalMunicipios}`);

    const antioquia = await Ubicacion.findOne({ departamento: 'ANTIOQUIA' });
    console.log(`Municipios en Antioquia: ${antioquia.municipios.length}`);

    console.log('\n✨ Proceso completado exitosamente!');

    // Cerrar conexión
    await mongoose.connection.close();
    console.log('👋 Conexión cerrada');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el proceso de siembra:', error);
    process.exit(1);
  }
}

// Ejecutar
seedLocations();
