/** Formes vectorielles originales partagées (viewBox 100×110). */
export const SPADE =
  "M50 4 C58 22 96 40 96 66 C96 82 84 92 70 92 C62 92 56 88 53 83 C54 92 58 100 66 106 L34 106 C42 100 46 92 47 83 C44 88 38 92 30 92 C16 92 4 82 4 66 C4 40 42 22 50 4 Z";
export const HEART = "M50 100 C20 76 4 58 4 36 C4 20 16 8 30 8 C40 8 47 14 50 22 C53 14 60 8 70 8 C84 8 96 20 96 36 C96 58 80 76 50 100 Z";
export const DIAMOND = "M50 4 L92 55 L50 106 L8 55 Z";
export const CLUB =
  "M50 6 C64 6 72 18 70 30 C68 38 64 42 62 44 C68 40 74 38 80 38 C92 38 98 50 98 60 C98 74 88 82 76 82 C66 82 58 76 54 70 C55 84 60 96 68 106 L32 106 C40 96 45 84 46 70 C42 76 34 82 24 82 C12 82 2 74 2 60 C2 50 8 38 20 38 C26 38 32 40 38 44 C36 42 32 38 30 30 C28 18 36 6 50 6 Z";

/** Dessine une enseigne centrée en (cx, cy) de largeur w. */
export function drawSuit(ctx: CanvasRenderingContext2D, path: string, cx: number, cy: number, w: number, fill: string | CanvasGradient, rot = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  const s = w / 100;
  ctx.scale(s, s);
  ctx.translate(-50, -55);
  ctx.fillStyle = fill;
  ctx.fill(new Path2D(path));
  ctx.restore();
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = g;
  ctx.fillRect(x - r, y - r, r * 2, r * 2);
  ctx.restore();
}
