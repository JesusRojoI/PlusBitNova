// src/i18n/config.ts
'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones
import esCommon from './locales/es/common.json';
import esHeader from './locales/es/header.json';
import esCheckout from './locales/es/checkout.json';
import esCart from './locales/es/cart.json';
import esPago from './locales/es/pago.json';

import enCommon from './locales/en/common.json';
import enHeader from './locales/en/header.json';
import enCheckout from './locales/en/checkout.json';
import enCart from './locales/en/cart.json';
import enPago from './locales/en/pago.json';

const resources = {
  es: {
    common: esCommon,
    header: esHeader,
    checkout: esCheckout,
    cart: esCart,
    pago: esPago,
  },
  en: {
    common: enCommon,
    header: enHeader,
    checkout: enCheckout,
    cart: enCart,
    pago: enPago,
  },
};

// Inicializar i18n
if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'es',
      defaultNS: 'common',
      ns: ['common', 'header', 'checkout', 'cart', 'pago'],
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['cookie', 'localStorage', 'navigator'],
        caches: ['cookie', 'localStorage'],
        cookieMinutes: 60 * 24 * 30, // 30 días
      },
    });
}

export default i18n;