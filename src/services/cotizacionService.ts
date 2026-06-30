// src/services/cotizacionService.ts
'use server';

import { sendEmail } from './emailService';

// ============================================
// FUNCIÓN PARA ENVIAR CORREO DE COTIZACIÓN
// ============================================
export async function sendCotizacionEmail(data: {
  clienteEmail: string;
  clienteNombre: string;
  clienteTelefono: string;
  clienteMensaje: string;
  servicio: string;
  idioma?: string; // 👉 AGREGAR PARÁMETRO IDIOMA
}) {
  try {
    const idioma = data.idioma || 'es'; // 👉 VALOR POR DEFECTO
    
    // 1. Enviar al cliente (confirmación)
    await sendEmail({
      to: data.clienteEmail,
      template: 'cotizacionCliente',
      data: {
        nombre: data.clienteNombre,
        servicio: data.servicio,
        mensaje: data.clienteMensaje,
        idioma: idioma // 👉 PASAR IDIOMA A LA PLANTILLA
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
        mensaje: data.clienteMensaje,
        idioma: idioma // 👉 PASAR IDIOMA A LA PLANTILLA
      }
    });

    return { success: true };

  } catch (error) {
    console.error('❌ Error enviando cotización:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Error desconocido' 
    };
  }
}