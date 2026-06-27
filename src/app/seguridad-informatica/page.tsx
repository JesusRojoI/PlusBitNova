'use client';

import { useEffect, useState } from 'react';
import { ServicePage, type ServicePageData } from "@/components/service/service-page";
import { loadTranslations } from '@/services/translationService';

export default function Page() {
  const [translations, setTranslations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'es' | 'en'>('es');

  useEffect(() => {
    const load = async () => {
      try {
        const saved = localStorage.getItem('language') as 'es' | 'en';
        if (saved === 'es' || saved === 'en') {
          setLanguage(saved);
        }
        
        const data = await loadTranslations();
        console.log('📦 Traducciones cargadas en Seguridad Informática:', data);
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

  const data: ServicePageData = {
    title: t('servicio_security_title'),
    heroSubtitle: (
      <>
        {t('servicio_security_heroSubtitle')}
      </>
    ),
    heroImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop&crop=center",
    servicioHeading: t('servicio_security_heading'),
    servicioImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&h=500&fit=crop&crop=center",
    servicioText: (
      <>
        {t('servicio_security_text')}
      </>
    ),
    note: t('servicio_security_note'),
    variant: "features" as const,
    services: [
      {
        title: t('servicio_security_mcafee'),
        price: "900",
        unit: t('servicio_security_price') || "MXN + IVA",
        features: [
          t('servicio_security_mcafee_feature1'),
          t('servicio_security_mcafee_feature2'),
          t('servicio_security_mcafee_feature3'),
          t('servicio_security_mcafee_feature4'),
        ],
      },
      {
        title: t('servicio_security_kaspersky'),
        price: "550",
        unit: t('servicio_security_price') || "MXN + IVA",
        features: [
          t('servicio_security_kaspersky_feature1'),
          t('servicio_security_kaspersky_feature2'),
          t('servicio_security_kaspersky_feature3'),
          t('servicio_security_kaspersky_feature4'),
        ],
      },
      {
        title: t('servicio_security_bitdefender'),
        price: "780",
        unit: t('servicio_security_price') || "MXN + IVA",
        features: [
          t('servicio_security_bitdefender_feature1'),
          t('servicio_security_bitdefender_feature2'),
          t('servicio_security_bitdefender_feature3'),
          t('servicio_security_bitdefender_feature4'),
        ],
      },
      {
        title: t('servicio_security_norton'),
        price: "800",
        unit: t('servicio_security_price') || "MXN + IVA",
        features: [
          t('servicio_security_norton_feature1'),
          t('servicio_security_norton_feature2'),
          t('servicio_security_norton_feature3'),
          t('servicio_security_norton_feature4'),
        ],
      },
      {
        title: t('servicio_security_totalav'),
        price: "2,000",
        unit: t('servicio_security_price') || "MXN + IVA",
        features: [
          t('servicio_security_totalav_feature1'),
          t('servicio_security_totalav_feature2'),
          t('servicio_security_totalav_feature3'),
          t('servicio_security_totalav_feature4'),
        ],
      },
    ],
  };

  return <ServicePage data={data} />;
}