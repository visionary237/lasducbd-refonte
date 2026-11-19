"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SECTIONS } from "@/lib/content";
import { SuitIcon } from "./Suits";

/**
 * Navigation immersive :
 *  - En-tête minimal (marque + bouton « Le jeu »)
 *  - Menu plein écran : chaque rubrique est une carte distribuée en éventail
 *  - Rail latéral : une enseigne par section, active selon le scroll
 */
export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const f = () => setWide(mq.matches);
    f(); mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open]);

  function close() { setOpen(false); btnRef.current?.focus(); }

  const n = SECTIONS.length;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:px-10">
        <a href="#accueil" className="flex items-center gap-3 text-ivoire" aria-label="L'As du CBD, retour à l'ouverture">
          <SuitIcon suit="spade" className="h-7 w-7 text-or" />
          <span className="t-caps hidden text-sm sm:inline">L'As du CBD</span>
        </a>
        <span className="hidden rounded-full border border-bordeaux/70 bg-onyx/70 px-3 py-1 text-[0.68rem] tracking-wide text-ivoire/80 backdrop-blur md:inline">
          Concept non commandité · présentation privée
        </span>
        <button
          ref={btnRef}
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="menu-jeu"
          className="group flex items-center gap-3 rounded-full border border-or/50 bg-onyx/60 py-2 pl-4 pr-2 text-sm backdrop-blur transition hover:border-or"
        >
          Le jeu
          <span className="flex h-8 w-6 items-center justify-center rounded-[4px] border border-or/60 bg-emeraude text-or transition group-hover:-rotate-6" aria-hidden>
            ♠
          </span>
        </button>
      </header>

      {/* Rail des enseignes */}
      <nav aria-label="Progression dans la page" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-current={active === s.id ? "true" : undefined}
            className="group flex items-center justify-end gap-3"
          >
            <span className="pointer-events-none translate-x-2 text-xs text-ivoire/0 transition group-hover:translate-x-0 group-hover:text-ivoire/80 group-focus-visible:text-ivoire/80">
              {s.label}
            </span>
            <SuitIcon suit={s.suit} className={`h-4 w-4 transition ${active === s.id ? "scale-125 text-or" : "text-ivoire/25"}`} />
          </a>
        ))}
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-jeu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="deco-rays fixed inset-0 z-[70] flex flex-col bg-onyx/97 backdrop-blur-md"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: reduce ? 0 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-end p-5 md:p-10">
              <button onClick={close} className="rounded-full border border-or/50 px-5 py-2 text-sm hover:bg-or hover:text-onyx">
                Fermer <span aria-hidden>✕</span>
              </button>
            </div>
            <ul className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-3 content-center gap-3 px-5 sm:gap-4 lg:flex lg:items-center lg:justify-center lg:gap-0">
              {SECTIONS.map((s, i) => {
                const mid = (n - 1) / 2;
                return (
                  <motion.li
                    key={s.id}
                    initial={{ y: 200, opacity: 0, rotate: 0 }}
                    animate={{ y: 0, opacity: 1, rotate: reduce ? 0 : (i - mid) * (wide ? 5 : 1.5) }}
                    exit={{ y: 120, opacity: 0 }}
                    transition={{ delay: reduce ? 0 : 0.15 + i * 0.06, type: "spring", stiffness: 140, damping: 18 }}
                    className="lg:-mx-3"
                    style={{ transformOrigin: "50% 140%" }}
                  >
                    <a
                      href={`#${s.id}`}
                      onClick={close}
                      className="deco-frame group relative flex aspect-[5/7] w-full flex-col justify-between bg-emeraude p-3 sm:p-4 shadow-2xl transition duration-500 hover:-translate-y-6 hover:bg-emeraude-2 focus-visible:-translate-y-6 lg:w-44"
                    >
                      <span className="flex flex-col items-start leading-none text-or">
                        <span className="t-display text-2xl">{s.rank}</span>
                        <SuitIcon suit={s.suit} className="mt-1 h-3 w-3" />
                      </span>
                      <SuitIcon suit={s.suit} className="mx-auto h-7 w-7 sm:h-10 sm:w-10 text-or/90 transition duration-500 group-hover:scale-110" />
                      <span className="t-display text-base leading-tight text-ivoire sm:text-xl">{s.label}</span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
            <p className="p-6 text-center text-xs text-ivoire/60">Échap pour fermer · Démonstration éditoriale sans vente en ligne</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
