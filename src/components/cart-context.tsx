"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  unit: string;
  qty: number;
  metadata?: Record<string, any>; 
}

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  iva: number;
  total: number;
  isOpen: boolean;
  hydrated: boolean;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = "safeware-cart";
const IVA_RATE = 0.16;

export function formatMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

export function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "qty">, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p,
        );
      }
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.id !== id)
        : prev.map((p) => (p.id === id ? { ...p, qty } : p)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const { count, subtotal } = useMemo(
    () =>
      items.reduce(
        (acc, it) => {
          acc.count += it.qty;
          acc.subtotal += it.price * it.qty;
          return acc;
        },
        { count: 0, subtotal: 0 },
      ),
    [items],
  );

  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      iva,
      total,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clear,
      openCart,
      closeCart,
    }),
    [
      items,
      count,
      subtotal,
      iva,
      total,
      isOpen,
      hydrated,
      addItem,
      removeItem,
      setQty,
      clear,
      openCart,
      closeCart,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
