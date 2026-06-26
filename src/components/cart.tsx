"use client";

import React, { useState } from "react";
import { useCart, formatMXN } from "./cart-context";
import { useRouter } from "next/navigation";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight, Tag } from "lucide-react";

const Cart = () => {
  const router = useRouter();
  const { items, subtotal, iva, total, removeItem, setQty, clear } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "DESCUENTO10") {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
      setCouponMessage("¡Cupón aplicado! 10% de descuento");
    } else if (couponCode.toUpperCase() === "BIENVENIDO") {
      setDiscount(500);
      setCouponApplied(true);
      setCouponMessage("¡Cupón aplicado! $500 de descuento");
    } else if (couponCode.toUpperCase() === "SAFEWARE20") {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
      setCouponMessage("¡Cupón aplicado! 20% de descuento");
    } else {
      setCouponMessage("Código de cupón inválido");
      setTimeout(() => setCouponMessage(""), 3000);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscount(0);
    setCouponApplied(false);
    setCouponCode("");
    setCouponMessage("");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Tu carrito está vacío
          </h1>
          <p className="text-gray-600 mb-6">
            Parece que no has agregado ningún servicio a tu carrito.
          </p>
          <button
            onClick={() => router.push("/servicios")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            Ver nuestros servicios
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-4 border-b-2 border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Carrito de Compras
            </h1>
            <span className="text-sm font-medium text-gray-900">
              {items.length} productos
            </span>
          </div>

          <button
            onClick={clear}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar carrito
          </button>
        </div>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tabla de productos */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Encabezado de la tabla */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wider">
              <div className="col-span-5">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1 text-center">Acción</div>
            </div>

            {/* Lista de productos */}
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-2 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Producto */}
                  <div className="col-span-2 md:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-gray-700" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-600">{item.unit}</p>
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                    <span className="text-sm font-medium text-gray-900">
                      {formatMXN(item.price)}
                    </span>
                  </div>

                  {/* Cantidad */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setQty(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold text-gray-900">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => setQty(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-center">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatMXN(item.price * item.qty)}
                    </span>
                  </div>

                  {/* Acción */}
                  <div className="col-span-2 md:col-span-1 flex items-center justify-end md:justify-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Línea separadora en móvil */}
                  <div className="col-span-2 md:hidden">
                    <div className="h-px bg-gray-200 mt-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Resumen del carrito */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Totales del carrito
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatMXN(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento</span>
                    <span className="font-semibold">
                      -{formatMXN(discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-700">
                  <span>IVA (16%)</span>
                  <span className="font-semibold text-gray-900">
                    {formatMXN(iva)}
                  </span>
                </div>

                <div className="border-t-2 border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total estimado</span>
                    <span className="text-gray-900">{formatMXN(total)}</span>
                  </div>
                </div>
              </div>

              {/* Cupones */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Tag className="w-4 h-4 text-blue-600" />
                  <span>Añadir cupones</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {!couponApplied ? (
                    <button
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
                    >
                      Aplicar
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap"
                    >
                      Quitar
                    </button>
                  )}
                </div>

                {couponMessage && (
                  <div
                    className={`mt-2 p-2 rounded-lg text-sm ${
                      couponApplied
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {couponMessage}
                  </div>
                )}

                {couponApplied && (
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Cupón aplicado: {couponCode}
                    </span>
                  </div>
                )}

                <div className="mt-2">
                  <small className="text-xs text-gray-500">
                    Códigos: DESCUENTO10, BIENVENIDO, SAFEWARE20
                  </small>
                </div>
              </div>

              {/* Botones */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => router.push("/finalizar-compra")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Finalizar compra
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => router.push("/servicios")}
                  className="w-full text-center text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium py-2 transition-colors"
                >
                  ← Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;