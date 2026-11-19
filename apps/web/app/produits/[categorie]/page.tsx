import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import ShopBrowser from "@/components/catalog/ShopBrowser";
import Notice from "@/components/ui/Notice";
import { categoryBySlug, productsByCategory, visibleCategories } from "@/lib/catalog";

export function generateStaticParams() { return visibleCategories().map((c) => ({ categorie: c.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ categorie: string }> }): Promise<Metadata> {
  const c = categoryBySlug((await params).categorie);
  return c ? { title: c.name, description: c.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ categorie: string }> }) {
  const c = categoryBySlug((await params).categorie);
  if (!c || c.compliance === "legal-review") notFound();
  const products = productsByCategory(c.slug);
  const subs = (c.children ?? []).filter((s) => products.some((p) => p.subcategory === s.slug)).map((s) => ({ slug: s.slug, name: s.name }));
  return (
    <>
      <PageHeader eyebrow="Boutique en ligne" title={c.name} intro={c.description} crumbs={[{ href: "/produits", label: "Boutique en ligne" }, { href: `/produits/${c.slug}`, label: c.name }]} />
      <section className="mx-auto max-w-7xl px-5 pb-20 md:px-8">
        {c.compliance === "restricted-ads" && <div className="mt-8 max-w-3xl"><Notice title="Information">Catégorie présentée à titre informatif, sans mise en avant promotionnelle.</Notice></div>}
        <Suspense fallback={<p className="py-10 text-ivoire/70">Chargement…</p>}><ShopBrowser products={products} subs={subs} /></Suspense>
      </section>
    </>
  );
}
