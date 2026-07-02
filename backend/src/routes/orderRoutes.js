import express from 'express';
import { enviarEmailOrden, obtenerOrdenPorId, obtenerOrdenesUsuario } from '../controllers/orderController.js';

const router = express.Router();

// POST /api/ordenes/email — Enviar email de confirmación de compra al cliente y al admin
router.post('/email', enviarEmailOrden);

// GET /api/ordenes/:id — Obtener orden por ID
router.get('/:id', obtenerOrdenPorId);

// GET /api/ordenes/usuario/:email — Obtener órdenes de un usuario por su email
router.get('/usuario/:email', obtenerOrdenesUsuario);

export default router;
