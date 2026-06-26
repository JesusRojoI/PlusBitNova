"use client";

import { ContactModalProvider } from "@/components/contact-modal";
import { CartProvider } from "@/components/cart-context";
import { CartSheet } from "@/components/cart-sheet";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <ContactModalProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <CartSheet />
      </CartProvider>
    </ContactModalProvider>
  );
}
