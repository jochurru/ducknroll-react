import express from 'express';
import { checkAdminStatus } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta protegida por token que verifica el estado de administrador de un usuario
router.get('/check-admin', requireAuth, checkAdminStatus);

export default router;
