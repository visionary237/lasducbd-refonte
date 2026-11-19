"use client";
import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SPADE_PATH } from "./Suits";

gsap.registerPlugin(useGSAP);

const TITLE = "L'AS DU CBD";
const SUITS = ["♠", "♥", "♦", "♣", "♠"];

/**
 * Introduction cinématographique : tracé du pique → remplissage or → distribution des cartes
 * → révélation typographique → rideau. Passable (bouton / Échap), ignorée si reduced-motion,
 * jouée une seule fois par session.
 */
export default function Intro() {
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      let seen = false;
      try { seen = sessionStorage.getItem("ace-intro") === "1"; } catch {}
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (seen || reduce || new URLSearchParams(location.search).has("nointro")) {
        setDone(true);
        return;
      }
      document.documentElement.style.overflow = "hidden";
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: () => finish(),
      });
      tl.set(".intro-stroke", { strokeDasharray: 420, strokeDashoffset: 420 })
        .to(".intro-stroke", { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" })
        .to(".intro-fill", { opacity: 1, duration: 0.6 }, "-=0.3")
        .from(".intro-card", { y: 140, rotate: 0, opacity: 0, stagger: 0.08, duration: 0.9, ease: "back.out(1.4)" }, "-=0.2")
        .to(".intro-card", { rotate: (i) => (i - 2) * 11, x: (i) => (i - 2) * 46, duration: 0.8, ease: "power2.out" }, "<0.3")
        .from(".intro-letter", { yPercent: 120, opacity: 0, stagger: 0.045, duration: 0.8 }, "-=0.4")
        .from(".intro-sub", { opacity: 0, y: 10, duration: 0.6 }, "-=0.3")
        .to({}, { duration: 0.7 })
        .to(".intro-curtain-top", { yPercent: -100, duration: 1.1, ease: "expo.inOut" })
        .to(".intro-curtain-bottom", { yPercent: 100, duration: 1.1, ease: "expo.inOut" }, "<")
        .to(".intro-stage", { opacity: 0, scale: 1.08, duration: 0.8 }, "<");

      // Mode capture portfolio : ?introAt=0.55 fige l'intro à 55 %
      const at = new URLSearchParams(location.search).get("introAt");
      if (at) { tl.progress(parseFloat(at)).pause(); }

      const onKey = (e: KeyboardEvent) => e.key === "Escape" && tl.progress(1);
      window.addEventListener("keydown", onKey);
      (root.current as any).__skip = () => tl.progress(1);
      return () => window.removeEventListener("keydown", onKey);
    },
    { scope: root }
  );

  function finish() {
    try { sessionStorage.setItem("ace-intro", "1"); } catch {}
    document.documentElement.style.overflow = "";
    setDone(true);
    window.dispatchEvent(new Event("ace:intro-done"));
  }

  if (done) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90]" role="dialog" aria-label="Introduction animée" aria-modal="true">
      <div className="intro-curtain-top absolute inset-x-0 top-0 h-1/2 bg-onyx" />
      <div className="intro-curtain-bottom absolute inset-x-0 bottom-0 h-1/2 bg-onyx" />
      <div className="intro-stage deco-rays absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative mb-10 h-48 w-48">
          {SUITS.map((s, i) => (
            <div
              key={i}
              className="intro-card deco-frame absolute left-1/2 top-1/2 -ml-14 -mt-20 flex h-40 w-28 items-center justify-center bg-emeraude text-3xl text-or shadow-2xl"
              style={{ transformOrigin: "50% 120%" }}
              aria-hidden
            >
              {s}
            </div>
          ))}
          <svg viewBox="0 0 100 110" className="absolute left-1/2 top-1/2 z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_10px_30px_rgba(0,0,0,.6)]" aria-hidden>
            <path className="intro-fill" d={SPADE_PATH} fill="#C6A05A" opacity="0" />
            <path className="intro-stroke" d={SPADE_PATH} fill="none" stroke="#E8CF9B" strokeWidth="1.2" />
          </svg>
        </div>
        <h1 className="t-caps flex overflow-hidden text-4xl text-ivoire md:text-6xl" aria-label={TITLE}>
          {TITLE.split("").map((c, i) => (
            <span key={i} className="intro-letter inline-block" aria-hidden>
              {c === " " ? " " : c}
            </span>
          ))}
        </h1>
        <p className="intro-sub t-eyebrow mt-6">Concept indépendant · DOERZ</p>
      </div>
      <button
        onClick={() => (root.current as any)?.__skip?.()}
        className="absolute bottom-6 right-6 z-20 rounded-full border border-or/50 px-5 py-2 text-sm text-ivoire/80 transition hover:bg-or hover:text-onyx"
      >
        Passer l'introduction
      </button>
    </div>
  );
}
