"use client";

import Cart from "@/components/cart";  // ← Importa el Cart del mismo directorio

export default function CarritoPage() {
  return (
    <div className="min-h-screen py-8 px-4 checkout-page">
      <div className="max-w-6xl mx-auto">
        <Cart />
      </div>
    </div>
  );
}