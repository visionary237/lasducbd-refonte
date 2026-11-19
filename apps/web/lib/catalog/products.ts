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

/**
 * Règle de publication.
 * - Produits en revue juridique : jamais publiés.
 * - THC > 0,3 % : jamais publié.
 * - Mode strict (CATALOG_STRICT_THC=true, à activer en production) : fleurs et extractions
 *   publiées seulement si le THC est renseigné. En prototype, les fiches sans taux affichent « à compléter ».
 */
export function isPublishable(p: Product, strict = process.env.CATALOG_STRICT_THC === "true") {
  if (p.isTemplate) return true;
  if (p.compliance === "legal-review") return false;
  const t = p.attributes.thcPercent;
  if (typeof t === "number" && t > 0.3) return false;
  if (strict && ["fleurs-de-cbd", "hash-et-extractions"].includes(p.categorySlug)) return typeof t === "number";
  return true;
}
/** Un produit peut aller au panier si son prix est connu sans ambiguïté (prix fixe ou variante choisie). */
export function isPurchasable(p: Product) {
  if (p.isTemplate || p.compliance === "legal-review") return false;
  if (p.variants?.length) return p.variants.some((v) => v.inStock);
  return p.priceCents != null && !p.priceFrom && p.inStock !== false;
}
export const findById = (id: string) => PRODUCTS.find((p) => p.id === id);
