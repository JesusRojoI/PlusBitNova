"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useContactModal } from "@/components/contact-modal";
import { useCart, formatMXN } from "@/components/cart-context";
import { LanguageSelector } from "@/components/LanguajeSelector";
import { useTranslation } from "react-i18next";

const LOGO = "/logo.png";

const services = [
  {
    label: "Soporte y Mantenimiento de Software",
    href: "/soporte-y-mantenimiento-de-software",
  },
  { label: "Seguridad Informática", href: "/seguridad-informatica" },
  { label: "Soporte Remoto y en Sitio", href: "/soporte-remoto-y-en-sitio" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { open: openContact } = useContactModal();
  const { count, total, openCart, hydrated } = useCart();
  const { t } = useTranslation('header');

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center" aria-label="SafeWare Solutions">
          <img src={LOGO} alt="SafeWare Solutions" className="h-12 w-auto sm:h-14" />
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <LanguageSelector />

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 text-foreground transition-colors hover:bg-sw-cloud"
              aria-label={mounted ? t('menu') : 'Menú'}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[88vw] max-w-sm border-0 bg-white p-0 text-sw-navy">
              <div className="flex h-full flex-col">
                <div className="border-b border-gray-200 px-7 py-6">
                  <img src={LOGO} alt="SafeWare Solutions" className="h-12 w-auto rounded-md bg-gray-100 p-1.5" />
                </div>
                <nav className="flex-1 overflow-y-auto px-7 py-8">
                  <Link
                    href="/#somos"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-gray-200 py-4 font-display text-lg font-bold text-sw-navy transition-colors hover:text-primary"
                  >
                    {mounted ? t('about') : 'Acerca de nosotros'} <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                  <div className="border-b border-gray-200 py-4">
                    <p className="font-display text-lg font-bold text-sw-navy">{mounted ? t('services') : 'Servicios'}</p>
                    <ul className="mt-3 space-y-2.5">
                      {services.map((s) => (
                        <li key={s.label}>
                          <Link
                            href={s.href}
                            onClick={() => setOpen(false)}
                            className="block text-sm text-gray-600 transition-colors hover:text-primary"
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href="/paga-tu-cotizacion"
                    onClick={() => setOpen(false)}
                    className="flex w-full items-center justify-between border-b border-gray-200 py-4 text-left font-display text-lg font-bold text-sw-navy transition-colors hover:text-primary"
                  >
                    {mounted ? t('payQuote') : 'Paga tu Cotización'} <ChevronRight className="h-4 w-4 opacity-60" />
                  </Link>
                </nav>
                <div className="px-7 pb-8">
                  <button
                    onClick={() => {
                      setOpen(false);
                      openContact();
                    }}
                    className="w-full rounded-full border border-primary bg-transparent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-primary transition-colors hover:bg-primary/5"
                  >
                    {mounted ? t('letsStart') : '¡Comencemos!'}
                  </button>
                  <div className="mt-6 space-y-1 text-sm text-gray-500">
                    <p>55 5533 2511</p>
                    <p>gestion@safeware.com.mx</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <button
            onClick={openCart}
            className="group flex items-center gap-2.5 text-foreground"
            aria-label={mounted ? t('cart') : 'Carrito'}
          >
            <span className="relative">
              <ShoppingBag
                className="h-6 w-6 transition-transform group-hover:scale-110"
                strokeWidth={1.6}
              />
              {hydrated && count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-sw-coral px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </span>
            <span className="hidden text-sm font-bold tabular-nums sm:inline">
              {hydrated ? formatMXN(total) : formatMXN(0)}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}