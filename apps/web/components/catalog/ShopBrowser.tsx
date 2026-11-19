"use client";
import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { queryProducts, SORTS, type Product, type SortKey } from "@/lib/catalog";
import ProductCard from "./ProductCard";

const PAGE = 24;

/** Grille de boutique : recherche, sous-catégories, disponibilité, tri — état synchronisé dans l'URL. */
export default function ShopBrowser({ products, subs = [], categories = [] }: { products: Product[]; subs?: { slug: string; name: string }[]; categories?: { slug: string; name: string }[] }) {
  const sp = useSearchParams(); const router = useRouter(); const path = usePathname();
  const get = (k: string) => sp.get(k) ?? "";
  const [text, setText] = useState(get("q"));
  const [shown, setShown] = useState(PAGE);
  const set = (k: string, v: string) => {
    const n = new URLSearchParams(sp.toString()); if (v) n.set(k, v); else n.delete(k);
    router.replace(`${path}${n.toString() ? `?${n}` : ""}`, { scroll: false }); setShown(PAGE);
  };
  const list = useMemo(() => queryProducts(products, { text: get("q"), category: get("cat") || undefined, sub: get("sous") || undefined, inStockOnly: get("dispo") === "1", sort: (get("tri") || "pertinence") as SortKey }), [products, sp]);
  const chip = (active: boolean) => `min-h-10 rounded-full border px-4 text-sm transition ${active ? "border-or bg-or text-charbon font-bold" : "border-ivoire/20 hover:border-or"}`;

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-5 border-b border-ivoire/10 bg-charbon/90 px-5 py-4 backdrop-blur md:top-20 md:-mx-8 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <form role="search" onSubmit={(e) => { e.preventDefault(); set("q", text.trim()); }} className="relative min-w-56 flex-1">
            <label htmlFor="shop-q" className="sr-only">Rechercher un produit</label>
            <input id="shop-q" value={text} onChange={(e) => setText(e.target.value)} onBlur={() => set("q", text.trim())} placeholder="Rechercher une variété, un accessoire…" className="h-11 w-full rounded-full border border-ivoire/20 bg-charbon-2 px-5 text-sm placeholder:text-ivoire/45 focus:border-or focus:outline-none" />
          </form>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={get("dispo") === "1"} onChange={(e) => set("dispo", e.target.checked ? "1" : "")} className="h-4 w-4 accent-[#C5A059]" /> Disponibles uniquement</label>
          <label className="flex items-center gap-2 text-sm"><span className="text-ivoire/70">Trier</span>
            <select value={get("tri") || "pertinence"} onChange={(e) => set("tri", e.target.value === "pertinence" ? "" : e.target.value)} className="h-11 rounded-full border border-ivoire/20 bg-charbon-2 px-4">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        {(categories.length > 0 || subs.length > 0) && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer">
            {categories.length > 0 && <>
              <button className={chip(!get("cat"))} aria-pressed={!get("cat")} onClick={() => set("cat", "")}>Tout</button>
              {categories.map((c) => <button key={c.slug} className={`${chip(get("cat") === c.slug)} shrink-0`} aria-pressed={get("cat") === c.slug} onClick={() => set("cat", c.slug)}>{c.name}</button>)}
            </>}
            {subs.length > 0 && <>
              <button className={chip(!get("sous"))} aria-pressed={!get("sous")} onClick={() => set("sous", "")}>Tout</button>
              {subs.map((s) => <button key={s.slug} className={`${chip(get("sous") === s.slug)} shrink-0`} aria-pressed={get("sous") === s.slug} onClick={() => set("sous", s.slug)}>{s.name}</button>)}
            </>}
          </div>
        )}
      </div>
      <p className="mt-6 text-sm text-ivoire/70" aria-live="polite">{list.length} produit{list.length > 1 ? "s" : ""}</p>
      {list.length === 0 ? <p className="py-20 text-center text-ivoire/70">Aucun produit ne correspond à votre recherche.</p> : (
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {list.slice(0, shown).map((p) => <li key={p.id}><ProductCard p={p} /></li>)}
        </ul>
      )}
      {shown < list.length && <div className="mt-12 flex justify-center"><button onClick={() => setShown((s) => s + PAGE)} className="min-h-12 rounded-full border border-ivoire/30 px-8 font-bold hover:border-or">Voir plus ({list.length - shown})</button></div>}
    </div>
  );
}
