// src/app/actions/send-cotizacion.ts
'use server';

import { sendCotizacionEmail } from '@/services/cotizacionService';

export async function sendCotizacionAction(formData: FormData) {
  try {
    const nombre = formData.get('nombre') as string;
    const telefono = formData.get('telefono') as string;
    const email = formData.get('email') as string;
    const mensaje = formData.get('mensaje') as string;
    const idioma = formData.get('idioma') as string || 'es'; // 👉 EXTRAER IDIOMA

    console.log('📤 Enviando cotización:', { nombre, email, telefono, mensaje, idioma });

    // Validar datos
    if (!nombre || !email || !mensaje) {
      return { 
        success: false, 
        error: 'Nombre, email y mensaje son requeridos' 
      };
    }

    // Enviar correos
    const result = await sendCotizacionEmail({
      clienteEmail: email,
      clienteNombre: nombre,
      clienteTelefono: telefono || 'No especificado',
      clienteMensaje: mensaje,
      servicio: 'Cotización general',
      idioma: idioma // 👉 PASAR IDIOMA
    });

    console.log('📬 Resultado del envío:', result);
    return result;

  } catch (error) {
    console.error('❌ Error en sendCotizacionAction:', error);
    return { 
      success: false, 
      error: 'Error al enviar la cotización' 
    };
  }
}