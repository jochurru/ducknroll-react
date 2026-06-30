import api from './api';

/**
 * Envía el email de confirmación de compra al admin y al cliente
 * a través del backend con Nodemailer.
 * 
 * @param {Object} orderData - Datos del pedido provenientes del Checkout
 * @param {string} orderId - Número de pedido generado en el Checkout
 */
export const sendOrderEmail = async (orderData, orderId) => {
  try {
    const payload = {
      email: orderData.email,
      cliente: orderData.cliente,
      productos: orderData.productos.map(p => ({
        nombre: p.nombre,
        talle: p.talle || p.talleSeleccionado || '-',
        cantidad: p.cantidad,
        subtotal: p.subtotal
      })),
      total: orderData.total,
      notas: orderData.notas || '',
      fecha: orderData.fecha || new Date().toISOString(),
      orderId: orderId || null
    };

    const response = await api.post('/ordenes/email', payload);
    return response.data;
  } catch (error) {
    console.error('Error al enviar email de orden:', error);
    throw error;
  }
};
