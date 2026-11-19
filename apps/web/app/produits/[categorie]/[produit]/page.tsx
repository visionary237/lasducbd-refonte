import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Notice from "@/components/ui/Notice";
import ApiForm from "@/components/forms/ApiForm";
import { Field } from "@/components/forms/Field";
import JsonLd from "@/components/JsonLd";
import AddToCart from "@/components/catalog/AddToCart";
import ProductImage from "@/components/catalog/ProductImage";
import ProductCard from "@/components/catalog/ProductCard";
import { categoryBySlug, displayPrice, getProduct, allProducts, productsByCategory } from "@/lib/catalog";
import { STORES } from "@/lib/stores";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return [...allProducts().map((p) => ({ categorie: p.categorySlug, produit: p.slug })), { categorie: "fleurs-de-cbd", produit: "modele-de-fiche" }];
}
export async function generateMetadata({ params }: { params: Promise<{ categorie: string; produit: string }> }): Promise<Metadata> {
  const { categorie, produit } = await params;
  const p = getProduct(categorie, produit); const c = categoryBySlug(categorie);
  return p && c ? { title: `${p.name} — ${c.name}`, description: `${p.name} : ${c.description}`, robots: p.isTemplate ? { index: false } : undefined } : {};
}
const missing = "À compléter";

export default async function ProductPage({ params }: { params: Promise<{ categorie: string; produit: string }> }) {
  const { categorie, produit } = await params;
  const p = getProduct(categorie, produit); const c = categoryBySlug(categorie);
  if (!p || !c) notFound();
  const hemp = ["fleurs-de-cbd", "hash-et-extractions"].includes(c.slug);
  const specs: [string, string][] = [
    ...(hemp ? [["Taux de CBD", p.attributes.cbdPercent != null ? `${String(p.attributes.cbdPercent).replace(".", ",")} %` : missing], ["Taux de THC", p.attributes.thcPercent != null ? `${String(p.attributes.thcPercent).replace(".", ",")} % (≤ 0,3 %)` : missing]] as [string, string][] : []),
    ...(hemp ? [["Culture", p.attributes.cultivation ?? missing], ["Origine", p.attributes.origin ?? missing], ["Bulletin d'analyse", p.labReport ? `${p.labReport.lab ?? ""} ${p.labReport.date ?? ""}` : missing]] as [string, string][] : []),
    ...(p.subcategory ? [["Rayon", c.children?.find((s) => s.slug === p.subcategory)?.name ?? p.subcategory]] as [string, string][] : []),
  ];
  const related = productsByCategory(c.slug).filter((x) => x.id !== p.id && x.inStock !== false).slice(0, 4);
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-28 md:px-8 md:pt-32">
        <nav aria-label="Fil d'Ariane" className="mb-8 text-xs text-ivoire/70">
          <ol className="flex flex-wrap gap-2"><li><Link href="/" className="hover:text-or-2">Accueil</Link> /</li><li><Link href="/produits" className="hover:text-or-2">Boutique en ligne</Link> /</li><li><Link href={`/produits/${c.slug}`} className="hover:text-or-2">{c.name}</Link> /</li><li aria-current="page" className="text-ivoire">{p.name}</li></ol>
        </nav>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-square overflow-hidden rounded-3xl border border-ivoire/10 bg-charbon-3"><ProductImage src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} name={p.name} /></div>
          <div>
            <p className="t-eyebrow">{c.name}{p.isNew ? " · Nouveauté" : ""}</p>
            <h1 className="t-display mt-3 text-[clamp(2.4rem,5vw,4rem)]">{p.name}</h1>
            <p className="t-num mt-4 text-3xl text-or-2">{displayPrice(p)}</p>
            {p.isTemplate && <div className="mt-6"><Notice title="Fiche gabarit" tone="warn">Structure de fiche, sans donnée réelle.</Notice></div>}
            <div className="mt-8"><AddToCart p={p} /></div>
            <ul className="mt-6 space-y-1 text-sm text-ivoire/75">
              <li>✓ {c.slug === "fleurs-de-cbd" || c.slug === "hash-et-extractions" ? "Livraison offerte" : "Livraison offerte dès 49 €"} · expédition sous 48 h, enveloppe neutre</li>
              <li>✓ Retrait gratuit dans nos {STORES.length} boutiques</li>
            </ul>
            {specs.length > 0 && (
              <dl className="mt-8 divide-y divide-ivoire/10 border-y border-ivoire/10">
                {specs.map(([k, v]) => <div key={k} className="flex justify-between gap-6 py-3 text-sm"><dt className="text-ivoire/70">{k}</dt><dd className={v === missing ? "italic text-ivoire/60" : ""}>{v}</dd></div>)}
              </dl>
            )}
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <a href="#reserver" className="font-bold text-or-2 underline-offset-4 hover:underline">Réserver en boutique</a>
              {p.eshopUrl && <a href={p.eshopUrl} target="_blank" rel="noopener" className="text-ivoire/75 underline-offset-4 hover:underline">Fiche sur le site actuel ↗</a>}
            </div>
            <p className="mt-8 text-xs leading-relaxed text-ivoire/65">Réservé aux personnes majeures. Ne revendique aucune propriété thérapeutique. Ne pas ingérer. Déconseillé aux femmes enceintes ou allaitantes.</p>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section aria-labelledby="h-rel" className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
          <h2 id="h-rel" className="t-display text-3xl">Dans la même sélection</h2>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">{related.map((r) => <li key={r.id}><ProductCard p={r} /></li>)}</ul>
        </section>
      )}
      <section id="reserver" aria-labelledby="h-res" className="border-t border-ivoire/10 bg-vert/40">
        <div className="mx-auto max-w-3xl px-5 py-16 md:px-8">
          <h2 id="h-res" className="t-display text-4xl">Réserver en boutique</h2>
          <p className="mt-3 text-ivoire/75">Nous mettons le produit de côté 48 h. Paiement et contrôle de l'âge en boutique.</p>
          <div className="mt-8">
            <ApiForm endpoint="/api/reservation" submitLabel="Envoyer la demande" purpose="traiter ma demande de réservation">
              <input type="hidden" name="product" value={`${c.slug}/${p.slug}`} />
              <div className="grid gap-5 sm:grid-cols-2"><Field label="Prénom" name="firstName" required autoComplete="given-name" /><Field label="E-mail" name="email" type="email" required autoComplete="email" /></div>
              <div><label htmlFor="f-store" className="text-sm font-semibold">Boutique<span aria-hidden className="text-or"> *</span></label>
                <select id="f-store" name="store" required className="mt-2 w-full rounded-xl border border-ivoire/20 bg-charbon px-4 py-3">{STORES.map((s) => <option key={s.slug} value={s.slug}>{s.city}</option>)}</select></div>
              <label className="flex items-start gap-3 text-sm"><input type="checkbox" name="adult" value="yes" required className="mt-1 h-4 w-4 accent-[#C5A059]" /> Je certifie avoir 18 ans ou plus.</label>
            </ApiForm>
          </div>
        </div>
      </section>
      {!p.isTemplate && <JsonLd data={{ "@context": "https://schema.org", "@type": "Product", name: p.name, image: p.images.map((i) => i.src), url: `${SITE.url}/produits/${c.slug}/${p.slug}`,
        ...(p.variants?.length ? { offers: { "@type": "AggregateOffer", priceCurrency: "EUR", lowPrice: (Math.min(...p.variants.map((v) => v.priceCents)) / 100).toFixed(2), highPrice: (Math.max(...p.variants.map((v) => v.priceCents)) / 100).toFixed(2), offerCount: p.variants.length } }
          : p.priceCents != null ? { offers: { "@type": "Offer", priceCurrency: "EUR", price: (p.priceCents / 100).toFixed(2), availability: p.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock" } } : {}) }} />}
    </>
  );
}
