'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart-context";
import { CheckoutNotification } from "@/components/checkout-notification";
import { 
  Shield, 
  FileText, 
  Building2, 
  Plus, 
  Lock, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export default function PagaTuCotizacionPage() {
  const router = useRouter();
  const { addItem, items } = useCart();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    cotizacionId: "",
    monto: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  // Verificar si la cotización ya está en el carrito
  const cotizacionEnCarrito = items.some(
    item => item.id === "cotizacion-personalizada"
  );

  // ============================================
  // VALIDACIONES
  // ============================================
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.cotizacionId.trim()) {
      newErrors.cotizacionId = t('pago_quoteIdError') || "El ID de cotización es requerido";
    } else if (!/^PT-\d{4}-\d{3}$/.test(formData.cotizacionId.trim())) {
      newErrors.cotizacionId = t('pago_quoteIdInvalid') || "Formato inválido. Ejemplo: PT-2026-001";
    }

    const montoNum = parseFloat(formData.monto);
    if (!formData.monto) {
      newErrors.monto = t('pago_amountRequired') || "El monto es requerido";
    } else if (isNaN(montoNum) || montoNum <= 0) {
      newErrors.monto = t('pago_amountInvalid') || "Ingresa un monto válido mayor a 0";
    } else if (montoNum > 999999.99) {
      newErrors.monto = t('pago_amountMax') || "El monto no puede exceder $999,999.99";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // MANEJAR ENVÍO
  // ============================================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setNotification({ type: null, message: "" });

    if (!validateForm()) {
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setNotification({
        type: "error",
        message: t('pago_formErrors') || "Por favor, corrige los errores en el formulario"
      });
      return;
    }

    setIsLoading(true);

    try {
      const montoNum = parseFloat(formData.monto);
      const iva = montoNum * 0.16;
      const total = montoNum + iva;

      if (cotizacionEnCarrito) {
        setNotification({
          type: "error",
          message: t('pago_alreadyInCart') || "Ya tienes una cotización en el carrito. Solo puedes agregar una."
        });
        setIsLoading(false);
        return;
      }

      addItem({
        id: "cotizacion-personalizada",
        title: `${t('pago_quote')} ${formData.cotizacionId}`,
        price: montoNum,
        unit: t('pago_unit') || "Cotización",
        metadata: {
          cotizacionId: formData.cotizacionId,
          iva: iva,
          total: total,
          tipo: "cotizacion"
        }
      });

      setSuccess(true);
      
      setNotification({
        type: "success",
        message: `${t('pago_quote')} ${formData.cotizacionId} ${t('pago_addedToCart')} $${montoNum.toFixed(2)}`
      });

      setTimeout(() => {
        setFormData({ cotizacionId: "", monto: "" });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error al agregar cotización:", error);
      setNotification({
        type: "error",
        message: t('pago_errorAdding') || "Error al agregar la cotización al carrito. Intenta nuevamente."
      });
      setErrors({ general: t('pago_errorAdding') || "Error al agregar la cotización al carrito" });
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================
  // MANEJAR INPUTS
  // ============================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cotizacionId") {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // ============================================
  // FORMATO DE MONTO
  // ============================================
  const formatMonto = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return "$0.00";
    return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };

  const montoNum = parseFloat(formData.monto) || 0;
  const ivaCalculado = montoNum * 0.16;
  const totalCalculado = montoNum + ivaCalculado;

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-b from-sw-navy to-sw-royal-dark">
      <div className="max-w-6xl mx-auto">
        <CheckoutNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('pago_title')}
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            {t('pago_description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold">{t('pago_security')}</h3>
              </div>
              <p className="text-white/60 text-sm">
                {t('pago_securityDesc')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold">{t('pago_billing')}</h3>
              </div>
              <p className="text-white/60 text-sm">
                {t('pago_billingDesc')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold">{t('pago_enterprise')}</h3>
              </div>
              <p className="text-white/60 text-sm">
                {t('pago_enterpriseDesc')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Image
                src="/logo.png"
                alt="PlusBitNova"
                width={120}
                height={40}
                className="mx-auto opacity-80"
              />
              <p className="text-white/40 text-xs mt-2">
                {t('pago_premium')}
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-2">
                {t('pago_formTitle')}
              </h2>
              <p className="text-white/60 text-sm mb-6">
                {t('pago_formDesc')}
              </p>

              {cotizacionEnCarrito && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-medium">{t('pago_alreadyAdded')}</p>
                    <p className="text-white/60 text-sm">
                      {t('pago_alreadyAddedDesc')}
                    </p>
                  </div>
                </div>
              )}

              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{errors.general}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    {t('pago_quoteId')} *
                  </label>
                  <input
                    type="text"
                    name="cotizacionId"
                    value={formData.cotizacionId}
                    onChange={handleInputChange}
                    placeholder={t('pago_quoteIdPlaceholder')}
                    className={`w-full px-4 py-3 bg-sw-navy/80 border rounded-lg text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                      errors.cotizacionId ? "border-red-500" : "border-white/20"
                    }`}
                    style={{
                      backgroundColor: "#1a1a2e",
                      color: "#e8e8f0",
                      WebkitTextFillColor: "#e8e8f0",
                    }}
                  />
                  {errors.cotizacionId && (
                    <p className="text-sm text-red-400 mt-1 error-message">
                      {errors.cotizacionId}
                    </p>
                  )}
                  <p className="text-white/40 text-xs mt-1">
                    {t('pago_quoteIdFormat')}
                  </p>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    {t('pago_amount')} *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">
                      $
                    </span>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0.01"
                      className={`w-full pl-8 pr-4 py-3 bg-sw-navy/80 border rounded-lg text-white placeholder:text-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                        errors.monto ? "border-red-500" : "border-white/20"
                      }`}
                      style={{
                        backgroundColor: "#1a1a2e",
                        color: "#e8e8f0",
                        WebkitTextFillColor: "#e8e8f0",
                      }}
                    />
                  </div>
                  {errors.monto && (
                    <p className="text-sm text-red-400 mt-1 error-message">
                      {errors.monto}
                    </p>
                  )}
                </div>

                {montoNum > 0 && (
                  <div className="bg-sw-navy/50 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white/80 text-sm font-medium mb-2">
                      {t('pago_summary')}
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>{t('pago_subtotal')}</span>
                        <span className="font-mono">{formatMonto(formData.monto)}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>{t('pago_iva')}</span>
                        <span className="font-mono">${ivaCalculado.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                        <span>{t('pago_total')}</span>
                        <span className="font-mono text-blue-400">
                          ${totalCalculado.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs mt-2">
                      {t('pago_amountImportant')}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading || success || cotizacionEnCarrito}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('pago_adding')}
                    </span>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t('pago_added')}
                    </>
                  ) : cotizacionEnCarrito ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {t('pago_alreadyAdded')}
                    </>
                  ) : (
                    <>
                      {t('pago_add')}
                      <Plus className="w-5 h-5" />
                    </>
                  )}
                </button>

                {success && (
                  <p className="text-emerald-400 text-sm text-center">
                    {t('pago_addedSuccess')}
                  </p>
                )}

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/carrito")}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    {t('pago_viewCart')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-white/30 text-xs">
              <Lock className="w-3 h-3" />
              <span>{t('pago_securePayment')}</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>{t('pago_encrypted')}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .paga-tu-cotizacion-page input:-webkit-autofill,
        .paga-tu-cotizacion-page input:-webkit-autofill:hover,
        .paga-tu-cotizacion-page input:-webkit-autofill:focus,
        .paga-tu-cotizacion-page input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 1000px #1a1a2e inset !important;
          -webkit-text-fill-color: #e8e8f0 !important;
          background-color: #1a1a2e !important;
          color: #e8e8f0 !important;
        }
      `}</style>
    </div>
  );
}