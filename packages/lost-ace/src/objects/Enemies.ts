import Phaser from "phaser";
import { TILE } from "../constants";

/** Ennemi de base : peut être écrasé par le dessus. */
export abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  alive = true;
  abstract readonly points: number;
  abstract tick(time: number, delta: number): void;
  kill() {
    this.alive = false;
    this.body.enable = false;
    this.scene.tweens.add({ targets: this, alpha: 0, y: this.y - 20, scaleY: 0.3, duration: 380, onComplete: () => this.destroy() });
  }
}

/** Scarabée d'émeraude : patrouille au sol, fait demi-tour aux murs et aux bords. */
export class Beetle extends Enemy {
  readonly points = 1;
  private speed = 70;
  private minX: number; private maxX: number;
  constructor(scene: Phaser.Scene, x: number, y: number, range: number, private layer: Phaser.Tilemaps.TilemapLayer) {
    super(scene, x, y, "beetle", 0);
    scene.add.existing(this); scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(40);
    this.body.setSize(50, 26).setOffset(7, 16);
    this.minX = x - range * TILE; this.maxX = x + range * TILE;
    this.play("beetle-walk");
    this.body.setVelocityX(-this.speed);
  }
  tick() {
    if (!this.alive) return;
    const b = this.body;
    const dir = Math.sign(b.velocity.x) || -1;
    const aheadX = this.x + dir * 30;
    const groundAhead = this.layer.getTileAtWorldXY(aheadX, this.y + 8);
    if (b.blocked.left || b.blocked.right || !groundAhead || this.x < this.minX || this.x > this.maxX) {
      const nd = this.x < this.minX ? 1 : this.x > this.maxX ? -1 : -dir;
      b.setVelocityX(nd * this.speed);
    }
    this.setFlipX(b.velocity.x < 0);
  }
}

/** Feu follet : vol sinusoïdal, sans gravité. */
export class Wisp extends Enemy {
  readonly points = 1;
  private ox: number; private oy: number; private t0: number;
  constructor(scene: Phaser.Scene, x: number, y: number, private amp = 1.5, private range = 0) {
    super(scene, x, y, "wisp", 0);
    scene.add.existing(this); scene.physics.add.existing(this);
    this.setDepth(41).setBlendMode(Phaser.BlendModes.SCREEN);
    this.body.setAllowGravity(false).setCircle(15, 13, 15);
    this.ox = x; this.oy = y; this.t0 = Math.random() * 10;
    this.play("wisp-float");
  }
  tick(time: number) {
    if (!this.alive) return;
    const t = time / 1000 + this.t0;
    this.setPosition(this.ox + Math.sin(t * 0.8) * this.range * TILE, this.oy + Math.sin(t * 2.1) * this.amp * TILE * 0.5);
    this.body.updateFromGameObject();
  }
}
