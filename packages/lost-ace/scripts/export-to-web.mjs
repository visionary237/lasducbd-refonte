// Copie le build du jeu dans le site (apps/web/public/experience/lost-ace) avec une brand.json.
import fs from "node:fs";
import path from "node:path";
const src = path.resolve("dist");
const dest = path.resolve("../../apps/web/public/experience/lost-ace");
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
// on ne garde que les sous-ensembles de polices latin (le reste ne sert pas en français)
for (const f of fs.readdirSync(path.join(dest, "assets"))) if (/(cyrillic|greek|vietnamese)/.test(f)) fs.rmSync(path.join(dest, "assets", f));
fs.writeFileSync(path.join(dest, "brand.json"), JSON.stringify({
  publisher: "L'AS DU CBD × DOERZ",
  footerNotice: "Expérience ludique · personnages fictifs · aucun produit, aucun achat, aucune collecte de données",
  storageKey: "lasducbd-lost-ace:v1",
}, null, 2));
console.log("exporté →", dest);
