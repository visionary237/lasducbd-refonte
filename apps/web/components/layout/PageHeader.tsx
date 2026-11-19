import Link from "next/link";
import JsonLd from "../JsonLd";
import { SITE } from "@/lib/site";
import { BotanicalLines } from "../Botanical";

export interface Crumb { href: string; label: string }

/** En-tête de page intérieure + fil d'Ariane (avec données structurées BreadcrumbList). */
export default function PageHeader({ eyebrow, title, intro, crumbs = [], children }: { eyebrow?: string; title: string; intro?: string; crumbs?: Crumb[]; children?: React.ReactNode }) {
  const all = [{ href: "/", label: "Accueil" }, ...crumbs];
  return (
    <section className="texture-botanique relative overflow-hidden border-b border-or/15 bg-vert/40 pt-28 md:pt-36">
      <BotanicalLines className="pointer-events-none absolute -right-10 -top-10 h-[130%] w-auto text-or/15" />
      <div className="relative mx-auto max-w-7xl px-5 pb-14 md:px-8 md:pb-20">
        <nav aria-label="Fil d'Ariane" className="mb-8 text-xs text-ivoire/70">
          <ol className="flex flex-wrap items-center gap-2">
            {all.map((c, i) => (
              <li key={c.href} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>/</span>}
                {i === all.length - 1 ? <span aria-current="page" className="text-ivoire">{c.label}</span> : <Link href={c.href} className="hover:text-or-2">{c.label}</Link>}
              </li>
            ))}
          </ol>
        </nav>
        {eyebrow && <p className="t-eyebrow mb-4">{eyebrow}</p>}
        <h1 className="t-display max-w-4xl text-[clamp(2.6rem,6.5vw,5.6rem)]">{title}</h1>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ivoire/80">{intro}</p>}
        {children}
      </div>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, item: SITE.url + c.href })) }} />
    </section>
  );
}
