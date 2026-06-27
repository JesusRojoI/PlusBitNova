'use client';

import { useState, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

const LOGO = "/logo.png";

// 📝 Textos originales en español (fallback)
const TEXTS = {
  contact: 'Contacto',
  phone: '55 5533 2511',
  email: 'gestion@safeware.com.mx',
  services: 'Servicios',
  support: 'Soporte y Mantenimiento de Software',
  security: 'Seguridad Informática',
  remote: 'Soporte Remoto y en Sitio',
  location: 'Encuéntranos en',
  address: 'Calle Londres 275, Int. A, Col. Juárez, Cuauhtémoc, C.P. 06600, CDMX',
  privacy: 'Aviso de Privacidad Integral',
  terms: 'Términos y Condiciones',
  refund: 'Políticas de Devolución Reembolso',
  rights: 'Todos los derechos reservados'
};

export function Footer() {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState(TEXTS);

  // Función de traducción con fallback
  const translate = (key: string): string => {
    const value = t(key);
    return value || TEXTS[key as keyof typeof TEXTS] || key;
  };

  // Cargar traducciones al iniciar
  useEffect(() => {
    const loadTrans = async () => {
      try {
        const data = await loadTranslations();
        if (data && data.en) {
          setTranslations(TEXTS);
        }
      } catch (error) {
        console.error('❌ Error cargando traducciones:', error);
      }
    };
    loadTrans();
  }, []);

  return (
    <footer className="bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4">
            <img src={LOGO} alt="SafeWare Solutions" className="h-16 w-auto" />
            <div className="flex items-center gap-3">
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/mastercard.svg"
                alt="Mastercard"
                className="h-8 w-auto filter invert"
              />
              <img
                src="https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/visa.svg"
                alt="Visa"
                className="h-8 w-auto filter invert"
              />
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {/* Contacto */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              {translate('footer_contact')}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href="tel:5555332511"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {translate('footer_phone')}
                </a>
              </li>
              <li>
                <a
                  href="mailto:gestion@safeware.com.mx"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 text-primary"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {translate('footer_email')}
                </a>
              </li>
            </ul>
          </div>

          {/* Servicios */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              {translate('footer_services')}
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href="/soporte-y-mantenimiento-de-software"
                  className="transition-colors hover:text-primary"
                >
                  {translate('footer_support')}
                </a>
              </li>
              <li>
                <a
                  href="/seguridad-informatica"
                  className="transition-colors hover:text-primary"
                >
                  {translate('footer_security')}
                </a>
              </li>
              <li>
                <a
                  href="/soporte-remoto-y-en-sitio"
                  className="transition-colors hover:text-primary"
                >
                  {translate('footer_remote')}
                </a>
              </li>
            </ul>
          </div>

          {/* Ubicación */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              {translate('footer_location')}
            </h4>
            <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-foreground/70">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              >
                <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {translate('footer_address')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer inferior */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:gap-0 sm:px-8">
          <span className="flex items-center">
            <a href="#" className="transition-colors hover:text-primary">
              {translate('footer_privacy')}
            </a>
            <span className="mx-4 hidden text-white/25 sm:inline">|</span>
          </span>
          <span className="flex items-center">
            <a href="#" className="transition-colors hover:text-primary">
              {translate('footer_terms')}
            </a>
            <span className="mx-4 hidden text-white/25 sm:inline">|</span>
          </span>
          <span className="flex items-center">
            <a href="#" className="transition-colors hover:text-primary">
              {translate('footer_refund')}
            </a>
          </span>
        </div>
        <div className="text-center text-xs text-white/40 pb-5">
          © {new Date().getFullYear()} SafeWare Solutions. {translate('footer_rights')}
        </div>
      </div>
    </footer>
  );
}

// ✅ Exportación por defecto
export default Footer;