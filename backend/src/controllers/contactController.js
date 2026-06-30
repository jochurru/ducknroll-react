import nodemailer from 'nodemailer';

/**
 * Crea y devuelve el transporter de nodemailer configurado con Gmail.
 */
const crearTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS  // App Password de Google (no tu contraseña normal)
    }
  });
};

/**
 * Manejar el formulario de contacto del sitio.
 * Recibe { nombre, email, mensaje } y envía un correo a johnnychurra@gmail.com.
 */
export const enviarContacto = async (req, res) => {
  try {
    const { nombre, email, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
      return res.status(400).json({ error: 'Por favor completá todos los campos requeridos.' });
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'El formato del email no es válido.' });
    }

    const transporter = crearTransporter();

    // Email notificación al dueño del negocio
    const mailAlAdmin = {
      from: `"Duck'n Roll Contacto" <${process.env.EMAIL_USER}>`,
      to: process.env.CONTACT_RECIPIENT || 'johnnychurra@gmail.com',
      replyTo: email,
      subject: `📬 Nuevo mensaje de contacto de ${nombre} - Duck'n Roll`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: #1a1a1a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #FFC700; margin: 0; font-size: 22px; letter-spacing: 2px;">🦆 DUCK'N ROLL</h1>
            <p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">Nuevo mensaje del formulario de contacto</p>
          </div>

          <!-- Body -->
          <div style="padding: 32px; background: #ffffff;">
            <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 18px; border-bottom: 3px solid #FFC700; padding-bottom: 10px;">
              📨 Datos del consultor
            </h2>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; color: #555; width: 30%; border-radius: 4px 0 0 4px;">Nombre</td>
                <td style="padding: 10px 12px; color: #1a1a1a; font-size: 15px;">${nombre}</td>
              </tr>
              <tr>
                <td style="padding: 10px 12px; background: #f5f5f5; font-weight: bold; color: #555;">Email</td>
                <td style="padding: 10px 12px; color: #1a1a1a; font-size: 15px;">
                  <a href="mailto:${email}" style="color: #FFC700; text-decoration: none;">${email}</a>
                </td>
              </tr>
            </table>

            <h3 style="color: #1a1a1a; font-size: 15px; margin-bottom: 12px;">💬 Mensaje:</h3>
            <div style="background: #f9f9f9; border-left: 4px solid #FFC700; padding: 16px 20px; border-radius: 0 8px 8px 0; color: #333; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">
              ${mensaje}
            </div>
          </div>

          <!-- Footer -->
          <div style="background: #f5f5f5; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #aaa; font-size: 11px; margin: 0;">
              📅 Recibido el ${new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })} hs · Duck'n Roll © ${new Date().getFullYear()}
            </p>
            <p style="color: #aaa; font-size: 11px; margin: 4px 0 0;">
              Podés responder directamente a este email para contestarle a ${nombre}
            </p>
          </div>
        </div>
      `
    };

    // Email de confirmación al cliente
    const mailAlCliente = {
      from: `"Duck'n Roll" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `✅ Recibimos tu mensaje, ${nombre}! - Duck'n Roll`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 12px; overflow: hidden;">
          <!-- Header -->
          <div style="background: #1a1a1a; padding: 24px 32px; text-align: center;">
            <h1 style="color: #FFC700; margin: 0; font-size: 22px; letter-spacing: 2px;">🦆 DUCK'N ROLL</h1>
          </div>

          <!-- Body -->
          <div style="padding: 32px; background: #ffffff; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 16px;">✅</div>
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 12px;">¡Gracias por escribirnos, ${nombre}!</h2>
            <p style="color: #555; font-size: 14px; line-height: 1.7; max-width: 380px; margin: 0 auto 24px;">
              Recibimos tu mensaje y te responderemos en el menor tiempo posible (generalmente dentro de las 24hs hábiles).
            </p>

            <div style="background: #f9f9f9; border-radius: 8px; padding: 16px 20px; text-align: left; margin-bottom: 24px;">
              <p style="color: #888; font-size: 12px; margin: 0 0 6px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Tu mensaje:</p>
              <p style="color: #333; font-size: 13px; margin: 0; white-space: pre-wrap; line-height: 1.6;">${mensaje}</p>
            </div>

            <a href="https://ducknroll-react.vercel.app" 
               style="display: inline-block; background: #FFC700; color: #1a1a1a; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 13px;">
              🛍️ Seguir explorando la tienda
            </a>
          </div>

          <!-- Footer -->
          <div style="background: #f5f5f5; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e5e5;">
            <p style="color: #aaa; font-size: 11px; margin: 0;">Duck'n Roll · Tu remera, tu identidad · © ${new Date().getFullYear()}</p>
          </div>
        </div>
      `
    };

    // Enviar ambos emails en paralelo
    await Promise.all([
      transporter.sendMail(mailAlAdmin),
      transporter.sendMail(mailAlCliente)
    ]);

    console.log(`📧 Correo de contacto enviado: de ${nombre} (${email})`);
    res.status(200).json({ message: '¡Mensaje enviado con éxito! Te responderemos muy pronto.' });

  } catch (error) {
    console.error('❌ Error al enviar email de contacto:', error);
    res.status(500).json({ error: 'No pudimos enviar tu mensaje. Por favor, intentá más tarde o comunicate por WhatsApp.' });
  }
};
