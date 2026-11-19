import Link from "next/link";
import { PALETTE } from "@/lib/content";
import { contrast } from "@/lib/contrast";
import { Button } from "@/components/ui/Button";
import Tag from "@/components/ui/Tag";
import Notice from "@/components/ui/Notice";
import { CardFace } from "@/components/ui/PlayingCard";
import { SuitIcon } from "@/components/Suits";

export const metadata = { title: "Design system — L'As du CBD (concept DOERZ)" };

const PAIRS: [string, string, string][] = [
  ["Ivoire sur Onyx", "#F3EBDD", "#101714"],
  ["Or sur Onyx", "#C6A05A", "#101714"],
  ["Ivoire sur Émeraude", "#F3EBDD", "#214D36"],
  ["Or sur Émeraude", "#C6A05A", "#214D36"],
  ["Ivoire sur Bordeaux", "#F3EBDD", "#832E3E"],
  ["Onyx sur Or", "#101714", "#C6A05A"],
  ["Ivoire 60 % sur Onyx", "#9A9890", "#101714"],
];

const COMPONENTS = [
  ["Button", "variant: primary | ghost | accent ; disabled", "Focus visible Or 2 px, cible ≥ 44 px"],
  ["LinkButton", "mêmes variantes, rendu <a>", "Pour la navigation uniquement"],
  ["Tag", "tone: or | bordeaux | ivoire", "Texte, jamais icône seule"],
  ["Notice", "title, children", "role=note, accent Bordeaux"],
  ["CardFace", "rank, suit, tone: emeraude | onyx | ivoire", "Coins décoratifs aria-hidden"],
  ["FlipCard", "front, back, label", "button + aria-pressed, verso dans le DOM, reduced-motion"],
  ["SectionHeading", "id, eyebrow, title, align", "h2 réel, animation mot à mot désactivée si reduced-motion"],
  ["SuitIcon / Rosette / Gentleman", "suit, className, title", "Décoratif par défaut ; title → role=img"],
];

export default function DesignSystem() {
  return (
    <main id="contenu" className="mx-auto max-w-6xl px-6 py-20">
      <Link href="/" className="text-sm text-or">← Retour au concept</Link>
      <p className="t-eyebrow mt-10">Design system · v1.0</p>
      <h1 className="t-display mt-3 text-6xl">Le jeu de construction</h1>
      <div className="mt-6 max-w-2xl"><Notice title="Concept indépendant non commandité">Documentation de travail DOERZ. Source complète : docs/DESIGN_SYSTEM.md.</Notice></div>

      <h2 className="t-display mt-16 text-4xl">Couleurs</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
        {PALETTE.map((c) => (
          <div key={c.hex} className="rounded-xl border border-ivoire/10 p-3">
            <div className="h-20 rounded-lg" style={{ background: c.hex }} />
            <p className="mt-2 font-semibold">{c.name}</p>
            <code className="text-xs text-ivoire/70">--color-{c.name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")} · {c.hex}</code>
          </div>
        ))}
      </div>

      <h2 className="t-display mt-16 text-4xl">Contrastes (WCAG 2.2)</h2>
      <table className="mt-6 w-full text-left text-sm">
        <thead className="text-ivoire/60"><tr><th className="py-2">Paire</th><th>Ratio</th><th>Usage autorisé</th></tr></thead>
        <tbody>
          {PAIRS.map(([n, f, b]) => {
            const r = contrast(f, b);
            return (
              <tr key={n} className="border-t border-ivoire/10">
                <td className="py-3"><span className="mr-3 inline-block rounded px-2 py-1" style={{ color: f, background: b }}>Aa</span>{n}</td>
                <td>{r.toFixed(2)}:1</td>
                <td>{r >= 7 ? "AAA — tout texte" : r >= 4.5 ? "AA — tout texte" : r >= 3 ? "Grand texte & UI uniquement" : "Décoratif uniquement"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="t-display mt-16 text-4xl">Échelle typographique</h2>
      <div className="mt-6 space-y-3">
        {[["Display XL", "t-display text-7xl", "clamp(3.2rem, 11vw, 10rem)"], ["Display L", "t-display text-5xl", "clamp(2.4rem, 5.5vw, 4.8rem)"], ["Titre", "t-display text-3xl", "1.875rem"], ["Corps", "text-lg", "1.125rem / 1.6"], ["Sur-titre", "t-eyebrow", "0.72rem · 0.32em"]].map(([n, c, v]) => (
          <div key={n} className="flex items-baseline justify-between gap-6 border-b border-ivoire/10 pb-3">
            <span className={c}>{n}</span><code className="shrink-0 text-xs text-ivoire/60">{v}</code>
          </div>
        ))}
      </div>

      <h2 className="t-display mt-16 text-4xl">Composants</h2>
      <div className="mt-6 flex flex-wrap items-center gap-3"><Button>Primaire</Button><Button variant="ghost">Secondaire</Button><Button variant="accent">Accent</Button><Tag>Tag</Tag><Tag tone="bordeaux">Signal</Tag></div>
      <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-3">
        <div className="aspect-[5/7]"><CardFace rank="A" suit="spade" title="As" /></div>
        <div className="aspect-[5/7]"><CardFace rank="R" suit="heart" title="Roi" tone="onyx" /></div>
        <div className="aspect-[5/7]"><CardFace rank="D" suit="diamond" title="Dame" tone="ivoire" /></div>
      </div>
      <table className="mt-8 w-full text-left text-sm">
        <thead className="text-ivoire/60"><tr><th className="py-2">Composant</th><th>Props</th><th>Accessibilité</th></tr></thead>
        <tbody>{COMPONENTS.map(([a, b, c]) => <tr key={a} className="border-t border-ivoire/10"><td className="py-3 font-semibold">{a}</td><td className="text-ivoire/80">{b}</td><td className="text-ivoire/80">{c}</td></tr>)}</tbody>
      </table>

      <h2 className="t-display mt-16 text-4xl">Enseignes</h2>
      <div className="mt-6 flex gap-6 text-or">{(["spade", "heart", "diamond", "club"] as const).map((s) => <SuitIcon key={s} suit={s} className="h-12 w-12" title={s} />)}</div>
    </main>
  );
}
