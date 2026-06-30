import axios from 'axios';

// Tu endpoint de Formspree
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xpwyepwj';

export const sendOrderEmail = async (orderData) => {
try {
const emailData = {
    // Formspree recibe estos campos
    subject: `Nuevo Pedido - Duck'n Roll #${Date.now()}`,
    message: `
==========================================
🦆 NUEVO PEDIDO - DUCK'N ROLL
==========================================

📋 DATOS DEL CLIENTE
------------------------------------------
Nombre: ${orderData.cliente.nombre} ${orderData.cliente.apellido}
Email: ${orderData.email}
Teléfono: ${orderData.cliente.telefono}

📦 DIRECCIÓN DE ENVÍO
------------------------------------------
Dirección: ${orderData.cliente.direccion}
Ciudad: ${orderData.cliente.ciudad}
Código Postal: ${orderData.cliente.codigoPostal}

🛒 PRODUCTOS
------------------------------------------
${orderData.productos.map(p => 
`- ${p.nombre} x${p.cantidad} = $${p.subtotal.toFixed(2)}`
).join('\n')}

💰 TOTAL: $${orderData.total.toFixed(2)}

${orderData.notas ? `📝 NOTAS: ${orderData.notas}` : ''}

==========================================
Fecha: ${new Date().toLocaleString('es-AR')}
==========================================
    `,
    _replyto: orderData.email,
    _subject: `Nuevo Pedido Duck'n Roll`,
    // Campos adicionales para mejor organización
    nombre: `${orderData.cliente.nombre} ${orderData.cliente.apellido}`,
    email: orderData.email,
    telefono: orderData.cliente.telefono,
    total: `$${orderData.total.toFixed(2)}`,
    productos: orderData.productos.map(p => 
    `${p.nombre} x${p.cantidad}`
    ).join(', ')
};

const response = await axios.post(FORMSPREE_ENDPOINT, emailData, {
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
    }
});

return response.data;
} catch (error) {
console.error('Error al enviar email:', error);
throw error;
}
};

