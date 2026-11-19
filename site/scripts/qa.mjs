// QA : captures portfolio + tests responsive + audit axe-core.
// Prérequis : `npm run build` puis un serveur statique sur out/ (PORT, défaut 4173).
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const BASE = process.env.BASE || "http://localhost:4173";
const OUT = "captures";
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const report = { viewports: [], axe: [] };

async function settle(page, ms = 400) { await page.waitForTimeout(ms); }

// 1) Intro (frames figées via ?introAt=)
for (const [at, n] of [[0.18, "01-intro-trace"], [0.42, "02-intro-cartes"], [0.66, "03-intro-titre"], [0.86, "04-intro-rideau"]]) {
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(`${BASE}/?introAt=${at}`);
  await settle(p, 900);
  await p.screenshot({ path: `${OUT}/${n}.png` });
  await p.close();
}

// 2) Sections desktop + mobile
for (const vp of [{ name: "desktop", width: 1440, height: 900 }, { name: "tablet", width: 834, height: 1112 }, { name: "mobile", width: 390, height: 844 }]) {
  const p = await browser.newPage({ viewport: vp, deviceScaleFactor: vp.name === "mobile" ? 2 : 1 });
  await p.goto(BASE + "/?nointro");
  await settle(p, 1600);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  report.viewports.push({ viewport: vp.name, horizontalOverflowPx: overflow });
  await p.screenshot({ path: `${OUT}/${vp.name}-hero.png` });
  for (const id of ["histoire", "galerie", "espaces", "direction", "composants"]) {
    await p.evaluate((i) => document.getElementById(i).scrollIntoView(), id);
    await settle(p, 1400);
    await p.screenshot({ path: `${OUT}/${vp.name}-${id}.png` });
  }
  if (vp.name === "desktop") {
    // carte retournée
    await p.evaluate(() => document.getElementById("galerie").scrollIntoView());
    await settle(p, 1400);
    await p.locator("#galerie li button").nth(0).click();
    await p.locator("#galerie li button").nth(2).click();
    await settle(p, 1000);
    await p.mouse.move(5, 5);
    await settle(p, 800);
    await p.screenshot({ path: `${OUT}/desktop-galerie-retournee.png` });
    // histoire au milieu du scroll horizontal
    const y = await p.evaluate(() => document.getElementById("histoire").offsetTop);
    await p.evaluate((yy) => window.scrollTo(0, yy + 900), y);
    await settle(p, 1400);
    await p.screenshot({ path: `${OUT}/desktop-histoire-chapitres.png` });
  }
  // menu immersif
  await p.evaluate(() => window.scrollTo(0, 0));
  await settle(p, 600);
  await p.getByRole("button", { name: "Le jeu" }).click();
  await settle(p, 1500);
  await p.screenshot({ path: `${OUT}/${vp.name}-menu.png` });
  await p.keyboard.press("Escape");
  await p.close();
}

// 3) Design system pleine page
{
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + "/design-system/");
  await settle(p, 800);
  await p.screenshot({ path: `${OUT}/design-system.png`, fullPage: true });
  await p.close();
}

// 4) Audit axe (WCAG 2.2 A/AA), avec et sans menu
for (const path of ["/?nointro", "/design-system/"]) {
  const ctx = await browser.newContext({ reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(BASE + path);
  await settle(p, 800);
  const r = await new AxeBuilder({ page: p }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  report.axe.push({ path, violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, sample: v.nodes[0]?.target })) , passes: r.passes.length });
  await ctx.close();
}

// 5) Clavier : tab → skip link
{
  const p = await browser.newPage();
  await p.goto(BASE + "/?nointro");
  await p.keyboard.press("Tab");
  report.firstTab = await p.evaluate(() => document.activeElement?.textContent);
  await p.close();
}

await browser.close();
fs.writeFileSync(`${OUT}/qa-report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
