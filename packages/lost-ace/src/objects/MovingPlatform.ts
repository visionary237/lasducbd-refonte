import Phaser from "phaser";
import { TILE } from "../constants";

/**
 * Plateforme mobile pilotée par vélocité (le corps Arcade « immovable » transporte le joueur
 * grâce à body.friction). Trajectoire sinusoïdale aller-retour.
 */
export class MovingPlatform extends Phaser.Physics.Arcade.Image {
  declare body: Phaser.Physics.Arcade.Body;
  private ox: number; private oy: number;
  constructor(scene: Phaser.Scene, x: number, y: number, private dx: number, private dy: number, private period: number, private phase = 0) {
    super(scene, x, y, "mover");
    scene.add.existing(this); scene.physics.add.existing(this);
    this.setOrigin(0, 0).setDepth(30);
    this.body.setAllowGravity(false).setImmovable(true).setSize(144, 22).setOffset(0, 2);
    this.body.friction.set(1, 0);
    this.ox = x; this.oy = y;
    this.body.checkCollision.down = false; this.body.checkCollision.left = false; this.body.checkCollision.right = false;
  }
  tick(time: number, delta: number) {
    const t = ((time / 1000) / this.period + this.phase) * Math.PI * 2;
    const k = (1 - Math.cos(t)) / 2; // 0→1→0, adouci
    const tx = this.ox + this.dx * TILE * k, ty = this.oy + this.dy * TILE * k;
    const dt = Math.max(delta, 1) / 1000;
    this.body.setVelocity((tx - this.x) / dt, (ty - this.y) / dt);
  }
}
