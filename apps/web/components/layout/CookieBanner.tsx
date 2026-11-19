"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_KEY, makeConsent, parseConsent, type ConsentState } from "@/lib/consent";

/** Bandeau de consentement : refus aussi simple que l'acceptation, aucun traceur par défaut. */
export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const [audience, setAudience] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    let c: ConsentState | null = null;
    try { c = parseConsent(localStorage.getItem(CONSENT_KEY)); } catch {}
    if (!c) setOpen(true); else { setAudience(c.choices.audience); setMarketing(c.choices.marketing); }
    const re = () => { setOpen(true); setCustom(true); };
    window.addEventListener("ladc:open-consent", re);
    return () => window.removeEventListener("ladc:open-consent", re);
  }, []);

  const save = (a: boolean, m: boolean) => {
    const c = makeConsent({ audience: a, marketing: m });
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch {}
    window.dispatchEvent(new CustomEvent("ladc:consent", { detail: c })); // les scripts tiers écoutent cet événement
    setOpen(false); setCustom(false);
  };
  if (!open) return null;
  return (
    <section aria-label="Gestion des cookies" className="fixed inset-x-3 bottom-3 z-[120] mx-auto max-w-3xl rounded-2xl border border-or/30 bg-charbon-2/97 p-5 shadow-2xl backdrop-blur md:p-6">
      <p className="text-sm leading-relaxed text-ivoire/85">
        Nous utilisons uniquement des cookies nécessaires au fonctionnement du site. Avec votre accord, nous pourrions mesurer l'audience et personnaliser nos communications.{" "}
        <Link href="/confidentialite" className="text-or-2 underline">En savoir plus</Link>
      </p>
      {custom && (
        <fieldset className="mt-4 space-y-3 text-sm">
          <legend className="sr-only">Finalités</legend>
          <label className="flex items-center gap-3 text-ivoire/70"><input type="checkbox" checked disabled className="h-4 w-4 accent-[#C5A059]" /> Nécessaires (toujours actifs)</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={audience} onChange={(e) => setAudience(e.target.checked)} className="h-4 w-4 accent-[#C5A059]" /> Mesure d'audience</label>
          <label className="flex items-center gap-3"><input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="h-4 w-4 accent-[#C5A059]" /> Personnalisation & communication</label>
        </fieldset>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => save(false, false)} className="min-h-11 flex-1 rounded-full border border-ivoire/40 px-5 text-sm font-bold hover:border-or">Tout refuser</button>
        {custom
          ? <button onClick={() => save(audience, marketing)} className="min-h-11 flex-1 rounded-full border border-ivoire/40 px-5 text-sm font-bold hover:border-or">Enregistrer mes choix</button>
          : <button onClick={() => setCustom(true)} className="min-h-11 flex-1 rounded-full border border-ivoire/40 px-5 text-sm font-bold hover:border-or">Personnaliser</button>}
        <button onClick={() => save(true, true)} className="min-h-11 flex-1 rounded-full border border-ivoire/40 px-5 text-sm font-bold hover:border-or">Tout accepter</button>
      </div>
    </section>
  );
}
