"use client";

import { useState } from "react";
import { ArrowRight, Check, ShoppingCart, Minus, Plus } from "lucide-react";
import { SectionLabel } from "@/components/section-label";
import { DecorativeRings } from "@/components/decorative-rings";
import { CotizaCTA } from "@/components/service/cotiza-cta";
import { useCart, parsePrice } from "@/components/cart-context";

export interface ServiceItem {
  title: string;
  desc?: string;
  price: string;
  unit: string;
  features?: string[];
}

export interface ServicePageData {
  title: string;
  heroSubtitle: React.ReactNode;
  heroImage: string;
  servicioHeading: string;
  servicioImage: string;
  servicioText: React.ReactNode;
  note?: string;
  variant: "price" | "features" | "hourly";
  services: ServiceItem[];
}

function PriceTag({ price, unit }: { price: string; unit: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        ${price}
      </span>
      <span className="text-sm font-bold text-white/75">{unit}</span>
    </div>
  );
}

function CoralButton({
  onClick,
  children,
  leadingIcon,
  trailingArrow = true,
}: {
  onClick: () => void;
  children: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingArrow?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 rounded-full bg-blue-400 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-blue-500"
    >
      {leadingIcon}
      {children}
      {trailingArrow && (
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
}

const CARD =
  "mb-6 break-inside-avoid rounded-2xl border border-white/10 bg-gray-800/50 backdrop-blur-sm p-7 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.8)] sm:p-8";

function useAddToCart() {
  const { addItem, openCart } = useCart();
  return (item: ServiceItem, qty = 1) => {
    addItem(
      {
        id: item.title,
        title: item.title,
        price: parsePrice(item.price),
        unit: item.unit,
      },
      qty,
    );
    openCart();
  };
}

function PriceCard({ item }: { item: ServiceItem }) {
  const addToCart = useAddToCart();
  return (
    <div className={CARD}>
      <h3 className="font-display text-2xl font-extrabold leading-tight text-white">
        {item.title}
      </h3>
      {item.desc && (
        <p className="mt-3 text-sm leading-relaxed text-gray-300">{item.desc}</p>
      )}
      <div className="mt-6">
        <PriceTag price={item.price} unit={item.unit} />
      </div>
      <div className="mt-6">
        <CoralButton onClick={() => addToCart(item)}>
          Seleccionar Servicio
        </CoralButton>
      </div>
    </div>
  );
}

function FeaturesCard({ item }: { item: ServiceItem }) {
  const addToCart = useAddToCart();
  return (
    <div className={CARD}>
      <h3 className="font-display text-2xl font-extrabold leading-tight text-white">
        {item.title}
      </h3>
      <div className="mt-4">
        <PriceTag price={item.price} unit={item.unit} />
      </div>
      <div className="mt-5">
        <CoralButton onClick={() => addToCart(item)}>
          Seleccionar Servicio
        </CoralButton>
      </div>
      <h4 className="mt-7 font-display text-3xl font-extrabold text-white sm:text-4xl">
        Características:
      </h4>
      <ul className="mt-4 space-y-3">
        {item.features?.map((f, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-gray-300">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[#f15a2b]"
              strokeWidth={3.5}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HourlyCard({ item }: { item: ServiceItem }) {
  const [qty, setQty] = useState(1);
  const addToCart = useAddToCart();
  return (
    <div className={CARD}>
      <h3 className="font-display text-xl font-extrabold leading-snug text-white">
        {item.title}
      </h3>
      <div className="mt-5">
        <PriceTag price={item.price} unit={item.unit} />
      </div>
      <div className="mt-7 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-lg border border-white/20">
            <button
              type="button"
              aria-label="Disminuir"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-2.5 py-2 text-white transition-colors hover:bg-white/10"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-9 text-center font-display text-sm font-bold text-white">
              {qty}
            </span>
            <button
              type="button"
              aria-label="Aumentar"
              onClick={() => setQty((q) => q + 1)}
              className="px-2.5 py-2 text-white transition-colors hover:bg-white/10"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <span className="text-sm text-gray-300">Hora(s)</span>
        </div>
        <CoralButton
          onClick={() => addToCart(item, qty)}
          trailingArrow={false}
          leadingIcon={<ShoppingCart className="h-3.5 w-3.5" />}
        >
          Añadir al carrito
        </CoralButton>
      </div>
    </div>
  );
}

export function ServicePage({ data }: { data: ServicePageData }) {
  return (
    <div className="bg-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-900">
        <DecorativeRings className="pointer-events-none absolute -right-24 -top-28 h-[440px] w-[440px] text-white/10" />
        <span className="pointer-events-none absolute left-[12%] top-40 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
        <span className="pointer-events-none absolute right-[18%] top-24 h-24 w-24 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 pt-16 text-center sm:px-8 sm:pt-20">
          <SectionLabel className="justify-center text-white/80">SafeWare</SectionLabel>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-[2.5rem] font-extrabold leading-[1.06] tracking-tight text-white sm:text-6xl">
            {data.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
            {data.heroSubtitle}
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-12 max-w-6xl px-5 sm:px-8">
          <img
            src={data.heroImage}
            alt={data.title}
            className="aspect-[16/9] w-full rounded-[1.75rem] object-cover shadow-2xl sm:aspect-[16/7]"
          />
        </div>
      </section>

      {/* SERVICIO INTRO */}
      <section className="bg-gray-900 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <SectionLabel className="justify-center text-white/80">Servicio</SectionLabel>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-extrabold leading-[1.12] text-white sm:text-5xl">
            {data.servicioHeading}
          </h2>
          <img
            src={data.servicioImage}
            alt=""
            className="mx-auto mt-10 aspect-[16/7] w-full max-w-2xl rounded-2xl object-cover shadow-lg"
          />
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-gray-300">
            {data.servicioText}
          </p>
          {data.note && (
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-gray-800/50 backdrop-blur-sm px-8 py-7 border border-white/10">
              <p className="font-display text-lg font-bold leading-snug text-white">
                {data.note}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* NUESTROS SERVICIOS */}
      <section className="bg-gray-900 pb-20 sm:pb-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="mb-12 text-center font-display text-4xl font-extrabold text-white sm:text-5xl">
            Nuestros Servicios
          </h2>
          <div className="columns-1 gap-6 sm:columns-2">
            {data.services.map((item, i) => {
              if (data.variant === "features")
                return <FeaturesCard key={i} item={item} />;
              if (data.variant === "hourly")
                return <HourlyCard key={i} item={item} />;
              return <PriceCard key={i} item={item} />;
            })}
          </div>
        </div>
      </section>

      <CotizaCTA />
    </div>
  );
}