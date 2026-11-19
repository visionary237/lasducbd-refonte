"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addLine, setQty as setQ, priceLines, count, type CartLine, type Fulfilment, type PricedLine } from "@/lib/cart";
import { findById } from "@/lib/catalog/products";

interface Ctx {
  lines: CartLine[]; priced: PricedLine[]; count: number; open: boolean; mode: Fulfilment;
  add: (productId: string, variant: string | null, qty?: number) => void;
  setQty: (key: string, qty: number) => void; clear: () => void; setOpen: (o: boolean) => void; setMode: (m: Fulfilment) => void;
}
const CartCtx = createContext<Ctx | null>(null);
const KEY = "ladc_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Fulfilment>("pickup");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) ?? "null"); if (s?.lines) { setLines(s.lines); setMode(s.mode ?? "pickup"); } } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem(KEY, JSON.stringify({ lines, mode })); } catch {} }, [lines, mode, ready]);
  const add = useCallback((id: string, v: string | null, q = 1) => { setLines((l) => addLine(l, id, v, q)); setOpen(true); }, []);
  const setQty = useCallback((k: string, q: number) => setLines((l) => setQ(l, k, q)), []);
  const priced = useMemo(() => priceLines(lines, findById), [lines]);
  const value = useMemo(() => ({ lines, priced, count: count(priced), open, mode, add, setQty, clear: () => setLines([]), setOpen, setMode }), [lines, priced, open, mode, add, setQty]);
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
export const useCart = () => { const c = useContext(CartCtx); if (!c) throw new Error("useCart hors CartProvider"); return c; };
