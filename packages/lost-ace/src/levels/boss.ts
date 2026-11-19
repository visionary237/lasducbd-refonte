import { LevelBuilder } from "./LevelBuilder";

/**
 * MONDE 5 — THE ROYAL PALACE · Salle du trône (arène du boss, prototype jouable).
 * Arène fermée de 30 tuiles (27 utiles). Le portail apparaît après la victoire.
 */
const b = new LevelBuilder(30);
b.ground(0, 29, 12).block(0, 0, 1, 12).block(29, 0, 1, 12)
  .platform(4, 8, 4).platform(22, 8, 4)
  .playerStart(4, 11)
  .add("boss", 22, 11)
  .add("heart", 6, 7).add("heart", 24, 7)
  .add("checkpoint", 2, 11);

export const BOSS = b.build("boss", "royal-palace", "La salle du trône");
