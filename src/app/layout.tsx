// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter_Tight, Manrope } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { CartProvider } from "@/components/cart-context";
import { ContactModalProvider } from "@/components/contact-modal";
import { SiteShell } from "@/components/site-shell";

const interTight = Inter_Tight({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-tight",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "SafeWare Solutions | Protegemos y optimizamos tu tecnología",
  description:
    "Servicios de seguridad, soporte y mantenimiento de software. Toma el control de la continuidad de tu negocio con soluciones de TI innovadoras.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${interTight.variable} ${manrope.variable}`}>
      <body className="antialiased">
        <I18nProvider>
          <CartProvider>
            <ContactModalProvider>
              <SiteShell>{children}</SiteShell>
            </ContactModalProvider>
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}