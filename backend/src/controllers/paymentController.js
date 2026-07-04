import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { db } from '../config/firebase.js';
import { registrarYEnviarEmailsPedido } from './orderController.js';
import { descontarInventarioFirestore } from './productsController.js';

// Inicializar el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || 'APP_USR-1475207540454939-070314-8ce92fc4e97b567a16607df22650a4da-3515192452' // Token sandbox por defecto
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

    // Mapear los items del carrito para Mercado Pago de forma robusta
    const mpItems = items.map(item => ({
      id: item.id.toString(),
      title: `${item.nombre} (Talle: ${item.talleSeleccionado || item.talle || '-'})`,
      unit_price: parseFloat(item.precio),
      quantity: parseInt(item.quantity || item.cantidad, 10),
      currency_id: 'ARS'
    }));

    const generatedOrderId = orderId || `DK${Date.now()}`;

    // Generar la preferencia en Mercado Pago
    const response = await preference.create({
      body: {
        items: mpItems,
        payer: {
          name: cliente.nombre,
          surname: cliente.apellido,
          phone: {
            number: cliente.telefono ? cliente.telefono.toString() : ''
          },
          address: {
            street_name: cliente.direccion || '',
            zip_code: cliente.codigoPostal ? cliente.codigoPostal.toString() : ''
          }
        },
        back_urls: {
          success: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/confirmacion?orderId=${generatedOrderId}`,
          failure: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/carrito`,
          pending: `${process.env.FRONTEND_URL || 'https://ducknroll-react.vercel.app'}/confirmacion?orderId=${generatedOrderId}`
        },
        auto_return: 'approved',
        metadata: {
          order_id: generatedOrderId,
          email: email,
          cliente: cliente,
          productos: items, // Mantenemos el formato original que espera tu orderController
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
    
    // Mercado Pago manda el ID del pago en diferentes campos según el tipo de formato/notificación
    const topic = query.topic || query.type;
    const paymentId = query.id || query['data.id'] || (req.body && req.body.data && req.body.data.id);

    console.log(`🔔 Webhook de Mercado Pago recibido. Topic: ${topic}, ID: ${paymentId}`);

    // Validar si la notificación corresponde a un evento de pago
    if (topic === 'payment' || req.body?.type === 'payment' || (req.body?.action && req.body.action.startsWith('payment.'))) {
      if (!paymentId) {
        return res.status(200).send('Webhook recibido sin ID de pago, se ignora.');
      }

      // Consultar el estado del pago directamente al cliente oficial
      const payment = new Payment(client);
      const paymentInfo = await payment.get({ id: paymentId });

      const status = paymentInfo.status;
      const metadata = paymentInfo.metadata;
      const orderId = metadata?.order_id;
      
      console.log(`💳 Pago ${paymentId} de la orden #${orderId} está: ${status}`);

      if (status === 'approved' && metadata) {
        const email = metadata.email;
        const cliente = metadata.cliente;
        const productos = metadata.productos;
        const notas = metadata.notas;
        const total = paymentInfo.transaction_amount;

        // Verificar duplicados en Firestore
        const orderRef = db.collection('ordenes').doc(orderId);
        const orderDoc = await orderRef.get();
        
        if (orderDoc.exists && orderDoc.data().estado === 'pagado') {
          console.log(`⚠️ La orden #${orderId} ya está registrada como pagada. Ignorando duplicado.`);
          return res.status(200).send('OK (Duplicado)');
        }

        console.log(`✅ Registrando orden aprobada #${orderId} en base de datos...`);

        // Mapeo unificado de los productos para la base de datos
        const orderData = {
          email,
          cliente,
          productos: productos.map(p => ({
            nombre: p.nombre || p.title || '',
            talle: p.talleSeleccionado || p.talle || p.talle_seleccionado || '-',
            cantidad: parseInt(p.quantity || p.cantidad, 10) || 1,
            subtotal: parseFloat(p.subtotal || p.precio_total || (Number(p.precio || p.unit_price) * Number(p.quantity || p.cantidad)))
          })),
          total,
          notas,
          fecha: new Date().toISOString(),
          estado: 'pagado',
          paymentId
        };

        // 1. Guardar orden y disparar emails
        const result = await registrarYEnviarEmailsPedido(orderData, orderId);
        
        if (result.success || result.orderSaved) {
          // 2. Descontar stock usando las propiedades seguras mapeadas
          try {
            const itemsToDiscount = productos.map(p => ({
              id: p.id,
              talle: p.talleSeleccionado || p.talle || p.talle_seleccionado || 'M',
              cantidad: parseInt(p.quantity || p.cantidad, 10) || 1
            }));
            
            console.log('📦 Solicitando descuento de inventario para:', itemsToDiscount);
            await descontarInventarioFirestore(itemsToDiscount);
          } catch (stockError) {
            console.error('⚠️ Error al descontar stock desde el webhook:', stockError);
          }
        }
      }
    }

    // Siempre responder 200 a Mercado Pago para avisar que llegó bien
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Error en el webhook de Mercado Pago:', error.message);
    res.status(500).json({ error: error.message });
  }
};
