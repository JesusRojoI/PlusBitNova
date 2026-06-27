'use client';

import { useContactModal } from "@/components/contact-modal";
import { useTranslation } from '@/hooks/useTranslation';

const HERO_IMG = "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80";

export function Hero() {
  const { open } = useContactModal();
  const { t } = useTranslation();

  return (
    <section id="top" className="relative overflow-hidden bg-card">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:py-24">
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-[2.7rem] font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-6xl">
            {t('hero_title')}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-foreground/70 sm:text-xl">
            {t('hero_description')}
          </p>
          <button
            onClick={open}
            className="inline-flex items-center justify-center rounded-full border border-primary bg-transparent px-9 py-4 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-white/5"
          >
            {t('hero_button')}
          </button>
        </div>
        <div className="relative">
          <div className="hero-clip overflow-hidden rounded-br-[2.5rem] shadow-2xl">
            <img
              src={HERO_IMG}
              alt={t('hero_imageAlt')}
              className="aspect-[5/4] w-full object-cover sm:aspect-[16/11]"
            />
          </div>
          <span className="absolute -bottom-4 left-6 hidden h-3 w-3 rounded-full bg-primary lg:block" />
          <span className="absolute -bottom-4 left-12 hidden h-3 w-3 rounded-full bg-sw-royal lg:block" />
        </div>
      </div>
    </section>
  );
}