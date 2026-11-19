import Link from "next/link";
import type { Category } from "@/lib/catalog";
import { SuitIcon } from "../Suits";

/**
 * Tuile de catégorie. Micro-interaction « carte » secondaire : au survol/focus,
 * l'enseigne glisse en coin comme l'index d'une carte, la tuile se soulève.
 */
export default function CategoryCard({ c, index }: { c: Category; index: number }) {
  return (
    <Link href={`/produits/${c.slug}`} className="group gold-frame texture-grain relative flex min-h-[19rem] flex-col justify-between overflow-hidden bg-vert p-6 transition duration-500 ease-[var(--ease-lux)] hover:-translate-y-2 hover:bg-vert-2 focus-visible:-translate-y-2">
      <div className="flex items-start justify-between">
        <span className="t-num text-5xl text-or">{String(index + 1).padStart(2, "0")}</span>
        <span className="flex flex-col items-center leading-none text-or-2 transition duration-500 group-hover:-translate-y-1 group-hover:rotate-[-8deg]" aria-hidden>
          <SuitIcon suit={c.suit} className="h-5 w-5" />
        </span>
      </div>
      <SuitIcon suit={c.suit} className="pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 text-ivoire/[0.04] transition duration-700 group-hover:scale-110 group-hover:text-or/10" />
      <div className="relative">
        <h3 className="t-display text-3xl">{c.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ivoire/75">{c.description}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-or-2">Voir la sélection <span aria-hidden className="transition group-hover:translate-x-1">→</span></span>
      </div>
    </Link>
  );
}
