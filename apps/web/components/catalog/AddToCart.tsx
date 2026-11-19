"use client";
import { useState } from "react";
import type { Product } from "@/lib/catalog/types";
import { euros, isPurchasable } from "@/lib/catalog";
import { useCart } from "../cart/CartProvider";
import QtyStepper from "../cart/QtyStepper";

export default function AddToCart({ p }: { p: Product }) {
  const { add } = useCart();
  const firstAvail = p.variants?.find((v) => v.inStock)?.label ?? null;
  const [variant, setVariant] = useState<string | null>(firstAvail);
  const [qty, setQty] = useState(1);
  if (!isPurchasable(p)) {
    const reason = p.inStock === false || p.priceCents == null ? "Indisponible actuellement" : "Grammages à synchroniser";
    return (
      <div className="rounded-2xl border border-ivoire/15 p-5">
        <p className="font-semibold">{reason}</p>
        <p className="mt-1 text-sm text-ivoire/70">{reason === "Grammages à synchroniser"
          ? "Les formats et prix par grammage de ce produit seront importés depuis la boutique en ligne. En attendant, commandez-le en ligne ou réservez-le en boutique."
          : "Revenez bientôt, ou demandez sa disponibilité en boutique."}</p>
      </div>
    );
  }
  const price = p.variants?.length ? p.variants.find((v) => v.label === variant)?.priceCents ?? 0 : p.priceCents!;
  return (
    <div className="space-y-5">
      {p.variants?.length ? (
        <fieldset>
          <legend className="t-label mb-3 text-or-2">Grammage</legend>
          <div className="flex flex-wrap gap-2">
            {p.variants.map((v) => (
              <label key={v.label} className={`cursor-pointer rounded-xl border px-4 py-3 text-sm transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-or ${variant === v.label ? "border-or bg-or/10" : "border-ivoire/20 hover:border-or/60"} ${!v.inStock ? "cursor-not-allowed opacity-40" : ""}`}>
                <input type="radio" name="variant" value={v.label} checked={variant === v.label} disabled={!v.inStock} onChange={() => setVariant(v.label)} className="sr-only" />
                <span className="block font-bold">{v.label}</span><span className="text-ivoire/75">{euros(v.priceCents)}</span>
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <QtyStepper value={qty} onChange={(q) => setQty(Math.max(1, q))} label={p.name} min={1} />
        <button onClick={() => add(p.id, p.variants?.length ? variant : null, qty)} className="min-h-12 flex-1 rounded-full bg-or px-7 font-bold text-charbon transition hover:bg-or-2">
          Ajouter au panier · {euros(price * qty)}
        </button>
      </div>
    </div>
  );
}
