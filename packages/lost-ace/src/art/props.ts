import Phaser from "phaser";
import { canvasTexture, sheetTexture } from "./canvas";
import { SPADE, HEART, DIAMOND, CLUB, drawSuit, roundRect, glow } from "./paths";

/** Objets, particules et éléments d'interface (cartes à jouer). */
export function generateProps(scene: Phaser.Scene) {
  // Cristal magique 32×44
  canvasTexture(scene, "crystal", 32, 44, (ctx) => {
    glow(ctx, 16, 22, 18, "rgba(127,224,255,.45)");
    const g = ctx.createLinearGradient(6, 4, 26, 40);
    g.addColorStop(0, "#e9fdff"); g.addColorStop(0.5, "#6fd8ff"); g.addColorStop(1, "#2a6fd6");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(16, 3); ctx.lineTo(27, 18); ctx.lineTo(16, 41); ctx.lineTo(5, 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.65)";
    ctx.beginPath(); ctx.moveTo(16, 3); ctx.lineTo(19, 18); ctx.lineTo(16, 41); ctx.lineTo(11, 18); ctx.closePath(); ctx.fill();
  });

  // Carte ancienne (dos) 44×62 + face révélée
  const cardBack = (ctx: CanvasRenderingContext2D, face: boolean) => {
    glow(ctx, 22, 31, 30, "rgba(255,215,130,.35)");
    ctx.fillStyle = face ? "#F3EBDD" : "#214D36";
    roundRect(ctx, 4, 4, 36, 54, 5); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 2; roundRect(ctx, 6, 6, 32, 50, 4); ctx.stroke();
    ctx.lineWidth = 0.8; roundRect(ctx, 9, 9, 26, 44, 3); ctx.stroke();
    drawSuit(ctx, SPADE, 22, 31, 16, face ? "#101714" : "#C6A05A");
  };
  canvasTexture(scene, "card", 44, 62, (ctx) => cardBack(ctx, false));
  canvasTexture(scene, "card-face", 44, 62, (ctx) => cardBack(ctx, true));

  // Cœur (soin) 36×36
  canvasTexture(scene, "heart", 36, 36, (ctx) => { glow(ctx, 18, 18, 18, "rgba(255,90,120,.4)"); drawSuit(ctx, HEART, 18, 19, 24, "#c2455c"); });

  // Lanterne checkpoint 44×80 : frame 0 éteinte, 1 allumée
  sheetTexture(scene, "lantern", 44, 80, 2, (ctx, i) => {
    if (i) glow(ctx, 22, 22, 26, "rgba(255,210,120,.7)");
    ctx.fillStyle = "#2a2119"; ctx.fillRect(20, 34, 4, 46);
    ctx.fillStyle = "#C6A05A"; roundRect(ctx, 11, 6, 22, 30, 4); ctx.fill();
    ctx.fillStyle = i ? "#ffe9a8" : "#2b3a33"; roundRect(ctx, 14, 10, 16, 22, 3); ctx.fill();
    if (i) drawSuit(ctx, SPADE, 22, 21, 8, "#c47a1e");
    ctx.fillStyle = "#8d6a2f"; ctx.fillRect(9, 4, 26, 4); ctx.fillRect(16, 0, 12, 4);
  });

  // Portail de fin 140×190
  canvasTexture(scene, "portal", 140, 190, (ctx) => {
    glow(ctx, 70, 100, 80, "rgba(160,255,220,.35)");
    ctx.fillStyle = "#2a3a30";
    ctx.beginPath(); ctx.moveTo(10, 190); ctx.lineTo(10, 70); ctx.arc(70, 70, 60, Math.PI, 0); ctx.lineTo(130, 190); ctx.lineTo(108, 190); ctx.lineTo(108, 74); ctx.arc(70, 74, 38, 0, Math.PI, true); ctx.lineTo(32, 190); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(70, 70, 60, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.arc(70, 74, 38, Math.PI, 0); ctx.stroke();
    drawSuit(ctx, SPADE, 70, 22, 18, "#C6A05A");
    const inner = ctx.createRadialGradient(70, 120, 4, 70, 120, 60);
    inner.addColorStop(0, "rgba(230,255,245,.95)"); inner.addColorStop(0.5, "rgba(90,220,180,.6)"); inner.addColorStop(1, "rgba(20,80,60,.2)");
    ctx.fillStyle = inner;
    ctx.beginPath(); ctx.moveTo(32, 190); ctx.lineTo(32, 74); ctx.arc(70, 74, 38, Math.PI, 0); ctx.lineTo(108, 190); ctx.closePath(); ctx.fill();
  });

  // Panneau bois 76×60
  canvasTexture(scene, "sign", 76, 60, (ctx) => {
    ctx.fillStyle = "#3b2a1a"; ctx.fillRect(35, 30, 6, 30);
    ctx.fillStyle = "#6b4a2b"; roundRect(ctx, 4, 4, 68, 32, 4); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 1.5; roundRect(ctx, 7, 7, 62, 26, 3); ctx.stroke();
    drawSuit(ctx, SPADE, 38, 20, 12, "#C6A05A");
  });

  // Plateforme mobile 144×30 (dalle de pierre moussue, liseré or)
  canvasTexture(scene, "mover", 144, 30, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 30);
    g.addColorStop(0, "#6c7a6a"); g.addColorStop(1, "#2c342c");
    ctx.fillStyle = g; roundRect(ctx, 0, 4, 144, 24, 6); ctx.fill();
    ctx.fillStyle = "#3d8a4a"; roundRect(ctx, 0, 0, 144, 9, 4); ctx.fill();
    ctx.fillStyle = "#62b56a"; for (let x = 4; x < 140; x += 9) ctx.fillRect(x, 0, 4, 3);
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(8, 18); ctx.lineTo(136, 18); ctx.stroke();
    [24, 72, 120].forEach((x) => drawSuit(ctx, DIAMOND, x, 18, 7, "#C6A05A"));
  });

  // Projectile du boss : carte tournoyante 30×42
  canvasTexture(scene, "boss-card", 30, 42, (ctx) => {
    ctx.fillStyle = "#F3EBDD"; roundRect(ctx, 2, 2, 26, 38, 4); ctx.fill();
    ctx.strokeStyle = "#832E3E"; ctx.lineWidth = 1.5; roundRect(ctx, 4, 4, 22, 34, 3); ctx.stroke();
    drawSuit(ctx, CLUB, 15, 21, 12, "#832E3E");
  });

  // Champignons lumineux (décor) 3 variantes
  sheetTexture(scene, "mushroom", 48, 48, 3, (ctx, i) => {
    const n = [1, 2, 3][i];
    for (let k = 0; k < n; k++) {
      const x = 14 + k * 12, h = 26 - k * 6, r = 11 - k * 2.5;
      glow(ctx, x, 46 - h, r * 2.2, "rgba(120,230,255,.45)");
      ctx.fillStyle = "#cfe9e4"; ctx.fillRect(x - 2, 46 - h, 4, h);
      const g = ctx.createLinearGradient(0, 46 - h - r, 0, 46 - h);
      g.addColorStop(0, "#b8f6ff"); g.addColorStop(1, "#2f9fd0");
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.ellipse(x, 46 - h, r, r * 0.7, 0, Math.PI, 0); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.8)";
      ctx.beginPath(); ctx.arc(x - r * 0.4, 46 - h - r * 0.35, 1.6, 0, 7); ctx.arc(x + r * 0.3, 46 - h - r * 0.5, 1.2, 0, 7); ctx.fill();
    }
  });

  // Fougères de premier plan 160×120
  canvasTexture(scene, "fern", 160, 120, (ctx) => {
    ctx.fillStyle = "#06140f";
    for (let f = 0; f < 5; f++) {
      const bx = 20 + f * 30, ang = -1.2 + f * 0.6;
      ctx.save(); ctx.translate(bx, 120); ctx.rotate(ang * 0.5);
      for (let l = 0; l < 10; l++) {
        const y = -l * 10, w = 22 - l * 1.8;
        ctx.beginPath(); ctx.ellipse(-w / 2, y, w / 2, 3, -0.4, 0, 7); ctx.ellipse(w / 2, y, w / 2, 3, 0.4, 0, 7); ctx.fill();
      }
      ctx.fillRect(-1, -100, 2, 100);
      ctx.restore();
    }
  });

  // Textures de particules et de lumière
  canvasTexture(scene, "dot", 16, 16, (ctx) => glow(ctx, 8, 8, 8, "rgba(255,255,255,1)"));
  canvasTexture(scene, "light", 256, 256, (ctx) => {
    const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.5, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  });
  canvasTexture(scene, "spark", 12, 12, (ctx) => {
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(6, 0); ctx.lineTo(7.5, 4.5); ctx.lineTo(12, 6); ctx.lineTo(7.5, 7.5); ctx.lineTo(6, 12); ctx.lineTo(4.5, 7.5); ctx.lineTo(0, 6); ctx.lineTo(4.5, 4.5); ctx.closePath(); ctx.fill();
  });
  canvasTexture(scene, "leaf", 14, 8, (ctx) => { ctx.fillStyle = "#7fd08a"; ctx.beginPath(); ctx.ellipse(7, 4, 6.5, 3, 0.3, 0, 7); ctx.fill(); });
  canvasTexture(scene, "ray", 220, 720, (ctx) => {
    const g = ctx.createLinearGradient(0, 0, 0, 720);
    g.addColorStop(0, "rgba(255,240,200,.35)"); g.addColorStop(1, "rgba(255,240,200,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(80, 0); ctx.lineTo(140, 0); ctx.lineTo(220, 720); ctx.lineTo(0, 720); ctx.closePath(); ctx.fill();
  });
  canvasTexture(scene, "vignette", 640, 360, (ctx) => {
    const g = ctx.createRadialGradient(320, 180, 120, 320, 180, 380);
    g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.75)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 640, 360);
  });

  // ---------- UI façon cartes à jouer
  canvasTexture(scene, "ui-panel", 320, 110, (ctx) => {
    ctx.fillStyle = "rgba(16,23,20,.82)"; roundRect(ctx, 2, 2, 316, 106, 16); ctx.fill();
    ctx.strokeStyle = "rgba(198,160,90,.8)"; ctx.lineWidth = 2; roundRect(ctx, 3, 3, 314, 104, 15); ctx.stroke();
    ctx.strokeStyle = "rgba(198,160,90,.35)"; ctx.lineWidth = 1; roundRect(ctx, 9, 9, 302, 92, 11); ctx.stroke();
  });
  canvasTexture(scene, "ui-card-slot", 30, 42, (ctx) => {
    ctx.strokeStyle = "rgba(198,160,90,.6)"; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5; roundRect(ctx, 2, 2, 26, 38, 4); ctx.stroke();
  });
  canvasTexture(scene, "ui-hp", 26, 28, (ctx) => drawSuit(ctx, SPADE, 13, 14, 22, "#C6A05A"));
  canvasTexture(scene, "ui-hp-empty", 26, 28, (ctx) => drawSuit(ctx, SPADE, 13, 14, 22, "rgba(198,160,90,.22)"));
  canvasTexture(scene, "ui-touch", 120, 120, (ctx) => {
    ctx.fillStyle = "rgba(16,23,20,.45)"; ctx.beginPath(); ctx.arc(60, 60, 56, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(198,160,90,.7)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(60, 60, 54, 0, 7); ctx.stroke();
  });
  // Grande carte de menu 260×364
  canvasTexture(scene, "menu-card", 260, 364, (ctx) => {
    ctx.fillStyle = "#214D36"; roundRect(ctx, 0, 0, 260, 364, 20); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 3; roundRect(ctx, 8, 8, 244, 348, 15); ctx.stroke();
    ctx.lineWidth = 1; roundRect(ctx, 16, 16, 228, 332, 11); ctx.stroke();
    ctx.globalAlpha = 0.12; ctx.strokeStyle = "#C6A05A";
    for (let k = 0; k < 16; k++) { ctx.save(); ctx.translate(130, 182); ctx.rotate((k * Math.PI) / 8); ctx.beginPath(); ctx.ellipse(0, -60, 18, 60, 0, 0, 7); ctx.stroke(); ctx.restore(); }
  });
  canvasTexture(scene, "menu-card-locked", 260, 364, (ctx) => {
    ctx.fillStyle = "#151c19"; roundRect(ctx, 0, 0, 260, 364, 20); ctx.fill();
    ctx.strokeStyle = "rgba(198,160,90,.35)"; ctx.lineWidth = 2; roundRect(ctx, 8, 8, 244, 348, 15); ctx.stroke();
    for (let y = 30; y < 340; y += 22) for (let x = 30; x < 240; x += 22) drawSuit(ctx, SPADE, x + ((y / 22) % 2) * 11, y, 7, "rgba(198,160,90,.08)");
  });
}
