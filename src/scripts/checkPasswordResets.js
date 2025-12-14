// Script para verificar los registros de recuperación de contraseña
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import PasswordReset from '../models/passwordReset.model.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkPasswordResets() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB\n');

    // Obtener todos los registros de password reset
    const resets = await PasswordReset.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`📊 Últimos ${resets.length} registros de recuperación:\n`);

    resets.forEach((reset, index) => {
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`Registro #${index + 1}`);
      console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`👤 Usuario: ${reset.user?.name || 'N/A'}`);
      console.log(`📧 Email: ${reset.email}`);
      console.log(`🔑 OTP Hash: ${reset.otp.substring(0, 30)}...`);
      console.log(`⏰ Creado: ${reset.createdAt.toLocaleString('es-CO')}`);
      console.log(`⌛ Expira: ${reset.expiresAt.toLocaleString('es-CO')}`);
      console.log(`🔄 Intentos: ${reset.attempts}/3`);
      console.log(`${reset.used ? '✅' : '❌'} Usado: ${reset.used ? 'SÍ' : 'NO'}`);
      console.log(`${reset.isExpired() ? '⏰' : '✅'} Estado: ${reset.isExpired() ? 'EXPIRADO' : 'VIGENTE'}`);
      console.log(`🌐 IP: ${reset.ipAddress || 'N/A'}\n`);
    });

    if (resets.length === 0) {
      console.log('No hay registros de recuperación de contraseña aún.');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Conexión cerrada');
  }
}

checkPasswordResets();
