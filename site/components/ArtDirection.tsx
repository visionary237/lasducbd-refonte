"use client";
import { PALETTE } from "@/lib/content";
import { contrast } from "@/lib/contrast";
import SectionHeading from "./ui/SectionHeading";
import { Gentleman, Rosette, SuitIcon } from "./Suits";

export default function ArtDirection() {
  return (
    <section id="direction" aria-labelledby="direction-titre" className="relative px-6 py-28 md:px-14">
      <div className="mx-auto max-w-7xl">
        <SectionHeading id="direction-titre" eyebrow="Direction artistique" title="Les règles du salon" />

        {/* Palette */}
        <h3 className="t-display mt-16 text-3xl">Palette</h3>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">
          {PALETTE.map((c) => (
            <li key={c.hex} className="overflow-hidden rounded-2xl border border-ivoire/10">
              <div className="flex h-36 items-end p-4" style={{ background: c.hex, color: c.on }}>
                <span className="t-display text-3xl">Aa</span>
              </div>
              <div className="space-y-1 bg-onyx-2 p-4 text-sm">
                <p className="font-semibold">{c.name}</p>
                <p className="font-mono text-xs text-ivoire/70">{c.hex}</p>
                <p className="text-xs text-ivoire/70">{c.role}</p>
                <p className="text-xs text-or">Contraste {contrast(c.hex, c.on).toFixed(1)}:1</p>
              </div>
            </li>
          ))}
        </ul>

        {/* Typo */}
        <div className="mt-20 grid gap-10 md:grid-cols-2">
          <div className="deco-frame bg-onyx-2 p-8">
            <p className="t-eyebrow">Titrage · Cormorant Garamond</p>
            <p className="t-display mt-4 text-7xl">As de pique</p>
            <p className="t-display mt-2 text-4xl italic text-or">l'élégance posée</p>
            <p className="mt-6 text-sm text-ivoire/70">Graisses 500–600, italique pour l'emphase, capitales espacées à 0,28 em pour les signatures.</p>
          </div>
          <div className="deco-frame bg-onyx-2 p-8">
            <p className="t-eyebrow">Texte & interface · Manrope</p>
            <p className="mt-4 text-3xl font-semibold">Une information claire, sans détour.</p>
            <p className="mt-4 leading-relaxed text-ivoire/80">
              Corps 16–18 px, interlignage 1,6. Les sur-titres sont en capitales 11 px, espacement 0,32 em, couleur Or.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-ivoire/70">
              <span>72 · 48 · 32 · 24 · 18 · 16 · 13 · 11</span>
            </div>
          </div>
        </div>

        {/* Motifs + mascotte */}
        <div className="mt-20 grid gap-6 md:grid-cols-4">
          <Motif title="Emblème" text="Pique aux courbes tendues, pied évasé.">
            <SuitIcon suit="spade" className="h-20 w-20 text-or" />
          </Motif>
          <Motif title="Rosace" text="16 pétales, filet 0,6 px. Fond et filigrane.">
            <Rosette className="h-24 w-24 text-or" />
          </Motif>
          <Motif title="Rayons" text="Conique répétée à 9°, opacité 9 %.">
            <div className="deco-rays h-24 w-24 rounded-full border border-or/30" />
          </Motif>
          <Motif title="Mascotte" text="Le Gentleman de Pique : il accueille, il ne vend pas.">
            <Gentleman className="h-28 w-auto" />
          </Motif>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            ["Le mouvement", "Les cartes se retournent, se distribuent, s'éventaillent. Durées 0,6–1,2 s, courbes « expo » et ressorts amortis."],
            ["La matière", "Grain argentique animé, filets dorés doubles, coins arrondis à 18 px comme une carte réelle."],
            ["La retenue", "Aucune incitation : pas de compte à rebours, pas de prix barré, pas de pop-up. Le contenu informe."],
          ].map(([t, d]) => (
            <div key={t} className="border-t border-or/40 pt-5">
              <h3 className="t-display text-2xl">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ivoire/75">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Motif({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <figure className="deco-frame flex flex-col items-center gap-4 bg-emeraude/40 p-6 text-center">
      <div className="flex h-32 items-center">{children}</div>
      <figcaption>
        <span className="t-display block text-xl">{title}</span>
        <span className="text-xs text-ivoire/70">{text}</span>
      </figcaption>
    </figure>
  );
}
