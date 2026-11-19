import type { Product } from "./types";
import imported from "@/content/products.json";

/**
 * Fiche gabarit : montre la mise en page sans inventer de produit.
 * Toutes les valeurs sont « à importer ». Elle n'apparaît jamais dans le sitemap.
 */
export const TEMPLATE_PRODUCT: Product = {
  id: "template", slug: "modele-de-fiche", name: "Modèle de fiche produit", categorySlug: "fleurs-de-cbd",
  priceCents: null, priceUnit: "à importer",
  images: [],
  shortDescription: "Gabarit de démonstration : nom, prix, photos, taux et analyses seront importés depuis le catalogue réel.",
  attributes: { cbdPercent: null, thcPercent: null, origin: null, cultivation: null, formats: [] },
  labReport: null, eshopUrl: null, isTemplate: true, source: { system: "template" },
};

/** Produits importés (content/products.json, généré par scripts/import-woocommerce.mjs). */
export const PRODUCTS: Product[] = (imported as Product[]).filter((p) => isPublishable(p));

/** Règle de publication : THC renseigné et ≤ 0,3 % pour les produits à base de chanvre. */
export function isPublishable(p: Product) {
  if (p.isTemplate) return true;
  const t = p.attributes.thcPercent;
  if (["fleurs-de-cbd", "hash-et-extractions"].includes(p.categorySlug)) return typeof t === "number" && t <= 0.3;
  return true;
}
