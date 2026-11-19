// Bot de playtest : parcourt le niveau en sautant au-dessus des trous, murs, ronces et ennemis.
// Sert de test de fumée (traversabilité, erreurs, checkpoints). node scripts/bot.mjs [start-col]
import { chromium } from "/home/claude/doerz/site/node_modules/playwright/index.mjs";
const BASE = process.env.BASE || "http://localhost:4174";
const startCol = Number(process.argv[2] || 0);
const b = await chromium.launch({ executablePath: "/usr/bin/google-chrome", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: 960, height: 540 } });
const errors = []; p.on("pageerror", (e) => errors.push(String(e)));
await p.goto(BASE + "/?level=level1&canvas"); await p.waitForTimeout(2500);
await p.evaluate((sc) => {
  const bot = (window.__bot = { left: false, right: true, jump: false, press: false });
  const g = window.__game.scene.getScene("Game");
  if (sc) g.player.body.reset(sc * 48, 11 * 48);
  window.__stats = { maxX: 0, doubles: 0 };
  let doubled = false;
  const T = 48;
  const step = () => {
    const g = window.__game.scene.getScene("Game");
    if (g && g.player && !g.player.dead && g.level) {
      const pl = g.player, L = g.level, bd = pl.body;
      const cell = (x, y) => (y >= L.height ? 1 : y < 0 ? 0 : (L.cells[y] ?? [])[x] ?? 1);
      const col = Math.floor(pl.x / T), row = Math.floor((pl.y - 2) / T);
      const floor = (x) => { for (let y = row + 1; y <= Math.min(L.height - 1, row + 3); y++) { const c = cell(x, y); if (c === 3) return false; if (c === 1 || c === 2) return true; } return false; };
      const mover = (x) => g.movers?.some((m) => x * T >= m.x - 20 && x * T <= m.x + 164 && m.y > pl.y - 140 && m.y < pl.y + 200);
      const grounded = bd.blocked.down || bd.touching.down;
      window.__stats.maxX = Math.max(window.__stats.maxX, col);
      const enemyAhead = g.enemies.getChildren().some((e) => e.alive && e.x - pl.x > 0 && e.x - pl.x < 150 && Math.abs(e.y - pl.y) < 90);
      const wall = cell(col + 1, row) === 1 || cell(col + 1, row - 1) === 1;
      const gap = !(floor(col + 1) || mover(col + 1)) || !(floor(col + 2) || mover(col + 2));
      const thorn = [1, 2].some((d) => cell(col + d, row) === 3 || cell(col + d, row + 1) === 3);
      // attendre la plateforme mobile si elle est loin
      const waitMover = grounded && gap && !mover(col + 2) && g.movers?.some((m) => Math.abs(m.x - pl.x) < 700 && m.y > pl.y - 200);
      bot.right = !waitMover;
      if (grounded && bd.velocity.y >= 0) { doubled = false; bot.jump = false; if (!waitMover && (wall || gap || thorn || enemyAhead)) { bot.press = true; bot.jump = true; } }
      else {
        bot.jump = true;
        const needHeight = cell(col + 1, row - 1) === 1 || cell(col + 1, row - 2) === 1 || cell(col + 1, row) === 1;
        const fallingIntoGap = bd.velocity.y > 0 && !(floor(col) || floor(col + 1) || mover(col) || mover(col + 1));
        if (!doubled && bd.velocity.y > -120 && (needHeight || fallingIntoGap)) { doubled = true; bot.press = true; window.__stats.doubles++; }
      }
    }
    requestAnimationFrame(step);
  };
  step();
}, startCol);
let last;
for (let i = 0; i < 90; i++) {
  await p.waitForTimeout(2000);
  last = await p.evaluate(() => { const g = window.__game.scene.getScene("Game"); const end = window.__game.scene.isActive("LevelEnd"); return { end, fps: Math.round(window.__game.loop.actualFps), ...window.__stats, x: g?.player ? Math.round(g.player.x / 48) : null, lives: g?.run?.lives, deaths: g?.run?.deaths, crystals: g?.run?.crystals, cards: g?.run?.cards?.join(","), score: g?.run?.score }; });
  if (i % 5 === 0) console.log(JSON.stringify(last));
  if (last.end || last.lives <= 0) break;
}
await p.screenshot({ path: "captures/_bot-end.png" });
console.log("FINAL", JSON.stringify(last), errors);
await b.close();
