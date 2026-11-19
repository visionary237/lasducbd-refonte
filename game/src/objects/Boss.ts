import Phaser from "phaser";
import { Audio } from "../systems/Audio";
import type { Player } from "./Player";

type State = "intro" | "walk" | "windup" | "leap" | "stunned" | "throw" | "hurt" | "defeated";

/**
 * LE ROI SANS VISAGE — boss final (personnage fictif).
 * Boucle : marche → élan → bond + onde de choc → sonné (vulnérable, couronne lumineuse) → lancer de cartes.
 * 3 points de vie ; phase 2 (≤ 1 PV) plus rapide et lancers en éventail.
 */
export class Boss extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  hp = 3;
  readonly maxHp = 3;
  state: State = "intro";
  private stateUntil = 0;
  projectiles: Phaser.Physics.Arcade.Group;
  shockwaves: Phaser.Physics.Arcade.Group;
  onDefeated?: () => void;

  constructor(scene: Phaser.Scene, x: number, y: number, private player: Player) {
    super(scene, x, y, "boss", 0);
    scene.add.existing(this); scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(45);
    this.body.setSize(100, 150).setOffset(40, 50);
    this.projectiles = scene.physics.add.group({ allowGravity: false });
    this.shockwaves = scene.physics.add.group({ allowGravity: false });
    this.set("intro", 1600);
  }

  get vulnerable() { return this.state === "stunned"; }
  get phase2() { return this.hp <= 1; }

  private set(s: State, ms: number) { this.state = s; this.stateUntil = this.scene.time.now + ms; }

  tick(time: number) {
    if (this.state === "defeated") return;
    const b = this.body;
    const onGround = b.blocked.down;
    const toPlayer = Math.sign(this.player.x - this.x) || 1;
    const spd = this.phase2 ? 170 : 110;
    this.setFlipX(toPlayer < 0);

    switch (this.state) {
      case "intro": b.setVelocityX(0); if (time > this.stateUntil) this.set("walk", 1800); break;
      case "walk":
        this.setFrame(0); b.setVelocityX(toPlayer * spd);
        if (time > this.stateUntil) { this.set("windup", this.phase2 ? 380 : 560); b.setVelocityX(0); }
        break;
      case "windup":
        this.setFrame(1);
        if (time > this.stateUntil) {
          this.set("leap", 3000);
          b.setVelocity(Phaser.Math.Clamp((this.player.x - this.x) * 1.1, -520, 520), -900);
        }
        break;
      case "leap":
        this.setFrame(1);
        if (onGround && b.velocity.y >= 0 && time > this.stateUntil - 2800) {
          b.setVelocityX(0);
          this.slam();
          this.set("stunned", this.phase2 ? 1400 : 1900);
        }
        break;
      case "stunned":
        this.setFrame(2); b.setVelocityX(0);
        if (time > this.stateUntil) { this.set("throw", 900); this.throwCards(); }
        break;
      case "throw": this.setFrame(0); b.setVelocityX(0); if (time > this.stateUntil) this.set("walk", this.phase2 ? 1200 : 1800); break;
      case "hurt": this.setFrame(2); if (time > this.stateUntil) { this.set("throw", 700); this.throwCards(); } break;
    }
    this.projectiles.getChildren().forEach((p: any) => { p.angle += 14; if (p.x < -50 || p.x > 3000 || p.y > 900) p.destroy(); });
    this.shockwaves.getChildren().forEach((s: any) => { s.alpha -= 0.012; if (s.alpha <= 0.05) s.destroy(); });
  }

  private slam() {
    Audio.play("slam");
    this.scene.cameras.main.shake(260, 0.012);
    [-1, 1].forEach((d) => {
      const w = this.shockwaves.create(this.x + d * 50, this.y - 14, "dot") as Phaser.Physics.Arcade.Image;
      w.setScale(5, 1.4).setTint(0xffd27a).setBlendMode("ADD").setDepth(44);
      (w.body as Phaser.Physics.Arcade.Body).setSize(10, 10).setVelocityX(d * 420);
    });
  }

  private throwCards() {
    Audio.play("throw");
    const n = this.phase2 ? 5 : 3;
    for (let i = 0; i < n; i++) {
      const a = Phaser.Math.DegToRad(-160 + (i / (n - 1)) * 140);
      const c = this.projectiles.create(this.x, this.y - 120, "boss-card") as Phaser.Physics.Arcade.Image;
      c.setDepth(46);
      const bias = (this.player.x - this.x) * 0.25;
      (c.body as Phaser.Physics.Arcade.Body).setVelocity(Math.cos(a) * 340 + bias, Math.sin(a) * 520).setAcceleration(0, 620).setSize(24, 30);
    }
  }

  /** Le joueur l'écrase pendant qu'il est sonné. */
  takeHit() {
    if (!this.vulnerable) return false;
    this.hp -= 1;
    Audio.play("boss-hit");
    this.scene.cameras.main.flash(120, 255, 230, 160);
    this.setTintFill(0xffffff);
    this.scene.time.delayedCall(90, () => this.clearTint());
    if (this.hp <= 0) {
      this.state = "defeated";
      this.setFrame(3);
      this.body.setVelocity(0, -300);
      this.projectiles.clear(true, true);
      this.scene.tweens.add({ targets: this, alpha: 0, duration: 1800, delay: 600, onComplete: () => this.onDefeated?.() });
    } else this.set("hurt", 500);
    return true;
  }
}
