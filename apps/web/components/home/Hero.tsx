"use client";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { STORES } from "@/lib/stores";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Hero immersif : photographie macro plein cadre, titre éditorial révélé, parallaxe douce. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-line > span", { yPercent: 110, duration: 1.3, stagger: 0.12, ease: "expo.out", delay: 0.1 });
      gsap.from(".hero-fade", { opacity: 0, y: 16, duration: 1, stagger: 0.1, delay: 0.6 });
      gsap.fromTo(".hero-media", { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "power2.out" });
      gsap.to(".hero-media", { yPercent: 12, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
      gsap.to(".hero-copy", { yPercent: -20, opacity: 0.2, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
    });
  }, { scope: root });

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28 md:items-center md:pb-0">
      <div className="hero-media absolute inset-0">
        {/* Visuel provisoire (moodboard fourni) — à remplacer par le shooting macro, cf. docs/ASSETS.md */}
        <img src="/visuel-moodboard-hero.jpg" alt="" className="h-full w-full object-cover object-[70%_50%]" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-r from-charbon via-charbon/80 to-charbon/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-charbon via-transparent to-charbon/40" />
      </div>
      <div className="hero-copy relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <p className="hero-fade t-eyebrow mb-6">Boutiques CBD · {STORES.map((s) => s.city).join(" · ")}</p>
        <h1 className="t-display max-w-4xl text-[clamp(3rem,9vw,8.5rem)]">
          <span className="hero-line block overflow-hidden pb-[0.06em]"><span className="block">Le chanvre,</span></span>
          <span className="hero-line block overflow-hidden pb-[0.06em]"><span className="block italic text-or-2">version</span></span>
          <span className="hero-line block overflow-hidden pb-[0.06em]"><span className="block">haute couture.</span></span>
        </h1>
        <p className="hero-fade mt-8 max-w-xl text-lg leading-relaxed text-ivoire/85">
          Fleurs, résines, accessoires et cosmétiques sélectionnés. Commande en ligne livrée sous 48 h, ou retrait gratuit dans nos boutiques.
        </p>
        <div className="hero-fade mt-10 flex flex-wrap gap-3">
          <Link href="/produits" className="inline-flex min-h-12 items-center rounded-full bg-or px-7 font-bold text-charbon transition hover:bg-or-2">Acheter en ligne</Link>
          <Link href="/boutiques" className="inline-flex min-h-12 items-center rounded-full border border-ivoire/40 px-7 font-bold transition hover:border-or hover:text-or-2">Trouver une boutique</Link>
        </div>
      </div>
    </section>
  );
}
