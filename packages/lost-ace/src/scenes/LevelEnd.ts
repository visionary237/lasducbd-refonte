import Phaser from "phaser";
import { GAME_W, GAME_H } from "../constants";
import { txt, cardButton, keyboardMenu } from "./ui";
import { Storage } from "../systems/Storage";
import { Audio } from "../systems/Audio";
import type { RunState } from "./Game";

interface Data { win: boolean; levelKey: string; world: string; time: number; bonus: number; run: RunState }
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ♠";

/** Bilan de niveau + saisie de nom pour le classement local (3 caractères, façon arcade). */
export class LevelEnd extends Phaser.Scene {
  constructor() { super("LevelEnd"); }
  create(d: Data) {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x0b1210).setOrigin(0);
    this.add.image(GAME_W / 2, GAME_H / 2, "vignette").setDisplaySize(GAME_W, GAME_H);
    this.add.particles(0, 0, "spark", { x: { min: 0, max: GAME_W }, y: -10, speedY: { min: 40, max: 120 }, lifespan: 6000, frequency: d.win ? 80 : 400, tint: [0xc6a05a, 0xf3ebdd], alpha: { start: 0.8, end: 0 }, rotate: { start: 0, end: 360 }, blendMode: "ADD" });
    txt(this, GAME_W / 2, 90, d.win ? "Niveau terminé" : "Partie terminée", 64, d.win ? "#C6A05A" : "#F3EBDD", true);
    txt(this, GAME_W / 2, 146, d.world, 18, "rgba(243,235,221,.7)");

    const r = d.run;
    const rows: [string, string][] = [
      ["Cristaux", `${r.crystals} / ${r.crystalsTotal}`],
      ["Cartes anciennes", `${r.cards.filter(Boolean).length} / 3`],
      ["Temps", `${d.time.toFixed(1)} s`],
      ["Chutes", `${r.deaths}`],
      ["Bonus (temps + vies)", `+${d.bonus}`],
    ];
    rows.forEach(([a, b], i) => {
      const y = 200 + i * 36;
      this.add.text(430, y, a, { fontFamily: "Manrope", fontSize: "20px", color: "rgba(243,235,221,.75)" });
      this.add.text(850, y, b, { fontFamily: "Manrope", fontSize: "20px", color: "#F3EBDD", fontStyle: "bold" }).setOrigin(1, 0);
    });
    txt(this, GAME_W / 2, 410, `${r.score}`, 72, "#F3EBDD", true);
    txt(this, GAME_W / 2, 455, "SCORE", 12, "#C6A05A").setLetterSpacing(6);

    const buttons = () => {
      const list = [cardButton(this, GAME_W / 2 - 160, 630, "Rejouer", () => this.scene.start("Game", { levelKey: d.levelKey }), 260)];
      if (d.win && d.levelKey === "level1") list.push(cardButton(this, GAME_W / 2 + 160, 630, "Affronter le boss", () => this.scene.start("Game", { levelKey: "boss" }), 260));
      else list.push(cardButton(this, GAME_W / 2 + 160, 630, "Menu", () => this.scene.start("Menu", { view: "scores" }), 260));
      keyboardMenu(this, list);
    };

    if (Storage.qualifies(r.score)) this.nameEntry(d, buttons);
    else buttons();
  }

  private nameEntry(d: Data, done: () => void) {
    txt(this, GAME_W / 2, 500, "Nouveau record local — inscrivez vos initiales", 16, "#C6A05A");
    const letters = [0, 2, 4]; // A C E
    let cur = 0;
    const boxes = letters.map((_, i) => {
      const x = GAME_W / 2 - 70 + i * 70;
      const g = this.add.graphics();
      const t = txt(this, x, 556, "", 40, "#F3EBDD", true);
      const z = this.add.zone(x, 556, 56, 64).setInteractive({ useHandCursor: true });
      z.on("pointerup", () => { cur = i; letters[i] = (letters[i] + 1) % ALPHA.length; draw(); Audio.play("ui"); });
      return { g, t, x };
    });
    const draw = () => boxes.forEach((b, i) => {
      b.t.setText(ALPHA[letters[i]]);
      b.g.clear().lineStyle(2, 0xc6a05a, i === cur ? 1 : 0.35).strokeRoundedRect(b.x - 28, 524, 56, 64, 10);
    });
    draw();
    const kb = this.input.keyboard!;
    const ok = () => {
      kb.removeAllListeners();
      okBtn.destroy();
      const name = letters.map((l) => ALPHA[l]).join("");
      Storage.submit({ name, score: d.run.score, level: d.levelKey, time: d.time, cards: d.run.cards.filter(Boolean).length, date: new Date().toISOString() });
      Audio.play("checkpoint");
      boxes.forEach((b) => b.g.clear());
      done();
    };
    kb.on("keydown-UP", () => { letters[cur] = (letters[cur] + 1) % ALPHA.length; draw(); });
    kb.on("keydown-DOWN", () => { letters[cur] = (letters[cur] - 1 + ALPHA.length) % ALPHA.length; draw(); });
    kb.on("keydown-LEFT", () => { cur = (cur + 2) % 3; draw(); });
    kb.on("keydown-RIGHT", () => { cur = (cur + 1) % 3; draw(); });
    kb.on("keydown", (e: KeyboardEvent) => { const k = e.key.toUpperCase(); if (k.length === 1 && k >= "A" && k <= "Z") { letters[cur] = ALPHA.indexOf(k); cur = Math.min(2, cur + 1); draw(); } });
    kb.on("keydown-ENTER", ok);
    const okBtn = cardButton(this, GAME_W / 2 + 190, 556, "Valider", ok, 140);
  }
}
