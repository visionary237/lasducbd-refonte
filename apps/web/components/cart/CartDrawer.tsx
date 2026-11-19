"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCart } from "./CartProvider";
import { euros } from "@/lib/catalog";
import { shipping, subtotal } from "@/lib/cart";
import QtyStepper from "./QtyStepper";
import ProductImage from "../catalog/ProductImage";

export default function CartDrawer() {
  const { open, setOpen, priced, setQty, mode } = useCart();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("button")?.focus();
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k); document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [open, setOpen]);
  const sub = subtotal(priced), ship = shipping(priced, mode);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110]">
          <motion.div className="absolute inset-0 bg-charbon/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div ref={panel} role="dialog" aria-modal="true" aria-label="Panier" className="texture-botanique absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-or/25 bg-charbon-2"
            initial={{ x: reduce ? 0 : "100%" }} animate={{ x: 0 }} exit={{ x: reduce ? 0 : "100%" }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex items-center justify-between border-b border-ivoire/10 px-6 py-5">
              <h2 className="t-display text-3xl">Votre panier</h2>
              <button onClick={() => setOpen(false)} className="h-10 rounded-full border border-ivoire/25 px-4 text-sm hover:border-or">Fermer</button>
            </div>
            {priced.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="t-display text-2xl">Votre panier est vide.</p>
                <Link href="/produits" onClick={() => setOpen(false)} className="rounded-full bg-or px-6 py-3 font-bold text-charbon">Parcourir le catalogue</Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-ivoire/10 overflow-y-auto px-6">
                  {priced.map((l) => (
                    <li key={l.key} className="flex gap-4 py-5">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-charbon-3"><ProductImage src={l.image} alt="" name={l.name} small /></div>
                      <div className="flex flex-1 flex-col">
                        <Link href={l.href} onClick={() => setOpen(false)} className="font-semibold leading-tight hover:text-or-2">{l.name}</Link>
                        {l.variant && <span className="text-xs text-ivoire/65">{l.variant}</span>}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <QtyStepper value={l.qty} onChange={(q) => setQty(l.key, q)} label={l.name} />
                          <span className="text-sm">{euros(l.unitCents * l.qty)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 border-t border-ivoire/10 px-6 py-5 text-sm">
                  <div className="flex justify-between"><span className="text-ivoire/70">Sous-total</span><span>{euros(sub)}</span></div>
                  <div className="flex justify-between"><span className="text-ivoire/70">{ship.label}</span><span>{ship.cents == null ? "—" : euros(ship.cents)}</span></div>
                  <Link href="/commande" onClick={() => setOpen(false)} className="mt-3 flex min-h-12 items-center justify-center rounded-full bg-or font-bold text-charbon hover:bg-or-2">Passer commande</Link>
                  <Link href="/panier" onClick={() => setOpen(false)} className="flex min-h-11 items-center justify-center rounded-full border border-ivoire/25 hover:border-or">Voir le panier</Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
