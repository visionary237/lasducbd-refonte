import Phaser from "phaser";
import { GAME_W, GAME_H, TILE, PHYS, SCORE } from "../constants";
import { worldById, type WorldDef } from "../config/worlds";
import { LEVELS } from "../levels";
import { Cell, type LevelData, type Entity } from "../levels/types";
import { generateBackground, generateTileset, T } from "../art/world";
import { rng } from "../utils/rng";
import { Controls } from "../systems/Controls";
import { Audio } from "../systems/Audio";
import { Storage } from "../systems/Storage";
import { Player } from "../objects/Player";
import { Enemy, Beetle, Wisp } from "../objects/Enemies";
import { MovingPlatform } from "../objects/MovingPlatform";
import { Boss } from "../objects/Boss";

export interface RunState {
  score: number; lives: number; combo: number; comboUntil: number;
  crystals: number; crystalsTotal: number; cards: boolean[]; deaths: number; startedAt: number;
}

interface Light { obj: { x: number; y: number; active?: boolean; visible?: boolean }; r: number; dy?: number }

/**
 * Scène de jeu générique : lit un LevelData + un WorldDef et construit tout le niveau.
 * Aucune logique spécifique à un monde ici → chaque nouveau niveau réutilise cette architecture.
 */
export class Game extends Phaser.Scene {
  level!: LevelData;
  world!: WorldDef;
  controls!: Controls;
  player!: Player;
  layer!: Phaser.Tilemaps.TilemapLayer;
  run!: RunState;
  private enemies!: Phaser.Physics.Arcade.Group;
  private movers: MovingPlatform[] = [];
  private pickups!: Phaser.Physics.Arcade.StaticGroup;
  private checkpoints: { s: Phaser.GameObjects.Sprite; lit: boolean }[] = [];
  private respawn = { x: 0, y: 0 };
  private parallax: { ts: Phaser.GameObjects.TileSprite; f: number }[] = [];
  private lamps: Light[] = [];
  private darkness?: Phaser.GameObjects.RenderTexture;
  private signs: { t: Phaser.GameObjects.Text; x: number; y: number }[] = [];
  private exit?: Phaser.GameObjects.Image;
  private exitZone?: Phaser.GameObjects.Zone;
  private boss?: Boss;
  private wasAirborne = false;
  private lastVy = 0;
  private finished = false;
  private sparkle!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() { super("Game"); }

  init(data: { levelKey: string; carry?: Partial<RunState> }) {
    this.level = LEVELS[data.levelKey] ?? LEVELS.level1;
    this.world = worldById(this.level.worldId);
    this.movers = []; this.checkpoints = []; this.parallax = []; this.lamps = []; this.signs = [];
    this.finished = false; this.boss = undefined; this.exit = undefined;
    const crystalsTotal = this.level.entities.filter((e) => e.type === "crystal").length;
    this.run = {
      score: 0, lives: 3, combo: 1, comboUntil: 0, crystals: 0, crystalsTotal,
      cards: [false, false, false], deaths: 0, startedAt: 0, ...data.carry,
    };
  }

  create() {
    const { world: w, level: L } = this;
    const WW = L.width * TILE, WH = L.height * TILE;
    if (!this.textures.exists(`bg-${w.id}-near`)) generateBackground(this, w);
    const tilesKey = this.textures.exists(`tiles-${w.id}`) ? `tiles-${w.id}` : generateTileset(this, w);

    this.physics.world.gravity.y = PHYS.gravity;
    this.physics.world.setBounds(0, -400, WW, WH + 800);
    this.physics.world.setBoundsCollision(true, true, false, false);

    // ---------- Parallaxe multicouche
    this.add.image(0, 0, `bg-${w.id}-sky`).setOrigin(0).setScrollFactor(0).setDepth(-100);
    (["far", "mid", "near"] as const).forEach((l, i) => {
      const ts = this.add.tileSprite(0, 0, GAME_W, GAME_H, `bg-${w.id}-${l}`).setOrigin(0).setScrollFactor(0).setDepth(-90 + i * 10);
      this.parallax.push({ ts, f: w.parallax[l] });
    });
    // rayons de lumière
    for (let i = 0; i < 4; i++) {
      const ray = this.add.image(200 + i * 320, 0, "ray").setOrigin(0.5, 0).setScrollFactor(0.15 + i * 0.05, 0).setBlendMode("ADD").setDepth(-55).setAlpha(0.35).setAngle(-12);
      this.tweens.add({ targets: ray, alpha: 0.12, duration: 2600 + i * 700, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    }

    // ---------- Tilemap (auto-tiling)
    const data = this.autotile(L);
    const map = this.make.tilemap({ data, tileWidth: TILE, tileHeight: TILE });
    const tileset = map.addTilesetImage(tilesKey, tilesKey, TILE, TILE, 0, 0)!;
    this.layer = map.createLayer(0, tileset, 0, 0)!.setDepth(20);
    this.layer.forEachTile((t) => {
      if (t.index < 0) return;
      if (t.index === T.THORN) { t.setCollision(false); return; }
      if ([T.PL, T.PM, T.PR, T.PSINGLE].includes(t.index)) t.setCollision(false, false, true, false);
      else t.setCollision(true);
    });

    // ---------- Entités
    this.controls = new Controls(this);
    const s = this.tileCenter(L.start.x, L.start.y, true);
    this.respawn = { ...s };
    this.player = new Player(this, s.x, s.y, this.controls);
    this.enemies = this.physics.add.group({ runChildUpdate: false });
    this.pickups = this.physics.add.staticGroup();
    this.sparkle = this.add.particles(0, 0, "spark", {
      lifespan: 600, speed: { min: 60, max: 220 }, scale: { start: 1, end: 0 }, alpha: { start: 1, end: 0 },
      tint: [0xffffff, 0x7fe0ff, 0xffe7a3], blendMode: "ADD", emitting: false,
    }).setDepth(60);
    L.entities.forEach((e) => this.spawn(e));

    // ---------- Collisions
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.enemies, this.layer);
    this.movers.forEach((m) => { this.physics.add.collider(this.player, m); this.physics.add.collider(this.enemies, m); });
    this.physics.add.overlap(this.player, this.enemies, (_p, e) => this.onEnemy(e as Enemy));
    this.physics.add.overlap(this.player, this.pickups, (_p, o) => this.onPickup(o as Phaser.Physics.Arcade.Image));

    // ---------- Ambiance : particules + lumière dynamique
    this.ambient();
    this.add.image(GAME_W / 2, GAME_H / 2, "vignette").setScrollFactor(0).setDisplaySize(GAME_W, GAME_H).setDepth(900).setAlpha(0.8);
    if (!Storage.settings.reducedFx && w.ambient.darkness > 0) {
      this.darkness = this.add.renderTexture(0, 0, GAME_W, GAME_H).setOrigin(0).setScrollFactor(0).setDepth(800);
      this.lamps.push({ obj: this.player, r: 300, dy: -40 });
    }
    const glowP = this.add.image(0, 0, "light").setBlendMode("ADD").setTint(0xffe7a3).setAlpha(0.22).setScale(1.3).setDepth(48);
    this.events.on("update", () => glowP.setPosition(this.player.x, this.player.y - 40));

    // ---------- Caméra
    const cam = this.cameras.main;
    cam.setBounds(0, 0, WW, WH).startFollow(this.player, true, 0.12, 0.12, 0, 60).setDeadzone(120, 80);
    cam.fadeIn(500, 0, 0, 0);

    // ---------- HUD + raccourcis
    this.scene.launch("HUD", { game: this });
    const kb = this.input.keyboard!;
    const pause = () => { if (this.finished) return; this.scene.launch("Pause", { from: "Game" }); this.scene.pause(); this.scene.pause("HUD"); };
    kb.on("keydown-P", pause); kb.on("keydown-ESC", pause);
    kb.on("keydown-M", () => { Audio.toggle(); this.events.emit("hud"); });
    kb.on("keydown-R", () => this.restartLevel());
    this.events.on("pause-request", pause);
    this.game.events.on(Phaser.Core.Events.BLUR, () => !this.finished && this.scene.isActive() && pause());

    this.run.startedAt = this.time.now;
    this.levelTitle();
    this.events.emit("hud");
    this.events.once("shutdown", () => { this.game.events.off(Phaser.Core.Events.BLUR); this.scene.stop("HUD"); });
  }

  // ================================================================== construction
  private autotile(L: LevelData): number[][] {
    const r = rng(L.width * 17);
    const at = (x: number, y: number) => (y < 0 ? Cell.Empty : y >= L.height ? Cell.Solid : x < 0 || x >= L.width ? Cell.Solid : L.cells[y][x]);
    return L.cells.map((row, y) => row.map((c, x) => {
      if (c === Cell.Solid) {
        if (at(x, y - 1) === Cell.Solid) return T.FILL[Math.floor(r() * 3)];
        if (at(x - 1, y) !== Cell.Solid) return T.EDGE_L;
        if (at(x + 1, y) !== Cell.Solid) return T.EDGE_R;
        return T.TOP[Math.floor(r() * 3)];
      }
      if (c === Cell.OneWay) {
        const l = at(x - 1, y) === Cell.OneWay, rr = at(x + 1, y) === Cell.OneWay;
        return l && rr ? T.PM : l ? T.PR : rr ? T.PL : T.PSINGLE;
      }
      if (c === Cell.Thorns) return T.THORN;
      return -1;
    }));
  }

  /** Centre de tuile ; `feet` = point bas (pour les objets posés). */
  tileCenter(x: number, y: number, feet = false) { return { x: (x + 0.5) * TILE, y: feet ? (y + 1) * TILE : (y + 0.5) * TILE }; }

  private spawn(e: Entity) {
    const p = e.props ?? {};
    const c = this.tileCenter(e.x, e.y), f = this.tileCenter(e.x, e.y, true);
    switch (e.type) {
      case "crystal": {
        const o = this.pickups.create(c.x, c.y, "crystal") as Phaser.Physics.Arcade.Image;
        o.setData("kind", "crystal").setDepth(35); (o.body as Phaser.Physics.Arcade.StaticBody).setSize(34, 46);
        this.tweens.add({ targets: o, y: c.y - 6, duration: 1100 + Math.random() * 400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        break;
      }
      case "card": {
        const o = this.pickups.create(c.x, c.y, "card") as Phaser.Physics.Arcade.Image;
        const idx = this.pickups.getChildren().filter((g: any) => g.getData("kind") === "card").length;
        o.setData("kind", "card").setData("idx", idx).setDepth(36);
        this.tweens.add({ targets: o, scaleX: -1, duration: 900, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        this.tweens.add({ targets: o, y: c.y - 8, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.inOut" });
        const halo = this.add.image(c.x, c.y, "light").setTint(0xffd27a).setBlendMode("ADD").setAlpha(0.35).setScale(0.7).setDepth(34);
        o.setData("halo", halo);
        this.lamps.push({ obj: o, r: 140 });
        break;
      }
      case "heart": {
        const o = this.pickups.create(c.x, c.y, "heart") as Phaser.Physics.Arcade.Image;
        o.setData("kind", "heart").setDepth(35);
        this.tweens.add({ targets: o, scale: 1.15, duration: 500, yoyo: true, repeat: -1 });
        break;
      }
      case "checkpoint": {
        const sp = this.add.sprite(f.x, f.y, "lantern", 0).setOrigin(0.5, 1).setDepth(25);
        this.checkpoints.push({ s: sp, lit: false });
        break;
      }
      case "exit": this.makeExit(f.x, f.y, this.level.key !== "boss"); break;
      case "sign": {
        this.add.image(f.x, f.y, "sign").setOrigin(0.5, 1).setDepth(24);
        const t = this.add.text(f.x, f.y - 92, String(p.text ?? ""), {
          fontFamily: "Manrope", fontSize: "18px", color: "#F3EBDD", backgroundColor: "rgba(16,23,20,.85)", padding: { x: 14, y: 8 },
        }).setOrigin(0.5).setDepth(70).setAlpha(0);
        this.signs.push({ t, x: f.x, y: f.y });
        break;
      }
      case "beetle": this.enemies.add(new Beetle(this, f.x, f.y, Number(p.range ?? 3), this.layer)); break;
      case "wisp": {
        const wsp = new Wisp(this, c.x, c.y, Number(p.amp ?? 1.5), Number(p.range ?? 0));
        this.enemies.add(wsp); (wsp.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        this.lamps.push({ obj: wsp, r: 160 });
        break;
      }
      case "mover": this.movers.push(new MovingPlatform(this, e.x * TILE, e.y * TILE, Number(p.dx ?? 0), Number(p.dy ?? 0), Number(p.period ?? 4), Number(p.phase ?? 0))); break;
      case "mushroom": {
        const m = this.add.image(f.x, f.y + 2, "mushroom", Math.floor(Math.random() * 3)).setOrigin(0.5, 1).setDepth(22);
        this.tweens.add({ targets: m, alpha: 0.75, duration: 1500 + Math.random() * 900, yoyo: true, repeat: -1 });
        this.lamps.push({ obj: { x: f.x, y: f.y - 20 }, r: 150 });
        break;
      }
      case "fern": this.add.image(f.x, f.y + 10, "fern").setOrigin(0.5, 1).setDepth(95).setScrollFactor(1.08, 1).setScale(1.3).setAlpha(0.95); break;
      case "boss": {
        this.boss = new Boss(this, f.x, f.y, this.player);
        this.physics.add.collider(this.boss, this.layer);
        this.physics.add.overlap(this.player, this.boss, () => this.onBoss());
        this.physics.add.overlap(this.player, this.boss.projectiles, (_p, pr) => { if (this.player.hurt(this.time.now, (pr as any).x)) this.afterHurt(); (pr as any).destroy(); });
        this.physics.add.overlap(this.player, this.boss.shockwaves, (_p, sw) => { if (this.player.grounded && this.player.hurt(this.time.now, (sw as any).x)) this.afterHurt(); });
        this.boss.onDefeated = () => { this.addScore(5000, this.boss!.x, this.boss!.y - 120, "Victoire !"); this.makeExit(14.5 * TILE, 12 * TILE, true); };
        this.events.emit("boss", this.boss);
        break;
      }
    }
  }

  private makeExit(x: number, y: number, appear: boolean) {
    this.exit = this.add.image(x, y, "portal").setOrigin(0.5, 1).setDepth(23);
    const swirl = this.add.particles(x, y - 80, "dot", {
      speed: { min: 10, max: 40 }, lifespan: 1400, scale: { start: 0.7, end: 0 }, alpha: { start: 0.8, end: 0 },
      tint: [0xa0ffd8, 0xffffff], blendMode: "ADD", frequency: 60, emitZone: { type: "random", source: new Phaser.Geom.Ellipse(0, 0, 70, 120) } as any,
    }).setDepth(24);
    this.lamps.push({ obj: { x, y: y - 90 }, r: 260 });
    this.exitZone = this.add.zone(x, y - 95, 80, 190);
    this.physics.add.existing(this.exitZone, true);
    this.physics.add.overlap(this.player, this.exitZone, () => this.complete());
    if (appear) { this.exit.setScale(0); swirl.setAlpha(0); this.tweens.add({ targets: [this.exit], scale: 1, duration: 800, ease: "Back.easeOut" }); this.tweens.add({ targets: swirl, alpha: 1, duration: 800 }); }
  }

  private ambient() {
    const kind = this.world.ambient.particles;
    const cfg: Record<string, Phaser.Types.GameObjects.Particles.ParticleEmitterConfig> = {
      fireflies: { tint: [0xffe7a3, 0xd8ff9a], speedX: { min: -20, max: 20 }, speedY: { min: -25, max: 5 }, scale: { start: 0.55, end: 0.1 }, lifespan: 4200, frequency: 120 },
      dust: { tint: 0xfff0c0, speedX: { min: 5, max: 25 }, speedY: { min: -5, max: 10 }, scale: { start: 0.3, end: 0 }, lifespan: 5000, frequency: 90 },
      bubbles: { tint: 0x9ff7ff, speedY: { min: -60, max: -20 }, scale: { start: 0.2, end: 0.6 }, lifespan: 3500, frequency: 110 },
      spores: { tint: [0xb78cff, 0x6ff0ff], speedY: { min: -18, max: -4 }, scale: { start: 0.45, end: 0 }, lifespan: 5200, frequency: 90 },
      embers: { tint: [0xffc76a, 0xff8a4a], speedY: { min: -70, max: -30 }, scale: { start: 0.4, end: 0 }, lifespan: 2600, frequency: 80 },
    };
    this.add.particles(0, 0, "dot", {
      ...cfg[kind], x: { min: 0, max: GAME_W }, y: { min: 0, max: GAME_H }, alpha: { start: 0.9, end: 0 }, blendMode: "ADD",
    }).setScrollFactor(0).setDepth(85);
    if (kind === "fireflies") this.add.particles(0, 0, "leaf", {
      x: { min: 0, max: GAME_W }, y: -10, speedY: { min: 30, max: 70 }, speedX: { min: -30, max: 30 }, rotate: { start: 0, end: 360 },
      lifespan: 9000, frequency: 900, alpha: 0.7, scale: { min: 0.7, max: 1.2 },
    }).setScrollFactor(0).setDepth(86);
  }

  private levelTitle() {
    const t1 = this.add.text(GAME_W / 2, GAME_H / 2 - 30, this.world.name.toUpperCase(), { fontFamily: "Cormorant Garamond", fontSize: "64px", color: "#F3EBDD" }).setOrigin(0.5).setScrollFactor(0).setDepth(1001).setLetterSpacing(6);
    const t2 = this.add.text(GAME_W / 2, GAME_H / 2 + 26, this.level.title, { fontFamily: "Manrope", fontSize: "20px", color: "#C6A05A" }).setOrigin(0.5).setScrollFactor(0).setDepth(1001);
    [t1, t2].forEach((t, i) => { t.setAlpha(0).setY(t.y + 20); this.tweens.add({ targets: t, alpha: 1, y: t.y - 20, delay: 300 + i * 150, duration: 700, ease: "Expo.out", hold: 1300, yoyo: true }); });
  }

  // ================================================================== boucle
  update(time: number, delta: number) {
    if (!this.player) return;
    this.controls.update();
    this.player.update(time, delta);
    this.movers.forEach((m) => m.tick(time, delta));
    this.enemies.getChildren().forEach((e) => (e as Enemy).tick(time, delta));
    this.boss?.tick(time);
    const cam = this.cameras.main;
    this.parallax.forEach(({ ts, f }) => (ts.tilePositionX = cam.scrollX * f));

    if (!this.player.dead && !this.finished) {
      // atterrissage (squash)
      const g = this.player.grounded;
      if (g && this.wasAirborne) this.player.land(this.lastVy);
      this.wasAirborne = !g; this.lastVy = this.player.body.velocity.y;
      // ronces
      const b = this.player.body;
      const hit = this.layer.getTilesWithinWorldXY(b.x + 4, b.y + b.height - 14, b.width - 8, 16).some((t) => t.index === T.THORN);
      if (hit && this.player.hurt(time, this.player.x)) { this.player.body.setVelocityY(-700); this.afterHurt(); }
      // chute
      if (this.player.y > this.level.height * TILE + 120) this.die();
      // checkpoints
      this.checkpoints.forEach((c) => { if (!c.lit && Math.abs(c.s.x - this.player.x) < 40 && Math.abs(c.s.y - this.player.y) < 90) this.lightCheckpoint(c); });
      // panneaux
      this.signs.forEach((s) => s.t.setAlpha(Phaser.Math.Clamp(1 - (Math.abs(s.x - this.player.x) - 60) / 120, 0, 1)));
    }
    // combo
    if (this.run.combo > 1 && time > this.run.comboUntil) { this.run.combo = 1; this.events.emit("hud"); }
    this.drawLights(cam);
  }

  private stamp?: Phaser.GameObjects.Image;
  /** Éclairage dynamique : un voile sombre « percé » par des tampons de lumière (erase). */
  private drawLights(cam: Phaser.Cameras.Scene2D.Camera) {
    if (!this.darkness) return;
    this.stamp ??= this.make.image({ key: "light" }, false);
    const rt = this.darkness;
    rt.clear().fill(0x020806, this.world.ambient.darkness + 0.12);
    for (const l of this.lamps) {
      if (l.obj.active === false || l.obj.visible === false) continue;
      const x = l.obj.x - cam.scrollX, y = l.obj.y + (l.dy ?? 0) - cam.scrollY;
      if (x < -l.r || x > GAME_W + l.r || y < -l.r || y > GAME_H + l.r) continue;
      this.stamp.setPosition(x, y).setScale((l.r * 2) / 256);
      rt.erase(this.stamp);
    }
  }

  // ================================================================== règles
  addScore(base: number, x: number, y: number, label?: string, combo = true) {
    const now = this.time.now;
    if (combo) {
      if (now < this.run.comboUntil) this.run.combo = Math.min(SCORE.comboMax, this.run.combo + 1);
      this.run.comboUntil = now + SCORE.comboWindowMs;
    }
    const pts = base * (combo ? this.run.combo : 1);
    this.run.score += pts;
    const t = this.add.text(x, y, label ?? `+${pts}${combo && this.run.combo > 1 ? `  ×${this.run.combo}` : ""}`, {
      fontFamily: "Manrope", fontSize: label ? "28px" : "18px", color: label ? "#C6A05A" : "#F3EBDD", fontStyle: "bold", stroke: "#101714", strokeThickness: 4,
    }).setOrigin(0.5).setDepth(120);
    this.tweens.add({ targets: t, y: y - 50, alpha: 0, duration: 900, ease: "Cubic.out", onComplete: () => t.destroy() });
    this.events.emit("hud");
  }

  private onPickup(o: Phaser.Physics.Arcade.Image) {
    if (!o.active) return;
    const kind = o.getData("kind");
    if (kind === "crystal") {
      this.run.crystals++; Audio.play("crystal", 1 + (this.run.combo - 1) * 0.06);
      this.sparkle.explode(10, o.x, o.y); this.addScore(SCORE.crystal, o.x, o.y - 20);
      o.destroy();
    } else if (kind === "card") {
      const idx = o.getData("idx") as number;
      this.run.cards[idx] = true; Audio.play("card");
      this.sparkle.explode(28, o.x, o.y);
      this.addScore(SCORE.card, o.x, o.y - 40, "Carte ancienne !", false);
      this.cameras.main.flash(180, 255, 230, 170, false);
      (o.getData("halo") as Phaser.GameObjects.Image)?.destroy();
      (o.body as Phaser.Physics.Arcade.StaticBody).enable = false;
      this.tweens.killTweensOf(o);
      o.setTexture("card-face").setScrollFactor(1);
      this.tweens.add({ targets: o, y: o.y - 60, scale: 1.6, duration: 400, ease: "Back.out", onComplete: () =>
        this.tweens.add({ targets: o, alpha: 0, scale: 0.6, duration: 400, onComplete: () => { o.destroy(); this.events.emit("card", idx); } }) });
    } else if (kind === "heart") {
      this.player.heal(); Audio.play("heart");
      this.addScore(SCORE.heart, o.x, o.y - 20, undefined, false);
      o.destroy();
    }
  }

  private onEnemy(e: Enemy) {
    if (!e.alive || this.player.dead) return;
    const pb = this.player.body, eb = e.body;
    const stomp = pb.velocity.y > 60 && pb.bottom - eb.top < 22;
    if (stomp) {
      e.kill(); this.player.bounce(); Audio.play("stomp");
      this.sparkle.explode(12, e.x, e.y - 10);
      this.cameras.main.shake(80, 0.004);
      this.addScore(SCORE.stomp, e.x, e.y - 40);
    } else if (this.player.hurt(this.time.now, e.x)) this.afterHurt();
  }

  private onBoss() {
    const b = this.boss!;
    if (b.state === "defeated" || this.player.dead) return;
    const pb = this.player.body;
    if (b.vulnerable && pb.velocity.y > 0 && pb.bottom - b.body.top < 40) {
      b.takeHit(); this.player.bounce(820); this.addScore(1000, b.x, b.y - 180);
      this.events.emit("boss", b);
    } else if (this.player.hurt(this.time.now, b.x)) this.afterHurt();
  }

  private afterHurt() {
    this.cameras.main.shake(140, 0.008);
    this.run.combo = 1;
    this.events.emit("hud");
    if (this.player.hp <= 0) this.die();
  }

  private lightCheckpoint(c: { s: Phaser.GameObjects.Sprite; lit: boolean }) {
    c.lit = true; c.s.setFrame(1);
    this.respawn = { x: c.s.x, y: c.s.y - 2 };
    Audio.play("checkpoint");
    this.sparkle.explode(18, c.s.x, c.s.y - 60);
    this.lamps.push({ obj: { x: c.s.x, y: c.s.y - 58 }, r: 220 });
    this.addScore(0, c.s.x, c.s.y - 110, "Point de reprise", false);
  }

  private die() {
    if (this.player.dead) return;
    const p = this.player;
    p.dead = true; p.body.enable = false;
    this.run.lives--; this.run.deaths++; this.run.combo = 1;
    Audio.play("death");
    this.events.emit("hud");
    p.play("p-hurt");
    this.tweens.add({ targets: p, angle: 540, alpha: 0, y: p.y - 60, duration: 700, ease: "Cubic.in" });
    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.time.delayedCall(800, () => {
      if (this.run.lives <= 0) { this.endRun(false); return; }
      p.respawn(this.respawn.x, this.respawn.y, this.time.now);
      this.cameras.main.fadeIn(400, 0, 0, 0);
      this.events.emit("hud");
    });
  }

  private complete() {
    if (this.finished) return;
    this.finished = true;
    Audio.play("portal");
    this.player.frozen = true;
    this.player.body.setVelocity(0, 0).setAllowGravity(false);
    this.tweens.add({ targets: this.player, x: this.exit!.x, y: this.exit!.y - 40, scale: 0.2, alpha: 0, angle: 360, duration: 900, ease: "Cubic.in" });
    this.time.delayedCall(1000, () => this.endRun(true));
  }

  private endRun(win: boolean) {
    const time = (this.time.now - this.run.startedAt) / 1000;
    let bonus = 0;
    if (win) {
      bonus = Math.max(0, Math.round((this.world.par - time) * SCORE.timeBonusPerSecondUnderPar)) + this.run.lives * 500;
      this.run.score += bonus;
    }
    this.scene.stop("HUD");
    this.scene.start("LevelEnd", { win, levelKey: this.level.key, world: this.world.name, time, bonus, run: { ...this.run } });
  }

  restartLevel() { this.scene.restart({ levelKey: this.level.key }); }
}
