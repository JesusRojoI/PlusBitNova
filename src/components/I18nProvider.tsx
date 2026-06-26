'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n, { loadTranslationsFromSupabase } from '@/i18n/config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      console.log('🔄 I18nProvider: Cargando traducciones...');
      
      // Cargar traducciones desde Supabase
      const loaded = await loadTranslationsFromSupabase();
      
      if (loaded) {
        console.log('✅ I18nProvider: Traducciones cargadas');
      } else {
        console.warn('⚠️ I18nProvider: Usando traducciones por defecto');
      }
      
      setIsReady(true);
    };

    load();
  }, []);

  if (!isReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}