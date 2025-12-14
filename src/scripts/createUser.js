// Script para crear un nuevo usuario
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // DATOS DEL NUEVO USUARIO:
    const userData = {
      name: 'Diego Bonilla',
      email: 'diego.bonilla@udea.edu.co',
      password: '1234567', // Se encriptará automáticamente
      role: 'sabio_admin' // Cambia según el rol que necesites
    };

    console.log('\n📋 Datos del usuario a crear:');
    console.log('👤 Nombre:', userData.name);
    console.log('📧 Email:', userData.email);
    console.log('🔑 Role:', userData.role);
    console.log('🔐 Password:', '****** (oculto por seguridad)');

    // Eliminar usuario existente si existe
    const deleted = await User.deleteOne({ email: userData.email.toLowerCase() });
    if (deleted.deletedCount > 0) {
      console.log('\n🗑️ Usuario anterior eliminado');
    } else {
      console.log('\n⚠️ No había usuario anterior con ese email');
    }

    // Crear nuevo usuario
    const user = await User.create(userData);

    console.log('\n✅ Usuario creado exitosamente:');
    console.log('📧 Email:', user.email);
    console.log('👤 Nombre:', user.name);
    console.log('🔑 Role:', user.role);
    console.log('🆔 ID:', user._id);

    // Verificar que la contraseña se encriptó
    const userFromDB = await User.findById(user._id).select('+password');
    const isEncrypted = userFromDB.password.startsWith('$2');

    console.log('\n🔐 Verificación de encriptación:');
    console.log('Hash en BD:', userFromDB.password.substring(0, 30) + '...');
    console.log('¿Encriptada correctamente?', isEncrypted ? '✅ SÍ' : '❌ NO');

    if (!isEncrypted) {
      console.log('\n⚠️ ADVERTENCIA: La contraseña NO se encriptó correctamente');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('💡 El email ya existe. El usuario no fue eliminado correctamente.');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

createUser();
