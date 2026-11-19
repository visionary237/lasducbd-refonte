import Phaser from "phaser";

/**
 * Entrées unifiées clavier + tactile.
 * Clavier : ← → / A D / Q (AZERTY) · Saut : Espace / ↑ / W / Z · Pause : P / Échap · Son : M · Recommencer : R
 * Tactile : boutons virtuels ◀ ▶ (gauche) et SAUT (droite), multi-touch.
 */
export class Controls {
  left = false; right = false; jumpHeld = false;
  private jumpPressedFlag = false;
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private touch = { left: false, right: false, jump: false };

  constructor(private scene: Phaser.Scene) {
    const kb = scene.input.keyboard!;
    const K = Phaser.Input.Keyboard.KeyCodes;
    this.keys = kb.addKeys({ left: K.LEFT, right: K.RIGHT, a: K.A, q: K.Q, d: K.D, up: K.UP, w: K.W, z: K.Z, space: K.SPACE }) as any;
    kb.addCapture([K.SPACE, K.UP, K.DOWN, K.LEFT, K.RIGHT]);
    const onJump = () => { this.jumpPressedFlag = true; };
    [this.keys.up, this.keys.w, this.keys.z, this.keys.space].forEach((k) => k.on("down", onJump));
    if (scene.sys.game.device.input.touch) this.buildTouch();
  }

  private buildTouch() {
    const s = this.scene;
    s.input.addPointer(2);
    const mk = (x: number, y: number, label: string, key: "left" | "right" | "jump", r = 1) => {
      const c = s.add.container(x, y).setScrollFactor(0).setDepth(1000).setScale(r);
      const bg = s.add.image(0, 0, "ui-touch").setAlpha(0.85);
      const t = s.add.text(0, 0, label, { fontFamily: "Manrope, sans-serif", fontSize: key === "jump" ? "22px" : "40px", color: "#F3EBDD", fontStyle: "bold" }).setOrigin(0.5);
      c.add([bg, t]);
      bg.setInteractive({ useHandCursor: false });
      const down = () => { this.touch[key] = true; if (key === "jump") this.jumpPressedFlag = true; c.setAlpha(1); bg.setTint(0xc6a05a); };
      const up = () => { this.touch[key] = false; c.setAlpha(1); bg.clearTint(); };
      bg.on("pointerdown", down); bg.on("pointerup", up); bg.on("pointerout", up);
      return c;
    };
    const h = s.scale.height;
    mk(100, h - 100, "◀", "left");
    mk(240, h - 100, "▶", "right");
    mk(s.scale.width - 110, h - 110, "SAUT", "jump", 1.2);
  }

  update() {
    const k = this.keys;
    this.left = k.left.isDown || k.a.isDown || k.q.isDown || this.touch.left;
    this.right = k.right.isDown || k.d.isDown || this.touch.right;
    this.jumpHeld = k.up.isDown || k.w.isDown || k.z.isDown || k.space.isDown || this.touch.jump;
    // Hook de test automatisé (scripts/qa.mjs) — inactif en jeu normal
    const bot = (window as any).__bot;
    if (bot) { this.left = bot.left; this.right = bot.right; this.jumpHeld = bot.jump; if (bot.press) { this.jumpPressedFlag = true; bot.press = false; } }
  }
  /** Consomme l'appui de saut (front montant). */
  consumeJump() { const v = this.jumpPressedFlag; this.jumpPressedFlag = false; return v; }
  peekJump() { return this.jumpPressedFlag; }
}
