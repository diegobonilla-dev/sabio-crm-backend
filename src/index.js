//src/index.js
import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/database.js';

// Cargamos las variables de entorno del archivo .env
dotenv.config();

connectDB();

// Obtenemos el puerto de las variables de entorno o usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// Encendemos el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});