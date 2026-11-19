import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import JsonLd from "@/components/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { STORES, storeBySlug, storeJsonLd } from "@/lib/stores";
import { SITE } from "@/lib/site";
import { SuitIcon } from "@/components/Suits";

export function generateStaticParams() { return STORES.map((s) => ({ ville: s.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ ville: string }> }): Promise<Metadata> {
  const s = storeBySlug((await params).ville);
  return s ? { title: `Boutique CBD ${s.city}`, description: `L'As du CBD ${s.city} : boutique de produits à base de chanvre, conseil et analyses. Adresse, horaires et accès.` } : {};
}

export default async function StorePage({ params }: { params: Promise<{ ville: string }> }) {
  const s = storeBySlug((await params).ville);
  if (!s) notFound();
  const missing = "Information à fournir par la boutique";
  return (
    <>
      <PageHeader eyebrow={`Boutique · ${s.region}`} title={`L'As du CBD ${s.city}`} intro={s.mood} crumbs={[{ href: "/boutiques", label: "Boutiques" }, { href: `/boutiques/${s.slug}`, label: s.city }]} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-[1.2fr_1fr]">
        <div className="texture-botanique flex aspect-[4/3] items-center justify-center rounded-3xl border border-ivoire/10 bg-charbon-2">
          <div className="text-center"><SuitIcon suit="club" className="mx-auto h-16 w-16 text-or/40" /><p className="mt-4 text-xs uppercase tracking-widest text-ivoire/60">Photographies de la boutique à intégrer</p></div>
        </div>
        <div>
          <dl className="divide-y divide-ivoire/10 border-y border-ivoire/10">
            <div className="py-4"><dt className="t-label text-or-2">Adresse</dt><dd className="mt-1">{s.address ?? <em className="text-ivoire/60">{missing}</em>}</dd></div>
            <div className="py-4"><dt className="t-label text-or-2">Horaires</dt><dd className="mt-1">{s.hours ? s.hours.map((h) => `${h.day} ${h.open}–${h.close}`).join(" · ") : <em className="text-ivoire/60">{missing}</em>}</dd></div>
            <div className="py-4"><dt className="t-label text-or-2">Téléphone</dt><dd className="mt-1">{s.phone ?? <em className="text-ivoire/60">{missing}</em>}</dd></div>
            <div className="py-4"><dt className="t-label text-or-2">Accueil</dt><dd className="mt-1">Réservé aux personnes majeures (pièce d'identité demandée)</dd></div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            {s.address && <LinkButton href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.address} ${s.city}`)}`} external>Itinéraire ↗</LinkButton>}
            <LinkButton href="/produits" variant="ghost">Voir le catalogue</LinkButton>
          </div>
        </div>
      </section>
      <JsonLd data={storeJsonLd(s, SITE.url)} />
    </>
  );
}
