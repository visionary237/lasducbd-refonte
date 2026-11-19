/** Validation des formulaires (sans dépendance), partagée client/serveur et testée. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const clean = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function common(raw: Record<string, unknown>) {
  if (clean(raw.website)) return "Requête refusée."; // champ piège
  if (raw.consent !== "yes") return "Merci d'accepter l'utilisation de vos données pour traiter la demande.";
  if (!EMAIL.test(clean(raw.email, 200))) return "Adresse e-mail invalide.";
  return null;
}
export function validateContact(raw: Record<string, unknown>): Result<{ firstName: string; email: string; topic: string; message: string }> {
  const e = common(raw); if (e) return { ok: false, error: e };
  const d = { firstName: clean(raw.firstName, 80), email: clean(raw.email, 200), topic: clean(raw.topic, 60) || "autre", message: clean(raw.message, 4000) };
  if (!d.firstName) return { ok: false, error: "Merci d'indiquer votre prénom." };
  if (d.message.length < 5) return { ok: false, error: "Votre message est trop court." };
  return { ok: true, data: d };
}
export function validateReservation(raw: Record<string, unknown>, stores: string[]): Result<{ firstName: string; email: string; store: string; product: string }> {
  const e = common(raw); if (e) return { ok: false, error: e };
  if (raw.adult !== "yes") return { ok: false, error: "La réservation est réservée aux personnes majeures." };
  const d = { firstName: clean(raw.firstName, 80), email: clean(raw.email, 200), store: clean(raw.store, 40), product: clean(raw.product, 200) };
  if (!d.firstName) return { ok: false, error: "Merci d'indiquer votre prénom." };
  if (!stores.includes(d.store)) return { ok: false, error: "Boutique inconnue." };
  if (!d.product || d.product.includes("modele-de-fiche")) return { ok: false, error: "Ce produit est un gabarit de démonstration et ne peut pas être réservé." };
  return { ok: true, data: d };
}
export function validateWaitlist(raw: Record<string, unknown>): Result<{ email: string }> {
  const e = common(raw); if (e) return { ok: false, error: e };
  if (raw.adult !== "yes") return { ok: false, error: "Le programme est réservé aux personnes majeures." };
  return { ok: true, data: { email: clean(raw.email, 200) } };
}

import { priceLines, shipping, subtotal, type CartLine, type Fulfilment } from "./cart";
import type { Product } from "./catalog/types";

export interface OrderInput { lines: CartLine[]; mode: Fulfilment; store?: string; firstName: string; lastName: string; email: string; phone?: string; address?: string; postalCode?: string; city?: string }
/** Commande : le serveur recalcule les prix depuis le catalogue et ignore tout prix envoyé par le client. */
export function validateOrder(raw: Record<string, unknown>, find: (id: string) => Product | undefined, stores: string[]):
  Result<OrderInput & { totals: { subtotal: number; shipping: number | null; total: number }; priced: ReturnType<typeof priceLines> }> {
  const e = common(raw); if (e) return { ok: false, error: e };
  if (raw.adult !== "yes") return { ok: false, error: "La commande est réservée aux personnes majeures." };
  const lines = Array.isArray(raw.lines) ? (raw.lines as CartLine[]).slice(0, 50) : [];
  const priced = priceLines(lines.map((l) => ({ key: String(l.key), productId: String(l.productId), variant: l.variant == null ? null : String(l.variant), qty: Math.max(1, Math.min(20, Number(l.qty) || 1)) })), find);
  if (!priced.length) return { ok: false, error: "Votre panier est vide ou contient des produits indisponibles." };
  if (priced.length !== lines.length) return { ok: false, error: "Certains produits ne sont plus disponibles : merci de vérifier votre panier." };
  const mode: Fulfilment = raw.mode === "delivery" ? "delivery" : "pickup";
  const d: OrderInput = { lines, mode, firstName: clean(raw.firstName, 80), lastName: clean(raw.lastName, 80), email: clean(raw.email, 200), phone: clean(raw.phone, 30) || undefined, store: clean(raw.store, 40) || undefined, address: clean(raw.address, 200) || undefined, postalCode: clean(raw.postalCode, 10) || undefined, city: clean(raw.city, 80) || undefined };
  if (!d.firstName || !d.lastName) return { ok: false, error: "Merci d'indiquer vos nom et prénom." };
  if (mode === "pickup" && !stores.includes(d.store ?? "")) return { ok: false, error: "Merci de choisir une boutique de retrait." };
  if (mode === "delivery" && (!d.address || !/^\d{5}$/.test(d.postalCode ?? "") || !d.city)) return { ok: false, error: "Adresse de livraison incomplète (code postal à 5 chiffres)." };
  const sub = subtotal(priced), ship = shipping(priced, mode);
  return { ok: true, data: { ...d, priced, totals: { subtotal: sub, shipping: ship.cents, total: sub + (ship.cents ?? 0) } } };
}
