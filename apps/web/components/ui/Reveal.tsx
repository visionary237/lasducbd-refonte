"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Apparition des enfants directs au scroll (transform + opacity uniquement). */
export default function Reveal({ children, className = "", stagger = 0.08, as: Tag = "div" }: { children: React.ReactNode; className?: string; stagger?: number; as?: "div" | "ul" }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(ref.current!.children, { y: 40, opacity: 0, duration: 0.9, stagger, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } });
    });
  }, { scope: ref });
  return <Tag ref={ref as any} className={className}>{children}</Tag>;
}
