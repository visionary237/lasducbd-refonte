/**
 * Définition data-driven des 5 mondes.
 * Ajouter un monde = ajouter une entrée ici + un fichier de niveau dans src/levels/.
 * Les décors procéduraux (BootScene) lisent `palette` et `layers` ; les vrais assets
 * illustrés remplaceront ces textures sans toucher au code de jeu (même clés).
 */
export type LayerKind = "sky" | "far" | "mid" | "near" | "fore";

export interface WorldDef {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  levelKey: string | null; // null = monde pas encore produit
  palette: {
    skyTop: string; skyBottom: string; fog: string;
    far: string; mid: string; near: string; fore: string;
    groundTop: string; groundFill: string; accent: string; light: string;
  };
  /** Motif dominant des silhouettes de décor. */
  motif: "trees" | "ruins" | "lab" | "nightwood" | "palace";
  /** Facteurs de parallaxe (scrollFactor) par couche. */
  parallax: Record<LayerKind, number>;
  ambient: { particles: "fireflies" | "dust" | "bubbles" | "spores" | "embers"; darkness: number };
  enemies: string[];
  par: number; // temps de référence (s) pour le bonus
}

const P = { sky: 0, far: 0.12, mid: 0.32, near: 0.62, fore: 1.25 };

export const WORLDS: WorldDef[] = [
  {
    id: "emerald-forest", index: 1, name: "Emerald Forest", subtitle: "Le sentier des lucioles", levelKey: "level1",
    palette: {
      skyTop: "#0b2420", skyBottom: "#1f5a47", fog: "rgba(120,220,190,0.10)",
      far: "#12352d", mid: "#0f2b24", near: "#0a1d18", fore: "#06120f",
      groundTop: "#4f9e57", groundFill: "#2a3a2c", accent: "#7fe0ff", light: "#ffe7a3",
    },
    motif: "trees", parallax: P, ambient: { particles: "fireflies", darkness: 0.18 },
    enemies: ["beetle", "wisp"], par: 150,
  },
  {
    id: "golden-temple", index: 2, name: "Golden Temple", subtitle: "Les ruines dorées", levelKey: null,
    palette: {
      skyTop: "#f2c879", skyBottom: "#a8742c", fog: "rgba(255,220,150,0.14)",
      far: "#c99a52", mid: "#8e6630", near: "#5b3d17", fore: "#2b1c09",
      groundTop: "#d8b25e", groundFill: "#5a4020", accent: "#fff0b0", light: "#fff4d0",
    },
    motif: "ruins", parallax: P, ambient: { particles: "dust", darkness: 0.05 },
    enemies: ["beetle", "spikeTrap", "flameJet"], par: 170,
  },
  {
    id: "crystal-laboratory", index: 3, name: "Crystal Laboratory", subtitle: "Les cornues chantantes", levelKey: null,
    palette: {
      skyTop: "#0e3a44", skyBottom: "#2b8f8a", fog: "rgba(150,255,240,0.10)",
      far: "#1f5b5f", mid: "#164246", near: "#3a2418", fore: "#1a0f08",
      groundTop: "#b88a4a", groundFill: "#3a2616", accent: "#8ff7ff", light: "#d8fffb",
    },
    motif: "lab", parallax: P, ambient: { particles: "bubbles", darkness: 0.1 },
    enemies: ["wisp", "gearbot"], par: 180,
  },
  {
    id: "midnight-kingdom", index: 4, name: "Midnight Kingdom", subtitle: "La forêt violette", levelKey: null,
    palette: {
      skyTop: "#140b26", skyBottom: "#4a2a74", fog: "rgba(190,140,255,0.10)",
      far: "#2d1c4c", mid: "#22153a", near: "#150c26", fore: "#0a0614",
      groundTop: "#3fae9a", groundFill: "#1a1426", accent: "#6ff0ff", light: "#ffd27a",
    },
    motif: "nightwood", parallax: P, ambient: { particles: "spores", darkness: 0.3 },
    enemies: ["wisp", "beetle", "owl"], par: 190,
  },
  {
    id: "royal-palace", index: 5, name: "The Royal Palace", subtitle: "La salle du trône", levelKey: "boss",
    palette: {
      skyTop: "#1a1410", skyBottom: "#5b4630", fog: "rgba(255,230,180,0.10)",
      far: "#3b3024", mid: "#2a2119", near: "#17120d", fore: "#0b0806",
      groundTop: "#c6a05a", groundFill: "#2a2119", accent: "#ffe3a1", light: "#fff2cf",
    },
    motif: "palace", parallax: P, ambient: { particles: "embers", darkness: 0.2 },
    enemies: ["boss"], par: 120,
  },
];

export const worldById = (id: string) => WORLDS.find((w) => w.id === id)!;
