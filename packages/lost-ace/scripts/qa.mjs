// QA automatisée du jeu : captures portfolio, erreurs console, parcours scripté.
// Utilisation : npm run build && npx vite preview --port 4174 & node scripts/qa.mjs
import { chromium } from "/home/claude/doerz/site/node_modules/playwright/index.mjs";
import fs from "node:fs";
const BASE = process.env.BASE || "http://localhost:4174";
const OUT = "captures"; fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const errors = [];
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.on("pageerror", (e) => errors.push(String(e)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
const wait = (ms) => page.waitForTimeout(ms);
const shot = (n) => page.screenshot({ path: `${OUT}/${n}.png` });
const state = () => page.evaluate(() => { const g = window.__game.scene.getScene("Game"); return g?.player ? { x: Math.round(g.player.x), y: Math.round(g.player.y), hp: g.player.hp, ...g.run, cards: g.run.cards.join(",") } : null; });

await page.goto(BASE + "/"); await wait(2500); await shot("01-menu");
await page.keyboard.press("Enter"); await wait(1200); await shot("02-mondes");
await page.keyboard.press("Escape"); await wait(400);
await page.keyboard.press("ArrowDown"); await page.keyboard.press("ArrowDown"); await page.keyboard.press("Enter"); await wait(700); await shot("03-commandes");

// Niveau 1 : parcours scripté
await page.goto(BASE + "/?level=level1"); await wait(2600); await shot("10-niveau1-depart");
const hold = async (key, ms) => { await page.keyboard.down(key); await wait(ms); await page.keyboard.up(key); };
await hold("ArrowRight", 1400); await shot("11-niveau1-course");
await page.keyboard.down("ArrowRight");
for (let i = 0; i < 6; i++) { await page.keyboard.down("Space"); await wait(300); await page.keyboard.up("Space"); await wait(250); }
await page.keyboard.up("ArrowRight");
await shot("12-niveau1-saut"); console.log("après sauts", await state());
// téléportation vers des zones clés pour captures
for (const [x, n] of [[44, "13-double-saut"], [66, "14-fosse-ronces"], [100, "15-ascension"], [140, "16-plaine"], [188, "17-portail"]]) {
  await page.evaluate((tx) => { const g = window.__game.scene.getScene("Game"); g.player.body.reset(tx * 48, 11 * 48); }, x);
  await wait(1300); await shot(n);
}
// saut double en l'air (capture de la vrille)
await page.evaluate(() => { const g = window.__game.scene.getScene("Game"); g.player.body.reset(30 * 48, 12 * 48); });
await wait(500); await page.keyboard.press("Space"); await wait(260); await page.keyboard.press("Space"); await wait(120); await shot("18-vrille");
console.log("état", await state());
// fin de niveau
await page.evaluate(() => { const g = window.__game.scene.getScene("Game"); g.player.body.reset(192 * 48, 11 * 48); });
await wait(2600); await shot("19-bilan");
await page.keyboard.press("Enter"); await wait(800); await shot("20-bilan-valide");

// Arène du boss
await page.goto(BASE + "/?level=boss"); await wait(4200); await shot("30-boss");
await wait(2500); await shot("31-boss-attaque");
console.log("boss", await page.evaluate(() => { const g = window.__game.scene.getScene("Game"); return g.boss ? { state: g.boss.state, hp: g.boss.hp } : null; }));

// Mobile (tactile)
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const m = await ctx.newPage(); m.on("pageerror", (e) => errors.push("mobile: " + e));
await m.goto(BASE + "/?level=level1"); await m.waitForTimeout(3000); await m.screenshot({ path: `${OUT}/40-mobile-tactile.png` });

// FPS approximatif
const fps = await page.evaluate(() => window.__game.loop.actualFps);
await browser.close();
fs.writeFileSync(`${OUT}/qa-report.json`, JSON.stringify({ errors, fps }, null, 2));
console.log({ errors, fps });
