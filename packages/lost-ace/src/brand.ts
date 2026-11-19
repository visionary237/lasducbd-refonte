/**
 * Configuration de marque du moteur de plateforme DOERZ.
 * Tout ce qui est propre à une marque (titres, textes, couleurs d'interface, clé de stockage)
 * vit ici. Pour décliner le jeu pour une autre marque : fournir un BrandConfig à createGame().
 * Le gameplay, les niveaux et les systèmes ne dépendent jamais d'une marque.
 */
export interface BrandConfig {
  gameTitle: string;
  publisher: string;            // ligne au-dessus du titre
  tagline: string;
  loadingText: string;
  footerNotice: string;         // mention légale / cadrage affichée au menu
  storageKey: string;           // isole les sauvegardes entre marques
  ui: { primary: string; text: string; accent: number; panel: number };
  /** URL de retour quand le jeu est intégré dans un site (bouton « Quitter »). */
  exitUrl?: string;
}

export const DEFAULT_BRAND: BrandConfig = {
  gameTitle: "THE LOST ACE",
  publisher: "UN JEU DOERZ",
  tagline: "Retrouvez les cartes anciennes et les cristaux perdus",
  loadingText: "Distribution des cartes…",
  footerNotice: "Personnages et univers fictifs · aucune publicité, aucun achat, aucune collecte de données",
  storageKey: "lost-ace:v1",
  ui: { primary: "#C6A05A", text: "#F3EBDD", accent: 0xc6a05a, panel: 0x214d36 },
};

let current: BrandConfig = DEFAULT_BRAND;
export const brand = () => current;
export function setBrand(b: Partial<BrandConfig>) { current = { ...DEFAULT_BRAND, ...b, ui: { ...DEFAULT_BRAND.ui, ...b.ui } }; }
