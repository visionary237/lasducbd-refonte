import Phaser from "phaser";
import { canvasTexture } from "./canvas";
import { glow, drawSuit, SPADE, DIAMOND } from "./paths";
import { rng } from "../utils/rng";
import type { WorldDef } from "../config/worlds";
import { GAME_W, GAME_H, TILE } from "../constants";

/** Index des tuiles dans le tileset généré (voir docs/ASSETS.md §Tileset). */
export const T = { TOP: [0, 1, 2], FILL: [3, 4, 5], PL: 6, PM: 7, PR: 8, THORN: 9, PSINGLE: 10, EDGE_L: 11, EDGE_R: 12 };
const TILE_COUNT = 13;

type Ctx = CanvasRenderingContext2D;

/** Répète un dessin pour qu'une couche soit raccordable horizontalement. */
function tileable(W: number, draw: (dx: number) => void) { draw(0); draw(-W); draw(W); }

// ------------------------------------------------------------------ TILESET
export function generateTileset(scene: Phaser.Scene, w: WorldDef) {
  const key = `tiles-${w.id}`;
  const r = rng(w.index * 101);
  const p = w.palette;
  const organic = w.motif === "trees" || w.motif === "nightwood";
  canvasTexture(scene, key, TILE * TILE_COUNT, TILE, (ctx) => {
    const fill = (i: number, withTop: boolean) => {
      const x0 = i * TILE;
      const g = ctx.createLinearGradient(0, 0, 0, TILE);
      g.addColorStop(0, p.groundFill); g.addColorStop(1, shade(p.groundFill, -0.35));
      ctx.fillStyle = g; ctx.fillRect(x0, 0, TILE, TILE);
      // pierres / briques
      if (organic) {
        for (let k = 0; k < 4; k++) {
          ctx.fillStyle = `rgba(255,255,255,${0.03 + r() * 0.04})`;
          ctx.beginPath(); ctx.ellipse(x0 + 6 + r() * 36, 14 + r() * 30, 4 + r() * 6, 3 + r() * 3, r(), 0, 7); ctx.fill();
        }
        ctx.fillStyle = "rgba(0,0,0,.25)";
        for (let k = 0; k < 6; k++) ctx.fillRect(x0 + r() * 46, 10 + r() * 36, 2, 2);
      } else {
        ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 2;
        ctx.strokeRect(x0 + 1, 1, TILE - 2, TILE / 2 - 1);
        ctx.strokeRect(x0 + 1 - TILE / 2, TILE / 2, TILE, TILE / 2 - 1);
        ctx.strokeRect(x0 + 1 + TILE / 2, TILE / 2, TILE, TILE / 2 - 1);
        ctx.fillStyle = "rgba(255,255,255,.05)"; ctx.fillRect(x0 + 3, 3, TILE - 6, 4);
      }
      if (withTop) topEdge(ctx, x0, TILE, 0);
    };
    const topEdge = (c: Ctx, x0: number, width: number, y0: number) => {
      if (organic) {
        const g = c.createLinearGradient(0, y0, 0, y0 + 16);
        g.addColorStop(0, shade(p.groundTop, 0.25)); g.addColorStop(1, shade(p.groundTop, -0.25));
        c.fillStyle = g; c.fillRect(x0, y0, width, 12);
        for (let x = 0; x < width; x += 3) {
          const h = 4 + r() * 9;
          c.fillStyle = r() > 0.5 ? shade(p.groundTop, 0.35) : p.groundTop;
          c.fillRect(x0 + x, y0 + 10, 2, h * 0.6);
          c.fillRect(x0 + x, y0 - h * 0.5 + 2, 2, h * 0.5);
        }
      } else {
        const g = c.createLinearGradient(0, y0, 0, y0 + 12);
        g.addColorStop(0, shade(p.groundTop, 0.35)); g.addColorStop(1, shade(p.groundTop, -0.2));
        c.fillStyle = g; c.fillRect(x0, y0, width, 10);
        c.fillStyle = "rgba(0,0,0,.25)"; c.fillRect(x0, y0 + 10, width, 2);
        drawSuit(c, DIAMOND, x0 + width / 2, y0 + 5, 6, "rgba(255,255,255,.35)");
      }
    };
    // 0-2 surface, 3-5 remplissage
    for (let i = 0; i < 3; i++) fill(i, true);
    for (let i = 3; i < 6; i++) fill(i, false);
    // 6-8 & 10 plateformes traversables (rondin / poutre)
    const plank = (i: number, capL: boolean, capR: boolean) => {
      const x0 = i * TILE;
      const g = ctx.createLinearGradient(0, 4, 0, 26);
      if (organic) { g.addColorStop(0, "#7a5a36"); g.addColorStop(1, "#3a2817"); }
      else { g.addColorStop(0, shade(p.groundTop, 0.1)); g.addColorStop(1, shade(p.groundTop, -0.5)); }
      ctx.fillStyle = g;
      ctx.beginPath();
      const l = capL ? 6 : 0, rr = capR ? 6 : 0;
      ctx.moveTo(x0 + l, 4); ctx.lineTo(x0 + TILE - rr, 4); ctx.quadraticCurveTo(x0 + TILE, 4, x0 + TILE, 10);
      ctx.lineTo(x0 + TILE, 22); ctx.lineTo(x0 + TILE - rr, 26); ctx.lineTo(x0 + l, 26); ctx.lineTo(x0, 22); ctx.lineTo(x0, 10); ctx.quadraticCurveTo(x0, 4, x0 + l, 4);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,.3)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x0, 15); ctx.lineTo(x0 + TILE, 15); ctx.stroke();
      if (organic) {
        ctx.fillStyle = p.groundTop; ctx.fillRect(x0 + (capL ? 4 : 0), 2, TILE - (capL ? 4 : 0) - (capR ? 4 : 0), 5);
        for (let k = 0; k < 3; k++) { ctx.fillStyle = shade(p.groundTop, 0.3); ctx.fillRect(x0 + 4 + r() * 38, 26, 2, 4 + r() * 8); }
      } else {
        ctx.fillStyle = "#C6A05A"; ctx.fillRect(x0, 4, TILE, 2);
      }
    };
    plank(T.PL, true, false); plank(T.PM, false, false); plank(T.PR, false, true); plank(T.PSINGLE, true, true);
    // 9 ronces
    {
      const x0 = T.THORN * TILE;
      ctx.fillStyle = "#2a0f16";
      ctx.fillRect(x0, 34, TILE, 14);
      for (let k = 0; k < 6; k++) {
        const bx = x0 + 4 + k * 8;
        const g = ctx.createLinearGradient(0, 10, 0, 40);
        g.addColorStop(0, "#e9c7cf"); g.addColorStop(1, "#832E3E");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.moveTo(bx - 4, 40); ctx.lineTo(bx, 12 + (k % 2) * 8); ctx.lineTo(bx + 4, 40); ctx.closePath(); ctx.fill();
      }
    }
    // 11-12 bords de falaise (surface avec ombre latérale)
    fill(T.EDGE_L, true); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(T.EDGE_L * TILE, 12, 5, TILE - 12);
    fill(T.EDGE_R, true); ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(T.EDGE_R * TILE + TILE - 5, 12, 5, TILE - 12);
  });
  return key;
}

// ------------------------------------------------------------------ PARALLAXE
/**
 * Génère les couches de décor d'un monde : bg-<id>-sky|far|mid|near (1280×720, raccordables).
 * `scale` < 1 sert aux vignettes du menu.
 */
export function generateBackground(scene: Phaser.Scene, w: WorldDef, scale = 1, suffix = "") {
  const W = Math.round(GAME_W * scale), H = Math.round(GAME_H * scale);
  const p = w.palette;
  const k = (l: string) => `bg-${w.id}-${l}${suffix}`;

  canvasTexture(scene, k("sky"), W, H, (ctx) => {
    ctx.scale(scale, scale);
    const g = ctx.createLinearGradient(0, 0, 0, GAME_H);
    g.addColorStop(0, p.skyTop); g.addColorStop(1, p.skyBottom);
    ctx.fillStyle = g; ctx.fillRect(0, 0, GAME_W, GAME_H);
    glow(ctx, GAME_W * 0.72, GAME_H * 0.28, 420, hexA(p.light, 0.35));
    glow(ctx, GAME_W * 0.72, GAME_H * 0.28, 90, hexA(p.light, 0.7));
    const r = rng(w.index * 7);
    if (w.motif === "nightwood" || w.motif === "trees") for (let i = 0; i < 90; i++) { ctx.fillStyle = `rgba(255,255,255,${r() * 0.5})`; ctx.fillRect(r() * GAME_W, r() * GAME_H * 0.5, 1.5, 1.5); }
  });

  const layer = (name: "far" | "mid" | "near", color: string, depth: number) =>
    canvasTexture(scene, k(name), W, H, (ctx) => {
      ctx.scale(scale, scale);
      const r = rng(w.index * 31 + depth * 13);
      MOTIFS[w.motif](ctx, r, color, depth, w);
      // brume au sol
      const fog = ctx.createLinearGradient(0, GAME_H * 0.55, 0, GAME_H);
      fog.addColorStop(0, "rgba(0,0,0,0)"); fog.addColorStop(1, p.fog);
      ctx.fillStyle = fog; ctx.fillRect(0, 0, GAME_W, GAME_H);
    });
  layer("far", p.far, 0);
  layer("mid", p.mid, 1);
  layer("near", p.near, 2);
}

// ------------------------------------------------------------------ MOTIFS
type MotifFn = (ctx: Ctx, r: () => number, color: string, depth: number, w: WorldDef) => void;

const MOTIFS: Record<WorldDef["motif"], MotifFn> = {
  trees: (ctx, r, color, depth, w) => forest(ctx, r, color, depth, w, false),
  nightwood: (ctx, r, color, depth, w) => forest(ctx, r, color, depth, w, true),
  ruins(ctx, r, color, depth) {
    ctx.fillStyle = color;
    const n = [7, 5, 3][depth];
    for (let i = 0; i < n; i++) {
      const x = (i + r() * 0.5) * (GAME_W / n), h = 260 + r() * 260 + depth * 80, wd = 50 + depth * 30;
      tileable(GAME_W, (dx) => {
        ctx.fillRect(x + dx, GAME_H - h, wd, h);
        ctx.fillRect(x + dx - 14, GAME_H - h, wd + 28, 18);
        // toit de pagode
        if (i % 2 === 0) { ctx.beginPath(); ctx.moveTo(x + dx - 50, GAME_H - h); ctx.quadraticCurveTo(x + dx + wd / 2, GAME_H - h - 90, x + dx + wd + 50, GAME_H - h); ctx.fill(); }
      });
    }
    if (depth === 0) for (let i = 0; i < 5; i++) { const x = r() * GAME_W; ctx.beginPath(); ctx.moveTo(x, GAME_H); ctx.lineTo(x + 120, GAME_H - 420 - r() * 120); ctx.lineTo(x + 260, GAME_H); ctx.fill(); }
  },
  lab(ctx, r, color, depth, w) {
    ctx.fillStyle = color; ctx.strokeStyle = color;
    const n = [4, 3, 2][depth];
    for (let i = 0; i < n; i++) {
      const x = (i + 0.3 + r() * 0.4) * (GAME_W / n), y = 260 + r() * 160, rad = 70 + depth * 40 + r() * 30;
      tileable(GAME_W, (dx) => {
        ctx.globalAlpha = 0.9; ctx.lineWidth = 10 + depth * 4;
        ctx.beginPath(); ctx.moveTo(x + dx, 0); ctx.lineTo(x + dx, y - rad); ctx.stroke();
        ctx.beginPath(); ctx.arc(x + dx, y, rad, 0, 7); ctx.stroke();
        ctx.globalAlpha = 0.35; ctx.fill();
        glow(ctx, x + dx, y, rad, hexA(w.palette.accent, 0.25));
        ctx.globalAlpha = 1;
        ctx.fillRect(x + dx - 20, GAME_H - 200, 40, 200);
      });
    }
  },
  palace(ctx, r, color, depth, w) {
    ctx.fillStyle = color;
    const n = [8, 5, 3][depth];
    for (let i = 0; i < n; i++) {
      const x = (i + 0.2) * (GAME_W / n), wd = 34 + depth * 26;
      tileable(GAME_W, (dx) => {
        ctx.fillRect(x + dx, 80, wd, GAME_H);
        ctx.fillRect(x + dx - 10, 80, wd + 20, 22);
        ctx.fillRect(x + dx - 10, GAME_H - 120, wd + 20, 22);
      });
    }
    if (depth === 0) {
      for (let i = 0; i < 3; i++) {
        const cx = (i + 0.5) * (GAME_W / 3);
        glow(ctx, cx, 260, 170, hexA(w.palette.light, 0.25));
        ctx.strokeStyle = hexA(w.palette.groundTop, 0.5); ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, 260, 110, 0, 7); ctx.stroke();
        for (let k2 = 0; k2 < 12; k2++) { ctx.beginPath(); ctx.moveTo(cx, 260); ctx.lineTo(cx + Math.cos(k2 * 0.52) * 110, 260 + Math.sin(k2 * 0.52) * 110); ctx.stroke(); }
      }
    }
    if (depth === 1) for (let i = 0; i < 4; i++) { const x = r() * GAME_W; ctx.fillStyle = "#5b1d28"; ctx.fillRect(x, 120, 50, 260); drawSuit(ctx, SPADE, x + 25, 230, 26, "#C6A05A"); }
  },
};

function forest(ctx: Ctx, r: () => number, color: string, depth: number, w: WorldDef, night: boolean) {
  const count = [26, 12, 4][depth];
  for (let i = 0; i < count; i++) {
    const x = (i / count) * GAME_W + (r() - 0.5) * (GAME_W / count);
    const trunkW = [14, 34, 90][depth] * (0.7 + r() * 0.6);
    const top = [140, 40, -40][depth] + r() * 120;
    const lean = (r() - 0.5) * [20, 40, 60][depth];
    tileable(GAME_W, (dx) => {
      const X = x + dx;
      ctx.fillStyle = color;
      // tronc avec racines
      ctx.beginPath();
      ctx.moveTo(X - trunkW / 2, GAME_H);
      ctx.bezierCurveTo(X - trunkW / 2 - trunkW * 0.6, GAME_H - 20, X - trunkW / 2, GAME_H - 80, X - trunkW / 2 + lean * 0.5, GAME_H * 0.55);
      ctx.lineTo(X - trunkW / 3 + lean, top);
      ctx.lineTo(X + trunkW / 3 + lean, top);
      ctx.lineTo(X + trunkW / 2 + lean * 0.5, GAME_H * 0.55);
      ctx.bezierCurveTo(X + trunkW / 2, GAME_H - 80, X + trunkW / 2 + trunkW * 0.6, GAME_H - 20, X + trunkW / 2, GAME_H);
      ctx.closePath(); ctx.fill();
      // branches
      for (let b = 0; b < 3; b++) {
        const by = top + 60 + b * 70 + r() * 30, dir = b % 2 ? 1 : -1;
        ctx.lineWidth = trunkW * 0.22; ctx.strokeStyle = color; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(X + lean * 0.8, by); ctx.quadraticCurveTo(X + dir * trunkW * 1.6, by - 40, X + dir * trunkW * 2.6, by - 20 - r() * 40); ctx.stroke();
      }
      // canopée
      const blobs = [6, 8, 10][depth];
      for (let c = 0; c < blobs; c++) {
        const cx = X + lean + (r() - 0.5) * trunkW * 6, cy = top + (r() - 0.6) * 90, cr = [40, 70, 120][depth] * (0.6 + r() * 0.6);
        ctx.fillStyle = color;
        ctx.beginPath(); ctx.ellipse(cx, cy, cr, cr * 0.75, 0, 0, 7); ctx.fill();
      }
      // lianes suspendues
      if (depth > 0) {
        ctx.strokeStyle = shade(color, 0.25); ctx.lineWidth = depth === 2 ? 4 : 2;
        for (let v = 0; v < 4; v++) {
          const vx = X + (r() - 0.5) * trunkW * 5, len = 80 + r() * 220;
          ctx.beginPath(); ctx.moveTo(vx, top); ctx.bezierCurveTo(vx + 10, top + len * 0.3, vx - 10, top + len * 0.6, vx + 4, top + len); ctx.stroke();
          ctx.fillStyle = shade(color, 0.3);
          for (let l = 0; l < len; l += 16) { ctx.beginPath(); ctx.ellipse(vx + Math.sin(l) * 4, top + l, 5, 2.5, 0.6, 0, 7); ctx.fill(); }
        }
      }
      // petites lueurs (champignons de fond)
      if (depth === 1) for (let m = 0; m < 3; m++) glow(ctx, X + (r() - 0.5) * 120, GAME_H - 30 - r() * 40, 18, hexA(w.palette.accent, night ? 0.55 : 0.35));
    });
  }
  // contre-jour : liseré clair sur la couche lointaine
  if (depth === 0) { ctx.globalCompositeOperation = "source-atop"; const g = ctx.createLinearGradient(0, 0, 0, GAME_H); g.addColorStop(0, hexA(w.palette.light, 0.12)); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, GAME_W, GAME_H); ctx.globalCompositeOperation = "source-over"; }
}

// ------------------------------------------------------------------ utilitaires couleur
function shade(hexStr: string, amt: number) {
  const n = parseInt(hexStr.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (c: number) => Math.max(0, Math.min(255, Math.round(amt > 0 ? c + (255 - c) * amt : c * (1 + amt))));
  r = f(r); g = f(g); b = f(b);
  return `rgb(${r},${g},${b})`;
}
function hexA(hexStr: string, a: number) {
  const n = parseInt(hexStr.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
