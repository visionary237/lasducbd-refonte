/** Codes de tuiles logiques (le rendu/auto-tiling est fait par GameScene). */
export const enum Cell { Empty = 0, Solid = 1, OneWay = 2, Thorns = 3 }

export type EntityType =
  | "crystal" | "card" | "heart" | "checkpoint" | "exit" | "sign"
  | "beetle" | "wisp" | "mover" | "boss" | "mushroom" | "fern";

export interface Entity {
  type: EntityType;
  x: number; // coordonnées en tuiles (centre bas pour les objets posés)
  y: number;
  props?: Record<string, number | string | boolean>;
}

export interface LevelData {
  key: string;
  worldId: string;
  title: string;
  width: number;
  height: number;
  cells: Cell[][]; // [row][col]
  start: { x: number; y: number };
  entities: Entity[];
}
