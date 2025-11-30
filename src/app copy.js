import express from 'express';
import cors from 'cors';
import routesV1 from './routes/index.routes.js';

import swaggerUi from 'swagger-ui-express';
import { swaggerSpecs } from './config/swagger.js';

// Inicializamos la aplicación de Express
const app = express();

// --- Middlewares Esenciales ---

// 1. CORS: Permite que nuestro frontend se conecte a este backend
app.use(cors()); 

// 2. express.json: Permite que el servidor entienda peticiones con body en formato JSON
app.use(express.json()); 

// --- Rutas ---
// Por ahora, una ruta de prueba para saber que el servidor funciona
/* app.get('/api', (req, res) => {
  res.json({ message: '¡Bienvenido a la API de SaBio!' });
}); */

// RUTA PARA LA DOCUMENTACIÓN!
// Esta ruta debe ir ANTES de tus rutas de la API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Rutas de la API v1
app.use('/api/v1', routesV1);

export default app;