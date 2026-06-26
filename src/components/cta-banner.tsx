"use client";

import { ArrowRight } from "lucide-react";  
import { useContactModal } from "@/components/contact-modal";

const IMG = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80";

export function CtaBanner() {
  const { open } = useContactModal();

  return (
    <section className="bg-card py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
        <div className="overflow-hidden rounded-3xl shadow-lg">
          <img
            src={IMG}
            alt="Equipo de trabajo colaborando"
            className="aspect-[4/3] w-full object-cover"
          />
        </div>

        <div className="max-w-md">
          <h2 className="font-display text-4xl font-extrabold leading-[1.08] text-foreground sm:text-5xl">
            Renueva, protege y maximiza el potencial de tu negocio.
          </h2>
        </div>
      </div>
    </section>
  );
}