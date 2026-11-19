// Aperçu pleine page statique (reduced-motion : tout le contenu affiché, sans épinglage).
import { chromium } from "playwright";
import fs from "node:fs";
fs.mkdirSync("preview", { recursive: true });
const b = await chromium.launch({ executablePath: process.env.CHROME || "/usr/bin/google-chrome" });
for (const [name, w, h, dpr] of [["desktop", 1440, 900, 1], ["mobile", 390, 844, 2]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto("http://localhost:4173/");
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `preview/${name}-full.png`, fullPage: true });
  await ctx.close();
}
await b.close();
