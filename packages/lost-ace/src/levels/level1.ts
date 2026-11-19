import { LevelBuilder } from "./LevelBuilder";

/**
 * MONDE 1 — EMERALD FOREST · « Le sentier des lucioles »
 * Grille 200 × 15 tuiles de 48 px. Surface standard : ligne 12.
 * Rythme : apprentissage → double saut → plateformes mobiles → ascension → épreuve finale.
 * 3 cartes anciennes : (45,7) ledge du double saut · (102,2) sommet de l'ascension · (148,4) chemin haut.
 */
const b = new LevelBuilder(200);

// ── 1. Apprentissage (0-27)
b.ground(0, 24, 12).ground(19, 24, 11).playerStart(3, 11)
  .add("sign", 6, 11, { text: "← → ou A / D  ·  avancer" })
  .crystals(9, 15, 10)
  .add("sign", 21, 10, { text: "ESPACE  ·  sauter" })
  .add("mushroom", 12, 11).add("fern", 16, 12);
// trou de 3 tuiles + arc de cristaux
b.arc(24, 28, 9, 2);

// ── 2. Premier ennemi et double saut (28-46)
b.ground(28, 46, 12).add("beetle", 34, 11, { range: 4 })
  .add("sign", 37, 11, { text: "ESPACE × 2  ·  double saut" })
  .ground(41, 46, 8).add("card", 45, 7).crystals(42, 44, 7)
  .add("mushroom", 30, 11).add("mushroom", 39, 11);

// ── 3. Rondins flottants (47-58)
b.ground(47, 58, 12).platform(50, 9, 3).crystals(50, 52, 8).add("wisp", 55, 8, { amp: 1.5 })
  .add("checkpoint", 57, 11);

// ── 4. Fosse aux ronces + plateforme mobile horizontale (59-74)
b.ground(59, 74, 14).thorns(59, 74, 13)
  .add("mover", 60, 10, { dx: 11, dy: 0, period: 4.2 })
  .crystals(61, 72, 8, 2).platform(67, 6, 2).add("heart", 67.5, 5);

// ── 5. Plaine des scarabées (75-90)
b.ground(75, 90, 12).block(83, 10, 2, 2)
  .add("beetle", 79, 11, { range: 3 }).add("beetle", 87, 11, { range: 2 })
  .crystals(82, 85, 8).add("mushroom", 77, 11).add("mushroom", 89, 11);

// ── 6. Ascension (91-110)
b.ground(91, 110, 12)
  .platform(93, 9, 3).platform(97, 6, 3).platform(101, 3, 3)
  .add("card", 102, 2).crystals(93, 95, 8).crystals(97, 99, 5)
  .add("wisp", 99, 4, { amp: 1, range: 2 })
  .add("mover", 105, 11, { dx: 0, dy: -6, period: 4.6 })
  .add("checkpoint", 109, 11);

// ── 7. Vide et plateformes mobiles en relais (111-126)
b.add("mover", 112, 10, { dx: 5, dy: 0, period: 3.4 })
  .add("mover", 119, 8, { dx: 5, dy: 0, period: 3.4, phase: 0.5 })
  .arc(112, 125, 7, 1.5);

// ── 8. Ronces au sol + chemin haut (127-150)
b.ground(127, 150, 12).thorns(133, 136, 11)
  .add("sign", 130, 11, { text: "Attention aux ronces" })
  .add("beetle", 140, 11, { range: 3 }).add("beetle", 146, 11, { range: 2 })
  .platform(142, 8, 2).platform(146, 5, 3).add("card", 147.5, 4)
  .crystals(133, 136, 8);

// ── 9. Épreuve finale (151-170)
b.ground(151, 156, 12).ground(160, 164, 10)
  .ground(165, 167, 14).thorns(165, 167, 13)
  .ground(168, 199, 12)
  .add("wisp", 158, 7, { amp: 1.4 }).add("wisp", 166, 8, { amp: 1.2 })
  .arc(156, 160, 9, 1.5).arc(164, 168, 7, 1.5)
  .add("checkpoint", 171, 11);

// ── 10. Sortie (172-199)
b.crystals(174, 186, 10, 2).add("heart", 178, 9).add("exit", 192, 11)
  .add("mushroom", 182, 11).add("mushroom", 188, 11).add("fern", 196, 12)
  .block(198, 0, 2, 12);

export const LEVEL1 = b.build("level1", "emerald-forest", "Le sentier des lucioles");
