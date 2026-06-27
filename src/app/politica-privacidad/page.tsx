// src/app/terminos-condiciones/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Shield, Lock, FileText, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loadTranslations } from '@/services/translationService';

export default function TerminosCondicionesPage() {
  const router = useRouter();
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const load = async () => {
      try {
        // Obtener idioma guardado
        const saved = localStorage.getItem('language') as 'es' | 'en';
        if (saved === 'es' || saved === 'en') {
          setLanguage(saved);
        }
        
        const data = await loadTranslations();
        console.log('📦 Traducciones cargadas en página de términos:', data);
        setTranslations(data);
      } catch (error) {
        console.error('❌ Error cargando traducciones:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const t = (key: string): string => {
    if (!translations) return key;
    const lang = language || 'es';
    const ns = 'common';
    const value = translations[lang]?.[ns]?.[key];
    return value || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('terminos_back')}
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8" />
            <h1 className="text-3xl font-bold">{t('terminos_title')}</h1>
          </div>
          <p className="text-blue-100 text-lg">
            {t('terminos_lastUpdate')} {new Date().toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className="text-blue-200 text-sm mt-2">
            {t('terminos_version')}
          </p>
        </div>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Tarjeta 1: Introducción */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('terminos_section1_title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terminos_section1_p1')}
                  <span className="text-blue-600"> plusbitnova.com</span>
                  {t('terminos_section1_p1b')}
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  {t('terminos_section1_p2')}
                </p>
                <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      <strong>{t('terminos_important')}</strong> {t('terminos_section1_note')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Servicios */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <Lock className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('terminos_section2_title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terminos_section2_p1')}
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
                  <li><strong>{t('terminos_section2_li1_title')}</strong> {t('terminos_section2_li1_desc')}</li>
                  <li><strong>{t('terminos_section2_li2_title')}</strong> {t('terminos_section2_li2_desc')}</li>
                  <li><strong>{t('terminos_section2_li3_title')}</strong> {t('terminos_section2_li3_desc')}</li>
                  <li><strong>{t('terminos_section2_li4_title')}</strong> {t('terminos_section2_li4_desc')}</li>
                  <li><strong>{t('terminos_section2_li5_title')}</strong> {t('terminos_section2_li5_desc')}</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-3">
                  {t('terminos_section2_p2')}
                </p>
              </div>
            </div>
          </div>

          {/* Tarjeta 3: Obligaciones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {t('terminos_section3_title')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {t('terminos_section3_p1')}
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3 text-gray-700">
                  <li><strong>{t('terminos_section3_li1_title')}</strong> {t('terminos_section3_li1_desc')}</li>
                  <li><strong>{t('terminos_section3_li2_title')}</strong> {t('terminos_section3_li2_desc')}</li>
                  <li><strong>{t('terminos_section3_li3_title')}</strong> {t('terminos_section3_li3_desc')}</li>
                  <li><strong>{t('terminos_section3_li4_title')}</strong> {t('terminos_section3_li4_desc')}</li>
                  <li><strong>{t('terminos_section3_li5_title')}</strong> {t('terminos_section3_li5_desc')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tarjeta 4: Propiedad Intelectual */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section4_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terminos_section4_p1')}
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              {t('terminos_section4_p2')}
            </p>
          </div>

          {/* Tarjeta 5: Limitación de Responsabilidad */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section5_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terminos_section5_p1')}
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-semibold">
                    {t('terminos_section5_disclaimer')}
                  </p>
                  <p className="text-sm text-yellow-700">
                    {t('terminos_section5_disclaimer_text')}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed mt-3">
              {t('terminos_section5_p2')}
            </p>
          </div>

          {/* Tarjeta 6: Política de Privacidad */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section6_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terminos_section6_p1')}
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              {t('terminos_section6_p2')}
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              {t('terminos_section6_p3')}
              <Link href="/politica-privacidad" className="text-blue-600 hover:underline ml-1">
                {t('terminos_section6_link')}
              </Link>.
            </p>
          </div>

          {/* Tarjeta 7: Facturación y Pagos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section7_title')}
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li><strong>{t('terminos_section7_li1_title')}</strong> {t('terminos_section7_li1_desc')}</li>
              <li><strong>{t('terminos_section7_li2_title')}</strong> {t('terminos_section7_li2_desc')}</li>
              <li><strong>{t('terminos_section7_li3_title')}</strong> {t('terminos_section7_li3_desc')}</li>
              <li><strong>{t('terminos_section7_li4_title')}</strong> {t('terminos_section7_li4_desc')}</li>
              <li><strong>{t('terminos_section7_li5_title')}</strong> {t('terminos_section7_li5_desc')}</li>
            </ul>
          </div>

          {/* Tarjeta 8: Ley Aplicable */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section8_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terminos_section8_p1')}
            </p>
            <p className="text-gray-700 leading-relaxed mt-3">
              {t('terminos_section8_p2')}
            </p>
          </div>

          {/* Tarjeta 9: Contacto */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              {t('terminos_section9_title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('terminos_section9_p1')}
            </p>
            <div className="mt-4 space-y-2 text-gray-700">
              <p>📧 <strong>{t('terminos_email')}:</strong> <a href="mailto:gestion@plusbitnova.com" className="text-blue-600 hover:underline">gestion@plusbitnova.com</a></p>
              <p>🌐 <strong>{t('terminos_web')}:</strong> <a href="https://plusbitnova.com" className="text-blue-600 hover:underline">plusbitnova.com</a></p>
              <p>📍 <strong>{t('terminos_address')}:</strong> {t('terminos_address_text')}</p>
            </div>
            <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>{t('terminos_confirmation')}</strong> {t('terminos_confirmation_text')}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t('terminos_lastReview')} {new Date().toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-200 pt-6">
          <p>© {new Date().getFullYear()} PlusBitNova - {t('terminos_footer_rights')}</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link href="/" className="hover:text-blue-600 transition-colors">{t('terminos_footer_home')}</Link>
            <span>•</span>
            <Link href="/politica-privacidad" className="hover:text-blue-600 transition-colors">{t('terminos_footer_privacy')}</Link>
            <span>•</span>
            <Link href="/terminos-condiciones" className="text-blue-600">{t('terminos_footer_terms')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}