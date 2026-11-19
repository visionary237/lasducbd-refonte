import { Storage } from "./Storage";

/**
 * Effets sonores synthétisés en WebAudio (aucun fichier audio requis pour le prototype).
 * Remplaçables par des fichiers .ogg/.mp3 (voir docs/ASSETS.md §Audio) via scene.sound.
 * Désactivables (touche M / bouton), réglage persistant.
 */
type Sfx = "jump" | "double" | "crystal" | "card" | "stomp" | "hurt" | "checkpoint" | "heart" | "death" | "portal" | "boss-hit" | "slam" | "throw" | "ui";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  get enabled() { return Storage.settings.sound; }
  toggle() { Storage.setSetting("sound", !this.enabled); return this.enabled; }

  private ensure() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.master = this.ctx.createGain(); this.master.gain.value = 0.35; this.master.connect(this.ctx.destination);
      } catch { return null; }
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  private tone(freq: number, dur: number, type: OscillatorType, slide = 0, vol = 1, delay = 0) {
    const ctx = this.ensure(); if (!ctx || !this.master) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5 * vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.master); o.start(t); o.stop(t + dur + 0.02);
  }
  private noise(dur: number, vol = 0.6, lp = 1200) {
    const ctx = this.ensure(); if (!ctx || !this.master) return;
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const s = ctx.createBufferSource(); s.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = lp;
    const g = ctx.createGain(); g.gain.value = vol;
    s.connect(f).connect(g).connect(this.master); s.start();
  }

  play(name: Sfx, pitch = 1) {
    if (!this.enabled) return;
    switch (name) {
      case "jump": this.tone(320 * pitch, 0.14, "square", 1.8, 0.35); break;
      case "double": this.tone(480, 0.12, "triangle", 1.9, 0.5); this.tone(720, 0.12, "triangle", 1.5, 0.3, 0.05); break;
      case "crystal": this.tone(1320 * pitch, 0.09, "sine", 1, 0.5); this.tone(1980 * pitch, 0.12, "sine", 1, 0.35, 0.05); break;
      case "card": [660, 880, 1100, 1320].forEach((f, i) => this.tone(f, 0.18, "triangle", 1, 0.45, i * 0.07)); break;
      case "stomp": this.tone(200, 0.12, "square", 0.4, 0.5); this.noise(0.08, 0.3, 800); break;
      case "hurt": this.tone(300, 0.25, "sawtooth", 0.35, 0.45); break;
      case "death": this.tone(440, 0.6, "triangle", 0.25, 0.5); break;
      case "checkpoint": [523, 659, 784].forEach((f, i) => this.tone(f, 0.2, "sine", 1, 0.45, i * 0.08)); break;
      case "heart": this.tone(600, 0.15, "sine", 1.5, 0.5); break;
      case "portal": [392, 523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.35, "triangle", 1, 0.4, i * 0.09)); break;
      case "boss-hit": this.tone(140, 0.3, "sawtooth", 0.5, 0.6); this.noise(0.2, 0.4, 600); break;
      case "slam": this.noise(0.35, 0.8, 300); this.tone(70, 0.3, "sine", 0.5, 0.7); break;
      case "throw": this.tone(900, 0.08, "square", 0.6, 0.25); break;
      case "ui": this.tone(880, 0.05, "sine", 1, 0.3); break;
    }
  }
}
export const Audio = new AudioEngine();
