import { TIERS, POINTS_RULES } from "./config";
import type { Interaction, Member, Tier } from "./types";

export function tierFor(points: number, tiers: Tier[] = TIERS): Tier {
  return [...tiers].sort((a, b) => b.minPoints - a.minPoints).find((t) => points >= t.minPoints) ?? tiers[0];
}
export function nextTier(points: number, tiers: Tier[] = TIERS) {
  const n = [...tiers].sort((a, b) => a.minPoints - b.minPoints).find((t) => t.minPoints > points);
  return n ? { tier: n, missing: n.minPoints - points } : null;
}
/** Points d'une interaction. Les parties de jeu ne donnent jamais de points (pas de récompense liée au jeu). */
export function pointsFor(i: Interaction): number {
  switch (i.type) {
    case "visit": return POINTS_RULES.perVisit;
    case "purchase": return Math.floor((i.amountCents ?? 0) / 100) * POINTS_RULES.perEuro;
    default: return 0;
  }
}
/** Segmentation simple (RFM léger) — calculée côté serveur, jamais exposée au client. */
export function segmentsFor(m: Member, history: Interaction[], now = new Date()): string[] {
  const s: string[] = [];
  const last = history.filter((h) => h.type === "visit" || h.type === "purchase").map((h) => +new Date(h.at)).sort((a, b) => b - a)[0];
  const days = last ? (now.getTime() - last) / 86400000 : Infinity;
  if (days <= 30) s.push("actif-30j"); else if (days <= 90) s.push("tiède-90j"); else s.push("inactif");
  const visits = history.filter((h) => h.type === "visit").length;
  if (visits >= 6) s.push("habitué");
  if (m.homeStore) s.push(`boutique:${m.homeStore}`);
  if (!m.consents.email && !m.consents.sms) s.push("sans-consentement-marketing");
  return s;
}
