import { Cell, type Entity, type EntityType, type LevelData } from "./types";

/**
 * Petit DSL de construction de niveau. Lisible, versionnable et sans éditeur externe.
 * Les niveaux peuvent aussi être exportés au format Tiled (voir tools/export-tiled.mjs).
 */
export class LevelBuilder {
  cells: Cell[][];
  entities: Entity[] = [];
  start = { x: 2, y: 11 };

  constructor(public width: number, public height = 15) {
    this.cells = Array.from({ length: height }, () => Array<Cell>(width).fill(Cell.Empty));
  }
  private set(x: number, y: number, c: Cell) { if (x >= 0 && x < this.width && y >= 0 && y < this.height) this.cells[y][x] = c; }

  /** Sol plein de la colonne x0 à x1 (incluses), surface à la ligne `top`. */
  ground(x0: number, x1: number, top: number) { for (let x = x0; x <= x1; x++) for (let y = top; y < this.height; y++) this.set(x, y, Cell.Solid); return this; }
  block(x: number, y: number, w: number, h: number) { for (let i = 0; i < w; i++) for (let j = 0; j < h; j++) this.set(x + i, y + j, Cell.Solid); return this; }
  /** Plateforme traversable par le dessous. */
  platform(x: number, y: number, len: number) { for (let i = 0; i < len; i++) this.set(x + i, y, Cell.OneWay); return this; }
  thorns(x0: number, x1: number, y: number) { for (let x = x0; x <= x1; x++) this.set(x, y, Cell.Thorns); return this; }

  add(type: EntityType, x: number, y: number, props?: Entity["props"]) { this.entities.push({ type, x, y, props }); return this; }
  /** Ligne de cristaux. */
  crystals(x0: number, x1: number, y: number, step = 1) { for (let x = x0; x <= x1; x += step) this.add("crystal", x, y); return this; }
  /** Arc de cristaux (au-dessus d'un saut). */
  arc(x0: number, x1: number, y: number, h = 2) {
    const n = x1 - x0;
    for (let i = 0; i <= n; i++) { const t = i / n; this.add("crystal", x0 + i, y - Math.sin(t * Math.PI) * h); }
    return this;
  }
  playerStart(x: number, y: number) { this.start = { x, y }; return this; }

  build(key: string, worldId: string, title: string): LevelData {
    return { key, worldId, title, width: this.width, height: this.height, cells: this.cells, start: this.start, entities: this.entities };
  }
}
