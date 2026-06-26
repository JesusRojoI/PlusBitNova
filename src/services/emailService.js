// src/services/emailService.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, template, data }) {
    try {
        let subject, html;

        // Definir plantillas
        switch (template) {
            case 'paymentConfirmation':
                subject = `✅ Pago confirmado - PlusBitNova (Orden: ${data.orderId})`;
                html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #2563eb;">¡Gracias por tu compra, ${data.customerName}!</h1>
                        <p>Tu pago por <strong>$${data.amount} USD</strong> ha sido aprobado.</p>
                        <p>Plan: <strong>${data.plan}</strong></p>
                        <p>Orden: <strong>${data.orderId}</strong></p>
                        <br>
                        <p>Ya puedes acceder a todos los servicios en tu <a href="https://plusbitnova.com/dashboard" style="color: #2563eb;">Dashboard</a>.</p>
                        <hr style="border: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px;">PlusBitNova - Seguridad Digital</p>
                    </div>
                `;
                break;
            default:
                throw new Error('Plantilla no encontrada');
        }

        const { data: emailData, error } = await resend.emails.send({
            from: `PlusBitNova <gestion@plusbitnova.com>`,
            to: [to],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error('❌ Error de Resend:', error);
            return { success: false, error: error.message };
        }

        console.log('✅ Correo enviado a:', to);
        return { success: true, data: emailData };

    } catch (error) {
        console.error('❌ Error enviando correo:', error);
        return { success: false, error: error.message };
    }
}