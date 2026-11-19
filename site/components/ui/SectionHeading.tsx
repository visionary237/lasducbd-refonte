"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Titre de section avec révélation typographique mot par mot. */
export default function SectionHeading({ id, eyebrow, title, align = "left" }: { id?: string; eyebrow: string; title: string; align?: "left" | "center" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current!.querySelectorAll(".w > span"), {
        yPercent: 105, rotate: 4, duration: 1, stagger: 0.06, ease: "expo.out",
        scrollTrigger: { trigger: ref.current, start: "top 85%" },
      });
    });
  }, { scope: ref });
  return (
    <div ref={ref} className={align === "center" ? "text-center" : ""}>
      <p className="t-eyebrow mb-4">{eyebrow}</p>
      <h2 id={id} className="t-display text-[clamp(2.4rem,5.5vw,4.8rem)]">
        {title.split(" ").map((w, i) => (
          <span key={i} className="w mr-[0.22em] inline-block overflow-hidden pb-[0.08em] align-bottom"><span className="inline-block">{w}</span></span>
        ))}
      </h2>
    </div>
  );
}
