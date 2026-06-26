// src/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { loadTranslations } from '@/services/translationService';

// Recursos vacíos por defecto
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

// Función para cargar traducciones desde Supabase
export async function loadTranslationsFromSupabase() {
  try {
    console.log('📦 Cargando traducciones desde Supabase...');
    const resources = await loadTranslations();
    
    if (resources && resources.es && resources.en) {
      // Actualizar los recursos de i18n
      Object.keys(resources.es).forEach((ns) => {
        if (i18n.store && i18n.store.data) {
          i18n.store.data.es[ns] = resources.es[ns];
          i18n.store.data.en[ns] = resources.en[ns];
        }
      });
      console.log(`✅ ${Object.keys(resources.es).length} namespaces cargados`);
      console.log(`📝 Ejemplo: header.menu = ${resources.es.header?.menu}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Error cargando traducciones:', error);
    return false;
  }
}

export default i18n;