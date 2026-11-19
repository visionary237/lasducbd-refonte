import type { Suit } from "@/lib/content";
import { Rosette, SuitIcon } from "../Suits";

/** Face illustrée d'une carte (Art déco). Composant purement visuel. */
export function CardFace({ rank, suit, title, tone = "emeraude" }: { rank: string; suit: Suit; title: string; tone?: "emeraude" | "onyx" | "ivoire" }) {
  const bg = { emeraude: "bg-emeraude text-or-2", onyx: "bg-onyx text-or", ivoire: "bg-ivoire text-onyx" }[tone];
  return (
    <div className={`deco-frame relative flex h-full w-full flex-col justify-between overflow-hidden p-4 ${bg}`}>
      <Rosette className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 opacity-[0.12]" />
      <Corner rank={rank} suit={suit} />
      <div className="relative flex flex-col items-center gap-3">
        <SuitIcon suit={suit} className="h-16 w-16 drop-shadow-[0_6px_14px_rgba(0,0,0,.35)]" />
        <span className="t-caps text-sm">{title}</span>
      </div>
      <Corner rank={rank} suit={suit} flip />
    </div>
  );
}

function Corner({ rank, suit, flip }: { rank: string; suit: Suit; flip?: boolean }) {
  return (
    <span className={`relative flex w-fit flex-col items-center leading-none ${flip ? "self-end rotate-180" : ""}`} aria-hidden>
      <span className="t-display text-2xl">{rank}</span>
      <SuitIcon suit={suit} className="mt-1 h-3 w-3" />
    </span>
  );
}
