"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rosette, SuitIcon, Gentleman } from "./Suits";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reveal = () =>
          gsap.from(".hero-line > span", { yPercent: 110, duration: 1.2, stagger: 0.12, ease: "expo.out" });
        let started = false;
        const go = () => { if (!started) { started = true; reveal(); } };
        window.addEventListener("ace:intro-done", go, { once: true });
        // si l'intro a été passée/déjà vue
        const t = setTimeout(() => { if (!document.querySelector('[aria-label="Introduction animée"]')) go(); }, 60);

        // Parallaxe multicouche
        gsap.utils.toArray<HTMLElement>("[data-depth]").forEach((el) => {
          const d = parseFloat(el.dataset.depth || "0");
          gsap.to(el, { yPercent: d * 60, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        });
        gsap.to(".hero-rosette", { rotate: 90, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        return () => clearTimeout(t);
      });
    },
    { scope: root }
  );

  return (
    <section id="accueil" ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden px-6 pt-24 md:px-14">
      <div className="deco-rays absolute inset-0" data-depth="0.2" aria-hidden />
      <Rosette className="hero-rosette pointer-events-none absolute -right-40 top-1/2 h-[70vmin] w-[70vmin] -translate-y-1/2 text-or/15 md:right-[-8vmin]" />
      <SuitIcon suit="spade" className="pointer-events-none absolute -left-24 bottom-[-12vmin] h-[60vmin] w-[60vmin] text-emeraude/40" />
      <div className="absolute bottom-0 right-[6vw] hidden h-[62vh] md:block" data-depth="-0.35" aria-hidden>
        <Gentleman className="h-full w-auto drop-shadow-[0_20px_40px_rgba(0,0,0,.6)]" />
      </div>

      <div className="relative z-10 max-w-5xl" data-depth="0.5">
        <p className="t-eyebrow mb-3">Refonte conceptuelle · Identité digitale</p>
        <p className="mb-6 inline-block rounded-full border border-bordeaux/70 px-3 py-1 text-[0.68rem] text-ivoire/80 md:hidden">Concept non commandité · présentation privée</p>
        <h2 className="t-display text-[clamp(3.2rem,11vw,10rem)]">
          <span className="hero-line block overflow-hidden"><span className="block">La maison</span></span>
          <span className="hero-line block overflow-hidden"><span className="block gold-text italic">joue cartes</span></span>
          <span className="hero-line block overflow-hidden"><span className="block">sur table.</span></span>
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivoire/80">
          Une proposition d'univers pour L'As du CBD : l'élégance d'un salon de jeu Art déco, la clarté d'une maison qui conseille.
          Démonstration éditoriale, sans vente ni promotion.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#histoire" className="rounded-full bg-or px-7 py-3 font-semibold text-onyx transition hover:bg-or-2">Découvrir l'histoire</a>
          <a href="#direction" className="rounded-full border border-ivoire/30 px-7 py-3 transition hover:border-or">Direction artistique</a>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-center md:block text-xs tracking-[0.3em] text-ivoire/60" aria-hidden>
        DÉFILER
        <div className="mx-auto mt-2 h-10 w-px animate-pulse bg-or/60" />
      </div>
    </section>
  );
}
