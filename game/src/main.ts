import Phaser from "phaser";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/700.css";
import { GAME_W, GAME_H } from "./constants";
import { Boot } from "./scenes/Boot";
import { Menu } from "./scenes/Menu";
import { Game } from "./scenes/Game";
import { HUD } from "./scenes/HUD";
import { Pause } from "./scenes/Pause";
import { LevelEnd } from "./scenes/LevelEnd";

const game = new Phaser.Game({
  type: new URLSearchParams(location.search).has("canvas") ? Phaser.CANVAS : Phaser.AUTO,
  parent: "game",
  width: GAME_W,
  height: GAME_H,
  backgroundColor: "#070b09",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  physics: { default: "arcade", arcade: { gravity: { x: 0, y: 1900 }, debug: new URLSearchParams(location.search).has("debug"), tileBias: 32 } },
  render: { antialias: true, roundPixels: false, powerPreference: "high-performance" },
  input: { activePointers: 3 },
  fps: { target: 60, smoothStep: true },
  scene: [Boot, Menu, Game, HUD, Pause, LevelEnd],
});
(window as any).__game = game; // accès pour les tests automatisés
