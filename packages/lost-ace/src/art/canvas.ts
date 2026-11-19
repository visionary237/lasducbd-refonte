import Phaser from "phaser";

/** Crée (ou remplace) une texture canvas et y dessine. */
export function canvasTexture(scene: Phaser.Scene, key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const tex = scene.textures.createCanvas(key, w, h)!;
  const ctx = tex.getContext();
  draw(ctx);
  tex.refresh();
  return tex;
}

/**
 * Crée une spritesheet à partir de frames dessinées une à une.
 * Les frames sont nommées 0..n-1 (compatible avec scene.anims.generateFrameNumbers).
 */
export function sheetTexture(
  scene: Phaser.Scene, key: string, fw: number, fh: number, count: number,
  drawFrame: (ctx: CanvasRenderingContext2D, i: number) => void
) {
  const tex = canvasTexture(scene, key, fw * count, fh, (ctx) => {
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.translate(i * fw, 0);
      ctx.beginPath();
      ctx.rect(0, 0, fw, fh);
      ctx.clip();
      drawFrame(ctx, i);
      ctx.restore();
    }
  });
  for (let i = 0; i < count; i++) tex.add(i, 0, i * fw, 0, fw, fh);
  return tex;
}
