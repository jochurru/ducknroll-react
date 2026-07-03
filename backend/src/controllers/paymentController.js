import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { db } from '../config/firebase.js';
import { registrarYEnviarEmailsPedido } from './orderController.js';
import { descontarInventarioFirestore } from './productsController.js';

// Inicializar el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'TEST-4144498305711728-070223-5e92db2142df35c754d9241ec27e28df-28444917' // Token sandbox de pruebas por defecto
});

/**
 * POST /api/payments/preferencia
 * Genera la preferencia de pago de Mercado Pago y devuelve los enlaces de redirección.
 */
export const createPreference = async (req, res) => {
  try {
    const { items, cliente, email, notes, orderId } = req.body;

    if (!items || !cliente || !email) {
      return res.status(400).json({ error: 'Datos incompletos para generar el pago.' });
    }

    const preference = new Preference(client);

    // Mapear los items del carrito para Mercado Pago
    const mpItems = items.map(item => ({
      id: item.id.toString(),
      title: `${item.nombre} (Talle: ${item.talleSeleccionado || item.talle || '-'})`,
      unit_price: Number(item.precio),
      quantity: Number(item.quantity),
      currency_id: 'ARS'
    }));

    // Generar Preference ID
    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: cliente.nombre,
          surname: cliente.apellido,
          email: 'comprador_prueba@test.com', // Email ficticio para evitar bucles de redirección con tu mail real de admin
          phone: {
            number: cliente.telefono
          },
          address: {
            street_name: cliente.direccion,
            zip_code: cliente.codigoPostal
          }
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/confirmacion?orderId=${orderId || `DK${Date.now()}`}`,
          failure: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/carrito`,
          pending: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/confirmacion?orderId=${orderId || `DK${Date.now()}`}`
        },
        auto_return: 'approved',
        metadata: {
          order_id: orderId || `DK${Date.now()}`,
          email,
          cliente,
          productos: items,
          notas: notes || ''
        },
        notification_url: `${process.env.BACKEND_URL || 'https://ducknroll-react.onrender.com'}/api/payments/webhook`
      }
    });

    res.status(200).json({
      id: response.id,
      init_point: response.init_point,
      sandbox_init_point: response.sandbox_init_point
    });
  } catch (error) {
    console.error('❌ Error al crear preferencia de Mercado Pago:', error);
    res.status(500).json({ error: 'No pudimos iniciar el proceso de pago.', details: error.message });
  }
};

/**
 * POST /api/payments/webhook
 * Recibe la notificación de pago en tiempo real y actualiza la base de datos Firestore.
 */
export const handleWebhook = async (req, res) => {
  try {
    const { query } = req;
    
    // Mercado Pago manda el ID del pago en 'id' o en 'data.id' según el tipo de notificación
    const topic = query.topic || query.type;
    const paymentId = query.id || query['data.id'] || (req.body && req.body.data && req.body.data.id);

    console.log(`🔔 Webhook de Mercado Pago recibido. Topic: ${topic}, ID: ${paymentId}`);

    // Solo procesamos notificaciones de pagos
    if (topic === 'payment' || req.body?.type === 'payment' || (req.body?.action && req.body.action.startsWith('payment.'))) {
      if (!paymentId) {
        return res.status(200).send('Webhook recibido sin ID de pago, se ignora.');
      }

      // Consultar el estado del pago a Mercado Pago
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      const status = paymentInfo.status;
      const orderId = paymentInfo.metadata?.order_id;
      
      console.log(`💳 Pago ${paymentId} de la orden #${orderId} está: ${status}`);

      if (status === 'approved') {
        const metadata = paymentInfo.metadata;
        
        if (metadata) {
          const email = metadata.email;
          const cliente = metadata.cliente;
          const productos = metadata.productos;
          const notas = metadata.notas;
          const total = paymentInfo.transaction_amount;

          // Verificar si la orden ya existe en Firestore y si ya está pagada
          const orderRef = db.collection('ordenes').doc(orderId);
          const orderDoc = await orderRef.get();
          
          if (orderDoc.exists && orderDoc.data().estado === 'pagado') {
            console.log(`⚠️ La orden #${orderId} ya está registrada como pagada. Ignorando duplicado.`);
            return res.status(200).send('OK (Duplicado)');
          }

          console.log(`✅ Registrando orden aprobada #${orderId} en base de datos...`);

          const orderData = {
            email,
            cliente,
            productos: productos.map(p => ({
              nombre: p.nombre,
              talle: p.talle || p.talleSeleccionado || '-',
              cantidad: p.cantidad || p.quantity,
              subtotal: p.subtotal || (Number(p.precio) * Number(p.quantity))
            })),
            total,
            notas,
            fecha: new Date().toISOString(),
            estado: 'pagado',
            paymentId
          };

          // 1. Guardar la orden y enviar emails (Nodemailer / Formspree fallback)
          const result = await registrarYEnviarEmailsPedido(orderData, orderId);
          
          if (result.success || result.orderSaved) {
            // 2. Descontar stock en Firestore de manera automatizada
            try {
              const itemsToDiscount = productos.map(p => ({
                id: p.id,
                talle: p.talleSeleccionado || p.talle || 'M',
                cantidad: p.quantity || p.cantidad
              }));
              await descontarInventarioFirestore(itemsToDiscount);
            } catch (stockError) {
              console.error('⚠️ Error al descontar stock desde webhook:', stockError);
            }
          }
        }
      }
    }

    // Responder 200 a Mercado Pago para confirmar recepción
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en el webhook de Mercado Pago:', error.message);
    res.status(500).json({ error: error.message });
  }
};
