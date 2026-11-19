import Phaser from "phaser";
import { sheetTexture } from "./canvas";
import { SPADE, HEART, drawSuit, roundRect, glow } from "./paths";

/**
 * Personnages générés procéduralement (placeholders haute fidélité).
 * Chaque texture respecte la spec de docs/ASSETS.md (taille de frame, ancrage, ordre des frames)
 * afin d'être remplacée 1:1 par les spritesheets illustrées.
 */

// ---------------------------------------------------------------- Le Gentleman de Pique (joueur)
export const PLAYER_FW = 72;
export const PLAYER_FH = 88;
/** Ordre des frames : 0-1 idle · 2-7 run · 8 jump · 9 fall · 10 hurt · 11 double-saut (vrille) */
export const PLAYER_FRAMES = { idle: [0, 1], run: [2, 3, 4, 5, 6, 7], jump: 8, fall: 9, hurt: 10, spin: 11 };

const INK = "#0b0e0d";
const INK2 = "#1a201d";

interface Pose { bob: number; legA: number; legB: number; arm: number; tail: number; lean: number; tuck: number; eyes: "open" | "hurt" | "happy" }

function drawGentleman(ctx: CanvasRenderingContext2D, p: Pose) {
  const cx = 36, foot = 84;
  ctx.save();
  ctx.translate(cx, foot);
  ctx.rotate(p.lean);
  ctx.translate(0, -foot + p.bob);

  const hip = 54;
  // --- jambes
  const leg = (ang: number, front: boolean) => {
    ctx.save();
    ctx.translate(front ? 3 : -3, hip);
    ctx.rotate(ang);
    const len = 26 - p.tuck * 8;
    ctx.fillStyle = front ? INK : "#060807";
    roundRect(ctx, -5, 0, 10, len, 4); ctx.fill();
    // chaussure vernie
    ctx.fillStyle = "#050606";
    roundRect(ctx, -6, len - 3, 16, 7, 3); ctx.fill();
    ctx.fillStyle = "rgba(198,160,90,.55)";
    ctx.fillRect(2, len - 2, 6, 1.5);
    ctx.restore();
  };
  leg(p.legB, false);

  // --- queue-de-pie (derrière)
  ctx.save();
  ctx.translate(-6, 44);
  ctx.rotate(-0.15 - p.tail);
  ctx.fillStyle = INK2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-6, 26); ctx.lineTo(2, 22); ctx.lineTo(6, 4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#214D36";
  ctx.beginPath(); ctx.moveTo(1, 2); ctx.lineTo(-4, 22); ctx.lineTo(0, 20); ctx.closePath(); ctx.fill();
  ctx.restore();

  leg(p.legA, true);

  // --- torse (habit)
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.moveTo(-11, 30); ctx.lineTo(11, 30); ctx.lineTo(10, 56); ctx.lineTo(-10, 56); ctx.closePath(); ctx.fill();
  // gilet émeraude à motif or
  const vest = ctx.createLinearGradient(-6, 30, 6, 52);
  vest.addColorStop(0, "#2c6447"); vest.addColorStop(1, "#163826");
  ctx.fillStyle = vest;
  ctx.beginPath(); ctx.moveTo(-6, 31); ctx.lineTo(7, 31); ctx.lineTo(6, 52); ctx.lineTo(0, 55); ctx.lineTo(-5, 52); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "rgba(198,160,90,.7)";
  for (let y = 36; y < 51; y += 5) for (let x = -3; x < 6; x += 4) ctx.fillRect(x, y, 1.4, 1.4);
  // plastron + nœud
  ctx.fillStyle = "#F3EBDD";
  ctx.beginPath(); ctx.moveTo(-3, 30); ctx.lineTo(4, 30); ctx.lineTo(0.5, 38); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#832E3E";
  ctx.beginPath(); ctx.moveTo(-3, 31); ctx.lineTo(0.5, 33); ctx.lineTo(4, 31); ctx.lineTo(4, 35); ctx.lineTo(0.5, 33); ctx.lineTo(-3, 35); ctx.closePath(); ctx.fill();
  // boutons
  ctx.fillStyle = "#C6A05A";
  [40, 45, 50].forEach((y) => { ctx.beginPath(); ctx.arc(8, y, 1.3, 0, 7); ctx.fill(); });
  // revers doré
  ctx.strokeStyle = "rgba(198,160,90,.6)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-10, 31); ctx.lineTo(-6, 44); ctx.stroke();

  // --- bras + gant
  ctx.save();
  ctx.translate(1, 33);
  ctx.rotate(p.arm);
  ctx.fillStyle = "#151a18";
  roundRect(ctx, -3.5, 0, 7, 18, 3.5); ctx.fill();
  ctx.fillStyle = "#F3EBDD";
  ctx.beginPath(); ctx.arc(0, 20, 4, 0, 7); ctx.fill();
  ctx.fillStyle = "#C6A05A"; ctx.fillRect(-3.5, 15, 7, 1.5);
  ctx.restore();

  // --- tête en pique (pointe vers le haut, couverte par le chapeau)
  const headGrad = ctx.createLinearGradient(-16, 6, 16, 32);
  headGrad.addColorStop(0, "#1f2623"); headGrad.addColorStop(1, "#050706");
  ctx.save();
  ctx.translate(1, 19);
  ctx.scale(0.36, 0.3);
  ctx.translate(-50, -55);
  ctx.fillStyle = headGrad;
  ctx.fill(new Path2D(SPADE));
  ctx.restore();
  // yeux dorés lumineux
  const eye = (x: number) => {
    glow(ctx, x, 21, 7, "rgba(255,210,110,.55)");
    ctx.fillStyle = "#FFD27A";
    if (p.eyes === "hurt") {
      ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x - 3, 19); ctx.lineTo(x + 3, 23); ctx.moveTo(x + 3, 19); ctx.lineTo(x - 3, 23); ctx.stroke();
    } else if (p.eyes === "happy") {
      ctx.strokeStyle = "#FFD27A"; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(x, 23, 3, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.ellipse(x, 21, 3.6, 1.9, 0.15, 0, 7); ctx.fill();
    }
  };
  eye(-2); eye(8);
  // sourire malicieux
  ctx.strokeStyle = "rgba(243,235,221,.35)"; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(4, 25, 4, 0.2, Math.PI - 0.6); ctx.stroke();

  // --- haut-de-forme
  ctx.fillStyle = INK;
  roundRect(ctx, -11, 9, 25, 3.5, 1.7); ctx.fill(); // bord
  roundRect(ctx, -7, -9, 17, 19, 2); ctx.fill(); // cylindre
  ctx.fillStyle = "#214D36"; ctx.fillRect(-7, 5, 17, 3.5); // ruban
  drawSuit(ctx, SPADE, 1.5, 6.8, 5, "#C6A05A"); // emblème (pique, aucun logo produit)
  ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fillRect(-5, -8, 3, 13); // reflet

  ctx.restore();
}

export function generatePlayer(scene: Phaser.Scene) {
  const poses: Pose[] = [];
  const base: Pose = { bob: 0, legA: 0, legB: 0, arm: 0.1, tail: 0, lean: 0, tuck: 0, eyes: "open" };
  poses.push({ ...base }, { ...base, bob: 1.2, arm: 0.16, tail: 0.04 });
  for (let i = 0; i < 6; i++) {
    const t = (i / 6) * Math.PI * 2;
    poses.push({ ...base, bob: -Math.abs(Math.sin(t)) * 2.4, legA: Math.sin(t) * 0.75, legB: -Math.sin(t) * 0.75, arm: -Math.sin(t) * 0.9, tail: 0.35 + Math.sin(t * 2) * 0.1, lean: 0.08 });
  }
  poses.push({ ...base, legA: -0.6, legB: 0.5, tuck: 0.6, arm: -2.4, tail: 0.5, bob: -2 }); // jump
  poses.push({ ...base, legA: 0.25, legB: -0.2, arm: -1.2, tail: -0.25, bob: 0 }); // fall
  poses.push({ ...base, legA: 0.5, legB: -0.4, arm: -2.6, tail: 0.6, lean: -0.25, eyes: "hurt" }); // hurt
  poses.push({ ...base, legA: -0.9, legB: 0.9, tuck: 1, arm: -2.9, tail: 0.8, bob: -6, eyes: "happy" }); // spin
  sheetTexture(scene, "player", PLAYER_FW, PLAYER_FH, poses.length, (ctx, i) => drawGentleman(ctx, poses[i]));

  const a = scene.anims;
  a.create({ key: "p-idle", frames: a.generateFrameNumbers("player", { frames: PLAYER_FRAMES.idle }), frameRate: 2.5, repeat: -1 });
  a.create({ key: "p-run", frames: a.generateFrameNumbers("player", { frames: PLAYER_FRAMES.run }), frameRate: 14, repeat: -1 });
  a.create({ key: "p-jump", frames: [{ key: "player", frame: PLAYER_FRAMES.jump }] });
  a.create({ key: "p-fall", frames: [{ key: "player", frame: PLAYER_FRAMES.fall }] });
  a.create({ key: "p-hurt", frames: [{ key: "player", frame: PLAYER_FRAMES.hurt }] });
  a.create({ key: "p-spin", frames: [{ key: "player", frame: PLAYER_FRAMES.spin }] });
}

// ---------------------------------------------------------------- Ennemis fictifs
/** Scarabée d'émeraude — 64×44, 4 frames de marche. */
export function generateBeetle(scene: Phaser.Scene) {
  sheetTexture(scene, "beetle", 64, 44, 5, (ctx, i) => {
    const dead = i === 4;
    const t = (i / 4) * Math.PI * 2;
    ctx.save();
    if (dead) { ctx.translate(0, 10); ctx.scale(1, 0.6); }
    // pattes
    ctx.strokeStyle = "#0c120f"; ctx.lineWidth = 3; ctx.lineCap = "round";
    for (let k = 0; k < 3; k++) {
      const x = 18 + k * 13, sw = Math.sin(t + k * 2) * 4;
      ctx.beginPath(); ctx.moveTo(x, 30); ctx.lineTo(x + sw - 4, 41); ctx.stroke();
    }
    // carapace
    const g = ctx.createLinearGradient(0, 8, 0, 34);
    g.addColorStop(0, "#5fd08a"); g.addColorStop(0.45, "#1f7a4b"); g.addColorStop(1, "#0d3321");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(30, 26, 24, 16, 0, Math.PI, 0); ctx.lineTo(54, 32); ctx.lineTo(6, 32); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(30, 26, 24, 16, 0, Math.PI, 0); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(30, 11); ctx.lineTo(30, 32); ctx.stroke();
    // reflet
    ctx.fillStyle = "rgba(255,255,255,.25)";
    ctx.beginPath(); ctx.ellipse(22, 17, 7, 3, -0.4, 0, 7); ctx.fill();
    // tête
    ctx.fillStyle = "#0c120f";
    ctx.beginPath(); ctx.arc(55, 27, 8, 0, 7); ctx.fill();
    ctx.fillStyle = dead ? "#555" : "#ff6b5a";
    ctx.beginPath(); ctx.arc(58, 25, 2.2, 0, 7); ctx.fill();
    // antenne
    ctx.strokeStyle = "#0c120f"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(57, 20); ctx.quadraticCurveTo(62, 10 + Math.sin(t) * 2, 60, 6); ctx.stroke();
    ctx.restore();
  });
  scene.anims.create({ key: "beetle-walk", frames: scene.anims.generateFrameNumbers("beetle", { start: 0, end: 3 }), frameRate: 10, repeat: -1 });
}

/** Feu follet — 56×56, 4 frames (scintillement). */
export function generateWisp(scene: Phaser.Scene) {
  sheetTexture(scene, "wisp", 56, 56, 4, (ctx, i) => {
    const f = Math.sin((i / 4) * Math.PI * 2);
    glow(ctx, 28, 30, 26, "rgba(120,200,255,.55)");
    const g = ctx.createRadialGradient(28, 32, 2, 28, 30, 16);
    g.addColorStop(0, "#ffffff"); g.addColorStop(0.4, "#9be8ff"); g.addColorStop(1, "rgba(80,120,255,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(28, 6 + f * 3);
    ctx.bezierCurveTo(40, 18, 44, 30, 40, 38); ctx.bezierCurveTo(36, 46, 20, 46, 16, 38);
    ctx.bezierCurveTo(12, 30, 18, 18, 28, 6 + f * 3); ctx.fill();
    ctx.fillStyle = "#0b1a2e";
    ctx.beginPath(); ctx.ellipse(23, 32, 2.4, 3.4, 0, 0, 7); ctx.ellipse(33, 32, 2.4, 3.4, 0, 0, 7); ctx.fill();
  });
  scene.anims.create({ key: "wisp-float", frames: scene.anims.generateFrameNumbers("wisp", { start: 0, end: 3 }), frameRate: 8, repeat: -1 });
}

/** Le Roi Sans Visage (boss) — 180×200, frames : 0 idle · 1 élan · 2 sonné · 3 vaincu. */
export function generateBoss(scene: Phaser.Scene) {
  sheetTexture(scene, "boss", 180, 200, 4, (ctx, i) => {
    const stunned = i === 2, defeated = i === 3, windup = i === 1;
    ctx.save();
    if (windup) { ctx.translate(90, 200); ctx.scale(1.06, 0.92); ctx.translate(-90, -200); }
    if (defeated) { ctx.translate(90, 200); ctx.rotate(0.25); ctx.translate(-90, -200); ctx.globalAlpha = 0.85; }
    // cape
    const cape = ctx.createLinearGradient(0, 60, 0, 200);
    cape.addColorStop(0, "#a83a4f"); cape.addColorStop(1, "#4d1622");
    ctx.fillStyle = cape;
    ctx.beginPath(); ctx.moveTo(40, 70); ctx.lineTo(140, 70); ctx.lineTo(170, 196); ctx.lineTo(10, 196); ctx.closePath(); ctx.fill();
    // corps-carte
    ctx.fillStyle = "#F3EBDD";
    roundRect(ctx, 46, 66, 88, 122, 10); ctx.fill();
    ctx.strokeStyle = "#C6A05A"; ctx.lineWidth = 3; roundRect(ctx, 52, 72, 76, 110, 7); ctx.stroke();
    ctx.lineWidth = 1; roundRect(ctx, 57, 77, 66, 100, 5); ctx.stroke();
    drawSuit(ctx, HEART, 90, 127, 38, "#832E3E");
    drawSuit(ctx, HEART, 66, 90, 10, "#832E3E"); drawSuit(ctx, HEART, 114, 166, 10, "#832E3E");
    // tête sans visage
    const head = ctx.createRadialGradient(90, 48, 4, 90, 48, 34);
    head.addColorStop(0, "#2a2a2a"); head.addColorStop(1, "#050505");
    ctx.fillStyle = head;
    ctx.beginPath(); ctx.ellipse(90, 50, 26, 30, 0, 0, 7); ctx.fill();
    // yeux
    if (stunned || defeated) {
      ctx.strokeStyle = "#ffd27a"; ctx.lineWidth = 3;
      [78, 102].forEach((x) => { ctx.beginPath(); ctx.moveTo(x - 5, 45); ctx.lineTo(x + 5, 55); ctx.moveTo(x + 5, 45); ctx.lineTo(x - 5, 55); ctx.stroke(); });
    } else {
      [78, 102].forEach((x) => { glow(ctx, x, 50, 12, "rgba(255,80,80,.7)"); ctx.fillStyle = windup ? "#fff" : "#ff5a5a"; ctx.beginPath(); ctx.ellipse(x, 50, 6, 3, 0, 0, 7); ctx.fill(); });
    }
    // couronne
    ctx.save();
    if (stunned) { ctx.translate(90, 24); ctx.rotate(-0.35); ctx.translate(-90, -24); }
    const cr = ctx.createLinearGradient(60, 0, 120, 30);
    cr.addColorStop(0, "#f4dc9c"); cr.addColorStop(0.5, "#C6A05A"); cr.addColorStop(1, "#8d6a2f");
    ctx.fillStyle = cr;
    ctx.beginPath(); ctx.moveTo(62, 30); ctx.lineTo(62, 8); ctx.lineTo(74, 20); ctx.lineTo(90, 2); ctx.lineTo(106, 20); ctx.lineTo(118, 8); ctx.lineTo(118, 30); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#832E3E"; ctx.beginPath(); ctx.arc(90, 22, 4, 0, 7); ctx.fill();
    if (stunned) glow(ctx, 90, 18, 34, "rgba(255,230,150,.6)");
    ctx.restore();
    // bras-épées
    ctx.fillStyle = "#0b0e0d";
    roundRect(ctx, 28, 92, 18, 46, 8); ctx.fill(); roundRect(ctx, 134, 92, 18, 46, 8); ctx.fill();
    ctx.fillStyle = "#C6A05A"; ctx.fillRect(30, 136, 14, 5); ctx.fillRect(136, 136, 14, 5);
    ctx.restore();
  });
}
