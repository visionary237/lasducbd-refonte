"use client";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import QtyStepper from "@/components/cart/QtyStepper";
import ProductImage from "@/components/catalog/ProductImage";
import { euros } from "@/lib/catalog";
import { shipping, subtotal, FREE_SHIPPING_THRESHOLD } from "@/lib/cart";

export default function CartView() {
  const { priced, setQty, mode, setMode } = useCart();
  const sub = subtotal(priced), ship = shipping(priced, mode);
  const total = sub + (ship.cents ?? 0);
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pt-36">
      <h1 className="t-display text-6xl">Panier</h1>
      {priced.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-ivoire/10 p-10 text-center"><p className="t-display text-3xl">Votre panier est vide.</p><Link href="/produits" className="mt-6 inline-flex rounded-full bg-or px-7 py-3 font-bold text-charbon">Parcourir la boutique</Link></div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <ul className="divide-y divide-ivoire/10 border-y border-ivoire/10">
            {priced.map((l) => (
              <li key={l.key} className="flex gap-5 py-6">
                <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-charbon-3"><ProductImage src={l.image} alt="" name={l.name} small /></div>
                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4"><Link href={l.href} className="t-display text-2xl hover:text-or-2">{l.name}</Link><span>{euros(l.unitCents * l.qty)}</span></div>
                  {l.variant && <span className="text-sm text-ivoire/70">{l.variant}</span>}
                  <span className="text-xs text-ivoire/60">{euros(l.unitCents)} l'unité</span>
                  <div className="mt-auto flex items-center gap-4 pt-3"><QtyStepper value={l.qty} onChange={(q) => setQty(l.key, q)} label={l.name} /><button onClick={() => setQty(l.key, 0)} className="text-sm text-ivoire/70 underline-offset-2 hover:underline">Retirer</button></div>
                </div>
              </li>
            ))}
          </ul>
          <aside className="gold-frame h-fit space-y-5 bg-charbon-2 p-6">
            <fieldset><legend className="t-label mb-3 text-or-2">Mode de réception</legend>
              {(["pickup", "delivery"] as const).map((m) => (
                <label key={m} className={`mb-2 flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm ${mode === m ? "border-or" : "border-ivoire/15"}`}>
                  <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} className="accent-[#C5A059]" />
                  {m === "pickup" ? "Retrait en boutique (gratuit)" : "Livraison à domicile (48 h, enveloppe neutre)"}
                </label>
              ))}
            </fieldset>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ivoire/70">Sous-total</dt><dd>{euros(sub)}</dd></div>
              <div className="flex justify-between"><dt className="text-ivoire/70">{ship.label}</dt><dd>{ship.cents == null ? "à confirmer" : euros(ship.cents)}</dd></div>
              <div className="flex justify-between border-t border-ivoire/10 pt-3 text-lg font-bold"><dt>Total</dt><dd>{euros(total)}{ship.cents == null ? " + port" : ""}</dd></div>
            </dl>
            {mode === "delivery" && ship.cents == null && <p className="text-xs text-ivoire/70">Encore {euros(FREE_SHIPPING_THRESHOLD - sub)} pour la livraison offerte.</p>}
            <Link href="/commande" className="flex min-h-12 items-center justify-center rounded-full bg-or font-bold text-charbon hover:bg-or-2">Passer commande</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
