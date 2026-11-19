"use client";
import FlipCard from "../ui/FlipCard";
import { SuitIcon } from "../Suits";
import type { Suit } from "@/lib/types";

/** Storytelling secondaire : les engagements de la maison, en quatre cartes à retourner. */
const CARDS: { suit: Suit; rank: string; title: string; text: string }[] = [
  { suit: "spade", rank: "A", title: "La sélection", text: "Chaque référence est choisie pour sa qualité, son origine et la clarté de sa fiche technique." },
  { suit: "diamond", rank: "R", title: "La transparence", text: "Taux de CBD et de THC, laboratoire, date et lot : l'analyse accompagne chaque produit à base de chanvre." },
  { suit: "heart", rank: "D", title: "Le conseil", text: "En boutique, on prend le temps d'expliquer les formats, la conservation et la réglementation." },
  { suit: "club", rank: "V", title: "La responsabilité", text: "Vente réservée aux majeurs, aucune promesse de santé, aucune incitation : c'est notre règle du jeu." },
];
export default function Engagements() {
  return (
    <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {CARDS.map((c) => (
        <li key={c.title}>
          <FlipCard label={`Engagement : ${c.title}`}
            front={
              <div className="gold-frame flex h-full flex-col justify-between bg-ivoire p-4 text-charbon">
                <span className="flex flex-col items-start leading-none text-or-fonce"><span className="t-display text-3xl">{c.rank}</span><SuitIcon suit={c.suit} className="mt-1 h-3 w-3" /></span>
                <SuitIcon suit={c.suit} className="mx-auto h-14 w-14 text-vert" />
                <span className="t-display text-lg leading-tight sm:text-2xl">{c.title}</span>
              </div>
            }
            back={
              <div className="gold-frame flex h-full flex-col justify-end bg-vert p-5">
                <SuitIcon suit={c.suit} className="mb-auto h-5 w-5 text-or" />
                <p className="t-display text-2xl">{c.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ivoire/85">{c.text}</p>
              </div>
            } />
        </li>
      ))}
    </ul>
  );
}
