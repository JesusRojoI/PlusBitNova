'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react';
import { loadTranslations } from '@/services/translationService';

// 📝 Textos originales en español (fallback)
const TEXTS = {
  pedido_exitoso_title: '¡Pedido exitoso! 🎉',
  pedido_exitoso_subtitle: 'Tu pago ha sido procesado correctamente',
  pedido_exitoso_orderNumber: 'Número de orden',
  pedido_exitoso_confirmationTitle: 'Confirmación enviada',
  pedido_exitoso_confirmationDesc: 'Hemos enviado los detalles de tu compra a tu correo electrónico.',
  pedido_exitoso_nextStepsTitle: 'Próximos pasos',
  pedido_exitoso_nextStepsDesc: 'En breve recibirás un correo con la información de acceso a tus servicios.',
  pedido_exitoso_dashboard: 'Ir al Dashboard',
  pedido_exitoso_home: 'Volver al inicio',
  pedido_exitoso_redirect: 'Serás redirigido automáticamente en',
  pedido_exitoso_seconds: 'segundos',
  pedido_exitoso_support: '¿Tienes alguna pregunta? Contáctanos en'
};

// ⚠️ CLAVES EN INGLÉS (deben coincidir con las de common.json)
const TEXTS_EN = {
  pedido_exitoso_title: 'Order successful! 🎉',
  pedido_exitoso_subtitle: 'Your payment has been processed successfully',
  pedido_exitoso_orderNumber: 'Order number',
  pedido_exitoso_confirmationTitle: 'Confirmation sent',
  pedido_exitoso_confirmationDesc: 'We have sent the details of your purchase to your email.',
  pedido_exitoso_nextStepsTitle: 'Next steps',
  pedido_exitoso_nextStepsDesc: 'You will shortly receive an email with the access information to your services.',
  pedido_exitoso_dashboard: 'Go to Dashboard',
  pedido_exitoso_home: 'Back to home',
  pedido_exitoso_redirect: 'You will be automatically redirected in',
  pedido_exitoso_seconds: 'seconds',
  pedido_exitoso_support: 'Have any questions? Contact us at'
};

// Componente que usa useSearchParams (envuelto en Suspense)
function PedidoExitosoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [countdown, setCountdown] = useState(5);
  const [translations, setTranslations] = useState(TEXTS);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  // ✅ Cargar idioma y traducciones al iniciar
  useEffect(() => {
    const loadTrans = async () => {
      try {
        // Obtener idioma guardado
        const saved = localStorage.getItem('language') as 'es' | 'en';
        if (saved === 'es' || saved === 'en') {
          setLanguage(saved);
        }
        
        // Cargar traducciones desde el servidor
        const data = await loadTranslations();
        console.log('📦 Traducciones cargadas en pedido exitoso:', data);
        
        // Si hay traducciones en inglés, actualizar el estado
        if (data && data.en && data.en.common) {
          // Usar las traducciones del archivo JSON para inglés
          setTranslations({
            pedido_exitoso_title: data.en.common.pedido_exitoso_title || TEXTS_EN.pedido_exitoso_title,
            pedido_exitoso_subtitle: data.en.common.pedido_exitoso_subtitle || TEXTS_EN.pedido_exitoso_subtitle,
            pedido_exitoso_orderNumber: data.en.common.pedido_exitoso_orderNumber || TEXTS_EN.pedido_exitoso_orderNumber,
            pedido_exitoso_confirmationTitle: data.en.common.pedido_exitoso_confirmationTitle || TEXTS_EN.pedido_exitoso_confirmationTitle,
            pedido_exitoso_confirmationDesc: data.en.common.pedido_exitoso_confirmationDesc || TEXTS_EN.pedido_exitoso_confirmationDesc,
            pedido_exitoso_nextStepsTitle: data.en.common.pedido_exitoso_nextStepsTitle || TEXTS_EN.pedido_exitoso_nextStepsTitle,
            pedido_exitoso_nextStepsDesc: data.en.common.pedido_exitoso_nextStepsDesc || TEXTS_EN.pedido_exitoso_nextStepsDesc,
            pedido_exitoso_dashboard: data.en.common.pedido_exitoso_dashboard || TEXTS_EN.pedido_exitoso_dashboard,
            pedido_exitoso_home: data.en.common.pedido_exitoso_home || TEXTS_EN.pedido_exitoso_home,
            pedido_exitoso_redirect: data.en.common.pedido_exitoso_redirect || TEXTS_EN.pedido_exitoso_redirect,
            pedido_exitoso_seconds: data.en.common.pedido_exitoso_seconds || TEXTS_EN.pedido_exitoso_seconds,
            pedido_exitoso_support: data.en.common.pedido_exitoso_support || TEXTS_EN.pedido_exitoso_support
          });
        }
      } catch (error) {
        console.error('❌ Error cargando traducciones:', error);
        // Si hay error, usar los textos en español
        setTranslations(TEXTS);
      } finally {
        setLoading(false);
      }
    };
    loadTrans();
  }, []);

  // ✅ Función de traducción con fallback
  const t = (key: string): string => {
    // Si estamos cargando, devolver el texto de fallback en español
    if (loading) {
      return TEXTS[key as keyof typeof TEXTS] || key;
    }
    
    // Si estamos en español, devolver los textos en español
    if (language === 'es') {
      return TEXTS[key as keyof typeof TEXTS] || key;
    }
    
    // Si estamos en inglés, devolver los textos traducidos
    if (language === 'en') {
      return translations[key as keyof typeof translations] || TEXTS_EN[key as keyof typeof TEXTS_EN] || key;
    }
    
    // Fallback general
    return TEXTS[key as keyof typeof TEXTS] || key;
  };

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

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
              {t('pedido_exitoso_title')}
            </h1>
            <p className="text-green-100 mt-2">
              {t('pedido_exitoso_subtitle')}
            </p>
          </div>

          {/* Contenido */}
          <div className="px-6 py-8">
            {/* Número de orden */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{t('pedido_exitoso_orderNumber')}</span>
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
                    {t('pedido_exitoso_confirmationTitle')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('pedido_exitoso_confirmationDesc')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t('pedido_exitoso_nextStepsTitle')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t('pedido_exitoso_nextStepsDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => router.push('/')}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                {t('pedido_exitoso_dashboard')}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                {t('pedido_exitoso_home')}
              </button>
            </div>

            {/* Contador de redirección */}
            <p className="text-center text-sm text-gray-500 mt-4">
              {t('pedido_exitoso_redirect')} {countdown} {t('pedido_exitoso_seconds')}
            </p>
          </div>
        </div>

        {/* Mensaje de soporte */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {t('pedido_exitoso_support')}{' '}
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

// Componente principal con Suspense
export default function PedidoExitosoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
        <div className="text-gray-500">Cargando...</div>
      </div>
    }>
      <PedidoExitosoContent />
    </Suspense>
  );
}