import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Infos pratiques : livraison, âge, paiement", description: "Livraison, contrôle de l'âge, retrait en boutique et questions fréquentes sur L'As du CBD." };

const FAQ: [string, string][] = [
  ["Qui peut acheter ?", "La vente est réservée aux personnes majeures. Une pièce d'identité peut être demandée en boutique et à la réception d'une réservation."],
  ["Comment sont expédiées les commandes ?", SITE.shipping.join(" ")],
  ["Puis-je réserver un produit en boutique ?", "Oui, depuis chaque fiche produit : le produit est mis de côté 48 h, le paiement se fait sur place."],
  ["Les produits sont-ils analysés ?", "Les produits à base de chanvre sont accompagnés d'un bulletin d'analyse indiquant notamment le taux de THC, qui doit être inférieur ou égal à 0,3 %."],
  ["Vendez-vous des huiles ou produits à avaler ?", "Depuis le 15 mai 2026, les denrées alimentaires au CBD ne peuvent plus être vendues en France. Nous respectons cette réglementation."],
];

export default function Infos() {
  return (
    <>
      <PageHeader eyebrow="Infos pratiques" title="Les réponses, sans détour." crumbs={[{ href: "/infos-pratiques", label: "Infos pratiques" }]} />
      <section className="mx-auto max-w-3xl px-5 py-16 md:px-8">
        <div className="divide-y divide-ivoire/10 border-y border-ivoire/10">
          {FAQ.map(([q, r]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 t-display text-2xl">{q}<span aria-hidden className="text-or transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 leading-relaxed text-ivoire/80">{r}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-xs text-ivoire/65">Conditions de livraison reprises du site actuel (relevé du 19/11/2026), à reconfirmer. <Link href="/contact" className="text-or-2 underline">Une autre question ?</Link></p>
      </section>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) }} />
    </>
  );
}
