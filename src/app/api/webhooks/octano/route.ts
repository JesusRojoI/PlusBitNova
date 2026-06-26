// src/app/api/webhooks/octano/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Obtener el payload
    const payload = await req.json();
    console.log('📨 Webhook recibido:', JSON.stringify(payload, null, 2));

    // Procesar diferentes eventos
    const event = payload.event || payload.type;
    const data = payload.data || payload;

    switch (event) {
      case 'payment.succeeded':
      case 'payment.approved':
        console.log(`✅ Pago exitoso para orden: ${data.reference || data.orderId}`);
        // Aquí puedes actualizar tu base de datos
        break;
      
      case 'payment.failed':
      case 'payment.rejected':
        console.log(`❌ Pago fallido para orden: ${data.reference || data.orderId}`);
        break;
      
      default:
        console.log(`ℹ️ Evento no manejado: ${event}`);
    }

    // Responder a Octano
    return NextResponse.json({ 
      received: true, 
      message: 'Webhook procesado correctamente' 
    });

  } catch (error) {
    console.error('❌ Error en webhook:', error);
    return NextResponse.json(
      { error: 'Error procesando webhook' },
      { status: 500 }
    );
  }
}

// Método GET para verificar que la ruta existe
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Webhook endpoint de Octano funcionando' 
  });
}