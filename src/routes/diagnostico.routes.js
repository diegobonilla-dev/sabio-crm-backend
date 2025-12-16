import { Router } from 'express';
import {
  createDiagnostico,
  getDiagnosticos,
  getDiagnosticoById,
  updateDiagnostico,
  deleteDiagnostico
} from '../controllers/diagnostico.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(protect);

// CRUD básico
router.post('/', createDiagnostico);
router.get('/', getDiagnosticos);
router.get('/:id', getDiagnosticoById);
router.put('/:id', updateDiagnostico);
router.delete('/:id', deleteDiagnostico);

export default router;
