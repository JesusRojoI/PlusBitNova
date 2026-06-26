// src/components/LanguageSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
];

export function LanguageSelector() {
  const { i18n, t } = useTranslation('header');
  const [mounted, setMounted] = useState(false);
  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('i18n', langCode);
    document.cookie = `i18n=${langCode}; path=/; max-age=${60 * 60 * 24 * 30}`;
    window.location.reload();
  };

  // Durante el renderizado en el servidor, mostrar solo el icono sin texto
  if (!mounted) {
    return (
      <button className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-foreground transition-colors hover:bg-sw-cloud">
        <Globe className="h-5 w-5" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-foreground transition-colors hover:bg-sw-cloud">
        <Globe className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-sw-navy border-white/10 text-white min-w-[160px]">
        {languages.map((lang) => {
          const isActive = currentLang.code === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              className={`cursor-pointer hover:bg-white/10 flex items-center justify-between ${
                isActive ? 'bg-white/10 text-primary' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span>{lang.flag}</span>
                {lang.label}
              </span>
              {isActive && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}