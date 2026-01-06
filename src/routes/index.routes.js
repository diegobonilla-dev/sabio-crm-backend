//src/routes/index.routes.js
import { Router } from 'express';
import userRoutes from './user.routes.js';
import leadRoutes from './lead.routes.js';
import authRoutes from './auth.routes.js';
import fincaRoutes from './finca.routes.js'
import empresaRoutes from './empresa.routes.js';
import compostRoutes from './compost.routes.js';
import laboratorioRoutes from './laboratorio.routes.js';
import operacionesRoutes from './operaciones.routes.js';
import visitaRoutes from './visita.routes.js'
import corporativoRoutes from './corporativo.routes.js';
import diagnosticoRoutes from './diagnostico.routes.js';
import imageRoutes from './image.routes.js';
import ubicacionRoutes from './ubicacion.routes.js';

const router = Router();

// Health check endpoint para Coolify/Docker
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'sabio-crm-backend'
  });
});

// Rutas de Autenticación (Login)
router.use('/auth', authRoutes);

// Rutas de Usuarios (CRUD)
// Cuando alguien vaya a "/users", usa las rutas de user.routes.js
router.use('/users', userRoutes);

// Rutas de Leads (CRM)
// Cuando alguien vaya a "/leads", usa las rutas de lead.routes.js
router.use('/leads', leadRoutes);
//corporativos
router.use('/corporativos', corporativoRoutes);
//empresas
router.use('/empresas', empresaRoutes);
//fincas
router.use('/fincas', fincaRoutes);
//Recetas
router.use('/compost', compostRoutes);
//muestras
router.use('/lab', laboratorioRoutes);
//operaciones
router.use('/operaciones', operacionesRoutes);
//visitas tecnicas
router.use('/visitas', visitaRoutes);
//diagnósticos
router.use('/diagnosticos', diagnosticoRoutes);
//imágenes
router.use('/images', imageRoutes);
//ubicaciones (departamentos y municipios de Colombia)
router.use('/ubicaciones', ubicacionRoutes);

export default router;