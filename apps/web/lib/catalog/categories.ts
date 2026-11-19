import type { Category } from "./types";

const E = "https://coffeeshop-lasducbd.fr";

/**
 * Catégories reprises du menu « Achat CBD » du site actuel (relevé du 19/11/2026).
 * Descriptions factuelles, sans allégation de santé.
 */
export const CATEGORIES: Category[] = [
  {
    slug: "fleurs-de-cbd", name: "Fleurs de CBD", suit: "spade", compliance: "ok", eshopPath: `${E}/fleurs-de-cbd/`,
    description: "Sommités de chanvre à faible teneur en THC (≤ 0,3 %), présentées avec leur origine, leur mode de culture et leur bulletin d'analyse.",
  },
  {
    slug: "hash-et-extractions", name: "Hash & extractions", suit: "diamond", compliance: "ok", eshopPath: `${E}/solides-cbd/`,
    description: "Résines et extractions issues du chanvre, chacune accompagnée de sa fiche technique et de son analyse.",
  },
  {
    slug: "e-cbd", name: "E-CBD", suit: "club", compliance: "restricted-ads", eshopPath: `${E}/e-cbd/`,
    complianceNote: "Produits du vapotage : vérifier les règles de publicité applicables avant toute mise en avant.",
    description: "Vaporisateurs, e-liquides et matériel de vapotage.",
    children: [
      { slug: "vaporisateurs", name: "Vaporisateurs", eshopPath: `${E}/e-cbd/vaporisateurs/` },
      { slug: "e-liquides", name: "E-liquides CBD", eshopPath: `${E}/e-cbd/liquides-cbd/` },
      { slug: "cigarette-electronique", name: "Cigarette électronique", eshopPath: `${E}/e-cbd/cigarette-electronique/` },
      { slug: "cigarettes-jetables", name: "Cigarettes jetables", eshopPath: `${E}/e-cbd/cigarettes-jetables/` },
      { slug: "chicha", name: "Chicha CBD", eshopPath: `${E}/e-cbd/chicha-cbd/` },
    ],
  },
  {
    slug: "cosmetiques", name: "Cosmétiques", suit: "heart", compliance: "ok", eshopPath: `${E}/accessoires/cosmetiques/`,
    description: "Soins à usage externe formulés avec du CBD, présentés avec leur liste d'ingrédients.",
  },
  {
    slug: "accessoires", name: "Accessoires", suit: "spade", compliance: "ok", eshopPath: `${E}/accessoires/`,
    description: "Rangement, préparation et entretien : l'équipement de l'amateur exigeant.",
    children: [
      { slug: "grinders", name: "Grinders", eshopPath: `${E}/accessoires/grinder/` },
      { slug: "boites-plateaux", name: "Boîtes & plateaux", eshopPath: `${E}/accessoires/plateau/` },
      { slug: "balances", name: "Balances de précision", eshopPath: `${E}/accessoires/balances-de-precision/` },
      { slug: "feuilles-filtres", name: "Feuilles & filtres", eshopPath: `${E}/accessoires/feuilles/` },
      { slug: "briquets-cendriers", name: "Briquets & cendriers", eshopPath: `${E}/accessoires/briquets/` },
    ],
  },
  {
    slug: "huiles", name: "Huiles de CBD", suit: "heart", compliance: "legal-review", eshopPath: `${E}/huiles-cbd-full-spectrum/`,
    complianceNote: "Depuis le 15/05/2026, la DGAL interdit la vente des denrées alimentaires au CBD (règlement Novel Food). Catégorie masquée tant que le statut des produits (ex. cosmétique à usage externe) n'est pas validé juridiquement.",
    description: "Catégorie en attente de validation réglementaire.",
  },
];

/** Catégories publiables (les catégories en revue juridique sont exclues sauf drapeau explicite). */
export function visibleCategories(opts: { includeLegalReview?: boolean } = {}) {
  return CATEGORIES.filter((c) => c.compliance !== "legal-review" || opts.includeLegalReview);
}
export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
