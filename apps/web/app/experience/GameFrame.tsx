"use client";
import { useState } from "react";
import { Gentleman } from "@/components/Suits";

/**
 * Le jeu est un bundle indépendant (packages/lost-ace) servi depuis /experience/lost-ace/.
 * Isolation : iframe sandboxée, chargée seulement au clic (aucun coût pour le reste du site).
 */
export default function GameFrame() {
  const [play, setPlay] = useState(false);
  return (
    <div className="gold-frame relative aspect-video w-full overflow-hidden bg-charbon">
      {play ? (
        <iframe src="/experience/lost-ace/index.html?exit=/experience" title="Jeu THE LOST ACE" className="absolute inset-0 h-full w-full" allow="fullscreen; autoplay" sandbox="allow-scripts allow-same-origin allow-top-navigation-by-user-activation" />
      ) : (
        <button onClick={() => setPlay(true)} className="group absolute inset-0 flex items-center justify-center bg-gradient-to-br from-vert-2 via-vert to-charbon">
          <Gentleman className="absolute bottom-0 left-[12%] h-[85%] w-auto opacity-90" />
          <span className="relative ml-[20%] text-left">
            <span className="t-display block text-[clamp(2rem,6vw,5rem)]">Lancer la partie</span>
            <span className="mt-3 inline-flex items-center gap-3 rounded-full bg-or px-6 py-3 font-bold text-charbon transition group-hover:bg-or-2">▶ Jouer</span>
            <span className="mt-3 block text-xs text-ivoire/70">Le jeu (≈ 1,3 Mo) se charge au clic.</span>
          </span>
        </button>
      )}
    </div>
  );
}
