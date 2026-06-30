'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
// Importar la Server Action
import { sendCotizacionAction } from "@/app/actions/send-cotizacion";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";

interface ContactModalCtx {
  open: () => void;
  close: () => void;
}

const Ctx = createContext<ContactModalCtx | null>(null);

// 📝 Textos originales en español (fallback)
const TEXTS = {
  title: 'Solicita tu cotización',
  description: 'Dinos qué necesitas y uno de nuestros especialistas te contactará lo antes posible.',
  successTitle: '¡Solicitud recibida!',
  successDesc: 'Gracias por escribirnos. Te responderemos en breve.',
  name: 'Nombre *',
  namePlaceholder: 'Tu nombre',
  phone: 'Teléfono',
  phonePlaceholder: '55 0000 0000',
  email: 'Correo electrónico *',
  emailPlaceholder: 'tucorreo@empresa.com',
  message: '¿Cómo podemos ayudarte? *',
  messagePlaceholder: 'Describe brevemente lo que necesitas…',
  submit: 'Enviar solicitud',
  sending: 'Enviando...',
  errorSubmit: 'Error al enviar la solicitud',
  errorRetry: 'Error al enviar la solicitud. Intenta nuevamente.'
};

export function useContactModal() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useContactModal must be used within ContactModalProvider");
  }
  return ctx;
}

export function ContactModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // 👉 CAMBIADO: usar 'language' en lugar de 'locale'
  const { t, language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [translations, setTranslations] = useState(TEXTS);

  // Función de traducción con fallback
  const translate = (key: string): string => {
    const value = t(key);
    return value || TEXTS[key as keyof typeof TEXTS] || key;
  };

  // Cargar traducciones al iniciar
  useEffect(() => {
    const loadTrans = async () => {
      const data = await loadTranslations();
      if (data && data.en) {
        // Las traducciones se cargan en el hook useTranslation
        // Solo forzamos un re-render
        setTranslations(TEXTS);
      }
    };
    loadTrans();
  }, []);

  const open = useCallback(() => {
    setSubmitted(false);
    setError("");
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close }), [open, close]);

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      
      // 👉 CAMBIADO: usar 'language' en lugar de 'locale'
      formData.append('idioma', language || 'es');
      
      const result = await sendCotizacionAction(formData);

      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || translate('contact_modal_errorSubmit'));
      }
    } catch (err) {
      setError(translate('contact_modal_errorRetry'));
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Estilo base para todos los inputs (fondo oscuro, texto claro)
  const inputStyle = {
    backgroundColor: "rgba(255,255,255,0.08)",
    color: "#ffffff",
    WebkitTextFillColor: "#ffffff",
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg overflow-hidden border-0 p-0 bg-sw-navy">
          <div className="bg-sw-navy px-7 py-7">
            <DialogHeader className="space-y-2 text-left">
              <DialogTitle className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                {translate('contact_modal_title')}
              </DialogTitle>
              <DialogDescription className="text-sm text-white/70">
                {translate('contact_modal_description')}
              </DialogDescription>
            </DialogHeader>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center gap-3 px-7 py-12 text-center bg-sw-navy">
              <CheckCircle2 className="h-14 w-14 text-emerald-500" />
              <h3 className="font-display text-xl font-bold text-white">
                {translate('contact_modal_successTitle')}
              </h3>
              <p className="max-w-sm text-sm text-white/70">
                {translate('contact_modal_successDesc')}
              </p>
            </div>
          ) : (
            <form className="space-y-4 px-7 py-7 bg-sw-navy" onSubmit={handleSubmit}>
              {/* 👉 CAMBIADO: usar 'language' en lugar de 'locale' */}
              <input type="hidden" name="idioma" value={language || 'es'} />
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cm-name" className="text-white/80 font-medium">
                    {translate('contact_modal_name')}
                  </Label>
                  <Input
                    id="cm-name"
                    name="nombre"
                    placeholder={translate('contact_modal_namePlaceholder')}
                    required
                    className="w-full px-4 py-2 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                    style={inputStyle}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="cm-phone" className="text-white/80 font-medium">
                    {translate('contact_modal_phone')}
                  </Label>
                  <Input
                    id="cm-phone"
                    name="telefono"
                    placeholder={translate('contact_modal_phonePlaceholder')}
                    className="w-full px-4 py-2 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cm-email" className="text-white/80 font-medium">
                  {translate('contact_modal_email')}
                </Label>
                <Input
                  id="cm-email"
                  name="email"
                  type="email"
                  placeholder={translate('contact_modal_emailPlaceholder')}
                  required
                  className="w-full px-4 py-2 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                  style={inputStyle}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="cm-msg" className="text-white/80 font-medium">
                  {translate('contact_modal_message')}
                </Label>
                <Textarea
                  id="cm-msg"
                  name="mensaje"
                  rows={4}
                  placeholder={translate('contact_modal_messagePlaceholder')}
                  required
                  className="w-full px-4 py-2 border border-white/20 rounded-lg placeholder:text-white/40 focus:border-white/50 focus:ring-2 focus:ring-white/20 resize-none"
                  style={inputStyle}
                />
              </div>

              {/* Mostrar error si existe */}
              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
                  ❌ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {translate('contact_modal_sending')}
                  </span>
                ) : (
                  <>
                    {translate('contact_modal_submit')}
                    <ArrowRight className="h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Estilos GLOBALES para forzar color blanco siempre */}
      <style jsx global>{`
        /* Chrome, Safari, Edge, Opera - Autofill */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        textarea:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #1a1a2e inset !important;
          -webkit-text-fill-color: #ffffff !important;
          background-color: #1a1a2e !important;
          background-clip: content-box !important;
          border-color: rgba(255,255,255,0.3) !important;
          color: #ffffff !important;
        }

        /* Firefox - Autofill */
        input:-moz-autofill,
        textarea:-moz-autofill {
          background-color: #1a1a2e !important;
          color: #ffffff !important;
        }

        /* Todos los navegadores - Autofill */
        input:autofill,
        textarea:autofill {
          background-color: #1a1a2e !important;
          color: #ffffff !important;
        }

        /* Inputs y textareas dentro del modal */
        .bg-sw-navy input,
        .bg-sw-navy textarea {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff !important;
        }

        /* Placeholders en blanco con opacidad */
        .bg-sw-navy input::placeholder,
        .bg-sw-navy textarea::placeholder {
          color: rgba(255, 255, 255, 0.4) !important;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.4) !important;
        }

        /* Forzar cursor blanco */
        .bg-sw-navy input,
        .bg-sw-navy textarea {
          caret-color: #ffffff !important;
        }

        /* Transición suave para autofill */
        input:-webkit-autofill {
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </Ctx.Provider>
  );
}