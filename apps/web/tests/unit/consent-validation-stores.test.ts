import { describe, expect, it } from "vitest";
import { makeConsent, parseConsent, allows, CONSENT_MAX_AGE_DAYS } from "@/lib/consent";
import { validateContact, validateReservation, validateWaitlist } from "@/lib/validation";
import { STORES, storeJsonLd } from "@/lib/stores";

describe("consentement", () => {
  it("refus par défaut, expiration à 6 mois", () => {
    const now = new Date("2026-11-19");
    const c = makeConsent({}, now);
    expect(allows(c, "audience")).toBe(false);
    expect(allows(null, "necessary")).toBe(true);
    expect(parseConsent(JSON.stringify(c), now)).not.toBeNull();
    expect(parseConsent(JSON.stringify(c), new Date(now.getTime() + (CONSENT_MAX_AGE_DAYS + 1) * 86400000))).toBeNull();
    expect(parseConsent(JSON.stringify({ ...c, v: 0 }), now)).toBeNull();
    expect(parseConsent("{oops", now)).toBeNull();
  });
});

describe("formulaires", () => {
  const ok = { firstName: "Léa", email: "lea@example.fr", message: "Bonjour, une question.", consent: "yes" };
  it("contact : consentement et e-mail requis, champ piège", () => {
    expect(validateContact(ok).ok).toBe(true);
    expect(validateContact({ ...ok, consent: undefined }).ok).toBe(false);
    expect(validateContact({ ...ok, email: "x" }).ok).toBe(false);
    expect(validateContact({ ...ok, website: "spam" }).ok).toBe(false);
  });
  it("réservation : majorité, boutique connue, pas de gabarit", () => {
    const r = { ...ok, store: "rouen", product: "fleurs-de-cbd/x", adult: "yes" };
    const stores = STORES.map((s) => s.slug);
    expect(validateReservation(r, stores).ok).toBe(true);
    expect(validateReservation({ ...r, adult: undefined }, stores).ok).toBe(false);
    expect(validateReservation({ ...r, store: "paris" }, stores).ok).toBe(false);
    expect(validateReservation({ ...r, product: "fleurs-de-cbd/modele-de-fiche" }, stores).ok).toBe(false);
  });
  it("liste d'attente fidélité : majorité requise", () => {
    expect(validateWaitlist({ email: "a@b.fr", consent: "yes", adult: "yes" }).ok).toBe(true);
    expect(validateWaitlist({ email: "a@b.fr", consent: "yes" }).ok).toBe(false);
  });
});

describe("SEO local", () => {
  it("n'émet jamais d'adresse inventée dans le JSON-LD", () => {
    const ld = storeJsonLd(STORES[0], "https://x.fr");
    expect(ld.address).toBeUndefined();
    expect(ld.telephone).toBeUndefined();
    expect(ld.areaServed).toBe("Rouen");
    const full = storeJsonLd({ ...STORES[0], address: "1 rue X", postalCode: "76000", phone: "0200000000" }, "https://x.fr");
    expect(full.address).toMatchObject({ streetAddress: "1 rue X", addressLocality: "Rouen" });
  });
});
