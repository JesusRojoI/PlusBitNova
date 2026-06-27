'use client';

import { ReactNode } from "react";
import { CartSheet } from "@/components/cart-sheet";
import Header from "@/components/header";  // ✅ Importación por defecto
import Footer from "@/components/footer";  // ✅ Importación por defecto

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <CartSheet />
      <main>{children}</main>
      <Footer />
    </>
  );
}