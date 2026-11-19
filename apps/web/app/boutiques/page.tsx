import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import Notice from "@/components/ui/Notice";
import Reveal from "@/components/ui/Reveal";
import { STORES } from "@/lib/stores";
import { SuitIcon } from "@/components/Suits";

export const metadata: Metadata = { title: "Nos boutiques CBD", description: "Les boutiques L'As du CBD à Rouen, Caen, Le Mans, Nantes et Bordeaux : conseil, analyses et sélection en magasin." };

export default function Boutiques() {
  return (
    <>
      <PageHeader eyebrow="Nos boutiques" title="Pousser la porte, prendre le temps." intro="Nos boutiques sont pensées comme des salons de conseil : on y découvre les produits, leurs analyses et la réglementation, sans pression d'achat." crumbs={[{ href: "/boutiques", label: "Boutiques" }]} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <Reveal as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {STORES.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/boutiques/${s.slug}`} className="group gold-frame texture-grain flex min-h-[18rem] flex-col justify-between bg-vert p-7 transition hover:-translate-y-1 hover:bg-vert-2">
                <span className="flex justify-between"><span className="t-label text-or-2">{s.region}</span><SuitIcon suit={(["spade", "heart", "diamond", "club"] as const)[i % 4]} className="h-4 w-4 text-or" /></span>
                <span><span className="t-display block text-5xl group-hover:text-or-2">{s.city}</span><span className="mt-3 block text-sm text-ivoire/75">{s.mood}</span></span>
                <span className="text-sm font-bold text-or-2">Adresse, horaires, accès →</span>
              </Link>
            </li>
          ))}
        </Reveal>
        <div className="mt-12 max-w-3xl"><Notice title="Données à confirmer">Les ambiances sont des propositions d'aménagement. Adresses, horaires et téléphones seront intégrés depuis les données officielles de la marque (aucune information n'est inventée).</Notice></div>
      </section>
    </>
  );
}
