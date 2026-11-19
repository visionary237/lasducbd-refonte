"use client";
import { useEffect, useRef, useState } from "react";
import { SuitIcon } from "../Suits";

const KEY = "ladc_age_ok";
/**
 * Contrôle d'âge déclaratif (18+). Le contenu reste dans le DOM pour le référencement ;
 * l'écran bloque l'interaction jusqu'à la réponse. Choix mémorisé 30 jours.
 * La vérification réelle se fait en boutique (pièce d'identité) — cf. docs/COMPLIANCE.md.
 */
export default function AgeGate() {
  const [show, setShow] = useState(false);
  const [denied, setDenied] = useState(false);
  const ok = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let v: string | null = null;
    try { v = localStorage.getItem(KEY); } catch {}
    const fresh = v && Date.now() - Number(v) < 30 * 86400000;
    if (!fresh && !navigator.webdriver) setShow(true);
    if (!fresh && new URLSearchParams(location.search).has("agegate")) setShow(true); // tests e2e
  }, []);
  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    ok.current?.focus();
    return () => { document.documentElement.style.overflow = ""; };
  }, [show]);

  if (!show) return null;
  const accept = () => { try { localStorage.setItem(KEY, String(Date.now())); } catch {} setShow(false); };
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="age-title" className="fixed inset-0 z-[150] flex items-center justify-center bg-charbon/95 p-6 backdrop-blur-xl">
      <div className="gold-frame texture-grain w-full max-w-md bg-vert p-8 text-center md:p-10">
        <SuitIcon suit="spade" className="mx-auto h-12 w-12 text-or" />
        {!denied ? (
          <>
            <h2 id="age-title" className="t-display mt-6 text-4xl">Avez-vous 18 ans ou plus ?</h2>
            <p className="mt-4 text-sm leading-relaxed text-ivoire/80">Ce site présente des produits à base de chanvre dont la vente est réservée aux personnes majeures.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button ref={ok} onClick={accept} className="min-h-12 rounded-full bg-or px-5 font-bold text-charbon hover:bg-or-2">Oui, j'ai 18 ans ou plus</button>
              <button onClick={() => setDenied(true)} className="min-h-12 rounded-full border border-ivoire/30 px-5 font-bold hover:border-or">Non</button>
            </div>
          </>
        ) : (
          <>
            <h2 id="age-title" className="t-display mt-6 text-4xl">Accès réservé</h2>
            <p className="mt-4 text-sm leading-relaxed text-ivoire/80">Ce site est réservé aux personnes majeures. Merci de votre compréhension.</p>
          </>
        )}
      </div>
    </div>
  );
}
