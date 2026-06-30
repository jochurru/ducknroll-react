import express from 'express';
import { enviarEmailOrden } from '../controllers/orderController.js';

const router = express.Router();

// POST /api/ordenes/email — Enviar email de confirmación de compra al cliente y al admin
router.post('/email', enviarEmailOrden);

export default router;
