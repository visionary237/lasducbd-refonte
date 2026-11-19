"use client";
import { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { SPACES } from "@/lib/content";
import SectionHeading from "./ui/SectionHeading";
import Notice from "./ui/Notice";
import { Rosette, SuitIcon } from "./Suits";

/** Présentation informative des maisons — onglets accessibles (flèches clavier). */
export default function Spaces() {
  const [i, setI] = useState(0);
  const base = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduce = useReducedMotion();
  const s = SPACES[i];

  function onKey(e: React.KeyboardEvent) {
    const k = e.key;
    let n = i;
    if (k === "ArrowDown" || k === "ArrowRight") n = (i + 1) % SPACES.length;
    else if (k === "ArrowUp" || k === "ArrowLeft") n = (i - 1 + SPACES.length) % SPACES.length;
    else if (k === "Home") n = 0;
    else if (k === "End") n = SPACES.length - 1;
    else return;
    e.preventDefault();
    setI(n);
    tabs.current[n]?.focus();
  }

  return (
    <section id="espaces" aria-labelledby="espaces-titre" className="relative bg-onyx-2 px-6 py-28 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="espaces-titre" eyebrow="Les maisons" title="Où pousser la porte ?" />
        <div className="mt-14 grid gap-10 lg:grid-cols-[320px_1fr]">
          <div role="tablist" aria-orientation="vertical" aria-label="Villes" onKeyDown={onKey} className="flex gap-2 overflow-x-auto lg:flex-col">
            {SPACES.map((sp, k) => (
              <button
                key={sp.city}
                ref={(el) => { tabs.current[k] = el; }}
                role="tab"
                id={`${base}-t${k}`}
                aria-selected={k === i}
                aria-controls={`${base}-p`}
                tabIndex={k === i ? 0 : -1}
                onClick={() => setI(k)}
                className={`group flex shrink-0 items-center gap-4 rounded-xl border px-5 py-4 text-left transition ${k === i ? "border-or bg-emeraude/40" : "border-ivoire/10 hover:border-or/50"}`}
              >
                <span className="t-display text-2xl text-or">{String(k + 1).padStart(2, "0")}</span>
                <span>
                  <span className="t-display block text-2xl">{sp.city}</span>
                  <span className="text-xs text-ivoire/60">{sp.region}</span>
                </span>
              </button>
            ))}
          </div>

          <div id={`${base}-p`} role="tabpanel" aria-labelledby={`${base}-t${i}`} tabIndex={0} className="deco-frame relative min-h-[26rem] overflow-hidden bg-emeraude">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.city}
                initial={reduce ? false : { opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={reduce ? undefined : { opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid h-full gap-8 p-8 md:grid-cols-2 md:p-12"
              >
                <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-xl bg-onyx md:aspect-auto">
                  <Rosette className="absolute h-[140%] w-[140%] text-or/15" />
                  <SuitIcon suit="club" className="relative h-20 w-20 text-or/70" />
                  <span className="absolute bottom-3 left-3 rounded bg-onyx/80 px-2 py-1 text-[0.65rem] uppercase tracking-widest text-ivoire/70">
                    Emplacement photo · voir inventaire
                  </span>
                </div>
                <div className="flex flex-col justify-center">
                  <p className="t-eyebrow !text-or-2">{s.mood}</p>
                  <h3 className="t-display mt-3 text-6xl">{s.city}</h3>
                  <p className="mt-5 leading-relaxed text-ivoire/80">{s.desc}</p>
                  <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-or/30 pt-6 text-sm">
                    <dt className="text-ivoire/60">Adresse</dt><dd>À intégrer depuis la source officielle</dd>
                    <dt className="text-ivoire/60">Horaires</dt><dd>À intégrer depuis la source officielle</dd>
                    <dt className="text-ivoire/60">Accueil</dt><dd>Réservé aux personnes majeures</dd>
                  </dl>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        <div className="mt-10 max-w-3xl">
          <Notice title="Contenu informatif">
            Les ambiances décrites sont des pistes d'aménagement proposées par DOERZ. Les villes reprennent la liste publiée sur le site actuel ;
            adresses et horaires seront branchés sur les données officielles de la maison.
          </Notice>
        </div>
      </div>
    </section>
  );
}
