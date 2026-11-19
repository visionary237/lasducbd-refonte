/**
 * Contenu éditorial du concept.
 * ⚠️ Les textes « histoire » sont un RÉCIT DE MARQUE PROPOSÉ par DOERZ (fiction de travail),
 * à valider avec les fondateurs. Aucune donnée factuelle n'est inventée sur l'entreprise.
 * Villes : reprises de la page « Nos shops » du site actuel (consultée le 19/11/2026).
 */

export type Suit = "spade" | "heart" | "diamond" | "club";

export const SECTIONS = [
  { id: "accueil", label: "Ouverture", rank: "A", suit: "spade" as Suit },
  { id: "histoire", label: "L'histoire", rank: "R", suit: "heart" as Suit },
  { id: "galerie", label: "La galerie", rank: "D", suit: "diamond" as Suit },
  { id: "espaces", label: "Les maisons", rank: "V", suit: "club" as Suit },
  { id: "direction", label: "Direction artistique", rank: "10", suit: "spade" as Suit },
  { id: "composants", label: "Composants", rank: "J", suit: "heart" as Suit },
] as const;

export const CHAPTERS = [
  {
    n: "I",
    title: "La carte maîtresse",
    body:
      "Dans un jeu, l'As est à la fois la plus petite et la plus haute des cartes. L'identité part de cette ambivalence : une maison discrète, accessible, et pourtant exigeante sur chaque détail.",
  },
  {
    n: "II",
    title: "Le geste du croupier",
    body:
      "Tout se joue dans la manière de présenter : le conseil prend le temps, la parole est posée, l'information est claire. La maison ne pousse pas, elle explique.",
  },
  {
    n: "III",
    title: "Le salon Art déco",
    body:
      "Lignes rayonnantes, dorures mesurées, verts profonds : l'univers emprunte aux salons de jeu des années 1920 sans jamais tomber dans le pastiche.",
  },
  {
    n: "IV",
    title: "Le Gentleman de Pique",
    body:
      "Mascotte de la maison, il incarne l'hôte idéal : courtois, malicieux, toujours tiré à quatre épingles. Il guide, il ne vend pas.",
  },
];

export const GALLERY = [
  { rank: "A", suit: "spade" as Suit, title: "L'As", motif: "Emblème", text: "Le pique, dessiné en courbes tendues. Il signe chaque support, du sceau au favicon." },
  { rank: "R", suit: "heart" as Suit, title: "Le Roi", motif: "Héritage", text: "Monogramme couronné pour les pièces d'exception : papeterie, enseignes, gravures." },
  { rank: "D", suit: "diamond" as Suit, title: "La Dame", motif: "Ornement", text: "Rosace Art déco à huit branches, utilisée en fond et en filigrane." },
  { rank: "V", suit: "club" as Suit, title: "Le Valet", motif: "Service", text: "Le pictogramme de l'accueil : signalétique, plans des maisons, aide." },
  { rank: "10", suit: "spade" as Suit, title: "Le Dix", motif: "Rythme", text: "Grille à dix colonnes et filets dorés qui structurent les pages éditoriales." },
  { rank: "9", suit: "diamond" as Suit, title: "Le Neuf", motif: "Texture", text: "Grain argentique animé, à 7 % d'opacité, pour donner de la matière aux aplats." },
  { rank: "8", suit: "heart" as Suit, title: "Le Huit", motif: "Bordeaux", text: "La couleur d'accent, réservée aux signaux : alertes, mentions, focus." },
  { rank: "J", suit: "club" as Suit, title: "Le Joker", motif: "Mascotte", text: "Le Gentleman de Pique, déclinable en poses pour l'éditorial et la signalétique." },
];

/** Villes listées sur le site actuel. Adresses et horaires volontairement non renseignés : à intégrer depuis la source officielle. */
export const SPACES = [
  { city: "Rouen", region: "Normandie", mood: "Salon de lecture", desc: "Concept d'aménagement : comptoir en noyer, mur de cartes encadrées, coin conseil assis." },
  { city: "Caen", region: "Normandie", mood: "Cabinet de curiosités", desc: "Concept d'aménagement : vitrines laiton, éclairage rasant, bibliothèque de fiches pédagogiques." },
  { city: "Le Mans", region: "Pays de la Loire", mood: "Atelier", desc: "Concept d'aménagement : établi central, matériaux bruts, signalétique peinte à la main." },
  { city: "Nantes", region: "Pays de la Loire", mood: "Jardin d'hiver", desc: "Concept d'aménagement : verrière, plantes vertes, banquettes émeraude." },
  { city: "Bordeaux", region: "Nouvelle-Aquitaine", mood: "Salon de jeu", desc: "Concept d'aménagement : tapis de feutre vert, lustres Art déco, bar de conseil." },
];

export const PALETTE = [
  { name: "Onyx", hex: "#101714", role: "Fond principal, profondeur", on: "#F3EBDD" },
  { name: "Émeraude", hex: "#214D36", role: "Surfaces, feutre de table", on: "#F3EBDD" },
  { name: "Or", hex: "#C6A05A", role: "Emblème, filets, actions", on: "#101714" },
  { name: "Ivoire", hex: "#F3EBDD", role: "Texte, papier", on: "#101714" },
  { name: "Bordeaux", hex: "#832E3E", role: "Accent, signaux", on: "#F3EBDD" },
];
