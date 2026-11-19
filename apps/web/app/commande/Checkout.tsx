"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Field } from "@/components/forms/Field";
import { euros } from "@/lib/catalog";
import { shipping, subtotal } from "@/lib/cart";
import { STORES } from "@/lib/stores";

export default function Checkout() {
  const { lines, priced, mode, setMode, clear } = useCart();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [msg, setMsg] = useState("");
  const sub = subtotal(priced), ship = shipping(priced, mode);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = { ...Object.fromEntries(new FormData(form).entries()), lines, mode };
    setState("sending");
    try {
      const r = await fetch("/api/order", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      clear();
      router.push(`/commande/merci?ref=${encodeURIComponent(j.ref)}&mode=${j.mode}&total=${j.totals.total}`);
    } catch (err) { setState("error"); setMsg(err instanceof Error ? err.message : "Erreur"); }
  }

  if (!priced.length) return (
    <section className="mx-auto max-w-3xl px-5 pb-20 pt-36 text-center"><h1 className="t-display text-5xl">Votre panier est vide.</h1><Link href="/produits" className="mt-8 inline-flex rounded-full bg-or px-7 py-3 font-bold text-charbon">Parcourir la boutique</Link></section>
  );
  return (
    <section className="mx-auto max-w-6xl px-5 pb-20 pt-28 md:px-8 md:pt-36">
      <ol className="mb-8 flex gap-3 text-xs uppercase tracking-widest text-ivoire/60" aria-label="Étapes"><li>1. Panier</li><li aria-current="step" className="text-or-2">2. Coordonnées</li><li>3. Confirmation</li></ol>
      <h1 className="t-display text-6xl">Commande</h1>
      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-8">
          <fieldset className="space-y-3"><legend className="t-label mb-3 text-or-2">Mode de réception</legend>
            {(["pickup", "delivery"] as const).map((m) => (
              <label key={m} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${mode === m ? "border-or bg-or/5" : "border-ivoire/15"}`}>
                <input type="radio" name="mode-ui" checked={mode === m} onChange={() => setMode(m)} className="mt-1 accent-[#C5A059]" />
                <span><strong className="block">{m === "pickup" ? "Retrait en boutique" : "Livraison à domicile"}</strong><span className="text-sm text-ivoire/70">{m === "pickup" ? "Gratuit · paiement et contrôle d'âge sur place" : "Sous 48 h, enveloppe neutre"}</span></span>
              </label>
            ))}
          </fieldset>
          <fieldset className="space-y-5"><legend className="t-label mb-3 text-or-2">Vos coordonnées</legend>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="Prénom" name="firstName" required autoComplete="given-name" /><Field label="Nom" name="lastName" required autoComplete="family-name" /></div>
            <div className="grid gap-5 sm:grid-cols-2"><Field label="E-mail" name="email" type="email" required autoComplete="email" /><Field label="Téléphone" name="phone" type="tel" autoComplete="tel" /></div>
          </fieldset>
          {mode === "pickup" ? (
            <div><label htmlFor="f-store" className="text-sm font-semibold">Boutique de retrait<span aria-hidden className="text-or"> *</span></label>
              <select id="f-store" name="store" required className="mt-2 w-full rounded-xl border border-ivoire/20 bg-charbon px-4 py-3">{STORES.map((s) => <option key={s.slug} value={s.slug}>{s.city}</option>)}</select></div>
          ) : (
            <fieldset className="space-y-5"><legend className="t-label mb-3 text-or-2">Adresse de livraison</legend>
              <Field label="Adresse" name="address" required autoComplete="street-address" />
              <div className="grid gap-5 sm:grid-cols-[1fr_2fr]"><Field label="Code postal" name="postalCode" required autoComplete="postal-code" /><Field label="Ville" name="city" required autoComplete="address-level2" /></div>
            </fieldset>
          )}
          <div className="space-y-3 text-sm">
            <label className="flex items-start gap-3"><input type="checkbox" name="adult" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" /> Je certifie avoir 18 ans ou plus. Une pièce d'identité pourra être demandée.</label>
            <label className="flex items-start gap-3"><input type="checkbox" name="consent" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" /> J'accepte que mes données soient utilisées pour traiter ma commande (<a href="/confidentialite" className="text-or-2 underline">confidentialité</a>).</label>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
          </div>
        </div>
        <aside className="gold-frame h-fit space-y-4 bg-charbon-2 p-6">
          <h2 className="t-display text-3xl">Récapitulatif</h2>
          <ul className="space-y-2 text-sm">{priced.map((l) => <li key={l.key} className="flex justify-between gap-4"><span>{l.qty} × {l.name}{l.variant ? ` (${l.variant})` : ""}</span><span>{euros(l.unitCents * l.qty)}</span></li>)}</ul>
          <dl className="space-y-2 border-t border-ivoire/10 pt-3 text-sm">
            <div className="flex justify-between"><dt className="text-ivoire/70">Sous-total</dt><dd>{euros(sub)}</dd></div>
            <div className="flex justify-between"><dt className="text-ivoire/70">{ship.label}</dt><dd>{ship.cents == null ? "à confirmer" : euros(ship.cents)}</dd></div>
            <div className="flex justify-between text-lg font-bold"><dt>Total</dt><dd>{euros(sub + (ship.cents ?? 0))}</dd></div>
          </dl>
          <p className="rounded-xl border border-or/40 bg-or/10 p-3 text-xs leading-relaxed">{mode === "pickup" ? "Paiement en boutique au moment du retrait." : "Prototype : le module de paiement en ligne (prestataire acceptant le CBD) n'est pas encore connecté. Aucun paiement ne sera demandé."}</p>
          <button disabled={state === "sending"} className="min-h-12 w-full rounded-full bg-or font-bold text-charbon hover:bg-or-2 disabled:opacity-50">{state === "sending" ? "Validation…" : mode === "pickup" ? "Valider la réservation" : "Valider la commande"}</button>
          <p role="status" aria-live="polite" className="text-sm text-or-2">{state === "error" ? msg : ""}</p>
        </aside>
      </form>
    </section>
  );
}
