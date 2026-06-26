"use client";

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

export default function PagaTuCotizacionPage() {
  const router = useRouter();
  const { addItem, items } = useCart();
  
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
      newErrors.cotizacionId = "El ID de cotización es requerido";
    } else if (!/^PT-\d{4}-\d{3}$/.test(formData.cotizacionId.trim())) {
      newErrors.cotizacionId = "Formato inválido. Ejemplo: PT-2026-001";
    }

    const montoNum = parseFloat(formData.monto);
    if (!formData.monto) {
      newErrors.monto = "El monto es requerido";
    } else if (isNaN(montoNum) || montoNum <= 0) {
      newErrors.monto = "Ingresa un monto válido mayor a 0";
    } else if (montoNum > 999999.99) {
      newErrors.monto = "El monto no puede exceder $999,999.99";
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
      // Mostrar notificación de error en validación
      setNotification({
        type: "error",
        message: "Por favor, corrige los errores en el formulario"
      });
      return;
    }

    setIsLoading(true);

    try {
      const montoNum = parseFloat(formData.monto);
      const iva = montoNum * 0.16;
      const total = montoNum + iva;

      // Verificar si ya existe una cotización en el carrito
      if (cotizacionEnCarrito) {
        setNotification({
          type: "error",
          message: "Ya tienes una cotización en el carrito. Solo puedes agregar una."
        });
        setIsLoading(false);
        return;
      }

      // Agregar al carrito como un item especial
      addItem({
        id: "cotizacion-personalizada",
        title: `Cotización ${formData.cotizacionId}`,
        price: montoNum,
        //qty: 1,
        unit: "Cotización",
        metadata: {
          cotizacionId: formData.cotizacionId,
          iva: iva,
          total: total,
          tipo: "cotizacion"
        }
      });

      setSuccess(true);
      
      // ✅ NOTIFICACIÓN DE ÉXITO
      setNotification({
        type: "success",
        message: `Cotización ${formData.cotizacionId} agregada al carrito por $${montoNum.toFixed(2)}`
      });

      // Limpiar formulario después de 2 segundos
      setTimeout(() => {
        setFormData({ cotizacionId: "", monto: "" });
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error al agregar cotización:", error);
      
      // ❌ NOTIFICACIÓN DE ERROR
      setNotification({
        type: "error",
        message: "Error al agregar la cotización al carrito. Intenta nuevamente."
      });
      setErrors({ general: "Error al agregar la cotización al carrito" });
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
        {/* NOTIFICACIÓN FLOTANTE */}
        <CheckoutNotification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ type: null, message: "" })}
        />

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Paga tu Cotización
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto">
            Agrega cotizaciones personalizadas acordadas con nuestros especialistas
            y continúa directamente al checkout.
          </p>
        </div>

        {/* Grid principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Info */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold">Seguridad empresarial</h3>
              </div>
              <p className="text-white/60 text-sm">
                Pagos protegidos y cifrados para clientes corporativos.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-white font-semibold">Facturación flexible</h3>
              </div>
              <p className="text-white/60 text-sm">
                Procesa cotizaciones personalizadas y pagos acordados.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold">Tecnología empresarial</h3>
              </div>
              <p className="text-white/60 text-sm">
                Soluciones premium para empresas modernas.
              </p>
            </div>

            {/* Logo */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <Image
                src="/logo.png"
                alt="PlusBitNova"
                width={120}
                height={40}
                className="mx-auto opacity-80"
              />
              <p className="text-white/40 text-xs mt-2">
                Soluciones premium para empresas modernas
              </p>
            </div>
          </div>

          {/* Columna derecha - Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-2">
                Agregar Cotización
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Introduce los datos proporcionados por nuestro equipo.
              </p>

              {cotizacionEnCarrito && (
                <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-emerald-400 font-medium">Cotización ya agregada</p>
                    <p className="text-white/60 text-sm">
                      Ya tienes una cotización en tu carrito. Puedes continuar al checkout.
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
                {/* ID de Cotización */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    ID de Cotización *
                  </label>
                  <input
                    type="text"
                    name="cotizacionId"
                    value={formData.cotizacionId}
                    onChange={handleInputChange}
                    placeholder="Ej. PT-2026-001"
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
                    Formato: PT-YYYY-XXX (ej. PT-2026-001)
                  </p>
                </div>

                {/* Monto */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-1.5">
                    Monto acordado (sin IVA) *
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

                {/* Resumen de cargos */}
                {montoNum > 0 && (
                  <div className="bg-sw-navy/50 rounded-lg p-4 border border-white/10">
                    <h4 className="text-white/80 text-sm font-medium mb-2">
                      Resumen de cargos
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between text-white/60">
                        <span>Subtotal (sin IVA)</span>
                        <span className="font-mono">{formatMonto(formData.monto)}</span>
                      </div>
                      <div className="flex justify-between text-white/60">
                        <span>IVA (16%)</span>
                        <span className="font-mono">${ivaCalculado.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-white">
                        <span>Total a pagar</span>
                        <span className="font-mono text-blue-400">
                          ${totalCalculado.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs mt-2">
                      El IVA será calculado automáticamente durante el checkout.
                    </p>
                  </div>
                )}

                {/* Botón Agregar */}
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
                      Agregando...
                    </span>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      ¡Agregada!
                    </>
                  ) : cotizacionEnCarrito ? (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      Ya está en el carrito
                    </>
                  ) : (
                    <>
                      Agregar al carrito
                      <Plus className="w-5 h-5" />
                    </>
                  )}
                </button>

                {success && (
                  <p className="text-emerald-400 text-sm text-center">
                    ✅ Cotización agregada al carrito exitosamente
                  </p>
                )}

                {/* Enlace al carrito */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => router.push("/carrito")}
                    className="text-white/50 hover:text-white text-sm transition-colors flex items-center justify-center gap-1 mx-auto"
                  >
                    Ver carrito
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Mensaje de seguridad */}
            <div className="mt-4 flex items-center justify-center gap-2 text-white/30 text-xs">
              <Lock className="w-3 h-3" />
              <span>Pago seguro y protegido</span>
              <span className="w-px h-3 bg-white/20"></span>
              <span>Datos encriptados</span>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos para autofill */}
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