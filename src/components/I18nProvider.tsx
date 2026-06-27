'use client';

import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Verificar que i18n está inicializado
    if (i18n.isInitialized) {
      setIsReady(true);
    } else {
      // Si no, inicializar
      i18n.init().then(() => {
        setIsReady(true);
      }).catch(() => {
        setIsReady(true); // Mostrar aunque falle
      });
    }
  }, []);

  if (!isReady) {
    return <>{children}</>;
  }

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}