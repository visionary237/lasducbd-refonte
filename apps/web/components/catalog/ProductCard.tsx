"use client";
import Link from "next/link";
import { displayPrice, isPurchasable, type Product } from "@/lib/catalog";
import ProductImage from "./ProductImage";
import { useCart } from "../cart/CartProvider";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const href = `/produits/${p.categorySlug}/${p.slug}`;
  const quick = isPurchasable(p) && !p.variants?.length;
  const out = p.inStock === false || (p.priceCents == null && !p.variants?.length);
  return (
    <article className="group relative">
      <Link href={href} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-ivoire/10 bg-charbon-3 transition duration-500 group-hover:border-or/50">
          <div className="h-full w-full transition duration-700 group-hover:scale-[1.04]"><ProductImage src={p.images[0]?.src} alt={p.images[0]?.alt ?? p.name} name={p.name} /></div>
          <div className="absolute left-3 top-3 flex gap-2">
            {p.isNew && <span className="rounded-full bg-or px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-charbon">Nouveau</span>}
            {out && <span className="rounded-full bg-charbon/85 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-ivoire">Indisponible</span>}
          </div>
        </div>
        <h3 className="t-display mt-4 text-xl leading-tight group-hover:text-or-2">{p.name}</h3>
        <p className="mt-1 text-sm text-ivoire/80">{displayPrice(p)}</p>
        {(p.attributes.cbdPercent != null || p.attributes.thcPercent != null) && (
          <p className="mt-0.5 text-xs text-ivoire/65">CBD {p.attributes.cbdPercent ?? "—"} % · THC {p.attributes.thcPercent ?? "—"} %</p>
        )}
      </Link>
      {quick && (
        <button onClick={() => add(p.id, null, 1)} className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ivoire text-charbon opacity-100 shadow-lg transition hover:bg-or md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100" aria-label={`Ajouter ${p.name} au panier`}>+</button>
      )}
    </article>
  );
}
