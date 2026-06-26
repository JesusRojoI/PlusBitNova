import { ContactModalProvider } from "@/components/contact-modal";
import { Hero } from "@/components/hero";
import { QuienesSomos } from "@/components/quienes-somos";
import { Servicios } from "@/components/servicios";
import { CtaBanner } from "@/components/cta-banner";
import { PorQue } from "@/components/por-que";

export default function Home() {
  return (
    <ContactModalProvider>
      <main>
        <Hero />
        <QuienesSomos />
        <Servicios />
        <CtaBanner />
        <PorQue />
      </main>
    /</ContactModalProvider>
  );
}
