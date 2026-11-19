/**
 * Stockage local (localStorage) — aucune donnée ne quitte l'appareil.
 * Contenu : réglages, progression, classement local. Aucune collecte marketing.
 */
const KEY = "lost-ace:v1";

export interface ScoreEntry { name: string; score: number; level: string; time: number; cards: number; date: string }
interface Save {
  settings: { sound: boolean; reducedFx: boolean };
  unlocked: string[]; // ids de mondes
  bestByLevel: Record<string, number>;
  leaderboard: ScoreEntry[];
}

const DEFAULT: Save = { settings: { sound: true, reducedFx: false }, unlocked: ["emerald-forest", "royal-palace"], bestByLevel: {}, leaderboard: [] };
let cache: Save | null = null;

function load(): Save {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(KEY);
    cache = raw ? { ...DEFAULT, ...JSON.parse(raw) } : structuredClone(DEFAULT);
  } catch { cache = structuredClone(DEFAULT); }
  return cache!;
}
function persist() { try { localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* mode privé : on garde en mémoire */ } }

export const Storage = {
  get settings() { return load().settings; },
  setSetting<K extends keyof Save["settings"]>(k: K, v: Save["settings"][K]) { load().settings[k] = v; persist(); },
  isUnlocked: (id: string) => load().unlocked.includes(id),
  unlock(id: string) { const s = load(); if (!s.unlocked.includes(id)) { s.unlocked.push(id); persist(); } },
  best: (level: string) => load().bestByLevel[level] ?? 0,
  leaderboard: () => [...load().leaderboard].sort((a, b) => b.score - a.score).slice(0, 10),
  qualifies(score: number) { const lb = this.leaderboard(); return score > 0 && (lb.length < 10 || score > lb[lb.length - 1].score); },
  submit(e: ScoreEntry) {
    const s = load();
    s.leaderboard.push(e);
    s.leaderboard = s.leaderboard.sort((a, b) => b.score - a.score).slice(0, 10);
    s.bestByLevel[e.level] = Math.max(s.bestByLevel[e.level] ?? 0, e.score);
    persist();
  },
  reset() { cache = structuredClone(DEFAULT); persist(); },
};
