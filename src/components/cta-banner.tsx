'use client';

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";  
import { useContactModal } from "@/components/contact-modal";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

const IMG = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

// 📝 Textos originales en español (fallback)
const TEXTS = {
  title: 'Renueva, protege y maximiza el potencial de tu negocio.',
  imageAlt: 'Equipo de trabajo colaborando'
};

export function CtaBanner() {
  const { open } = useContactModal();
  const { t } = useTranslation();
  const [translations, setTranslations] = useState(TEXTS);
  const [loading, setLoading] = useState(false);

  // Función de traducción con fallback
  const translate = (key: string): string => {
    const value = t(key);
    return value || TEXTS[key as keyof typeof TEXTS] || key;
  };

  // Cargar traducciones al iniciar
  useEffect(() => {
    const loadTrans = async () => {
      setLoading(true);
      try {
        const data = await loadTranslations();
        if (data && data.en) {
          // Las traducciones se cargan en el hook useTranslation
          // Solo forzamos un re-render
          setTranslations(TEXTS);
        }
      } catch (error) {
        console.error('❌ Error cargando traducciones:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTrans();
  }, []);

  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <img
            src={IMG}
            alt={loading ? '...' : translate('cta_imageAlt')}
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl">
            {loading ? '...' : translate('cta_title')}
          </h2>
        </div>
      </div>
    </section>
  );
}