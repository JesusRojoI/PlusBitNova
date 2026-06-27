'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

const BG = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80";

// 📝 Textos originales en español (fallback)
const TEXTS = {
  sectionLabel: 'Nuestros Servicios',
  title: 'Encuentra el mejor Servicio',
  description: 'Desde un equipo de TI completo hasta una asesoría puntual, Safeware ofrece la solución que tu empresa necesita.'
};

// 📝 Títulos de los servicios (con números fijos)
const SERVICES_TEXTS = [
  { 
    n: "01", 
    title: 'Soporte y Mantenimiento de Software', 
    href: '/soporte-y-mantenimiento-de-software',
    translationKey: 'servicios_support' // ✅ Clave para traducción
  },
  { 
    n: "02", 
    title: 'Seguridad Informática', 
    href: '/seguridad-informatica',
    translationKey: 'servicios_security' // ✅ Clave para traducción
  },
  { 
    n: "03", 
    title: 'Soporte Remoto y en Sitio', 
    href: '/soporte-remoto-y-en-sitio',
    translationKey: 'servicios_remote' // ✅ Clave para traducción
  }
];

export function Servicios() {
  const router = useRouter();
  const { t } = useTranslation();
  const [translations, setTranslations] = useState(TEXTS);
  const [services, setServices] = useState(SERVICES_TEXTS);
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
          setServices(SERVICES_TEXTS);
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
    <section
      id="servicios"
      className="relative overflow-hidden bg-sw-royalDark bg-cover bg-center py-20 sm:py-28"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background))]/85 via-[hsl(var(--card))]/55 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionLabel variant="dark">
          {loading ? '...' : translate('servicios_sectionLabel')}
        </SectionLabel>
        <h2 className="mt-6 max-w-2xl font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl">
          {loading ? '...' : translate('servicios_title')}
        </h2>
        <p className="mt-4 max-w-xl text-base text-white/70">
          {loading ? '...' : translate('servicios_description')}
        </p>

        <div className="mt-12 border-t border-white/15">
          {services.map((s) => (
            <button
              key={s.n}
              onClick={() => router.push(s.href)}
              className="group flex w-full items-center gap-6 border-b border-white/15 py-7 text-left transition-colors hover:bg-white/[0.06] sm:gap-10 sm:py-8"
            >
              <span className="font-display text-lg font-semibold text-white/45 sm:text-xl">
                {s.n}.
              </span>
              <span className="flex-1 font-display text-xl font-medium text-white transition-colors group-hover:text-primary sm:text-2xl">
                {loading ? '...' : translate(s.translationKey)}
              </span>
              <ArrowUpRight className="h-6 w-6 shrink-0 text-white/40 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}