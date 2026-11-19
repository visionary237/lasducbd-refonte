import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import { ARTICLES } from "@/lib/articles";
import { SuitIcon } from "@/components/Suits";

export const metadata: Metadata = { title: "Journal : actualités et guides CBD", description: "Réglementation, guides de lecture des analyses et nouvelles de la maison L'As du CBD." };

export default function Journal() {
  return (
    <>
      <PageHeader eyebrow="Journal" title="Actualités & conseils." intro="Réglementation, pédagogie et vie des boutiques." crumbs={[{ href: "/actualites", label: "Journal" }]} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <ul className="grid gap-6 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <li key={a.slug}>
              <Link href={`/actualites/${a.slug}`} className="group gold-frame flex h-full flex-col bg-charbon-2 p-8 transition hover:bg-charbon-3">
                <span className="flex items-center justify-between t-label text-or-2"><span>{a.category}</span><SuitIcon suit={a.suit} className="h-4 w-4" /></span>
                <h2 className="t-display mt-6 text-3xl group-hover:text-or-2">{a.title}</h2>
                <p className="mt-3 flex-1 text-ivoire/75">{a.excerpt}</p>
                <time dateTime={a.date} className="mt-6 text-xs text-ivoire/65">{new Date(a.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</time>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
