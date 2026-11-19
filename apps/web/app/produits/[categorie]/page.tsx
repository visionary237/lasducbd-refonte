import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ProductCard from "@/components/catalog/ProductCard";
import Notice from "@/components/ui/Notice";
import { LinkButton } from "@/components/ui/Button";
import { categoryBySlug, productsByCategory, visibleCategories, TEMPLATE_PRODUCT } from "@/lib/catalog";

export function generateStaticParams() { return visibleCategories().map((c) => ({ categorie: c.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ categorie: string }> }): Promise<Metadata> {
  const c = categoryBySlug((await params).categorie);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ categorie: string }> }) {
  const c = categoryBySlug((await params).categorie);
  if (!c || c.compliance === "legal-review") notFound();
  const products = productsByCategory(c.slug);
  const showTemplate = products.length === 0 && c.slug === TEMPLATE_PRODUCT.categorySlug;
  return (
    <>
      <PageHeader eyebrow="Catalogue" title={c.name} intro={c.description} crumbs={[{ href: "/produits", label: "Catalogue" }, { href: `/produits/${c.slug}`, label: c.name }]}>
        {c.children && (
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Sous-catégories">
            {c.children.map((s) => <li key={s.slug}><a href={s.eshopPath} target="_blank" rel="noopener" className="inline-flex rounded-full border border-ivoire/25 px-4 py-2 text-sm hover:border-or hover:text-or-2">{s.name} ↗</a></li>)}
          </ul>
        )}
      </PageHeader>
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {c.compliance === "restricted-ads" && <div className="mb-10 max-w-3xl"><Notice title="Information">Catégorie présentée à titre informatif, sans mise en avant promotionnelle.</Notice></div>}
        {products.length > 0 ? (
          <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">{products.map((p) => <li key={p.id}><ProductCard p={p} /></li>)}</ul>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div className="rounded-2xl border border-dashed border-or/40 p-8">
              <p className="t-eyebrow">Catalogue en cours d'import</p>
              <p className="t-display mt-3 text-3xl">Les fiches arrivent depuis la boutique en ligne.</p>
              <p className="mt-4 text-sm leading-relaxed text-ivoire/75">Ce prototype ne publie aucun produit inventé. Les références, prix, photos et analyses seront importés automatiquement (script <code>import-woocommerce</code>). En attendant, la sélection complète est consultable sur la boutique en ligne actuelle.</p>
              <LinkButton href={c.eshopPath} external className="mt-6">Voir sur la boutique en ligne ↗</LinkButton>
            </div>
            {showTemplate && <div className="max-w-sm"><ProductCard p={TEMPLATE_PRODUCT} /></div>}
          </div>
        )}
      </section>
    </>
  );
}
