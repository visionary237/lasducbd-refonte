"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CHAPTERS } from "@/lib/content";
import { Rosette, SuitIcon } from "./Suits";
import SectionHeading from "./ui/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Story() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Desktop : défilement horizontal épinglé
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const el = track.current!;
        const dist = () => el.scrollWidth - window.innerWidth + 80;
        const tween = gsap.to(el, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: { trigger: ".story-pin", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.6, invalidateOnRefresh: true },
        });
        gsap.utils.toArray<HTMLElement>(".chapter").forEach((c) => {
          gsap.from(c.querySelectorAll(".chapter-reveal"), {
            y: 40, opacity: 0, stagger: 0.1, duration: 0.8,
            scrollTrigger: { trigger: c, containerAnimation: tween, start: "left 75%" },
          });
        });
      });
      // Mobile : révélations verticales
      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".chapter").forEach((c) =>
          gsap.from(c, { y: 50, opacity: 0, duration: 0.9, scrollTrigger: { trigger: c, start: "top 85%" } })
        );
      });
    },
    { scope: root }
  );

  return (
    <section id="histoire" ref={root} aria-labelledby="histoire-titre" className="relative bg-emeraude/30">
      <div className="story-pin overflow-hidden lg:flex lg:h-screen lg:items-center motion-reduce:lg:h-auto">
        <div ref={track} className="flex flex-col gap-8 px-6 py-24 lg:flex-row lg:items-stretch lg:gap-10 lg:px-14 lg:py-0 motion-reduce:lg:flex-wrap motion-reduce:lg:py-28">
          <div className="lg:w-[34vw] lg:shrink-0 lg:self-center motion-reduce:lg:w-full">
            <SectionHeading id="histoire-titre" eyebrow="L'histoire" title="Qu'est-ce qui fait une maison ?" />
            <p className="mt-6 max-w-md text-ivoire/75">
              Un récit de marque proposé en quatre chapitres. Il donne une colonne vertébrale à toutes les prises de parole.
            </p>
            <p className="mt-4 text-xs text-ivoire/60">Récit de travail DOERZ, à valider avec les fondateurs.</p>
          </div>
          {CHAPTERS.map((c, i) => (
            <article
              key={c.n}
              className="chapter deco-frame relative flex min-h-[26rem] flex-col justify-between overflow-hidden bg-onyx p-8 lg:h-[70vh] lg:w-[30vw] lg:shrink-0 motion-reduce:lg:h-auto motion-reduce:lg:min-h-[30rem] motion-reduce:lg:w-[calc(50%-1.25rem)]"
            >
              <div className="chapter-reveal flex items-start justify-between">
                <span className="t-display text-7xl text-or">{c.n}</span>
                <SuitIcon suit={(["spade", "heart", "diamond", "club"] as const)[i]} className="h-8 w-8 text-bordeaux" />
              </div>
              <div className="chapter-reveal relative mx-auto my-6 flex h-28 w-28 items-center justify-center" aria-hidden>
                <Rosette className="absolute inset-0 h-full w-full text-or/25" />
                <SuitIcon suit={(["spade", "heart", "diamond", "club"] as const)[i]} className="relative h-10 w-10 text-or/70" />
              </div>
              <div>
                <h3 className="chapter-reveal t-display text-4xl text-ivoire">{c.title}</h3>
                <p className="chapter-reveal mt-4 leading-relaxed text-ivoire/75">{c.body}</p>
              </div>
              <span data-numeral={c.n} className="numeral t-display pointer-events-none absolute -bottom-10 -right-4 text-[12rem] leading-none text-ivoire/[0.03]" aria-hidden />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
