import Phaser from "phaser";
import { GAME_W, GAME_H } from "../constants";
import type { Game } from "./Game";
import type { Boss } from "../objects/Boss";
import { Audio } from "../systems/Audio";

/** Interface en surimpression façon cartes à jouer. Écoute les événements de la scène Game. */
export class HUD extends Phaser.Scene {
  private g!: Game;
  private hp: Phaser.GameObjects.Image[] = [];
  private lives!: Phaser.GameObjects.Text;
  private crystals!: Phaser.GameObjects.Text;
  private score!: Phaser.GameObjects.Text;
  private combo!: Phaser.GameObjects.Text;
  private slots: Phaser.GameObjects.Image[] = [];
  private soundLabel!: Phaser.GameObjects.Text;
  private bossBar?: Phaser.GameObjects.Graphics;
  private bossLabel?: Phaser.GameObjects.Text;
  private shownScore = 0;

  constructor() { super("HUD"); }

  create(data: { game: Game }) {
    this.g = data.game;
    this.hp = []; this.slots = [];
    // panneau gauche : vie + vies + cristaux
    this.add.image(24, 20, "ui-panel").setOrigin(0).setScale(0.9, 0.85);
    for (let i = 0; i < 3; i++) this.hp.push(this.add.image(60 + i * 32, 58, "ui-hp"));
    this.lives = this.add.text(166, 44, "", { fontFamily: "Cormorant Garamond", fontSize: "30px", color: "#F3EBDD" });
    this.crystals = this.add.text(48, 82, "", { fontFamily: "Manrope", fontSize: "16px", color: "#7fe0ff", fontStyle: "bold" });
    // cartes anciennes au centre
    for (let i = 0; i < 3; i++) {
      const s = this.add.image(GAME_W / 2 - 40 + i * 40, 52, "ui-card-slot");
      this.slots.push(s);
    }
    this.add.text(GAME_W / 2, 86, "CARTES ANCIENNES", { fontFamily: "Manrope", fontSize: "10px", color: "#C6A05A" }).setOrigin(0.5).setLetterSpacing(3);
    // score à droite
    this.score = this.add.text(GAME_W - 40, 28, "0", { fontFamily: "Cormorant Garamond", fontSize: "48px", color: "#F3EBDD" }).setOrigin(1, 0).setShadow(0, 3, "#000", 8);
    this.combo = this.add.text(GAME_W - 40, 84, "", { fontFamily: "Manrope", fontSize: "16px", color: "#101714", backgroundColor: "#C6A05A", padding: { x: 10, y: 4 }, fontStyle: "bold" }).setOrigin(1, 0);
    this.soundLabel = this.add.text(GAME_W - 40, GAME_H - 30, "", { fontFamily: "Manrope", fontSize: "13px", color: "rgba(243,235,221,.6)" }).setOrigin(1, 1).setInteractive({ useHandCursor: true });
    this.soundLabel.on("pointerup", () => { Audio.toggle(); this.refresh(); });
    if (this.sys.game.device.input.touch) {
      const pb = this.add.text(GAME_W / 2, GAME_H - 40, "❚❚  PAUSE", { fontFamily: "Manrope", fontSize: "16px", color: "#F3EBDD", backgroundColor: "rgba(16,23,20,.7)", padding: { x: 14, y: 8 } }).setOrigin(0.5).setInteractive();
      pb.on("pointerup", () => this.g.events.emit("pause-request"));
    }

    this.g.events.on("hud", this.refresh, this);
    this.g.events.on("card", (i: number) => this.cardCollected(i), this);
    this.g.events.on("boss", (b: Boss) => this.bossUpdate(b), this);
    this.events.once("shutdown", () => { this.g.events.off("hud", this.refresh, this); this.g.events.off("card"); this.g.events.off("boss"); });
    this.refresh();
    // les cartes déjà obtenues (si reprise)
    this.g.run.cards.forEach((c, i) => c && this.slots[i].setTexture("card-face").setScale(0.68));
  }

  private refresh() {
    const r = this.g.run, p = this.g.player;
    this.hp.forEach((h, i) => h.setTexture(p && i < p.hp ? "ui-hp" : "ui-hp-empty"));
    this.lives.setText(`× ${Math.max(0, r.lives)}`);
    this.crystals.setText(`◆  ${r.crystals} / ${r.crystalsTotal}`);
    this.combo.setText(r.combo > 1 ? `COMBO ×${r.combo}` : "").setVisible(r.combo > 1);
    if (r.combo > 1) { this.combo.setScale(1.25); this.tweens.add({ targets: this.combo, scale: 1, duration: 200, ease: "Back.out" }); }
    this.soundLabel.setText(`Son ${Audio.enabled ? "activé" : "coupé"} (M)`);
    this.tweens.addCounter({ from: this.shownScore, to: r.score, duration: 400, onUpdate: (t) => { this.shownScore = Math.round(t.getValue() ?? 0); this.score.setText(String(this.shownScore)); } });
  }

  private cardCollected(i: number) {
    const s = this.slots[i];
    this.tweens.add({ targets: s, scaleX: 0, duration: 160, onComplete: () => { s.setTexture("card-face").setScale(0, 0.68); this.tweens.add({ targets: s, scaleX: 0.68, duration: 220, ease: "Back.out" }); } });
  }

  private bossUpdate(b: Boss) {
    if (!this.bossBar) {
      this.bossLabel = this.add.text(GAME_W / 2, GAME_H - 82, "LE ROI SANS VISAGE", { fontFamily: "Cormorant Garamond", fontSize: "26px", color: "#F3EBDD" }).setOrigin(0.5).setLetterSpacing(4);
      this.bossBar = this.add.graphics();
    }
    const w = 420, x = GAME_W / 2 - w / 2, y = GAME_H - 60;
    this.bossBar.clear().fillStyle(0x101714, 0.85).fillRoundedRect(x - 4, y - 4, w + 8, 22, 8);
    this.bossBar.fillStyle(0x832e3e, 1).fillRoundedRect(x, y, (w * Math.max(0, b.hp)) / b.maxHp, 14, 6);
    this.bossBar.lineStyle(1.5, 0xc6a05a, 1).strokeRoundedRect(x - 4, y - 4, w + 8, 22, 8);
    if (b.hp <= 0) this.tweens.add({ targets: [this.bossBar, this.bossLabel], alpha: 0, duration: 1200, delay: 800 });
  }
}
