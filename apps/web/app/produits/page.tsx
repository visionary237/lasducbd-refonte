import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import CategoryCard from "@/components/catalog/CategoryCard";
import Notice from "@/components/ui/Notice";
import { visibleCategories } from "@/lib/catalog";

export const metadata: Metadata = { title: "Catalogue CBD : fleurs, extractions, accessoires", description: "Le catalogue de L'As du CBD : fleurs, hash et extractions, E-CBD, cosmétiques et accessoires, avec bulletins d'analyse." };

export default function Catalogue() {
  const cats = visibleCategories();
  return (
    <>
      <PageHeader eyebrow="Catalogue" title="Choisir en connaissance de cause." intro="Chaque famille de produits, avec ses fiches techniques. Les produits à base de chanvre affichent leur taux de THC (≤ 0,3 %) et leur analyse." crumbs={[{ href: "/produits", label: "Catalogue" }]} />
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cats.map((c, i) => <CategoryCard key={c.slug} c={c} index={i} />)}</div>
        <div className="mt-12 max-w-3xl">
          <Notice title="Produits alimentaires au CBD">
            Depuis le 15 mai 2026, les denrées alimentaires contenant du CBD (huiles à ingérer, infusions, confiseries) ne peuvent plus être vendues en France. Elles ne figurent pas dans ce catalogue.
          </Notice>
        </div>
      </section>
    </>
  );
}
