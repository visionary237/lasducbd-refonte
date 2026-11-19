"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Titre de section, révélation mot à mot (désactivée en reduced-motion). */
export default function SectionHeading({ id, eyebrow, title, intro, align = "left", as = "h2" }: { id?: string; eyebrow?: string; title: string; intro?: string; align?: "left" | "center"; as?: "h1" | "h2" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current!.querySelectorAll(".w > span"), { yPercent: 105, duration: 1, stagger: 0.05, ease: "expo.out", scrollTrigger: { trigger: ref.current, start: "top 88%" } });
    });
  }, { scope: ref });
  const H = as;
  return (
    <div ref={ref} className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <p className="t-eyebrow mb-4">{eyebrow}</p>}
      <H id={id} className="t-display text-[clamp(2.3rem,5.2vw,4.6rem)]">
        {title.split(" ").map((w, i) => (
          <span key={i} className="w mr-[0.22em] inline-block overflow-hidden pb-[0.1em] align-bottom"><span className="inline-block">{w}</span></span>
        ))}
      </H>
      {intro && <p className="mt-6 text-lg leading-relaxed text-ivoire/75">{intro}</p>}
    </div>
  );
}
