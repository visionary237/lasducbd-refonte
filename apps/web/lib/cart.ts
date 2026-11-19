/**
 * Panier — logique pure (testée), partagée client / serveur.
 * Le serveur recalcule TOUJOURS les prix depuis le catalogue (jamais confiance au client).
 */
import type { Product } from "./catalog/types";

export interface CartLine { key: string; productId: string; variant: string | null; qty: number }
export interface PricedLine extends CartLine { name: string; href: string; image?: string; unitCents: number; categorySlug: string }
export type Fulfilment = "pickup" | "delivery";

export const MAX_QTY = 20;
export const lineKey = (productId: string, variant: string | null) => `${productId}::${variant ?? "-"}`;

export function addLine(lines: CartLine[], productId: string, variant: string | null, qty = 1): CartLine[] {
  const key = lineKey(productId, variant);
  const ex = lines.find((l) => l.key === key);
  if (ex) return lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l));
  return [...lines, { key, productId, variant, qty: Math.min(MAX_QTY, Math.max(1, qty)) }];
}
export const setQty = (lines: CartLine[], key: string, qty: number) =>
  qty <= 0 ? lines.filter((l) => l.key !== key) : lines.map((l) => (l.key === key ? { ...l, qty: Math.min(MAX_QTY, qty) } : l));

/** Prix unitaire d'une ligne à partir du catalogue ; null si la ligne n'est pas achetable. */
export function unitPrice(p: Product | undefined, variant: string | null): number | null {
  if (!p || p.compliance === "legal-review" || p.isTemplate) return null;
  if (p.variants?.length) { const v = p.variants.find((x) => x.label === variant); return v && v.inStock ? v.priceCents : null; }
  if (variant) return null;
  return p.priceCents != null && !p.priceFrom && p.inStock !== false ? p.priceCents : null;
}
export function priceLines(lines: CartLine[], find: (id: string) => Product | undefined): PricedLine[] {
  return lines.flatMap((l) => {
    const p = find(l.productId); const u = unitPrice(p, l.variant);
    if (!p || u == null) return [];
    return [{ ...l, name: p.name, href: `/produits/${p.categorySlug}/${p.slug}`, image: p.images[0]?.src, unitCents: u, categorySlug: p.categorySlug }];
  });
}
export const subtotal = (lines: PricedLine[]) => lines.reduce((s, l) => s + l.unitCents * l.qty, 0);
export const count = (lines: CartLine[]) => lines.reduce((s, l) => s + l.qty, 0);

/**
 * Livraison, selon les conditions affichées sur le site actuel (relevé du 19/11/2026) :
 * offerte pour les fleurs, solides et extractions ; offerte dès 49 € pour les autres produits.
 * En dessous, le tarif transporteur n'est pas connu : null = « à confirmer » (jamais inventé).
 */
export const FREE_SHIPPING_THRESHOLD = 4900;
export function shipping(lines: PricedLine[], mode: Fulfilment): { cents: number | null; label: string } {
  if (mode === "pickup") return { cents: 0, label: "Retrait en boutique — gratuit" };
  if (!lines.length) return { cents: 0, label: "—" };
  if (lines.some((l) => ["fleurs-de-cbd", "hash-et-extractions"].includes(l.categorySlug))) return { cents: 0, label: "Livraison offerte (fleurs & extractions)" };
  if (subtotal(lines) >= FREE_SHIPPING_THRESHOLD) return { cents: 0, label: "Livraison offerte dès 49 €" };
  return { cents: null, label: "Frais de port à confirmer" };
}
