// Test fonctionnel du boss : 3 écrasements pendant l'état « sonné » doivent le vaincre et faire apparaître le portail.
import { chromium } from "/home/claude/doerz/site/node_modules/playwright/index.mjs";
const BASE = process.env.BASE || "http://localhost:4174";
const b = await chromium.launch({ executablePath: process.env.CHROME, args: ["--use-gl=angle", "--use-angle=swiftshader"] });
const p = await b.newPage({ viewport: { width: 960, height: 540 } });
const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(BASE + "/?level=boss&canvas"); await p.waitForTimeout(2500);
const res = await p.evaluate(async () => {
  const g = window.__game.scene.getScene("Game"); const out = [];
  for (let k = 0; k < 3; k++) {
    const t0 = performance.now();
    while (g.boss.state !== "stunned" && performance.now() - t0 < 25000) await new Promise((r) => setTimeout(r, 30));
    g.player.invulnUntil = g.time.now + 4000;
    g.player.body.reset(g.boss.x, g.boss.body.top - 40); g.player.body.setVelocityY(300);
    await new Promise((r) => setTimeout(r, 700));
    out.push({ hp: g.boss.hp, state: g.boss.state });
  }
  await new Promise((r) => setTimeout(r, 3500));
  return { out, exit: !!g.exit, score: g.run.score };
});
await p.screenshot({ path: "captures/32-boss-victoire.png" });
console.log(JSON.stringify(res), errors);
await b.close();
