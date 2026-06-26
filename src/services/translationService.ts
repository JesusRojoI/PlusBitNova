'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

let cache: any = null;
let cacheTimestamp = 0;
const CACHE_TTL = 60 * 1000; // 1 minuto

export async function loadTranslations() {
  try {
    // Verificar caché
    const now = Date.now();
    if (cache && (now - cacheTimestamp) < CACHE_TTL) {
      console.log('📦 Usando caché de traducciones');
      return cache;
    }

    console.log('🔍 Cargando traducciones desde Supabase...');

    const { data, error } = await supabase
      .from('translations')
      .select('namespace, key, es, en');

    if (error) {
      console.error('❌ Error en la consulta:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('⚠️ No se encontraron traducciones en la base de datos');
      return { es: {}, en: {} };
    }

    console.log(`✅ ${data.length} traducciones cargadas`);

    // Convertir a formato i18next
    const resources: any = { es: {}, en: {} };

    data.forEach((item: any) => {
      const ns = item.namespace || 'common';
      
      if (!resources.es[ns]) resources.es[ns] = {};
      if (!resources.en[ns]) resources.en[ns] = {};
      
      resources.es[ns][item.key] = item.es;
      resources.en[ns][item.key] = item.en;
    });

    // Guardar en caché
    cache = resources;
    cacheTimestamp = now;

    return resources;
  } catch (error) {
    console.error('❌ Error loading translations:', error);
    // Devolver recursos vacíos para no romper la app
    return { es: {}, en: {} };
  }
}