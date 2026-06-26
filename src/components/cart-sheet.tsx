"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, Minus, Plus, Wrench, ArrowRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart, formatMXN } from "@/components/cart-context";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next"; // ✅ Importar traducción

export function CartSheet() {
  const router = useRouter();
  const { t } = useTranslation('cart'); // ✅ Usar namespace 'cart'
  const [isDark, setIsDark] = useState(true);
  
  const {
    items,
    count,
    subtotal,
    iva,
    total,
    isOpen,
    openCart,
    closeCart,
    setQty,
    removeItem,
    clear,
  } = useCart();

  const handleCheckout = () => {
    closeCart();
    router.push("/carrito");
  };

  // Alternar colores cada 2 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsDark(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (o ? openCart() : closeCart())}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-0 p-0 sm:max-w-md"
      >
        {/* Header con fondo blanco */}
        <SheetHeader className="flex flex-col space-y-2 sm:text-left border-b border-black/10 px-6 py-5 text-left bg-white">
          <SheetTitle className="flex items-center gap-2.5 font-display text-xl font-extrabold text-sw-navy">
            <ShoppingBag className="h-5 w-5" />
            {t('title')} {/* ✅ Tu carrito */}
            {/* === CONTADOR QUE ALTERNA COLORES === */}
            <span 
              className={`rounded-full px-2 py-0.5 text-xs font-bold border transition-all duration-500 ${
                isDark 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-black border-black/20'
              }`}
            >
              {count}
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          // === CARRITO VACÍO - FONDO BLANCO, TEXTOS E ICONOS OSCUROS ===
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-12 text-center bg-white">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              <ShoppingBag className="h-9 w-9 text-gray-600" />
            </div>
            <p className="font-display text-lg font-bold text-gray-800">
              {t('empty')} {/* ✅ Tu carrito está vacío */}
            </p>
            <p className="max-w-xs text-sm text-gray-600">
              {t('explore')} {/* ✅ Explora nuestros servicios... */}
            </p>
            <button
              onClick={closeCart}
              className="mt-2 rounded-full bg-blue-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-500"
            >
              {t('exploreButton')} {/* ✅ Seguir explorando */}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto px-5 py-5 bg-gray-50">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 rounded-xl border border-black/[0.07] bg-white p-3 shadow-sm"
                >
                  {/* Icono con fondo negro e icono blanco */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-black text-white">
                    <Wrench className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm font-bold leading-snug text-sw-navy">
                        {item.title}
                      </p>
                      {/* === TACHE (X) CON CARÁCTER ESPECIAL === */}
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={t('remove')} 
                        className="shrink-0 text-gray-700 transition-colors hover:text-red-600 text-lg font-bold leading-none"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatMXN(item.price)} · {item.unit}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center overflow-hidden rounded-md border border-black/15">
                        <button
                          aria-label={t('decrease') || "Disminuir"}
                          onClick={() => setQty(item.id, item.qty - 1)}
                          className="px-2 py-1.5 text-sw-navy transition-colors hover:bg-sw-cloud"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center font-display text-xs font-bold text-sw-navy">
                          {item.qty}
                        </span>
                        <button
                          aria-label={t('increase') || "Aumentar"}
                          onClick={() => setQty(item.id, item.qty + 1)}
                          className="px-2 py-1.5 text-sw-navy transition-colors hover:bg-sw-cloud"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-display text-sm font-extrabold text-sw-navy">
                        {formatMXN(item.price * item.qty)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={clear}
                className="mx-auto mt-2 block text-xs font-semibold text-slate-400 transition-colors hover:text-red-600"
              >
                {t('clear')} {/* ✅ Vaciar carrito */}
              </button>
            </div>

            {/* Footer con fondo blanco */}
            <div className="space-y-3 border-t border-black/10 bg-white px-6 py-5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('subtotal') || 'Subtotal'}</span> {/* ✅ Subtotal */}
                <span className="font-semibold text-sw-navy">
                  {formatMXN(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{t('iva') || 'IVA (16%)'}</span> {/* ✅ IVA (16%) */}
                <span className="font-semibold text-sw-navy">
                  {formatMXN(iva)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-black/10 pt-3">
                <span className="font-display text-base font-bold text-sw-navy">
                  {t('total') || 'Total'} {/* ✅ Total */}
                </span>
                <span className="font-display text-2xl font-extrabold text-sw-navy">
                  {formatMXN(total)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-blue-400 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-500"
              >
                {t('checkout')} {/* ✅ Finalizar pedido */}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <p className="text-center text-[11px] text-slate-400">
                {t('note')} {/* ✅ Te contactaremos para confirmar... */}
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}