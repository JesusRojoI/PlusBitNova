"use client";

import { ArrowRight } from "lucide-react";
import { useContactModal } from "@/components/contact-modal";

export function CotizaCTA() {
  const { open } = useContactModal();

  return (
    <section className="bg-gray-900 px-5 py-14 sm:px-8 sm:py-16 border-t border-white/10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-sw-royal px-6 py-16 text-center sm:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -right-10 hidden h-72 w-72 md:block"
        >
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_36%_30%,#eaf0ff_0%,#9db4ff_38%,#4a63e6_64%,transparent_72%)] opacity-90 blur-[1px]" />
          <div className="absolute inset-10 rounded-full border border-white/30" />
          <div className="absolute inset-20 rounded-full border border-white/20" />
          <div className="absolute inset-28 rounded-full bg-white/40 blur-md" />
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 hidden h-56 w-56 rounded-full bg-white/10 blur-2xl lg:block"
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <h2 className="font-display text-4xl font-extrabold leading-tight text-white sm:text-[2.9rem]">
            Cotiza servicios de Soporte
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80">
            Nos gustaría ofrecerle nuestro servicio de soporte técnico remoto
            24/7, diseñado para resolver cualquier inconveniente de software de
            manera rápida y eficiente.
          </p>
          <button
            onClick={open}
            className="group inline-flex items-center gap-3 rounded-full bg-blue-400 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition-all hover:bg-blue-500"
          >
            Cotiza aquí
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}