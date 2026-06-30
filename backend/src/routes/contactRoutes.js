import express from 'express';
import { enviarContacto } from '../controllers/contactController.js';

const router = express.Router();

// POST /api/contacto - Enviar formulario de contacto (pública, sin autenticación)
router.post('/', enviarContacto);

export default router;
