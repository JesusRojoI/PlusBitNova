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
        console.log('📦 Traducciones cargadas en Soporte y Mantenimiento:', data);
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
    title: t('servicio_support_title'),
    heroSubtitle: t('servicio_support_heroSubtitle'),
    heroImage: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=1200&h=600&fit=crop&crop=center",
    servicioHeading: t('servicio_support_heading'),
    servicioImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=500&fit=crop&crop=center",
    servicioText: (
      <>
        {t('servicio_support_text')}
      </>
    ),
    note: t('servicio_support_note'),
    variant: "price" as const,
    services: [
      {
        title: t('servicio_support_service1_title'),
        desc: t('servicio_support_service1_desc'),
        price: "500",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service2_title'),
        desc: t('servicio_support_service2_desc'),
        price: "2,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service3_title'),
        desc: t('servicio_support_service3_desc'),
        price: "4,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service4_title'),
        desc: t('servicio_support_service4_desc'),
        price: "800",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service5_title'),
        desc: t('servicio_support_service5_desc'),
        price: "6,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service6_title'),
        desc: t('servicio_support_service6_desc'),
        price: "11,700",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service7_title'),
        desc: t('servicio_support_service7_desc'),
        price: "1,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service8_title'),
        desc: t('servicio_support_service8_desc'),
        price: "3,800",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service9_title'),
        desc: t('servicio_support_service9_desc'),
        price: "10,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
      {
        title: t('servicio_support_service10_title'),
        desc: t('servicio_support_service10_desc'),
        price: "18,000",
        unit: t('servicio_support_price') || "MXN + IVA",
      },
    ],
  };

  return <ServicePage data={data} />;
}