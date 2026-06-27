'use client';

import { useState, useEffect, useCallback } from 'react';
import { loadTranslations } from '@/services/translationService';

// 🗄️ Clave para localStorage
const CACHE_KEY = 'translations_cache';
const VERSION_KEY = 'translations_version';
const CURRENT_VERSION = '1.0.0';

export function useTranslation() {
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isReady, setIsReady] = useState(false);
  const [translations, setTranslations] = useState<Record<string, any>>({});

  useEffect(() => {
    const init = async () => {
      try {
        // 🔍 Cargar idioma guardado
        let saved = localStorage.getItem('language') as 'es' | 'en';
        if (saved !== 'es' && saved !== 'en') {
          saved = 'es';
          localStorage.setItem('language', 'es');
        }
        setLanguage(saved);

        // 📦 Intentar cargar desde localStorage PRIMERO
        const cachedData = localStorage.getItem(CACHE_KEY);
        const cachedVersion = localStorage.getItem(VERSION_KEY);
        
        let data: any = null;
        let fromCache = false;

        if (cachedData && cachedVersion === CURRENT_VERSION) {
          try {
            data = JSON.parse(cachedData);
            fromCache = true;
            console.log('📦 Usando traducciones desde localStorage (rápido!)');
          } catch (e) {
            console.warn('⚠️ Error al parsear caché:', e);
          }
        }

        // Si no hay caché, cargar desde archivos
        if (!data) {
          console.log('📦 Cargando traducciones desde archivos...');
          data = await loadTranslations();
          // Guardar en localStorage para futuras veces
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
            console.log('💾 Traducciones guardadas en localStorage');
          } catch (e) {
            console.warn('⚠️ Error al guardar en localStorage:', e);
          }
        }
        
        if (data) {
          setTranslations(data);
          console.log('✅ Traducciones listas:', 
            'ES:', Object.keys(data.es?.common || {}).length, 
            'EN:', Object.keys(data.en?.common || {}).length
          );
        }
      } catch (error) {
        console.warn('⚠️ Error:', error);
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  const changeLanguage = useCallback((lang: 'es' | 'en') => {
    console.log('🔄 Cambiando idioma a:', lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // ✅ Recarga instantánea porque las traducciones ya están en memoria
    window.location.reload();
  }, []);

  const t = useCallback((text: string): string => {
    if (!translations || Object.keys(translations).length === 0) {
      return text;
    }

    if (language === 'es') {
      if (translations.es) {
        for (const ns of Object.keys(translations.es)) {
          if (translations.es[ns] && translations.es[ns][text] !== undefined) {
            return translations.es[ns][text] || text;
          }
        }
      }
      return text;
    }

    if (language === 'en') {
      if (translations.en) {
        for (const ns of Object.keys(translations.en)) {
          if (translations.en[ns] && translations.en[ns][text] !== undefined) {
            return translations.en[ns][text] || text;
          }
        }
      }
      return text;
    }

    return text;
  }, [language, translations]);

  return { t, language, changeLanguage, isReady };
}