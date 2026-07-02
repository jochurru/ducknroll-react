import express from 'express';
import { createPreference, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// POST /api/payments/preferencia — Generar preferencia de pago
router.post('/preferencia', createPreference);

// POST /api/payments/webhook — Notificaciones de pago de Mercado Pago
router.post('/webhook', handleWebhook);

export default router;
