import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import Notice from "@/components/ui/Notice";
import ApiForm from "@/components/forms/ApiForm";
import { Field } from "@/components/forms/Field";
import JsonLd from "@/components/JsonLd";
import { LinkButton } from "@/components/ui/Button";
import { SuitIcon } from "@/components/Suits";
import { categoryBySlug, formatPrice, getProduct, allProducts } from "@/lib/catalog";
import { STORES } from "@/lib/stores";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return [...allProducts().map((p) => ({ categorie: p.categorySlug, produit: p.slug })), { categorie: "fleurs-de-cbd", produit: "modele-de-fiche" }];
}
export async function generateMetadata({ params }: { params: Promise<{ categorie: string; produit: string }> }): Promise<Metadata> {
  const { categorie, produit } = await params;
  const p = getProduct(categorie, produit);
  return p ? { title: p.name, description: p.shortDescription, robots: p.isTemplate ? { index: false } : undefined } : {};
}

const dash = (v: unknown) => (v === null || v === undefined || v === "" ? "À importer" : String(v));

export default async function ProductPage({ params }: { params: Promise<{ categorie: string; produit: string }> }) {
  const { categorie, produit } = await params;
  const p = getProduct(categorie, produit);
  const c = categoryBySlug(categorie);
  if (!p || !c) notFound();
  const specs: [string, string][] = [
    ["Taux de CBD", p.attributes.cbdPercent != null ? `${p.attributes.cbdPercent} %` : dash(null)],
    ["Taux de THC", p.attributes.thcPercent != null ? `${p.attributes.thcPercent} % (≤ 0,3 %)` : dash(null)],
    ["Origine", dash(p.attributes.origin)],
    ["Culture", dash(p.attributes.cultivation)],
    ["Formats", p.attributes.formats?.length ? p.attributes.formats.join(", ") : dash(null)],
    ["Bulletin d'analyse", p.labReport ? `${p.labReport.lab ?? "Laboratoire"} · ${p.labReport.date ?? ""}` : dash(null)],
  ];
  return (
    <>
      <PageHeader eyebrow={c.name} title={p.name} crumbs={[{ href: "/produits", label: "Catalogue" }, { href: `/produits/${c.slug}`, label: c.name }, { href: `/produits/${c.slug}/${p.slug}`, label: p.name }]} />
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:px-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="texture-botanique relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl bg-charbon-3">
            {p.images[0] ? <img src={p.images[0].src} alt={p.images[0].alt} className="h-full w-full object-cover" /> : (
              <div className="text-center"><SuitIcon suit={c.suit} className="mx-auto h-20 w-20 text-or/40" /><p className="mt-4 text-xs uppercase tracking-widest text-ivoire/60">Photographie macro à importer</p></div>
            )}
          </div>
        </div>
        <div>
          {p.isTemplate && <div className="mb-6"><Notice title="Fiche gabarit" tone="warn">Cette page montre la structure d'une fiche produit. Aucune donnée n'est inventée : chaque champ sera alimenté par l'import du catalogue réel.</Notice></div>}
          <p className="t-num text-4xl text-or-2">{formatPrice(p.priceCents, p.priceUnit)}</p>
          {p.shortDescription && <p className="mt-5 text-lg leading-relaxed text-ivoire/80">{p.shortDescription}</p>}
          <dl className="mt-8 divide-y divide-ivoire/10 border-y border-ivoire/10">
            {specs.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-ivoire/70">{k}</dt><dd className={v === "À importer" ? "text-ivoire/60 italic" : ""}>{v}</dd></div>)}
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href={p.eshopUrl ?? c.eshopPath} external>Commander en ligne ↗</LinkButton>
            <LinkButton href="#reserver" variant="ghost">Réserver en boutique</LinkButton>
          </div>
          <h2 className="t-label mt-10 text-or-2">Disponibilité en boutique</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            {STORES.map((s) => {
              const a = p.availability?.find((x) => x.storeSlug === s.slug);
              return <li key={s.slug} className="rounded-xl border border-ivoire/10 px-3 py-2"><span className="block font-semibold">{s.city}</span><span className="text-xs text-ivoire/65">{a ? (a.inStock ? "En stock" : "Indisponible") : "Stock non synchronisé"}</span></li>;
            })}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-ivoire/65">Produit réservé aux personnes majeures. Ne revendique aucune propriété thérapeutique. Ne pas ingérer. Déconseillé aux femmes enceintes ou allaitantes.</p>
        </div>
      </section>
      <section id="reserver" aria-labelledby="h-res" className="border-t border-ivoire/10 bg-vert/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <h2 id="h-res" className="t-display text-4xl">Réserver en boutique</h2>
          <p className="mt-3 text-ivoire/75">Nous mettons le produit de côté 48 h. Paiement et contrôle de l'âge en boutique.</p>
          <div className="mt-8">
            <ApiForm endpoint="/api/reservation" submitLabel="Envoyer la demande" purpose="traiter ma demande de réservation">
              <input type="hidden" name="product" value={`${c.slug}/${p.slug}`} />
              <div className="grid gap-5 sm:grid-cols-2"><Field label="Prénom" name="firstName" required autoComplete="given-name" /><Field label="E-mail" name="email" type="email" required autoComplete="email" /></div>
              <div>
                <label htmlFor="f-store" className="text-sm font-semibold">Boutique<span aria-hidden className="text-or"> *</span></label>
                <select id="f-store" name="store" required className="mt-2 w-full rounded-xl border border-ivoire/20 bg-charbon px-4 py-3">{STORES.map((s) => <option key={s.slug} value={s.slug}>{s.city}</option>)}</select>
              </div>
              <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="adult" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" /> Je certifie avoir 18 ans ou plus.</label>
            </ApiForm>
          </div>
        </div>
      </section>
      {!p.isTemplate && <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.shortDescription, image: p.images.map((i) => i.src), url: `${SITE.url}/produits/${c.slug}/${p.slug}`, ...(p.priceCents != null ? { offers: { "@type": "Offer", priceCurrency: "EUR", price: (p.priceCents / 100).toFixed(2), url: p.eshopUrl ?? c.eshopPath } } : {}) }} />}
    </>
  );
}
