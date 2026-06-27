// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Recursos vacíos por defecto (no cargamos desde Supabase)
const defaultResources = {
  es: {
    common: {},
    header: {},
    checkout: {},
    cart: {},
    pago: {}
  },
  en: {
    common: {},
    header: {},
    checkout: {},
    cart: {},
    pago: {}
  }
};

// Inicializar i18n
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: defaultResources,
      fallbackLng: 'es',
      defaultNS: 'common',
      ns: ['common', 'header', 'checkout', 'cart', 'pago'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage'],
        cookieMinutes: 60 * 24 * 30,
      },
      react: {
        useSuspense: false,
      },
    });

  console.log('✅ i18n inicializado (config)');
}

export default i18n;