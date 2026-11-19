/**
 * Modèle produit. Conçu pour être alimenté par un import (WooCommerce, PIM, caisse)
 * — jamais rédigé à la main sans source. Tous les champs réglementaires sont explicites.
 */
export type ComplianceStatus =
  | "ok"                // catégorie publiable
  | "legal-review"      // à valider juridiquement avant publication (ex. huiles, cf. Novel Food)
  | "restricted-ads";   // publiable, mais sans mise en avant publicitaire (ex. vapotage)

export interface Category {
  slug: string;
  name: string;
  description: string;         // texte factuel, sans allégation
  eshopPath: string;           // URL de la catégorie sur la boutique actuelle
  compliance: ComplianceStatus;
  complianceNote?: string;
  suit: "spade" | "heart" | "diamond" | "club";
  children?: { slug: string; name: string; eshopPath: string }[];
}

export interface LabReport { url: string; lab?: string; date?: string }

export interface Product {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  /** Prix en centimes TTC ; null = non renseigné (jamais deviné). */
  priceCents: number | null;
  priceUnit?: string;          // ex. "le gramme", "l'unité"
  images: { src: string; alt: string }[];
  shortDescription?: string;
  attributes: {
    cbdPercent?: number | null;
    thcPercent?: number | null; // doit être ≤ 0,3 pour publication
    origin?: string | null;
    cultivation?: string | null; // indoor / greenhouse / outdoor
    formats?: string[];
  };
  labReport?: LabReport | null;
  eshopUrl?: string | null;    // fiche sur la boutique en ligne
  availability?: { storeSlug: string; inStock: boolean }[];
  isTemplate?: boolean;        // fiche gabarit de démonstration
  subcategory?: string | null;
  priceFrom?: boolean;         // prix affiché « à partir de » (variantes non synchronisées)
  variants?: { label: string; priceCents: number; inStock: boolean }[] | null;
  inStock?: boolean;
  isNew?: boolean;
  dataNote?: string | null;    // incohérence relevée dans la source, à corriger
  compliance?: "ok" | "legal-review";
  complianceNote?: string | null;
  source: { system: "woocommerce" | "manual" | "template" | "releve-pages-categories"; importedAt?: string };
}
