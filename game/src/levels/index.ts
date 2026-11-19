import { LEVEL1 } from "./level1";
import { BOSS } from "./boss";
import type { LevelData } from "./types";

/** Registre des niveaux : clé = WorldDef.levelKey. */
export const LEVELS: Record<string, LevelData> = { level1: LEVEL1, boss: BOSS };
