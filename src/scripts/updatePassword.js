// Script para actualizar contraseña de usuario existente
import mongoose from 'mongoose';
import User from '../models/user.model.js';
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

    // Buscar el usuario
    const user = await User.findOne({ email: userEmail.toLowerCase() });

    if (!user) {
      console.log('❌ Usuario no encontrado');
      process.exit(1);
    }

    console.log('📧 Usuario encontrado:', user.email);

    // Actualizar la contraseña (el hook pre-save se encargará de encriptarla)
    user.password = newPassword;
    await user.save();

    console.log('✅ Contraseña actualizada correctamente');
    console.log('🔐 La contraseña ahora está encriptada con bcrypt');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

updatePassword();
