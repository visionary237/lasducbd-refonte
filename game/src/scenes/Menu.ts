import Phaser from "phaser";
import { GAME_W, GAME_H } from "../constants";
import { WORLDS, worldById } from "../config/worlds";
import { generateBackground } from "../art/world";
import { Storage } from "../systems/Storage";
import { Audio } from "../systems/Audio";
import { txt, cardButton, keyboardMenu } from "./ui";

type View = "home" | "worlds" | "scores" | "controls";

export class Menu extends Phaser.Scene {
  private view!: Phaser.GameObjects.Container;
  constructor() { super("Menu"); }

  create(data: { view?: View }) {
    const w = worldById("emerald-forest");
    if (!this.textures.exists(`bg-${w.id}-sky`)) generateBackground(this, w);
    this.add.image(0, 0, `bg-${w.id}-sky`).setOrigin(0);
    const far = this.add.tileSprite(0, 0, GAME_W, GAME_H, `bg-${w.id}-far`).setOrigin(0);
    const mid = this.add.tileSprite(0, 0, GAME_W, GAME_H, `bg-${w.id}-mid`).setOrigin(0);
    this.events.on("update", (_t: number, d: number) => { far.tilePositionX += d * 0.006; mid.tilePositionX += d * 0.02; });
    this.add.particles(0, 0, "dot", {
      x: { min: 0, max: GAME_W }, y: { min: 200, max: GAME_H }, lifespan: 5000, speedY: { min: -14, max: -4 }, speedX: { min: -8, max: 8 },
      scale: { start: 0.5, end: 0 }, alpha: { start: 0.9, end: 0 }, tint: 0xffe7a3, frequency: 140, blendMode: "ADD",
    });
    this.add.image(GAME_W / 2, GAME_H / 2, "vignette").setDisplaySize(GAME_W, GAME_H).setAlpha(0.9);
    this.show(data?.view ?? "home");
  }

  private show(v: View) {
    this.view?.destroy();
    this.input.keyboard!.removeAllListeners();
    this.view = this.add.container(0, 0);
    ({ home: () => this.home(), worlds: () => this.worlds(), scores: () => this.scores(), controls: () => this.controls() })[v]();
    this.input.keyboard!.on("keydown-ESC", () => v !== "home" && this.show("home"));
    this.input.keyboard!.on("keydown-M", () => Audio.toggle());
  }

  private home() {
    const v = this.view;
    const hero = this.add.sprite(330, 560, "player").setOrigin(0.5, 1).setScale(3.2).play("p-idle");
    const halo = this.add.image(330, 380, "light").setTint(0xffe7a3).setAlpha(0.28).setScale(2.2).setBlendMode("ADD");
    this.tweens.add({ targets: hero, y: 548, yoyo: true, repeat: -1, duration: 1600, ease: "Sine.inOut" });
    v.add([halo, hero]);
    v.add(txt(this, 820, 150, "UN JEU DOERZ", 15, "#C6A05A").setLetterSpacing(8));
    const title = txt(this, 820, 225, "THE LOST ACE", 92, "#F3EBDD", true).setShadow(0, 6, "#000", 18, false, true);
    v.add(title);
    v.add(txt(this, 820, 292, "Retrouvez les cartes anciennes et les cristaux perdus", 18, "rgba(243,235,221,.8)"));
    const b = [
      cardButton(this, 820, 380, "Jouer", () => this.show("worlds")),
      cardButton(this, 820, 448, "Classement local", () => this.show("scores")),
      cardButton(this, 820, 516, "Commandes", () => this.show("controls")),
      cardButton(this, 820, 584, `Son : ${Audio.enabled ? "activé" : "coupé"}`, () => { Audio.toggle(); this.show("home"); }),
    ];
    v.add(b);
    keyboardMenu(this, b);
    v.add(txt(this, GAME_W / 2, 690, "Projet portfolio indépendant · personnages et univers fictifs · aucune publicité ni collecte de données", 13, "rgba(243,235,221,.55)"));
  }

  private worlds() {
    const v = this.view;
    v.add(txt(this, GAME_W / 2, 70, "Choisissez un monde", 48, "#F3EBDD", true));
    const cards: Phaser.GameObjects.Container[] = [];
    WORLDS.forEach((w, i) => {
      const x = 160 + i * 240, y = 370;
      const playable = !!w.levelKey && Storage.isUnlocked(w.id);
      const c = this.add.container(x, y);
      const bg = this.add.image(0, 0, playable ? "menu-card" : "menu-card-locked").setScale(0.82);
      const thumb = this.add.image(0, -40, `bg-${w.id}-sky-thumb`).setDisplaySize(176, 140);
      const thumbFar = this.add.image(0, -40, `bg-${w.id}-mid-thumb`).setDisplaySize(176, 140);
      if (!playable) { thumb.setTint(0x555555); thumbFar.setTint(0x444444); }
      c.add([bg, thumb, thumbFar]);
      c.add(txt(this, 0, -136, `${["I", "II", "III", "IV", "V"][i]}`, 22, "#C6A05A", true));
      c.add(txt(this, 0, 52, w.name, 24, "#F3EBDD", true));
      c.add(txt(this, 0, 80, w.subtitle, 13, "rgba(243,235,221,.7)"));
      const status = w.levelKey === "boss" ? "Arène du boss · prototype" : playable ? "Jouable" : "En production";
      c.add(txt(this, 0, 118, status, 12, playable ? "#C6A05A" : "rgba(243,235,221,.45)").setLetterSpacing(2));
      const best = w.levelKey ? Storage.best(w.levelKey) : 0;
      if (best) c.add(txt(this, 0, 138, `Record ${best}`, 12, "rgba(243,235,221,.7)"));
      v.add(c);
      if (playable) {
        c.setSize(212, 298).setInteractive({ useHandCursor: true });
        const go = () => { Audio.play("ui"); this.cameras.main.fadeOut(400, 0, 0, 0); this.time.delayedCall(420, () => this.scene.start("Game", { levelKey: w.levelKey })); };
        c.on("pointerover", () => this.tweens.add({ targets: c, y: y - 14, angle: -1.5, duration: 200 }));
        c.on("pointerout", () => this.tweens.add({ targets: c, y, angle: 0, duration: 200 }));
        c.on("pointerup", go);
        (c as any).setFocus = (f: boolean) => this.tweens.add({ targets: c, y: f ? y - 14 : y, duration: 160 });
        (c as any).activate = go;
        cards.push(c);
      }
      // entrée en éventail
      c.setAngle((i - 2) * 6).setAlpha(0).setY(y + 80);
      this.tweens.add({ targets: c, angle: 0, alpha: 1, y, delay: i * 70, duration: 520, ease: "Back.easeOut" });
    });
    const back = cardButton(this, GAME_W / 2, 650, "Retour", () => this.show("home"), 200);
    v.add(back);
    // ← → entre mondes jouables, Entrée pour lancer
    let k = 0;
    const upd = () => cards.forEach((c, j) => (c as any).setFocus(j === k));
    this.time.delayedCall(600, upd);
    this.input.keyboard!.on("keydown-RIGHT", () => { k = (k + 1) % cards.length; upd(); });
    this.input.keyboard!.on("keydown-LEFT", () => { k = (k - 1 + cards.length) % cards.length; upd(); });
    this.input.keyboard!.on("keydown-ENTER", () => (cards[k] as any).activate());
  }

  private scores() {
    const v = this.view;
    v.add(txt(this, GAME_W / 2, 80, "Classement local", 48, "#F3EBDD", true));
    const panel = this.add.graphics().fillStyle(0x101714, 0.85).fillRoundedRect(340, 130, 600, 450, 18).lineStyle(2, 0xc6a05a, 0.7).strokeRoundedRect(340, 130, 600, 450, 18);
    v.add(panel);
    const lb = Storage.leaderboard();
    if (!lb.length) v.add(txt(this, GAME_W / 2, 350, "Aucun score pour l'instant.\nTerminez un niveau pour inscrire votre nom.", 20, "rgba(243,235,221,.75)"));
    lb.forEach((e, i) => {
      const y = 170 + i * 40, col = i === 0 ? "#C6A05A" : "#F3EBDD";
      v.add(this.add.text(380, y, `${String(i + 1).padStart(2, "0")}`, { fontFamily: "Cormorant Garamond", fontSize: "26px", color: "#C6A05A" }));
      v.add(this.add.text(440, y + 2, e.name, { fontFamily: "Manrope", fontSize: "22px", color: col, fontStyle: "bold" }));
      v.add(this.add.text(560, y + 4, `${e.level === "boss" ? "Palais" : "Forêt"} · ${e.cards} ♠ · ${Math.round(e.time)} s`, { fontFamily: "Manrope", fontSize: "16px", color: "rgba(243,235,221,.6)" }));
      v.add(this.add.text(900, y + 2, `${e.score}`, { fontFamily: "Manrope", fontSize: "22px", color: col, fontStyle: "bold" }).setOrigin(1, 0));
    });
    v.add(txt(this, GAME_W / 2, 605, "Scores enregistrés uniquement sur cet appareil.", 13, "rgba(243,235,221,.55)"));
    const back = cardButton(this, GAME_W / 2, 660, "Retour", () => this.show("home"), 200);
    v.add(back); keyboardMenu(this, [back]);
  }

  private controls() {
    const v = this.view;
    v.add(txt(this, GAME_W / 2, 80, "Commandes", 48, "#F3EBDD", true));
    const rows: [string, string][] = [
      ["Se déplacer", "← →   ·   A / D   ·   Q / D (AZERTY)"],
      ["Sauter / double saut", "Espace   ·   ↑   ·   W / Z   (appuyer 2×)"],
      ["Saut court", "Relâcher le saut plus tôt"],
      ["Écraser un ennemi", "Retomber sur lui"],
      ["Pause", "P   ·   Échap"],
      ["Son on / off", "M"],
      ["Recommencer au checkpoint", "R"],
      ["Tactile", "◀ ▶ à gauche · SAUT à droite"],
    ];
    rows.forEach(([a, b], i) => {
      const y = 160 + i * 52;
      v.add(this.add.text(300, y, a, { fontFamily: "Cormorant Garamond", fontSize: "26px", color: "#C6A05A" }));
      v.add(this.add.text(640, y + 4, b, { fontFamily: "Manrope", fontSize: "20px", color: "#F3EBDD" }));
    });
    const back = cardButton(this, GAME_W / 2, 640, "Retour", () => this.show("home"), 200);
    v.add(back); keyboardMenu(this, [back]);
  }
}
