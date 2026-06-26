// src/app/pedido-exitoso/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';

export default function PedidoExitosoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Si no hay orderId, redirigir al inicio
    if (!orderId) {
      router.push('/');
      return;
    }

    // Contador para redirección automática
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [orderId, router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Tarjeta principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header con gradiente */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              ¡Pedido exitoso! 🎉
            </h1>
            <p className="text-green-100 mt-2">
              Tu pago ha sido procesado correctamente
            </p>
          </div>

          {/* Contenido */}
          <div className="px-6 py-8">
            {/* Número de orden */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Número de orden</span>
                <span className="font-mono font-bold text-gray-900">
                  {orderId || 'N/A'}
                </span>
              </div>
            </div>

            {/* Detalles del pedido */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Confirmación enviada
                  </h3>
                  <p className="text-sm text-gray-600">
                    Hemos enviado los detalles de tu compra a tu correo electrónico.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Próximos pasos
                  </h3>
                  <p className="text-sm text-gray-600">
                    En breve recibirás un correo con la información de acceso a tus servicios.
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                Ir al Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Volver al inicio
              </button>
            </div>

            {/* Contador de redirección */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Serás redirigido automáticamente en {countdown} segundos
            </p>
          </div>
        </div>

        {/* Mensaje de soporte */}
        <p className="text-center text-sm text-gray-500 mt-6">
          ¿Tienes alguna pregunta? Contáctanos en{' '}
          <a 
            href="mailto:gestion@plusbitnova.com" 
            className="text-blue-600 hover:underline"
          >
            gestion@plusbitnova.com
          </a>
        </p>
      </div>
    </div>
  );
}