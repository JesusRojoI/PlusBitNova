'use client';

import { useState, useEffect } from "react";
import { SectionLabel } from "@/components/section-label";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

const IMG = "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80";

// 📝 Textos originales en español (fallback)
const TEXTS = {
  sectionLabel: '¿Por qué escogernos?',
  title: 'En Safeware aplicamos un enfoque distinto a cada proyecto.',
  imageAlt: 'Especialistas de Safeware revisando sistemas',
  closing: 'Compartimos nuestra experiencia y compromiso en cada proyecto para construir relaciones duraderas basadas en confianza. Te acompañamos en todo el ciclo de vida para lograr resultados reales.'
};

// 📝 Textos de las tarjetas (razones)
const REASONS_TEXTS = [
  {
    n: "01",
    title: 'Personal Especializado',
    body: 'Contamos con expertos preparados para atender los retos de tu empresa.'
  },
  {
    n: "02",
    title: 'Proactive Approach',
    body: 'Actuamos con prevención, revisando y cuidando tus sistemas antes de que surjan fallas.'
  },
  {
    n: "04",
    title: 'Medidas de seguridad robustas',
    body: 'Ponemos tus datos y sistemas protegidos con soluciones seguras y confiables.'
  },
  {
    n: "03",
    title: 'Soluciones y escalabilidad',
    body: 'Cada empresa es diferente, por eso diseñamos soluciones que crecen con tu negocio.'
  }
];

export function PorQue() {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState(TEXTS);
  const [reasons, setReasons] = useState(REASONS_TEXTS);
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
          setTranslations(TEXTS);
          setReasons(REASONS_TEXTS);
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
    <section className="bg-royal-radial py-20 sm:py-28 relative z-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Top: heading + image */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <SectionLabel variant="dark">
              {loading ? '...' : translate('porque_sectionLabel')}
            </SectionLabel>
            <h2 className="mt-6 max-w-md font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl">
              {loading ? '...' : translate('porque_title')}
            </h2>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-2xl">
            <img
              src={IMG}
              alt={loading ? '...' : translate('porque_imageAlt')}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {reasons.map((r, index) => {
            const titleKey = `porque_reason${index + 1}_title`;
            const bodyKey = `porque_reason${index + 1}_body`;
            return (
              <div
                key={r.n}
                className="rounded-2xl border border-white/15 bg-card/95 p-7 backdrop-blur-sm transition-colors hover:bg-white/[0.08] sm:p-8"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                  </span>
                  <span className="font-display text-sm font-bold text-white/80">
                    {r.n}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-extrabold text-primary sm:text-2xl">
                  {loading ? '...' : translate(titleKey)}
                </h3>
                <div className="mt-4 h-px w-full bg-white/20" />
                <p className="mt-4 text-sm leading-relaxed text-white/75">
                  {loading ? '...' : translate(bodyKey)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Closing statement */}
        <p className="mx-auto mt-16 max-w-4xl text-center font-display text-2xl font-medium leading-snug text-white sm:text-[2rem]">
          {loading ? '...' : translate('porque_closing')}
        </p>
      </div>

      {/* === CAPA NEGRA PARA ELIMINAR LA DIAGONAL === */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black -mb-8 pointer-events-none"></div>
    </section>
  );
}