import Link from "next/link";
import { formatPrice, type Product } from "@/lib/catalog";
import { SuitIcon } from "../Suits";

export default function ProductCard({ p }: { p: Product }) {
  const img = p.images[0];
  return (
    <Link href={`/produits/${p.categorySlug}/${p.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-charbon-3">
        {img ? <img src={img.src} alt={img.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
          : <div className="texture-botanique flex h-full items-center justify-center"><SuitIcon suit="spade" className="h-16 w-16 text-or/40" /></div>}
        {p.isTemplate && <span className="absolute left-3 top-3 rounded-full bg-or px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-charbon">Gabarit</span>}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="t-display text-2xl leading-tight group-hover:text-or-2">{p.name}</h3>
        <span className="shrink-0 text-sm text-ivoire/80">{formatPrice(p.priceCents, p.priceUnit)}</span>
      </div>
      <p className="mt-1 text-xs text-ivoire/70">
        CBD {p.attributes.cbdPercent ?? "—"} % · THC {p.attributes.thcPercent ?? "—"} %
      </p>
    </Link>
  );
}
