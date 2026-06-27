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
        console.log('📦 Traducciones cargadas en Soporte Remoto:', data);
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
    title: t('servicio_remote_title'),
    heroSubtitle: (
      <>
        {t('servicio_remote_heroSubtitle')}
      </>
    ),
    heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop&crop=center",
    servicioHeading: t('servicio_remote_heading'),
    servicioImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=500&fit=crop&crop=center",
    servicioText: (
      <>
        {t('servicio_remote_text')}
      </>
    ),
    variant: "hourly" as const,
    services: [
      {
        title: t('servicio_remote_service1'),
        price: "600",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
      {
        title: t('servicio_remote_service2'),
        price: "90",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
      {
        title: t('servicio_remote_service3'),
        price: "200",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
      {
        title: t('servicio_remote_service4'),
        price: "650",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
      {
        title: t('servicio_remote_service5'),
        price: "350",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
      {
        title: t('servicio_remote_service6'),
        price: "100",
        unit: t('servicio_remote_price') || "MXN P/ Hora + IVA",
      },
    ],
  };

  return <ServicePage data={data} />;
}