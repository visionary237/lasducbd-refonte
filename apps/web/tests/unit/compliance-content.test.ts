import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { checkText } from "@/lib/compliance";
import { ARTICLES } from "@/lib/articles";
import { CATEGORIES } from "@/lib/catalog/categories";
import { TIERS } from "@/lib/loyalty/config";

/** Parcourt tout le contenu publié (pages, composants, données) à la recherche d'allégations. */
const ROOT = path.resolve(__dirname, "../..");
function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? files(p) : /\.(tsx?|json)$/.test(d.name) ? [p] : [];
  });
}
const strip = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "").replace(/^import .*$/gm, "");

describe("conformité des contenus publiés", () => {
  const sources = ["app", "components", "lib", "content"].flatMap((d) => files(path.join(ROOT, d))).filter((f) => !f.endsWith("compliance.ts"));
  it.each(sources.map((f) => [path.relative(ROOT, f), f]))("%s", (_rel, f) => {
    expect(checkText(strip(fs.readFileSync(f, "utf8")))).toEqual([]);
  });
  it("articles, catégories et paliers", () => {
    const all = [...ARTICLES.flatMap((a) => [a.title, a.excerpt, ...a.blocks.map((b) => JSON.stringify(b))]), ...CATEGORIES.map((c) => c.description), ...TIERS.flatMap((t) => t.perks)].join("\n");
    expect(checkText(all)).toEqual([]);
  });
});
