"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { GALLERY } from "@/lib/content";
import SectionHeading from "./ui/SectionHeading";
import FlipCard from "./ui/FlipCard";
import { CardFace } from "./ui/PlayingCard";
import { SuitIcon } from "./Suits";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // distribution des cartes à l'entrée dans le viewport
      gsap.from(".g-card", {
        y: 120, rotate: (i) => (i % 2 ? 8 : -8), opacity: 0, duration: 1, stagger: 0.07, ease: "back.out(1.2)",
        scrollTrigger: { trigger: ".g-grid", start: "top 80%" },
      });
    });
  }, { scope: root });

  return (
    <section id="galerie" ref={root} aria-labelledby="galerie-titre" className="relative px-6 py-28 md:px-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <SectionHeading id="galerie-titre" eyebrow="La galerie" title="Un jeu de huit cartes graphiques" />
          <p className="text-ivoire/75 md:pb-3">
            Chaque carte est un élément du système visuel. Retournez-la (survol, clic ou clavier) pour lire son rôle.
          </p>
        </div>
        <ul className="g-grid mt-16 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {GALLERY.map((c, i) => (
            <li key={c.title} className="g-card">
              <FlipCard
                label={`${c.title}, motif ${c.motif}`}
                front={<CardFace rank={c.rank} suit={c.suit} title={c.title} tone={i % 3 === 1 ? "onyx" : i % 3 === 2 ? "ivoire" : "emeraude"} />}
                back={
                  <div className="deco-frame flex h-full flex-col justify-between bg-onyx p-5">
                    <span className="t-eyebrow">{c.motif}</span>
                    <div>
                      <SuitIcon suit={c.suit} className="mb-3 h-6 w-6 text-bordeaux" />
                      <p className="t-display text-2xl text-ivoire">{c.title}</p>
                      <p className="mt-2 text-sm leading-relaxed text-ivoire/75">{c.text}</p>
                    </div>
                  </div>
                }
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
