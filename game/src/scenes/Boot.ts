import Phaser from "phaser";
import { generatePlayer, generateBeetle, generateWisp, generateBoss } from "../art/characters";
import { generateProps } from "../art/props";
import { generateBackground } from "../art/world";
import { WORLDS } from "../config/worlds";
import { FONT_DISPLAY } from "../constants";

/** Génère toutes les textures procédurales puis ouvre le menu. */
export class Boot extends Phaser.Scene {
  constructor() { super("Boot"); }
  create() {
    const t = this.add.text(640, 360, "Distribution des cartes…", { fontFamily: FONT_DISPLAY, fontSize: "32px", color: "#C6A05A" }).setOrigin(0.5);
    // laisse une frame s'afficher avant la génération
    this.time.delayedCall(30, async () => {
      try { await (document as any).fonts?.ready; } catch {}
      generateProps(this);
      generatePlayer(this);
      generateBeetle(this);
      generateWisp(this);
      generateBoss(this);
      // vignettes de menu pour les 5 mondes (1/4 de résolution)
      WORLDS.forEach((w) => generateBackground(this, w, 0.25, "-thumb"));
      t.destroy();
      const q = new URLSearchParams(location.search);
      if (q.get("level")) this.scene.start("Game", { levelKey: q.get("level") });
      else this.scene.start("Menu");
    });
  }
}
