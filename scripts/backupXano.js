import mongoose from 'mongoose';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// --- CONFIGURACIÓN ---
// 1. URL DE  GRUPO "Backup_Sabio"
const XANO_API_URL = 'https://xt8q-qmk0-svdn.n7.xano.io/api:BxqgdNgI'; 

// 2. TABLAS 
const TABLAS_A_RESPALDAR = [
  'empresas',
  'fincas',
  'corporativos',
  'planes_corporativos',
  'corp_users' 
];

const MONGO_LOCAL_URI = 'mongodb://localhost:27017/sabio_backup_xano';

const runBackup = async () => {
  try {
    console.log('🔌 Conectando a MongoDB Local...');
    await mongoose.connect(MONGO_LOCAL_URI);
    console.log('✅ Conectado.\n');

    for (const tabla of TABLAS_A_RESPALDAR) {
      console.log(`Descargando: ${XANO_API_URL}/${tabla}...`);

      try {
        const response = await axios.get(`${XANO_API_URL}/${tabla}`);
        let datos = response.data;

        // Xano CRUD por defecto devuelve array directo, pero por si acaso:
        if (datos && !Array.isArray(datos) && datos.items) datos = datos.items;

        if (!Array.isArray(datos)) {
          console.log(`   ⚠️ ALERTA: Estructura rara recibida: ${typeof datos}`);
          continue;
        }

        if (datos.length === 0) {
            console.log('   ⚠️ La tabla está vacía.');
            continue;
        }

        const collectionName = `xano_${tabla}`;
        if (mongoose.models[collectionName]) delete mongoose.models[collectionName];
        
        const Schema = new mongoose.Schema({}, { strict: false, collection: collectionName });
        const Model = mongoose.model(collectionName, Schema);

        await Model.deleteMany({});
        await Model.insertMany(datos);
        console.log(`   ✅ ÉXITO: ${datos.length} registros guardados en '${collectionName}'`);

      } catch (error) {
        console.error(`   ❌ ERROR: ${error.message}`);
        if(error.response && error.response.status === 404) {
            console.error('      (El nombre de la tabla sigue mal o no creaste el endpoint en el grupo nuevo)');
        }
      }
    }

    console.log('\n🏁 PROCESO TERMINADO');
    process.exit(0);

  } catch (error) {
    console.error('Fatal:', error);
    process.exit(1);
  }
};

runBackup();