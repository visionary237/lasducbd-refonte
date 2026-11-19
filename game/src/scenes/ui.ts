import Phaser from "phaser";
import { FONT_DISPLAY, FONT_UI } from "../constants";
import { Audio } from "../systems/Audio";

export const txt = (s: Phaser.Scene, x: number, y: number, str: string, size = 22, color = "#F3EBDD", display = false) =>
  s.add.text(x, y, str, { fontFamily: display ? FONT_DISPLAY : FONT_UI, fontSize: `${size}px`, color, align: "center" }).setOrigin(0.5);

/** Bouton « carte » cliquable + focus clavier géré par la scène. */
export function cardButton(s: Phaser.Scene, x: number, y: number, label: string, onClick: () => void, w = 280) {
  const c = s.add.container(x, y);
  const g = s.add.graphics();
  const draw = (hover: boolean) => {
    g.clear();
    g.fillStyle(hover ? 0x2c6447 : 0x214d36, 1).fillRoundedRect(-w / 2, -28, w, 56, 14);
    g.lineStyle(2, 0xc6a05a, hover ? 1 : 0.7).strokeRoundedRect(-w / 2, -28, w, 56, 14);
  };
  draw(false);
  const t = txt(s, 0, 0, label, 22, "#F3EBDD");
  c.add([g, t]);
  c.setSize(w, 56).setInteractive({ useHandCursor: true });
  c.on("pointerover", () => { draw(true); s.tweens.add({ targets: c, scale: 1.04, duration: 120 }); });
  c.on("pointerout", () => { draw(false); s.tweens.add({ targets: c, scale: 1, duration: 120 }); });
  c.on("pointerup", () => { Audio.play("ui"); onClick(); });
  (c as any).setFocus = (f: boolean) => { draw(f); c.setScale(f ? 1.04 : 1); };
  (c as any).activate = () => { Audio.play("ui"); onClick(); };
  return c;
}

/** Navigation clavier verticale entre boutons (↑ ↓ Entrée). */
export function keyboardMenu(s: Phaser.Scene, buttons: Phaser.GameObjects.Container[]) {
  let i = 0;
  const upd = () => buttons.forEach((b, k) => (b as any).setFocus(k === i));
  upd();
  const kb = s.input.keyboard!;
  kb.on("keydown-DOWN", () => { i = (i + 1) % buttons.length; upd(); Audio.play("ui"); });
  kb.on("keydown-UP", () => { i = (i - 1 + buttons.length) % buttons.length; upd(); Audio.play("ui"); });
  kb.on("keydown-ENTER", () => (buttons[i] as any).activate());
}
