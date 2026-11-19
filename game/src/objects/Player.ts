import Phaser from "phaser";
import { PHYS } from "../constants";
import type { Controls } from "../systems/Controls";
import { Audio } from "../systems/Audio";
import { Storage } from "../systems/Storage";

/**
 * Le Gentleman de Pique.
 * Game feel : accélération/décélération, coyote time, buffer de saut, hauteur variable,
 * double saut avec vrille, squash & stretch, invulnérabilité clignotante.
 */
export class Player extends Phaser.Physics.Arcade.Sprite {
  declare body: Phaser.Physics.Arcade.Body;
  maxHp = 3;
  hp = 3;
  canDouble = true;
  invulnUntil = 0;
  dead = false;
  frozen = false;
  private lastGrounded = 0;
  private lastJumpPress = -9999;
  private jumping = false;
  private spinTween?: Phaser.Tweens.Tween;
  private squashTween?: Phaser.Tweens.Tween;
  private dust: Phaser.GameObjects.Particles.ParticleEmitter;
  private trail: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene, x: number, y: number, private controls: Controls) {
    super(scene, x, y, "player", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setOrigin(0.5, 1).setDepth(50);
    this.body.setSize(26, 58).setOffset(23, 28);
    this.body.setMaxVelocity(PHYS.runSpeed * 1.4, PHYS.maxFall);
    this.play("p-idle");
    // liseré lumineux pour détacher la silhouette noire des décors sombres (WebGL uniquement)
    if (!Storage.settings.reducedFx) this.preFX?.addGlow(0xffe7a3, 1.6, 0, false, 0.1, 10);

    this.dust = scene.add.particles(0, 0, "dot", {
      lifespan: 420, speed: { min: 20, max: 90 }, angle: { min: 200, max: 340 }, scale: { start: 0.55, end: 0 },
      alpha: { start: 0.55, end: 0 }, tint: 0xcfe7c7, emitting: false,
    }).setDepth(49);
    this.trail = scene.add.particles(0, 0, "spark", {
      lifespan: 500, speed: { min: 10, max: 60 }, scale: { start: 0.9, end: 0 }, alpha: { start: 1, end: 0 },
      tint: [0xffe7a3, 0xc6a05a, 0x7fe0ff], rotate: { min: 0, max: 360 }, emitting: false, blendMode: "ADD",
    }).setDepth(49);
  }

  get grounded() { return this.body.blocked.down || this.body.touching.down; }

  update(time: number, delta: number) {
    if (this.dead || this.frozen) return;
    const c = this.controls;
    const dt = delta / 1000;
    const onGround = this.grounded;
    if (onGround) { this.lastGrounded = time; this.canDouble = true; if (this.body.velocity.y >= 0) this.jumping = false; }
    if (c.consumeJump()) this.lastJumpPress = time;

    // --- horizontal
    const dir = (c.right ? 1 : 0) - (c.left ? 1 : 0);
    const vx = this.body.velocity.x;
    const accel = onGround ? PHYS.accelGround : PHYS.accelAir;
    if (dir !== 0) {
      this.body.setVelocityX(Phaser.Math.Clamp(vx + dir * accel * dt, -PHYS.runSpeed, PHYS.runSpeed));
      this.setFlipX(dir < 0);
    } else {
      const drag = (onGround ? PHYS.dragGround : PHYS.accelAir * 0.5) * dt;
      this.body.setVelocityX(Math.abs(vx) <= drag ? 0 : vx - Math.sign(vx) * drag);
    }

    // --- saut (buffer + coyote)
    const buffered = time - this.lastJumpPress < PHYS.jumpBufferMs;
    const coyote = time - this.lastGrounded < PHYS.coyoteMs;
    if (buffered && (onGround || (coyote && !this.jumping))) {
      this.doJump(PHYS.jumpVelocity, false);
    } else if (buffered && !onGround && this.canDouble && time - this.lastJumpPress < 20) {
      this.canDouble = false;
      this.doJump(PHYS.doubleJumpVelocity, true);
    }
    // hauteur variable : relâcher coupe la montée
    if (!c.jumpHeld && this.jumping && this.body.velocity.y < -120) this.body.setVelocityY(this.body.velocity.y * PHYS.jumpCutMultiplier);

    // --- animation
    const hurt = time < this.invulnUntil - PHYS.invulnMs + 380;
    if (hurt) this.play("p-hurt", true);
    else if (!onGround) {
      if (!this.spinTween?.isPlaying()) this.play(this.body.velocity.y < 0 ? "p-jump" : "p-fall", true);
    } else if (Math.abs(this.body.velocity.x) > 30) {
      this.play("p-run", true);
      if (Math.random() < 0.12) this.dust.emitParticleAt(this.x - Math.sign(this.body.velocity.x) * 10, this.y, 1);
    } else this.play("p-idle", true);

    // invulnérabilité clignotante
    this.setAlpha(time < this.invulnUntil ? (Math.floor(time / 70) % 2 ? 0.35 : 1) : 1);
  }

  private doJump(v: number, double: boolean) {
    this.lastJumpPress = -9999;
    this.jumping = true;
    this.body.setVelocityY(-v);
    this.squash(0.78, 1.22);
    if (double) {
      Audio.play("double");
      this.trail.explode(14, this.x, this.y - 30);
      this.play("p-spin", true);
      this.spinTween?.stop();
      this.setAngle(0);
      this.spinTween = this.scene.tweens.add({ targets: this, angle: this.flipX ? -360 : 360, duration: 380, ease: "Cubic.easeOut", onComplete: () => this.setAngle(0) });
    } else {
      Audio.play("jump");
      this.dust.explode(8, this.x, this.y);
    }
  }

  /** Atterrissage (appelé par la scène lors d'un contact sol après une chute). */
  land(impact: number) {
    if (impact > 450) { this.squash(1.25, 0.8); this.dust.explode(10, this.x, this.y); }
  }

  squash(sx: number, sy: number) {
    this.squashTween?.stop();
    this.setScale(sx, sy);
    this.squashTween = this.scene.tweens.add({ targets: this, scaleX: 1, scaleY: 1, duration: 220, ease: "Back.easeOut" });
  }

  bounce(v = PHYS.stompBounce) {
    this.body.setVelocityY(-v);
    this.jumping = true;
    this.canDouble = true;
    this.squash(0.8, 1.2);
  }

  /** Retourne true si le coup a été encaissé. */
  hurt(time: number, fromX: number) {
    if (time < this.invulnUntil || this.dead) return false;
    this.hp -= 1;
    this.invulnUntil = time + PHYS.invulnMs;
    const dir = Math.sign(this.x - fromX) || 1;
    this.body.setVelocity(dir * 380, -480);
    this.jumping = false;
    Audio.play("hurt");
    return true;
  }

  heal() { this.hp = Math.min(this.maxHp, this.hp + 1); }

  respawn(x: number, y: number, time: number) {
    this.dead = false;
    this.setPosition(x, y).setAngle(0).setAlpha(1).setVisible(true);
    this.body.reset(x, y);
    this.body.enable = true;
    this.hp = this.maxHp;
    this.invulnUntil = time + 1200;
  }
}
