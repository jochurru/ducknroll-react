import nodemailer from 'nodemailer';
import { db } from '../config/firebase.js';

/**
 * Crea y devuelve el transporter de nodemailer configurado con Gmail.
 */
const crearTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 8000, // 8 segundos
    greetingTimeout: 8000,
    socketTimeout: 8000
  });
};

/**
 * POST /api/ordenes/email
 * Recibe el orderData completo desde el Checkout y envía:
 *  - Email de notificación al admin (johnnychurra@gmail.com) con todos los detalles
 *  - Email de confirmación al cliente con resumen de su compra
 */
export const enviarEmailOrden = async (req, res) => {
  try {
    const { email, cliente, productos, total, notas, fecha, orderId } = req.body;

    if (!email || !cliente || !productos || !total) {
      return res.status(400).json({ error: 'Datos de orden incompletos.' });
    }

    const transporter = crearTransporter();
    const fechaFormateada = fecha
      ? new Date(fecha).toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })
      : new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });

    const numeroOrden = orderId || `DK${Date.now()}`;
    let orderSaved = false;

    // Registrar la orden en Firebase Firestore antes de intentar mandar el email
    try {
      await db.collection('ordenes').doc(numeroOrden).set({
        id: numeroOrden,
        email,
        cliente,
        productos: productos.map(p => ({
          nombre: p.nombre,
          talle: p.talle || p.talleSeleccionado || '-',
          cantidad: p.cantidad,
          subtotal: Number(p.subtotal)
        })),
        total: Number(total),
        notas: notas || '',
        fecha: fecha || new Date().toISOString(),
        estado: 'pendiente',
        createdAt: new Date().toISOString()
      });
      console.log(`✅ Orden #${numeroOrden} registrada con éxito en Firestore.`);
      orderSaved = true;
    } catch (dbError) {
      console.error('❌ Error al registrar la orden en Firestore:', dbError);
    }

    const productosHTML = productos.map(p => `
      <tr style="border-bottom: 1px solid #f0f0f0;">
        <td style="padding: 10px 8px; color: #1a1a1a; font-size: 14px;">${p.nombre}</td>
        <td style="padding: 10px 8px; text-align: center; color: #555; font-size: 14px;">${p.talle || p.talleSeleccionado || '-'}</td>
        <td style="padding: 10px 8px; text-align: center; color: #555; font-size: 14px;">x${p.cantidad}</td>
        <td style="padding: 10px 8px; text-align: right; font-weight: bold; color: #1a1a1a; font-size: 14px;">$${Number(p.subtotal).toLocaleString('es-AR')}</td>
      </tr>
    `).join('');

    // ─────────────────────────────────────────────────
    // EMAIL AL ADMIN (johnnychurra@gmail.com)
    // ─────────────────────────────────────────────────
    const mailAlAdmin = {
      from: `"Duck'n Roll Tienda" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECIPIENT || 'johnnychurra@gmail.com',
      replyTo: email,
      subject: `🛒 Nuevo Pedido #${numeroOrden} — $${Number(total).toLocaleString('es-AR')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <div style="background: #1a1a1a; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h1 style="color: #FFC700; margin: 0; font-size: 22px; letter-spacing: 2px;">🦆 DUCK'N ROLL</h1>
              <p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">Panel de Administración — Nuevo Pedido</p>
            </div>
            <div style="background: #FFC700; color: #1a1a1a; padding: 8px 16px; border-radius: 8px; font-weight: bold; font-size: 13px;">
              #${numeroOrden}
            </div>
          </div>

          <!-- Body -->
          <div style="padding: 28px 32px; background: #ffffff;">

            <!-- Datos del cliente -->
            <h2 style="color: #1a1a1a; font-size: 16px; margin: 0 0 14px; border-bottom: 3px solid #FFC700; padding-bottom: 8px;">👤 Datos del Cliente</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #777; width: 140px;">Nombre</td><td style="padding: 6px 0; color: #1a1a1a; font-weight: bold;">${cliente.nombre} ${cliente.apellido}</td></tr>
              <tr><td style="padding: 6px 0; color: #777;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #FFC700;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #777;">Teléfono</td><td style="padding: 6px 0; color: #1a1a1a;">${cliente.telefono}</td></tr>
            </table>

            <!-- Dirección de envío -->
            <h2 style="color: #1a1a1a; font-size: 16px; margin: 0 0 14px; border-bottom: 3px solid #FFC700; padding-bottom: 8px;">📦 Dirección de Envío</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #777; width: 140px;">Dirección</td><td style="padding: 6px 0; color: #1a1a1a;">${cliente.direccion}</td></tr>
              <tr><td style="padding: 6px 0; color: #777;">Ciudad</td><td style="padding: 6px 0; color: #1a1a1a;">${cliente.ciudad}</td></tr>
              <tr><td style="padding: 6px 0; color: #777;">Código Postal</td><td style="padding: 6px 0; color: #1a1a1a;">${cliente.codigoPostal}</td></tr>
            </table>

            <!-- Productos -->
            <h2 style="color: #1a1a1a; font-size: 16px; margin: 0 0 14px; border-bottom: 3px solid #FFC700; padding-bottom: 8px;">🛒 Productos</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 8px;">
              <thead>
                <tr style="background: #f5f5f5;">
                  <th style="padding: 10px 8px; text-align: left; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Producto</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Talle</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Cant.</th>
                  <th style="padding: 10px 8px; text-align: right; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productosHTML}
              </tbody>
            </table>

            <!-- Total -->
            <div style="background: #f9f9f9; border-radius: 8px; padding: 16px 20px; margin-top: 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 16px; font-weight: bold; color: #1a1a1a;">TOTAL DEL PEDIDO</span>
              <span style="font-size: 22px; font-weight: bold; color: #FFC700;">$${Number(total).toLocaleString('es-AR')}</span>
            </div>

            ${notas ? `
            <!-- Notas -->
            <div style="margin-top: 20px; background: #fffbea; border-left: 4px solid #FFC700; border-radius: 0 8px 8px 0; padding: 14px 16px;">
              <p style="color: #777; font-size: 11px; font-weight: bold; text-transform: uppercase; margin: 0 0 6px; letter-spacing: 1px;">📝 Notas del cliente:</p>
              <p style="color: #333; font-size: 13px; margin: 0; white-space: pre-wrap;">${notas}</p>
            </div>` : ''}
          </div>

          <!-- Footer -->
          <div style="background: #f5f5f5; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #aaa; font-size: 11px; margin: 0;">
              📅 Recibido: ${fechaFormateada} hs · Duck'n Roll © ${new Date().getFullYear()}
            </p>
            <p style="color: #aaa; font-size: 11px; margin: 4px 0 0;">
              Respondé este email directamente para contactar a ${cliente.nombre} (${email})
            </p>
          </div>
        </div>
      `
    };

    // ─────────────────────────────────────────────────
    // EMAIL DE CONFIRMACIÓN AL CLIENTE
    // ─────────────────────────────────────────────────
    const mailAlCliente = {
      from: `"Duck'n Roll" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Confirmación de tu pedido #${numeroOrden} — Duck'n Roll`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <div style="background: #1a1a1a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #FFC700; margin: 0 0 4px; font-size: 24px; letter-spacing: 2px;">🦆 DUCK'N ROLL</h1>
            <p style="color: #aaa; font-size: 12px; margin: 0;">Tu remera, tu identidad</p>
          </div>

          <!-- Confirmación -->
          <div style="padding: 32px; background: #ffffff; text-align: center;">
            <div style="font-size: 52px; margin-bottom: 12px;">🎉</div>
            <h2 style="color: #1a1a1a; font-size: 22px; margin: 0 0 8px;">¡Tu pedido fue confirmado, ${cliente.nombre}!</h2>
            <div style="display: inline-block; background: #FFC700; color: #1a1a1a; font-weight: bold; padding: 6px 18px; border-radius: 20px; font-size: 14px; margin-bottom: 20px;">
              Pedido #${numeroOrden}
            </div>
            <p style="color: #555; font-size: 15px; line-height: 1.7; max-width: 420px; margin: 0 auto 28px;">
              Recibimos tu compra y ya la estamos preparando con mucho cuidado. <strong>Te contactaremos a la brevedad</strong> para coordinar los detalles del envío. 📬
            </p>
          </div>

          <!-- Resumen del pedido -->
          <div style="padding: 0 32px 28px; background: #ffffff;">
            <h3 style="color: #1a1a1a; font-size: 15px; margin: 0 0 14px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">🛒 Resumen de tu pedido</h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 16px;">
              <thead>
                <tr style="background: #f9f9f9;">
                  <th style="padding: 10px 8px; text-align: left; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Producto</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Talle</th>
                  <th style="padding: 10px 8px; text-align: center; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Cant.</th>
                  <th style="padding: 10px 8px; text-align: right; font-size: 11px; color: #777; text-transform: uppercase; letter-spacing: 1px;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${productosHTML}
              </tbody>
            </table>
            <div style="background: #f9f9f9; border-radius: 8px; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 15px; font-weight: bold; color: #1a1a1a;">Total pagado</span>
              <span style="font-size: 20px; font-weight: bold; color: #1a1a1a;">$${Number(total).toLocaleString('es-AR')}</span>
            </div>
          </div>

          <!-- Dirección -->
          <div style="padding: 0 32px 28px; background: #ffffff;">
            <h3 style="color: #1a1a1a; font-size: 15px; margin: 0 0 14px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">📦 Dirección de envío</h3>
            <p style="color: #555; font-size: 14px; margin: 0; line-height: 1.7;">
              ${cliente.direccion}<br>
              ${cliente.ciudad}, CP ${cliente.codigoPostal}
            </p>
          </div>

          <!-- Próximos pasos -->
          <div style="background: #fffbea; padding: 20px 32px; border-top: 1px solid #f0e68c;">
            <h3 style="color: #1a1a1a; font-size: 14px; margin: 0 0 12px;">📋 ¿Qué sigue?</h3>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555;">
                <span style="font-size: 16px;">1️⃣</span>
                <span>Recibirás un llamado o mensaje de WhatsApp para confirmar el método de pago.</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555;">
                <span style="font-size: 16px;">2️⃣</span>
                <span>Una vez confirmado el pago, tu pedido entra en producción.</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: #555;">
                <span style="font-size: 16px;">3️⃣</span>
                <span>Despacho por correo prioridad con número de seguimiento. 🚚</span>
              </div>
            </div>
          </div>

          <!-- CTA -->
          <div style="padding: 24px 32px; background: #ffffff; text-align: center;">
            <a href="https://ducknroll-react.vercel.app/productos"
               style="display: inline-block; background: #FFC700; color: #1a1a1a; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: bold; font-size: 14px;">
              🛍️ Seguir explorando la tienda
            </a>
          </div>

          <!-- Footer -->
          <div style="background: #1a1a1a; padding: 20px 32px; text-align: center;">
            <p style="color: #FFC700; font-size: 13px; font-weight: bold; margin: 0 0 4px;">Duck'n Roll</p>
            <p style="color: #aaa; font-size: 11px; margin: 0;">¿Dudas? Escribinos por WhatsApp o a johnnychurra@gmail.com</p>
            <p style="color: #555; font-size: 10px; margin: 8px 0 0;">© ${new Date().getFullYear()} Duck'n Roll — Tu remera, tu identidad</p>
          </div>
        </div>
      `
    };

    // Enviar ambos emails en paralelo
    await Promise.all([
      transporter.sendMail(mailAlAdmin),
      transporter.sendMail(mailAlCliente)
    ]);

    console.log(`📦 Emails de orden #${numeroOrden} enviados: admin + cliente (${email})`);
    res.status(200).json({
      message: 'Emails de orden enviados correctamente.',
      orderId: numeroOrden
    });

  } catch (error) {
    console.error('❌ Error al enviar emails de orden:', error);
    if (orderSaved) {
      // Si ya se guardó en la base de datos, no devolvemos un 500 para no trabar el flujo de compra
      return res.status(200).json({
        message: 'Pedido registrado en base de datos, pero hubo un problema al enviar la confirmación por email.',
        orderId: numeroOrden,
        warning: 'No se pudo enviar el correo de confirmación por email.'
      });
    }
    res.status(500).json({
      error: 'No pudimos registrar tu pedido ni enviar el email. Por favor, intentá de nuevo.',
      _debug: error.message,
      _code: error.code
    });
  }
};
