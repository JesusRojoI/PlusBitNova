// src/components/Translate.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTranslation } from '@/services/translationService';

interface TranslateProps {
  text: string;
  lang?: 'es' | 'en';
}

export function Translate({ text, lang = 'es' }: TranslateProps) {
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    const translate = async () => {
      const result = await getTranslation(text, lang);
      setTranslated(result);
    };
    translate();
  }, [text, lang]);

  return <span>{translated}</span>;
}