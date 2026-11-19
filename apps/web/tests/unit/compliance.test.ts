import { describe, expect, it } from "vitest";
import { checkText } from "@/lib/compliance";

describe("checkText — allégations interdites", () => {
  it.each([
    "Cette fleur soulage les douleurs articulaires.",
    "Une huile qui apaise et favorise le sommeil.",
    "Le remède naturel contre l'anxiété.",
    "Idéal pour les lycéens stressés.",
  ])("détecte : %s", (t) => expect(checkText(t).length).toBeGreaterThan(0));

  it.each([
    "Nos produits ne revendiquent aucune propriété thérapeutique.",
    "Aucun produit au CBD n'est un médicament.",
    "Ce ne sont pas des médicaments.",
    "Taux de THC inférieur ou égal à 0,3 %, bulletin d'analyse fourni.",
  ])("accepte les mises en garde : %s", (t) => expect(checkText(t)).toEqual([]));
});
