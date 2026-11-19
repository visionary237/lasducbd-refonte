/**
 * Point d'entrée « bibliothèque » du moteur : createGame(parent, brand).
 * Le moteur ne connaît aucun site : il s'intègre via une iframe (recommandé, isolation totale)
 * ou par import direct dans une autre application.
 */
import Phaser from "phaser";
import { GAME_W, GAME_H } from "./constants";
import { setBrand, type BrandConfig } from "./brand";
import { Boot } from "./scenes/Boot";
import { Menu } from "./scenes/Menu";
import { Game } from "./scenes/Game";
import { HUD } from "./scenes/HUD";
import { Pause } from "./scenes/Pause";
import { LevelEnd } from "./scenes/LevelEnd";

export type { BrandConfig };

export function createGame(parent: string | HTMLElement, brandCfg: Partial<BrandConfig> = {}, opts: { canvas?: boolean; debug?: boolean } = {}) {
  setBrand(brandCfg);
  return new Phaser.Game({
    type: opts.canvas ? Phaser.CANVAS : Phaser.AUTO,
    parent,
    width: GAME_W,
    height: GAME_H,
    backgroundColor: "#070b09",
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: "arcade", arcade: { gravity: { x: 0, y: 1900 }, debug: !!opts.debug, tileBias: 32 } },
    render: { antialias: true, roundPixels: false, powerPreference: "high-performance" },
    input: { activePointers: 3 },
    fps: { target: 60, smoothStep: true },
    scene: [Boot, Menu, Game, HUD, Pause, LevelEnd],
  });
}
