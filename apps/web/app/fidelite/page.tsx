import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import WalletCard from "@/components/loyalty/WalletCard";
import Notice from "@/components/ui/Notice";
import Reveal from "@/components/ui/Reveal";
import ApiForm from "@/components/forms/ApiForm";
import { Field } from "@/components/forms/Field";
import { TIERS, POINTS_RULES } from "@/lib/loyalty/config";
import { SuitIcon } from "@/components/Suits";

export const metadata: Metadata = { title: "Programme de fidélité", description: "La carte de fidélité L'As du CBD dans Apple Wallet et Google Wallet : paliers Valet, Dame, Roi et As." };

const suits = ["club", "heart", "diamond", "spade"] as const;

export default function Fidelite() {
  return (
    <>
      <PageHeader eyebrow="Programme de fidélité · proposition DOERZ" title="Une carte qui se mérite, comme un as." intro="Une carte digitale à ajouter à Apple Wallet ou Google Wallet, scannée en caisse par QR code ou NFC. Les avantages récompensent la fidélité à la maison : services, accès, événements." crumbs={[{ href: "/fidelite", label: "Fidélité" }]} />
      <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 md:px-8 lg:grid-cols-2">
        <div className="flex justify-center"><WalletCard /></div>
        <ol className="space-y-6">
          {[["Inscription", "En boutique ou en ligne, avec une simple adresse e-mail. Contrôle de majorité en boutique."], ["Ajout au Wallet", "Un lien vous permet d'ajouter la carte à Apple Wallet ou Google Wallet. Elle se met à jour toute seule."], ["En caisse", "Présentez la carte : un scan du QR code (ou NFC) enregistre la visite et met à jour vos points."]].map(([t, d], i) => (
            <li key={t} className="flex gap-5"><span className="t-num text-4xl text-or">{i + 1}</span><div><h2 className="t-display text-2xl">{t}</h2><p className="mt-1 text-ivoire/75">{d}</p></div></li>
          ))}
        </ol>
      </section>
      <section aria-labelledby="h-tiers" className="surface-ivoire texture-grain py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <p className="t-eyebrow">Les paliers</p>
          <h2 id="h-tiers" className="t-display mt-3 text-5xl text-charbon">Du Valet à l'As.</h2>
          <Reveal as="ul" className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((t, i) => (
              <li key={t.id} className="gold-frame flex aspect-[5/7] flex-col justify-between bg-white/60 p-5">
                <span className="flex items-center justify-between text-or-fonce"><span className="t-display text-3xl">{t.name[0]}</span><SuitIcon suit={suits[i]} className="h-4 w-4" /></span>
                <div><p className="t-display text-3xl">{t.name}</p><p className="text-sm text-charbon/70">dès {t.minPoints} points</p>
                  <ul className="mt-4 space-y-1 text-sm text-charbon/85">{t.perks.map((p) => <li key={p}>— {p}</li>)}</ul></div>
              </li>
            ))}
          </Reveal>
          <p className="mt-8 text-sm text-charbon/75">Barème proposé : {POINTS_RULES.perVisit} points par visite, {POINTS_RULES.perEuro} point par euro. L'expérience de jeu ne rapporte aucun point.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:px-8 lg:grid-cols-2">
        <div>
          <h2 className="t-display text-4xl">Être prévenu du lancement</h2>
          <p className="mt-3 text-ivoire/75">Laissez votre e-mail : nous vous écrirons une seule fois, à l'ouverture du programme.</p>
          <div className="mt-8"><ApiForm endpoint="/api/loyalty/waitlist" submitLabel="Me prévenir" purpose="être informé(e) du lancement du programme de fidélité">
            <Field label="E-mail" name="email" type="email" required autoComplete="email" />
            <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="adult" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" /> Je certifie avoir 18 ans ou plus.</label>
          </ApiForm></div>
        </div>
        <Notice title="Proposition à valider" tone="warn">L'As du CBD ne dispose pas aujourd'hui de programme de fidélité. Paliers, barème et avantages présentés ici sont une proposition DOERZ, construite pour récompenser la relation plutôt que la quantité achetée.</Notice>
      </section>
    </>
  );
}
