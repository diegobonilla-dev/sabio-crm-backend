//src/config/database.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI no está definida en el archivo .env');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`🚀 MongoDB Conectado: ${conn.connection.host}`);
    
  } catch (error) {
    console.error(`Error de conexión: ${error.message}`);
    // Salimos del proceso si no nos podemos conectar
    process.exit(1); 
  }
};

export default connectDB;