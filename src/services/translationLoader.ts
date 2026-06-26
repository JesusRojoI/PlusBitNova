'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function loadTranslationsFromSupabase() {
  try {
    const { data, error } = await supabase
      .from('translations')
      .select('namespace, key, es, en');

    if (error) throw error;

    if (!data || data.length === 0) {
      return null;
    }

    const resources: any = { es: {}, en: {} };

    data.forEach((item: any) => {
      const ns = item.namespace || 'common';
      if (!resources.es[ns]) resources.es[ns] = {};
      if (!resources.en[ns]) resources.en[ns] = {};
      resources.es[ns][item.key] = item.es;
      resources.en[ns][item.key] = item.en;
    });

    return resources;
  } catch (error) {
    console.error('Error cargando traducciones:', error);
    return null;
  }
}