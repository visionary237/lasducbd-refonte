/**
 * Consentement cookies (RGPD / lignes directrices CNIL) :
 * - aucun traceur non essentiel avant consentement ;
 * - « Tout refuser » aussi visible que « Tout accepter » ;
 * - choix conservé 6 mois, puis redemandé ; versionné pour redemander si les finalités changent.
 */
export const CONSENT_VERSION = 1;
export const CONSENT_MAX_AGE_DAYS = 182;
export type ConsentCategory = "necessary" | "audience" | "marketing";
export interface ConsentState { v: number; at: string; choices: Record<ConsentCategory, boolean> }

export const CONSENT_KEY = "ladc_consent";

export function makeConsent(choices: Partial<Record<ConsentCategory, boolean>>, now = new Date()): ConsentState {
  return { v: CONSENT_VERSION, at: now.toISOString(), choices: { necessary: true, audience: !!choices.audience, marketing: !!choices.marketing } };
}
export function parseConsent(raw: string | null | undefined, now = new Date()): ConsentState | null {
  if (!raw) return null;
  try {
    const c = JSON.parse(raw) as ConsentState;
    if (c.v !== CONSENT_VERSION) return null;
    const age = (now.getTime() - new Date(c.at).getTime()) / 86400000;
    if (!(age >= 0 && age <= CONSENT_MAX_AGE_DAYS)) return null;
    return c;
  } catch { return null; }
}
export const allows = (c: ConsentState | null, cat: ConsentCategory) => cat === "necessary" || !!c?.choices[cat];
