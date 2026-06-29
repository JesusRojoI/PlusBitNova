// src/app/actions/email-actions.ts
'use server';

import { Resend } from 'resend';

// ============================================
// CONFIGURACIÓN DE RESEND
// ============================================
let resendInstance: any = null;

if (typeof window === 'undefined') {
  try {
    if (process.env.RESEND_API_KEY) {
      resendInstance = new Resend(process.env.RESEND_API_KEY);
      console.log('✅ Resend inicializado en el servidor');
    } else {
      console.warn('⚠️ RESEND_API_KEY no configurada. Los correos no se enviarán.');
    }
  } catch (error) {
    console.warn('⚠️ Error cargando Resend:', error);
  }
}

// ============================================
// PLANTILLAS DE CORREO
// ============================================
const templates = {
  paymentConfirmation: (data: any) => ({
    subject: `✅ ¡Pago confirmado! - PlusBitNova (Orden: ${data.orderId})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Confirmación de Pago</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
          .details { background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
          .details-item:last-child { border-bottom: none; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; margin-top: 20px; }
          .badge { display: inline-block; background: #22c55e; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🛡️ PlusBitNova</h1>
            <p>Seguridad Digital</p>
          </div>
          <div class="content">
            <h2 style="margin-top: 0;">¡Gracias por tu compra, ${data.name}! 🎉</h2>
            <p>Tu pago ha sido <strong>confirmado exitosamente</strong>.</p>
            <div class="details">
              <div class="details-item"><span>📋 Número de orden</span><strong>${data.orderId}</strong></div>
              <div class="details-item"><span>💳 Monto pagado</span><strong>$${data.amount.toFixed(2)} MXN</strong></div>
              <div class="details-item"><span>📦 Plan contratado</span><strong>${data.plan}</strong></div>
              <div class="details-item"><span>📅 Fecha</span><strong>${new Date().toLocaleDateString('es-MX')}</strong></div>
              <div class="details-item"><span>✅ Estado</span><strong><span class="badge">Pagado</span></strong></div>
            </div>
            <div style="text-align: center;">
              <a href="https://plusbitnova.com/dashboard" class="button">🚀 Ir al Dashboard</a>
            </div>
            <p style="color: #475569; font-size: 14px;">
              Si tienes alguna pregunta, contáctanos en 
              <a href="mailto:gestion@plusbitnova.com" style="color: #3b82f6;">gestion@plusbitnova.com</a>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PlusBitNova - Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminNotification: (data: any) => ({
    subject: `📋 Nuevo pedido - ${data.orderId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nuevo Pedido</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { padding: 30px; }
          .info-box { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .info-box-item { display: flex; justify-content: space-between; padding: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin: 0;">📋 Nuevo Pedido</h1></div>
          <div class="content">
            <div class="info-box">
              <div class="info-box-item"><span>🆔 Orden:</span><strong>${data.orderId}</strong></div>
              <div class="info-box-item"><span>👤 Cliente:</span><strong>${data.customerName}</strong></div>
              <div class="info-box-item"><span>📧 Email:</span><strong>${data.customerEmail}</strong></div>
              <div class="info-box-item"><span>💰 Total:</span><strong>$${data.amount.toFixed(2)} MXN</strong></div>
              <div class="info-box-item"><span>📦 Plan:</span><strong>${data.plan}</strong></div>
            </div>
            <p style="text-align: center; color: #64748b; font-size: 14px;">Revisa los detalles en el panel de administración.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  cotizacionCliente: (data: any) => ({
    subject: `📋 Solicitud de cotización - PlusBitNova`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Cotización recibida</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { padding: 30px; }
          .mensaje { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin: 0;">¡Cotización recibida! 📋</h1></div>
          <div class="content">
            <p>Hola <strong>${data.nombre}</strong>,</p>
            <p>Hemos recibido tu solicitud de cotización para el servicio:</p>
            <p><strong>${data.servicio}</strong></p>
            <p>Nuestro equipo de especialistas revisará tu información y te contactará en las próximas 24 horas.</p>
            <p><strong>Mensaje que nos enviaste:</strong></p>
            <div class="mensaje">${data.mensaje}</div>
            <p>¡Gracias por confiar en PlusBitNova!</p>
            <p style="color: #475569; font-size: 14px;">
              <a href="mailto:gestion@plusbitnova.com" style="color: #2563eb;">gestion@plusbitnova.com</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  cotizacionAdmin: (data: any) => ({
    subject: `📋 Nueva cotización de ${data.nombre}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Nueva cotización</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1a1a2e; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #2563eb, #3b82f6); color: white; padding: 20px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { padding: 30px; }
          .info { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1 style="margin: 0;">📋 Nueva cotización</h1></div>
          <div class="content">
            <div class="info">
              <p><strong>Cliente:</strong> ${data.nombre}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Teléfono:</strong> ${data.telefono}</p>
              <p><strong>Servicio:</strong> ${data.servicio}</p>
            </div>
            <p><strong>Mensaje:</strong></p>
            <div class="info">${data.mensaje}</div>
            <hr>
            <p style="color: #64748b; font-size: 14px;">Responde a este correo para contactar al cliente.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// ============================================
// FUNCIÓN PRINCIPAL PARA ENVIAR CORREOS
// ============================================
async function sendEmail({ to, template, data }: {
  to: string;
  template: keyof typeof templates;
  data: Record<string, any>;
}) {
  if (typeof window !== 'undefined') {
    console.warn('⚠️ sendEmail no puede ejecutarse en el cliente');
    return { success: false, error: 'sendEmail solo puede ejecutarse en el servidor' };
  }

  try {
    if (!resendInstance) {
      console.warn('⚠️ Resend no inicializado. No se enviará el correo.');
      return { success: false, error: 'Resend no inicializado. Verifica RESEND_API_KEY.' };
    }

    console.log(`📧 Enviando correo "${template}" a ${to}...`);

    const templateData = templates[template](data);
    const from = process.env.EMAIL_FROM || 'PlusBitNova <gestion@plusbitnova.com>';

    const result = await resendInstance.emails.send({
      from,
      to: [to],
      subject: templateData.subject,
      html: templateData.html,
    });

    if (result.error) {
      console.error('❌ Error de Resend:', result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`✅ Correo enviado a ${to}`);
    return { success: true, data: result.data };
  } catch (error) {
    console.error('❌ Error enviando correo:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

// ============================================
// ✅ FUNCIONES EXPORTADAS
// ============================================

export async function sendPaymentConfirmationAction(data: {
  to: string;
  name: string;
  orderId: string;
  amount: number;
  plan: string;
}) {
  try {
    const result = await sendEmail({
      to: data.to,
      template: 'paymentConfirmation',
      data: {
        name: data.name,
        orderId: data.orderId,
        amount: data.amount,
        plan: data.plan
      }
    });
    return result;
  } catch (error) {
    console.error('❌ Error en sendPaymentConfirmationAction:', error);
    return { success: false, error: String(error) };
  }
}

export async function notifyAdminAction(data: {
  orderId: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  plan: string;
}) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'gestion@plusbitnova.com';
    const result = await sendEmail({
      to: adminEmail,
      template: 'adminNotification',
      data: {
        orderId: data.orderId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        amount: data.amount,
        plan: data.plan
      }
    });
    return result;
  } catch (error) {
    console.error('❌ Error en notifyAdminAction:', error);
    return { success: false, error: String(error) };
  }
}

export async function sendCotizacionEmailAction(data: {
  clienteEmail: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteMensaje: string;
  servicio: string;
}) {
  try {
    // 1. Enviar al cliente
    await sendEmail({
      to: data.clienteEmail,
      template: 'cotizacionCliente',
      data: {
        nombre: data.clienteNombre,
        servicio: data.servicio,
        mensaje: data.clienteMensaje
      }
    });

    // 2. Enviar al administrador
    const adminEmail = process.env.ADMIN_EMAIL || 'gestion@plusbitnova.com';
    await sendEmail({
      to: adminEmail,
      template: 'cotizacionAdmin',
      data: {
        nombre: data.clienteNombre,
        email: data.clienteEmail,
        telefono: data.clienteTelefono,
        servicio: data.servicio,
        mensaje: data.clienteMensaje
      }
    });

    return { success: true };
  } catch (error) {
    console.error('❌ Error en sendCotizacionEmailAction:', error);
    return { success: false, error: String(error) };
  }
}