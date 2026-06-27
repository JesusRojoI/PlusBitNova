'use client';

import { useState, useEffect } from "react";
import { ShieldPlus, RotateCw, TrendingUp } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

const ABOUT_IMG = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80";

function Badge24() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-[10px] border-2 border-white/10">
      <span className="font-display text-sm font-extrabold text-white">24</span>
      <span className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 border-b-2 border-r-2 border-white/20 bg-white" />
    </div>
  );
}

// 📝 Textos originales en español (fallback)
const TEXTS = {
  sectionLabel: '¿Quiénes somos?',
  title: 'Ofrecemos seguridad, soporte y mantenimiento continuo para tus sistemas.',
  description: 'En un entorno digital mucho más exigente, nos enfocamos en entregar protección avanzada, asistencia experta y mantenimiento constante. Así, tus procesos son más seguros, ágiles y confiables, con menos riesgos y mayor productividad para tu equipo.',
  imageAlt: 'Especialistas de Safeware atendiendo a un cliente',
  feature1_title: 'Seguridad',
  feature1_body: 'Protegemos los datos de tu empresa con controles tecnológicos sólidos y buenos hábitos digitales.',
  feature2_title: 'Actualización',
  feature2_body: 'Mantenemos tus sistemas al día para que trabajen con rapidez, estabilidad y menos interrupciones.',
  feature3_title: 'Flexibilidad y escalabilidad',
  feature3_body: 'Nuestro soporte se ajusta a los cambios de tu empresa y evoluciona junto con tus necesidades.',
  feature4_title: 'Atención al cliente',
  feature4_body: 'Responder con rapidez a preguntas y problemas mejora la experiencia del cliente y refuerza tu reputación.'
};

// 📝 Características con iconos (los iconos no se traducen)
const FEATURES = [
  {
    icon: <ShieldPlus className="h-10 w-10 text-white" strokeWidth={1.6} />,
    titleKey: 'feature1_title',
    bodyKey: 'feature1_body'
  },
  {
    icon: <RotateCw className="h-10 w-10 text-white" strokeWidth={1.6} />,
    titleKey: 'feature2_title',
    bodyKey: 'feature2_body'
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-white" strokeWidth={1.6} />,
    titleKey: 'feature3_title',
    bodyKey: 'feature3_body'
  },
  {
    icon: <Badge24 />,
    titleKey: 'feature4_title',
    bodyKey: 'feature4_body'
  }
];

export function QuienesSomos() {
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
    <section id="somos" className="bg-background py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Framed image */}
        <div className="relative mx-auto mb-16 w-full max-w-3xl">
          <span className="absolute -left-4 -top-6 -z-0 h-32 w-32 rounded-3xl bg-muted sm:h-44 sm:w-44" />
          <img
            src={ABOUT_IMG}
            alt={loading ? '...' : translate('quienes_imageAlt')}
            className="relative z-10 aspect-[16/9] w-full rounded-3xl object-cover shadow-xl"
          />
        </div>

        {/* Intro copy */}
        <div className="max-w-3xl">
          <SectionLabel variant="dark">
            {loading ? '...' : translate('quienes_sectionLabel')}
          </SectionLabel>
          <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-foreground sm:text-[2.6rem]">
            {loading ? '...' : translate('quienes_title')}
          </h2>
          <p className="mt-6 text-base leading-relaxed text-foreground/70">
            {loading ? '...' : translate('quienes_description')}
          </p>
        </div>

        {/* Feature grid */}
        <div className="mt-14 overflow-hidden rounded-3xl">
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <div
                key={f.titleKey}
                className={[
                  "p-8 sm:p-10 bg-card/90 rounded-3xl",
                  i % 2 === 0 ? "sm:border-r" : "",
                  i < 2 ? "sm:border-b" : "",
                  i === 0 ? "border-b sm:border-b" : "",
                  i === 1 ? "border-b sm:border-b" : "",
                  i === 2 ? "border-b sm:border-b-0" : "",
                  "border-white/10",
                ].join(" ")}
              >
                <div className="mb-6">{f.icon}</div>
                <h3 className="font-display text-2xl font-extrabold text-foreground sm:text-3xl">
                  {loading ? '...' : translate(f.titleKey)}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                  {loading ? '...' : translate(f.bodyKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}