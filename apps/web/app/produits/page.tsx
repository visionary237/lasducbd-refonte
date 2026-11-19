import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/PageHeader";
import ShopBrowser from "@/components/catalog/ShopBrowser";
import Notice from "@/components/ui/Notice";
import { SuitIcon } from "@/components/Suits";
import { allProducts, visibleCategories } from "@/lib/catalog";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Boutique en ligne CBD : fleurs, résines, accessoires", description: "Fleurs de CBD, résines et extractions, E-CBD, cosmétiques et accessoires. Livraison sous 48 h ou retrait en boutique." };

export default function Shop() {
  const cats = visibleCategories();
  const products = allProducts();
  return (
    <>
      <PageHeader eyebrow="Boutique en ligne" title="Toute la sélection." intro={`${products.length} références. ${SITE.shipping[0]} Ou retirez gratuitement en boutique.`} crumbs={[{ href: "/produits", label: "Boutique en ligne" }]}>
        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link href={`/produits/${c.slug}`} className="group flex items-center justify-between rounded-2xl border border-ivoire/15 bg-charbon/40 px-4 py-4 transition hover:border-or">
                <span className="font-semibold group-hover:text-or-2">{c.name}</span><SuitIcon suit={c.suit} className="h-4 w-4 text-or" />
              </Link>
            </li>
          ))}
        </ul>
      </PageHeader>
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        <Suspense fallback={<p className="py-10 text-ivoire/70">Chargement du catalogue…</p>}>
          <ShopBrowser products={products} categories={cats.map((c) => ({ slug: c.slug, name: c.name }))} />
        </Suspense>
        <div className="mt-16 max-w-3xl"><Notice title="Données du catalogue">Noms, prix et visuels relevés sur la boutique en ligne actuelle le 19/11/2026. Grammages et analyses sont synchronisés produit par produit (import WooCommerce). Les produits alimentaires au CBD, interdits à la vente depuis le 15 mai 2026, ne figurent pas au catalogue.</Notice></div>
      </section>
    </>
  );
}
