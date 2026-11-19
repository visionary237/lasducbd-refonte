import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import Reveal from "@/components/ui/Reveal";
import Notice from "@/components/ui/Notice";
import { LinkButton } from "@/components/ui/Button";
import { SuitIcon } from "@/components/Suits";

export const metadata: Metadata = { title: "Découvrir le CBD : définition, cadre légal, analyses", description: "Ce qu'est le CBD, ce que dit la loi française en 2026, comment lire un bulletin d'analyse. Un guide factuel, sans allégation de santé." };

const STEPS = [
  { suit: "spade" as const, t: "Qu'est-ce que le CBD ?", d: "Le cannabidiol est l'une des molécules présentes dans le chanvre. Les produits vendus en France doivent provenir de variétés autorisées et contenir au plus 0,3 % de THC." },
  { suit: "diamond" as const, t: "Ce que dit la loi", d: "Les fleurs et feuilles sont commercialisables depuis la décision du Conseil d'État du 29 décembre 2022. Les denrées alimentaires au CBD ne le sont plus depuis le 15 mai 2026 (règlement Novel Food)." },
  { suit: "heart" as const, t: "Ce que nous ne disons pas", d: "Aucun produit au CBD n'est un médicament. Nous ne prêtons à nos produits aucun effet sur la santé : la réglementation l'interdit, et c'est aussi notre éthique." },
  { suit: "club" as const, t: "Les bons réflexes", d: "Vente réservée aux majeurs. Déconseillé aux femmes enceintes ou allaitantes. Des traces de THC pouvant être détectées, ne pas conduire après usage. En cas de traitement médical, demandez l'avis d'un professionnel de santé." },
];

export default function Decouvrir() {
  return (
    <>
      <PageHeader eyebrow="Découvrir le CBD" title="Comprendre avant de choisir." intro="Un guide factuel et sourcé, mis à jour au gré de la réglementation." crumbs={[{ href: "/decouvrir-le-cbd", label: "Découvrir le CBD" }]} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal as="ul" className="grid gap-5 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.t} className="gold-frame bg-charbon-2 p-8">
              <div className="flex items-center justify-between"><span className="t-num text-5xl text-or">{i + 1}</span><SuitIcon suit={s.suit} className="h-5 w-5 text-or" /></div>
              <h2 className="t-display mt-6 text-3xl">{s.t}</h2>
              <p className="mt-3 leading-relaxed text-ivoire/80">{s.d}</p>
            </li>
          ))}
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Notice title="Pour aller plus loin">Lisez notre article sur le cadre légal 2026 et notre guide de lecture des bulletins d'analyse.</Notice>
          <div className="flex flex-wrap items-center gap-3">
            <LinkButton href="/actualites/cadre-legal-cbd-france-2026">Le cadre légal 2026</LinkButton>
            <LinkButton href="/actualites/lire-un-bulletin-d-analyse" variant="ghost">Lire une analyse</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
