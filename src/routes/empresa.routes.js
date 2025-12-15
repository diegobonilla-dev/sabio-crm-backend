import { Router } from 'express';
import { getEmpresas, getEmpresaById } from '../controllers/empresa.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(protect);

router.get('/', getEmpresas);
router.get('/:id', getEmpresaById);

export default router;
