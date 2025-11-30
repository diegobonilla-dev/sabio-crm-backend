// Script para actualizar contraseña MANUALMENTE con bcrypt
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

async function updatePassword() {
  try {
    // Conectar a la base de datos
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    // CAMBIA ESTOS VALORES:
    const userEmail = 'diego.bonilla@sabio.com.co'; // 👈 Email del usuario
    const newPassword = '2024CoreI9#';   // 👈 Nueva contraseña

    // ENCRIPTAR MANUALMENTE la contraseña
    console.log('🔐 Encriptando contraseña...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    console.log('📝 Hash generado:', hashedPassword.substring(0, 20) + '...');

    // Actualizar DIRECTAMENTE en la base de datos sin usar el modelo
    const result = await mongoose.connection.db.collection('users').updateOne(
      { email: userEmail.toLowerCase() },
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      console.log('❌ Usuario no encontrado');
    } else if (result.modifiedCount === 0) {
      console.log('⚠️ Usuario encontrado pero no se modificó (quizás ya tenía ese hash)');
    } else {
      console.log('✅ Contraseña actualizada correctamente en la BD');
    }

    // Verificar que se guardó correctamente
    const user = await mongoose.connection.db.collection('users').findOne(
      { email: userEmail.toLowerCase() }
    );

    console.log('\n📋 Verificación:');
    console.log('Email:', user.email);
    console.log('Password en BD:', user.password.substring(0, 30) + '...');
    console.log('¿Empieza con $2a$ o $2b$?', user.password.startsWith('$2'));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Conexión cerrada');
  }
}

updatePassword();
