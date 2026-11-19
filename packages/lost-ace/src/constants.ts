/** Dimensions logiques du jeu (mise à l'échelle FIT par Phaser). */
export const GAME_W = 1280;
export const GAME_H = 720;
export const TILE = 48;

/** Physique du personnage — réglée pour 3 tuiles de saut simple, ~5 avec double saut. */
export const PHYS = {
  gravity: 1900,
  runSpeed: 320,
  accelGround: 2600,
  accelAir: 1700,
  dragGround: 3000,
  jumpVelocity: 760,
  doubleJumpVelocity: 640,
  jumpCutMultiplier: 0.45, // relâcher le saut tôt = saut plus court
  coyoteMs: 110,
  jumpBufferMs: 130,
  maxFall: 1100,
  stompBounce: 560,
  invulnMs: 1400,
};

export const SCORE = {
  crystal: 100,
  stomp: 250,
  card: 1000,
  heart: 50,
  comboWindowMs: 2400,
  comboMax: 8,
  timeBonusPerSecondUnderPar: 20,
};

export const PALETTE = {
  onyx: 0x101714,
  emeraude: 0x214d36,
  or: 0xc6a05a,
  ivoire: 0xf3ebdd,
  bordeaux: 0x832e3e,
};

export const FONT_DISPLAY = '"Cormorant Garamond", Georgia, serif';
export const FONT_UI = '"Manrope", system-ui, sans-serif';
