// Captures pleine page des pages clés (desktop + mobile) → captures/. Serveur requis : npm run start
import { chromium } from "playwright";
import fs from "node:fs";
const BASE = process.env.BASE || "http://localhost:4173";
const OUT = "captures"; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const pages = [["accueil", "/"], ["catalogue", "/produits"], ["categorie", "/produits/fleurs-de-cbd"], ["fiche", "/produits/fleurs-de-cbd/modele-de-fiche"], ["boutiques", "/boutiques"], ["boutique-rouen", "/boutiques/rouen"], ["decouvrir", "/decouvrir-le-cbd"], ["fidelite", "/fidelite"], ["experience", "/experience"], ["journal-article", "/actualites/cadre-legal-cbd-france-2026"], ["infos", "/infos-pratiques"]];
for (const [vp, w, h, dpr] of [["desktop", 1440, 900, 1], ["mobile", 390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: "reduce" });
  await ctx.addInitScript(() => { localStorage.setItem("ladc_age_ok", String(Date.now())); localStorage.setItem("ladc_consent", JSON.stringify({ v: 1, at: new Date().toISOString(), choices: { necessary: true, audience: false, marketing: false } })); });
  const p = await ctx.newPage();
  for (const [n, path] of pages) {
    if (vp === "mobile" && !["accueil", "fiche", "fidelite"].includes(n)) continue;
    await p.goto(BASE + path); await p.waitForTimeout(900);
    await p.screenshot({ path: `${OUT}/${vp}-${n}.png`, fullPage: true });
  }
  if (vp === "desktop") {
    await p.goto(BASE + "/"); await p.waitForTimeout(700); await p.screenshot({ path: `${OUT}/desktop-hero.png` });
    await p.goto(BASE + "/experience"); await p.getByRole("button", { name: /Jouer/ }).click(); await p.waitForTimeout(5000);
    await p.locator("iframe").screenshot({ path: `${OUT}/desktop-experience-jeu.png` });
  }
  await ctx.close();
}
// Contrôle d'âge et bandeau cookies (premier visiteur)
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage(); await p.goto(BASE + "/?agegate"); await p.waitForTimeout(1500); await p.screenshot({ path: `${OUT}/desktop-premiere-visite.png` });
await b.close();
console.log("captures ok");
