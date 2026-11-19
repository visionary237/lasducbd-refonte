/**
 * Garde-fou éditorial : détecte les allégations de santé / thérapeutiques interdites
 * et les formulations incitatives. Utilisé par les tests (vitest) et scripts/check-compliance.mjs.
 * Ce n'est pas un avis juridique : il signale, un humain tranche.
 */
export interface ComplianceHit { rule: string; match: string; index: number }

const RULES: { rule: string; re: RegExp }[] = [
  { rule: "allégation thérapeutique", re: /\b(gu[ée]ri[rst]?|soigne[rz]?|soulage[rz]?|traite(?:ment)?s? (?:de|contre|l[ae])|th[ée]rapeutique|m[ée]dicament|rem[èe]de)\b/gi },
  { rule: "pathologie / symptôme", re: /\b(anxi[ée]t[ée]|d[ée]pression|insomnie|douleurs?|inflammation|[ée]pilepsie|cancer|stress chronique|migraines?|arthrose)\b/gi },
  { rule: "promesse d'effet", re: /\b(apaise|relaxant|anti[- ]?stress|d[ée]tente garantie|favorise le sommeil|aide à dormir|effet (?:calmant|relaxant))\b/gi },
  { rule: "incitation / banalisation", re: /\b(d[ée]fonce|planer|(?<!["'])high(?!["'])|stone|100 ?% (?:l[ée]gal|naturel) garanti)\b/gi },
  { rule: "ciblage mineurs", re: /\b(ados?|adolescents?|lyc[ée]ens?|coll[ée]giens?)\b/gi },
];

/** Contexte autorisé : phrases de mise en garde ou citations réglementaires (« sans allégation thérapeutique »). */
const ALLOW = /(\bsans|\baucune?|\bni|\bpas|interdit\w*|\bne |\bn['’])[^.]{0,60}$/i;

export function checkText(text: string): ComplianceHit[] {
  const hits: ComplianceHit[] = [];
  for (const { rule, re } of RULES) {
    re.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const before = text.slice(Math.max(0, m.index - 80), m.index);
      if (ALLOW.test(before)) continue;
      hits.push({ rule, match: m[0], index: m.index });
    }
  }
  return hits;
}
