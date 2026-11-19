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
