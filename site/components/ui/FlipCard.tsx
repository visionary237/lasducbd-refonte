"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

/**
 * Carte à retournement 3D. Accessible : bouton (aria-pressed), Entrée/Espace,
 * survol desktop, contenu du verso toujours dans le DOM (lisible par lecteurs d'écran).
 */
export default function FlipCard({ front, back, label }: { front: React.ReactNode; back: React.ReactNode; label: string }) {
  const [pinned, setPinned] = useState(false);
  const [hover, setHover] = useState(false);
  const flipped = pinned || hover;
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      aria-pressed={pinned}
      aria-label={`${label} — ${flipped ? "masquer" : "révéler"} la description`}
      onClick={() => setPinned((f) => !f)}
      onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setHover(true)}
      onMouseLeave={() => window.matchMedia("(hover: hover)").matches && setHover(false)}
      className="card-3d block aspect-[5/7] w-full rounded-[18px] text-left"
    >
      <motion.div
        className="card-3d__inner"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
      >
        <div className="card-3d__face shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)]">{front}</div>
        <div className="card-3d__face card-3d__back">{back}</div>
      </motion.div>
    </button>
  );
}
