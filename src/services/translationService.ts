// src/services/translationService.ts
'use server';

import fs from 'fs';
import path from 'path';

function loadJsonFile(lang: string, namespace: string): Record<string, string> {
  try {
    const filePath = path.join(process.cwd(), 'src', 'i18n', 'locales', lang, `${namespace}.json`);
    console.log(`📂 Leyendo archivo: ${filePath}`);
    
    // Verificar si el archivo existe
    if (!fs.existsSync(filePath)) {
      console.error(`❌ El archivo NO existe: ${filePath}`);
      return {};
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    console.log(`✅ ${lang}/${namespace}.json cargado: ${Object.keys(data).length} claves`);
    
    // Mostrar las primeras 5 claves para verificar
    const keys = Object.keys(data).slice(0, 5);
    console.log(`📝 Claves de ejemplo: ${keys.join(', ')}`);
    
    return data;
  } catch (error) {
    console.error(`❌ Error cargando ${lang}/${namespace}.json:`, error);
    return {};
  }
}

export async function loadTranslations() {
  try {
    console.log('📂 Cargando traducciones desde archivos locales...');

    const resources: any = { es: {}, en: {} };
    const namespaces = ['common'];
    const languages = ['es', 'en'];

    for (const lang of languages) {
      for (const ns of namespaces) {
        const data = loadJsonFile(lang, ns);
        if (Object.keys(data).length > 0) {
          if (!resources[lang][ns]) resources[lang][ns] = {};
          Object.assign(resources[lang][ns], data);
        }
      }
    }

    console.log(`📦 Traducciones cargadas: ES: ${Object.keys(resources.es.common).length}, EN: ${Object.keys(resources.en.common).length}`);
    
    // Verificar que las claves de términos están cargadas
    if (resources.es.common) {
      const hasTerminos = Object.keys(resources.es.common).some(k => k.startsWith('terminos_'));
      console.log(`📋 ¿Claves de términos en ES? ${hasTerminos ? '✅ Sí' : '❌ No'}`);
    }
    
    return resources;
  } catch (error) {
    console.error('❌ Error en loadTranslations:', error);
    return { es: { common: {} }, en: { common: {} } };
  }
}