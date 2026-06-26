import { MapPin, Phone, Mail } from "lucide-react";

const LOGO = "/logo.png";
const PAY_MASTERCARD = "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/mastercard.svg";
const PAY_VISA = "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/visa.svg";

const servicios = [
  "Soporte y Mantenimiento de Software",
  "Seguridad Informática",
  "Soporte Remoto y en Sitio",
  "Soporte Personalizado",
];

const legal = [
  "Aviso de Privacidad Integral",
  "Términos y Condiciones",
  "Políticas de Devolución Reembolso",
];

export function Footer() {
  return (
    <footer className="bg-card">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        {/* Top */}
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col items-start gap-4">
            <img src={LOGO} alt="SafeWare Solutions" className="h-16 w-auto" />
            <div className="flex items-center gap-3">
              <img src={PAY_MASTERCARD} alt="Mastercard" className="h-8 w-auto filter invert" />
              <img src={PAY_VISA} alt="Visa" className="h-8 w-auto filter invert" />
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Contacto
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href="tel:5555332511"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-primary" /> 55 5533 2511
                </a>
              </li>
              <li>
                <a
                  href="mailto:gestion@safeware.com.mx"
                  className="inline-flex items-center gap-2 transition-colors hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-primary" /> gestion@safeware.com.mx
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Servicios
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-foreground/70">
              <li>
                <a
                  href="/soporte-y-mantenimiento-de-software"
                  className="transition-colors hover:text-primary"
                >
                  Soporte y Mantenimiento de Software
                </a>
              </li>
              <li>
                <a
                  href="/seguridad-informatica"
                  className="transition-colors hover:text-primary"
                >
                  Seguridad Informática
                </a>
              </li>
              <li>
                <a
                  href="/soporte-remoto-y-en-sitio"
                  className="transition-colors hover:text-primary"
                >
                  Soporte Remoto y en Sitio
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-foreground">
              Encuéntranos en
            </h4>
              <p className="mt-5 flex items-start gap-2 text-sm leading-relaxed text-foreground/70">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              Calle Londres 275, Int. A, Col. Juárez, Cuauhtémoc, C.P. 06600,
              CDMX
            </p>
          </div>
        </div>
      </div>

      {/* Legal bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 text-xs text-white/60 sm:flex-row sm:gap-0 sm:px-8">
          {legal.map((l, i) => (
            <span key={l} className="flex items-center">
              <a href="#" className="transition-colors hover:text-primary">
                {l}
              </a>
              {i < legal.length - 1 && (
                <span className="mx-4 hidden text-white/25 sm:inline">|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
