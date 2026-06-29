'use client';

import React, { useState, useEffect } from "react";
import { useCart, formatMXN } from "@/components/cart-context";
import { useRouter } from "next/navigation";
import { 
  authenticateOctano, 
  tokenizeCard, 
  createOrder, 
  validateUser 
} from "@/services/octano-api";
import { CreditCard, Lock, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { loadTranslations } from "@/services/translationService";
import { sendPaymentConfirmationAction, notifyAdminAction } from '@/app/actions/email-actions';
const CheckoutPage = () => {
  const router = useRouter();
  const { items, subtotal, iva, total, clear } = useCart();
  const { t, language } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [translations, setTranslations] = useState<any>(null);
  
  // Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    pais: "México",
    calle: "",
    numero: "",
    apartamento: "",
    poblacion: "",
    provincia: "Ciudad de México",
    codigoPostal: "",
    telefono: "",
    email: "",
    notas: "",
    cupon: "",
    aceptaTerminos: false,
  });

  // Datos de tarjeta
  const [cardData, setCardData] = useState({
    nombreTarjeta: "",
    numero: "",
    expiracion: "",
    cvc: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Cargar traducciones al iniciar
  useEffect(() => {
    const loadTrans = async () => {
      const data = await loadTranslations();
      setTranslations(data);
    };
    loadTrans();
  }, [language]);

  // Redirigir si el carrito está vacío
  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/carrito");
    }
  }, [items, router, success]);

  // ============================================
  // VALIDACIONES
  // ============================================
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) newErrors.nombre = t('checkout_errorNameRequired') || "El nombre es requerido";
    if (!formData.apellidos.trim()) newErrors.apellidos = t('checkout_errorLastNameRequired') || "Los apellidos son requeridos";
    if (!formData.calle.trim()) newErrors.calle = t('checkout_errorAddressRequired') || "La calle es requerida";
    if (!formData.poblacion.trim()) newErrors.poblacion = t('checkout_errorCityRequired') || "La población es requerida";
    if (!formData.codigoPostal.trim()) newErrors.codigoPostal = t('checkout_errorPostalRequired') || "El código postal es requerido";
    if (!formData.email.trim()) {
      newErrors.email = t('checkout_errorEmailRequired') || "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('checkout_errorEmailInvalid') || "Email inválido";
    }

    const cleanCard = cardData.numero.replace(/\s/g, "");
    if (!cardData.nombreTarjeta.trim()) newErrors.nombreTarjeta = t('checkout_errorCardNameRequired') || "Nombre en tarjeta requerido";
    if (!cleanCard || cleanCard.length < 16) newErrors.numero = t('checkout_errorCardNumberInvalid') || "Número de tarjeta inválido";
    if (!cardData.expiracion || cardData.expiracion.length < 5) {
      newErrors.expiracion = t('checkout_errorExpirationInvalid') || "Fecha de expiración inválida";
    }
    if (!cardData.cvc || cardData.cvc.length < 3) newErrors.cvc = t('checkout_errorCVCInvalid') || "CVC inválido";
    if (!formData.aceptaTerminos) newErrors.aceptaTerminos = t('checkout_errorTermsRequired') || "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ============================================
  // FORMATEADORES
  // ============================================
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, "").replace(/\D/g, "");
    const matches = v.match(/\d{1,4}/g);
    return matches ? matches.join(" ") : "";
  };

  const formatExpiration = (value: string) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  // ============================================
  // MANEJADORES DE INPUT
  // ============================================
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "numero") {
      setCardData(prev => ({ ...prev, [name]: formatCardNumber(value) }));
    } else if (name === "expiracion") {
      setCardData(prev => ({ ...prev, [name]: formatExpiration(value) }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyCoupon = () => {
    if (formData.cupon.toUpperCase() === "DESCUENTO10") {
      setCouponMessage(t('checkout_couponApplied10') || "¡Cupón aplicado! 10% de descuento");
    } else if (formData.cupon.toUpperCase() === "BIENVENIDO") {
      setCouponMessage(t('checkout_couponApplied500') || "¡Cupón aplicado! $500 de descuento");
    } else {
      setCouponMessage(t('checkout_couponInvalid') || "Código de cupón inválido");
      setTimeout(() => setCouponMessage(""), 3000);
    }
  };

  // ============================================
  // PROCESAR PEDIDO CON OCTANO
  // ============================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      const firstError = document.querySelector(".error-message");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsLoading(true);

    try {
      console.log("1. Autenticando con Octano...");
      await authenticateOctano();

      console.log("2. Tokenizando tarjeta...");
      const tokenizedCard = await tokenizeCard({
        cardNumber: cardData.numero.replace(/\s/g, ""),
        cardExpiration: cardData.expiracion,
        cardCVC: cardData.cvc,
        cardHolder: cardData.nombreTarjeta,
      });

      console.log("3. Validando usuario...");
      const isValidUser = await validateUser({
        email: formData.email,
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
      });

      if (!isValidUser) {
        throw new Error("No se pudo validar la información del usuario");
      }

      console.log("4. Creando pedido...");
      const orderData = {
        user: {
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          email: formData.email,
          telefono: formData.telefono || "",
        },
        shipping: {
          calle: formData.calle,
          numero: formData.numero || "S/N",
          apartamento: formData.apartamento,
          poblacion: formData.poblacion,
          provincia: formData.provincia,
          codigoPostal: formData.codigoPostal,
          pais: formData.pais,
        },
        products: items.map(item => ({
          id: item.id,
          title: item.title,
          quantity: item.qty,
          price: item.price,
          unit: item.unit,
        })),
        payment: {
          cardToken: tokenizedCard.token,
          amount: total,
          iva: iva,
          subtotal: subtotal,
        },
        notes: formData.notas,
        coupon: formData.cupon,
      };

      const result = await createOrder(orderData);

      if (result.status === "approved") {
        setSuccess(true);
        clear();
        
        // ✅ ENVIAR CORREO DE CONFIRMACIÓN AL CLIENTE
        try {
          await sendPaymentConfirmationAction({
            to: formData.email,
            name: `${formData.nombre} ${formData.apellidos}`,
            orderId: result.orderId,
            amount: total,
            plan: 'Cotización personalizada'
          });
          console.log('✅ Correo de confirmación enviado al cliente');
        } catch (emailError) {
          console.error('❌ Error enviando correo al cliente:', emailError);
        }
        
        // ✅ NOTIFICAR AL ADMINISTRADOR
        try {
          await notifyAdminAction({
            orderId: result.orderId,
            customerName: `${formData.nombre} ${formData.apellidos}`,
            customerEmail: formData.email,
            amount: total,
            plan: 'Cotización personalizada'
          });
          console.log('✅ Notificación al admin enviada');
        } catch (adminError) {
          console.error('❌ Error notificando admin:', adminError);
        }
        
        setTimeout(() => {
          router.push(`/pedido-exitoso?orderId=${result.orderId}`);
        }, 2000);
      } else {
        throw new Error(result.message || "El pago fue rechazado");
      }

    } catch (err) {
      console.error("Error en checkout:", err);
      setError(err instanceof Error ? err.message : "Error procesando el pago");
    } finally {
      setIsLoading(false);
    }
  };

  // Estado: carrito vacío
  if (items.length === 0 && !success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4 checkout-page">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">{t('checkout_emptyTitle') || 'Carrito vacío'}</h2>
          <p className="mb-4">{t('checkout_emptyDesc') || 'No hay productos para finalizar la compra.'}</p>
          <button
            onClick={() => router.push("/servicios")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('checkout_emptyButton') || 'Ver servicios'}
          </button>
        </div>
      </div>
    );
  }

  // Render principal
  return (
    <div className="min-h-screen py-8 px-4 checkout-page">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">
          {t('checkout_title') || 'Finalizar Compra'}
        </h1>

        {success && (
          <div className="mb-6 p-4 rounded-lg border flex items-center gap-3 success-message">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>{t('checkout_successMessage') || '¡Pedido realizado con éxito! Redirigiendo...'}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg border error-message-box">
            <strong>{t('checkout_error') || 'Error:'}</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Datos de facturación */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl shadow-sm p-6 card-checkout">
              <h2 className="text-lg font-bold mb-4">
                {t('checkout_billing') || 'Detalles de facturación'}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_firstName') || 'Nombre *'}
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_firstNamePlaceholder') || 'Nombre'}
                  />
                  {errors.nombre && (
                    <span className="text-sm text-red-600 error-message">{errors.nombre}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_lastName') || 'Apellidos *'}
                  </label>
                  <input
                    type="text"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.apellidos ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_lastNamePlaceholder') || 'Apellidos'}
                  />
                  {errors.apellidos && (
                    <span className="text-sm text-red-600 error-message">{errors.apellidos}</span>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  {t('checkout_country') || 'País / Región *'}
                </label>
                <select
                  name="pais"
                  value={formData.pais}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="México">México</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Canadá">Canadá</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  {t('checkout_address') || 'Dirección de la calle *'}
                </label>
                <input
                  type="text"
                  name="calle"
                  value={formData.calle}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.calle ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('checkout_addressPlaceholder') || 'Nombre de la calle y número de la casa'}
                />
                {errors.calle && (
                  <span className="text-sm text-red-600 error-message">{errors.calle}</span>
                )}
              </div>

              <div className="mt-4">
                <input
                  type="text"
                  name="apartamento"
                  value={formData.apartamento}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('checkout_apartment') || 'Apartamento, habitación, escalera, etc. (opcional)'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_city') || 'Población *'}
                  </label>
                  <input
                    type="text"
                    name="poblacion"
                    value={formData.poblacion}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.poblacion ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_cityPlaceholder') || 'Población'}
                  />
                  {errors.poblacion && (
                    <span className="text-sm text-red-600 error-message">{errors.poblacion}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_state') || 'Región / Provincia *'}
                  </label>
                  <select
                    name="provincia"
                    value={formData.provincia}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Ciudad de México">Ciudad de México</option>
                    <option value="Estado de México">Estado de México</option>
                    <option value="Jalisco">Jalisco</option>
                    <option value="Nuevo León">Nuevo León</option>
                    <option value="Puebla">Puebla</option>
                    <option value="Querétaro">Querétaro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_postal') || 'Código postal / ZIP *'}
                  </label>
                  <input
                    type="text"
                    name="codigoPostal"
                    value={formData.codigoPostal}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.codigoPostal ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_postalPlaceholder') || 'Código postal'}
                  />
                  {errors.codigoPostal && (
                    <span className="text-sm text-red-600 error-message">{errors.codigoPostal}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_phone') || 'Teléfono (opcional)'}
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={t('checkout_phonePlaceholder') || 'Teléfono'}
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  {t('checkout_email') || 'Dirección de correo electrónico *'}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder={t('checkout_emailPlaceholder') || 'correo@ejemplo.com'}
                />
                {errors.email && (
                  <span className="text-sm text-red-600 error-message">{errors.email}</span>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">
                  {t('checkout_notes') || 'Notas del pedido (opcional)'}
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={t('checkout_notesPlaceholder') || 'Notas sobre tu pedido, por ejemplo, notas especiales para la entrega.'}
                />
              </div>
            </div>
          </div>

          {/* Columna derecha - Resumen y pago */}
          <div className="lg:col-span-1 space-y-6">
            {/* Resumen del pedido */}
            <div className="rounded-xl shadow-sm p-6 card-checkout">
              <h2 className="text-lg font-bold mb-4">
                {t('checkout_orderSummary') || 'Tu pedido'}
              </h2>

              <div className="max-h-60 overflow-y-auto space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm py-1 border-b">
                    <span className="flex-1 pr-2">
                      {item.title} <span className="text-gray-500">× {item.qty}</span>
                    </span>
                    <span className="font-semibold whitespace-nowrap">
                      {formatMXN(item.price * item.qty)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t('checkout_subtotal') || 'Subtotal'}</span>
                  <span className="font-semibold">{formatMXN(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t('checkout_iva') || '+ IVA 16%'}</span>
                  <span className="font-semibold">{formatMXN(iva)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>{t('checkout_total') || 'Total'}</span>
                  <span>{formatMXN(total)}</span>
                </div>
              </div>

              {/* Cupón */}
              <div className="mt-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowCoupon(!showCoupon)}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  {showCoupon ? (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      {t('checkout_couponHide') || 'Ocultar cupón'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      {t('checkout_couponShow') || '¿Tienes un cupón? Haz clic aquí'}
                    </>
                  )}
                </button>

                {showCoupon && (
                  <div className="mt-2 flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      name="cupon"
                      value={formData.cupon}
                      onChange={handleInputChange}
                      placeholder={t('checkout_couponPlaceholder') || 'Código de cupón'}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      {t('checkout_couponApply') || 'Aplicar'}
                    </button>
                  </div>
                )}
                {couponMessage && (
                  <p className={`mt-2 text-sm ${
                    couponMessage.includes("inválido") ? "text-red-600" : "text-green-600"
                  }`}>
                    {couponMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Datos de tarjeta */}
            <div className="rounded-xl shadow-sm p-6 card-checkout">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                <h3 className="text-base font-bold">
                  {t('checkout_cardTitle') || 'Tarjeta de Crédito o débito'}
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_cardName') || 'Nombre en la tarjeta'}
                  </label>
                  <input
                    type="text"
                    name="nombreTarjeta"
                    value={cardData.nombreTarjeta}
                    onChange={handleCardChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.nombreTarjeta ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_cardNamePlaceholder') || 'Nombre en la tarjeta'}
                  />
                  {errors.nombreTarjeta && (
                    <span className="text-sm text-red-600 error-message">{errors.nombreTarjeta}</span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('checkout_cardNumber') || 'Número de tarjeta'}
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={cardData.numero}
                    onChange={handleCardChange}
                    maxLength={19}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.numero ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={t('checkout_cardNumberPlaceholder') || '1234 5678 9012 3456'}
                  />
                  {errors.numero && (
                    <span className="text-sm text-red-600 error-message">{errors.numero}</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('checkout_cardExpiration') || 'MM/AA'}
                    </label>
                    <input
                      type="text"
                      name="expiracion"
                      value={cardData.expiracion}
                      onChange={handleCardChange}
                      maxLength={5}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.expiracion ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={t('checkout_cardExpirationPlaceholder') || 'MM/AA'}
                    />
                    {errors.expiracion && (
                      <span className="text-sm text-red-600 error-message">{errors.expiracion}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('checkout_cardCVC') || 'CVC'}
                    </label>
                    <input
                      type="text"
                      name="cvc"
                      value={cardData.cvc}
                      onChange={handleCardChange}
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.cvc ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={t('checkout_cardCVCPlaceholder') || 'CVC'}
                    />
                    {errors.cvc && (
                      <span className="text-sm text-red-600 error-message">{errors.cvc}</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 border-t border-gray-200/30">
                  <div className="flex items-center gap-2 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>{t('checkout_secure') || 'Seguro: Tus datos están encriptados'}</span>
                  </div>
                  
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">
                      {t('checkout_secureWith') || 'Pagos seguros con'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Image
                        src="/octano_logo.jpeg"
                        alt="Octano Payments"
                        width={60}
                        height={24}
                        className="h-5 w-auto object-contain rounded"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Términos y condiciones */}
            <div className="rounded-xl shadow-sm p-6 card-checkout">
              <div className="space-y-3">
                <p className="text-sm">
                  {t('checkout_termsText') || 'Tus datos personales se utilizarán para procesar tu pedido, mejorar tu experiencia en esta web y otros propósitos descritos en nuestra'}{" "}
                  <a href="/politica-privacidad" className="text-blue-600 hover:underline">
                    {t('checkout_termsLink') || 'política de privacidad'}
                  </a>
                  .
                </p>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm">
                    {t('checkout_termsAccept') || 'He leído y acepto las condiciones términos y condiciones *'}
                  </label>
                </div>
                {errors.aceptaTerminos && (
                  <span className="text-sm text-red-600 error-message block">
                    {errors.aceptaTerminos}
                  </span>
                )}
              </div>
            </div>

            {/* Botón Agregar pedido */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-4 bg-blue-600 text-white rounded-xl text-lg font-bold hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('checkout_processing') || 'Procesando...'}
                </span>
              ) : success ? (
                t('checkout_success') || '¡Pedido realizado!'
              ) : (
                t('checkout_submit') || 'Agregar pedido'
              )}
            </button>

            {error && (
              <div className="text-center text-sm text-red-600 mt-2">
                {error}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;