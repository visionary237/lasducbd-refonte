import Phaser from "phaser";
import { GAME_W, GAME_H } from "../constants";
import { txt, cardButton, keyboardMenu } from "./ui";
import { Audio } from "../systems/Audio";
import { Storage } from "../systems/Storage";

export class Pause extends Phaser.Scene {
  constructor() { super("Pause"); }
  create() {
    this.add.rectangle(0, 0, GAME_W, GAME_H, 0x050807, 0.72).setOrigin(0);
    txt(this, GAME_W / 2, 180, "Pause", 72, "#F3EBDD", true);
    const resume = () => { this.scene.resume("Game"); this.scene.resume("HUD"); this.scene.stop(); };
    const b = [
      cardButton(this, GAME_W / 2, 320, "Reprendre", resume),
      cardButton(this, GAME_W / 2, 390, "Recommencer le niveau", () => { this.scene.stop(); (this.scene.get("Game") as any).restartLevel(); }),
      cardButton(this, GAME_W / 2, 460, `Son : ${Audio.enabled ? "activé" : "coupé"}`, () => { Audio.toggle(); this.scene.restart(); }),
      cardButton(this, GAME_W / 2, 530, `Effets lumineux : ${Storage.settings.reducedFx ? "réduits" : "complets"}`, () => { Storage.setSetting("reducedFx", !Storage.settings.reducedFx); this.scene.stop(); (this.scene.get("Game") as any).restartLevel(); }),
      cardButton(this, GAME_W / 2, 600, "Menu principal", () => { this.scene.stop("HUD"); this.scene.stop("Game"); this.scene.start("Menu"); }),
    ];
    keyboardMenu(this, b);
    this.input.keyboard!.on("keydown-P", resume);
    this.input.keyboard!.on("keydown-ESC", resume);
  }
}
