// src/components/LanguageSelector.tsx
'use client';

import { useTranslation } from '@/hooks/useTranslation';
import { Globe, Check } from 'lucide-react';

// 🟢 Versión SIMPLE sin dropdown-menu para evitar errores
const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export function LanguageSelector() {
  const { language, changeLanguage } = useTranslation();
  const currentLang = languages.find((l) => l.code === language) || languages[0];

  const handleChange = (lang: 'es' | 'en') => {
    console.log('🔄 Selector: Cambiando a', lang);
    changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => {
        const isActive = currentLang.code === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => handleChange(lang.code as 'es' | 'en')}
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            aria-label={`Cambiar a ${lang.label}`}
          >
            <span className="flex items-center gap-1.5">
              <span>{lang.flag}</span>
              <span className="hidden sm:inline">{lang.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}