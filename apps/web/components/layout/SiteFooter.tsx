import Link from "next/link";
import { FOOTER_NAV, NAV } from "@/lib/site";
import { STORES } from "@/lib/stores";
import { SuitIcon } from "../Suits";
import CookieSettingsLink from "./CookieSettingsLink";

export default function SiteFooter() {
  return (
    <footer className="texture-botanique border-t border-or/20 bg-charbon-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-3"><SuitIcon suit="spade" className="h-9 w-9 text-or" /><span className="t-display text-2xl uppercase tracking-[0.18em]">L'As du CBD</span></div>
          <p className="mt-5 text-sm leading-relaxed text-ivoire/70">Boutiques spécialisées en produits à base de chanvre à faible teneur en THC (≤ 0,3 %).</p>
        </div>
        <nav aria-label="Plan du site"><p className="t-eyebrow mb-4">Explorer</p>
          <ul className="space-y-2 text-sm">{NAV.map((n) => <li key={n.href}><Link className="text-ivoire/80 hover:text-or-2" href={n.href}>{n.label}</Link></li>)}</ul>
        </nav>
        <div><p className="t-eyebrow mb-4">Nos boutiques</p>
          <ul className="space-y-2 text-sm">{STORES.map((s) => <li key={s.slug}><Link className="text-ivoire/80 hover:text-or-2" href={`/boutiques/${s.slug}`}>{s.city}</Link></li>)}</ul>
        </div>
        <nav aria-label="Informations"><p className="t-eyebrow mb-4">Informations</p>
          <ul className="space-y-2 text-sm">
            {FOOTER_NAV.map((n) => <li key={n.href}><Link className="text-ivoire/80 hover:text-or-2" href={n.href}>{n.label}</Link></li>)}
            <li><CookieSettingsLink /></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-ivoire/10">
        <div className="mx-auto max-w-7xl space-y-2 px-5 py-6 text-xs leading-relaxed text-ivoire/70 md:px-8">
          <p><strong className="text-ivoire">Vente réservée aux personnes majeures.</strong> Nos produits ne sont pas des médicaments et ne revendiquent aucune propriété thérapeutique. Déconseillés aux femmes enceintes ou allaitantes. Ne pas conduire après usage : des traces de THC peuvent être détectées.</p>
          <p>© {new Date().getFullYear()} L'As du CBD · Conception et développement : DOERZ · <span className="text-ivoire/60">Prototype de refonte — contenus à valider par la marque.</span></p>
        </div>
      </div>
    </footer>
  );
}
