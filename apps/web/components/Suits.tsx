import type { Suit } from "@/lib/types";

/** Pique dessiné pour le concept (courbes originales, viewBox 100×110). */
export const SPADE_PATH =
  "M50 4 C58 22 96 40 96 66 C96 82 84 92 70 92 C62 92 56 88 53 83 C54 92 58 100 66 106 L34 106 C42 100 46 92 47 83 C44 88 38 92 30 92 C16 92 4 82 4 66 C4 40 42 22 50 4 Z";

const PATHS: Record<Suit, string> = {
  spade: SPADE_PATH,
  heart: "M50 100 C20 76 4 58 4 36 C4 20 16 8 30 8 C40 8 47 14 50 22 C53 14 60 8 70 8 C84 8 96 20 96 36 C96 58 80 76 50 100 Z",
  diamond: "M50 4 L92 55 L50 106 L8 55 Z",
  club:
    "M50 6 C64 6 72 18 70 30 C68 38 64 42 62 44 C68 40 74 38 80 38 C92 38 98 50 98 60 C98 74 88 82 76 82 C66 82 58 76 54 70 C55 84 60 96 68 106 L32 106 C40 96 45 84 46 70 C42 76 34 82 24 82 C12 82 2 74 2 60 C2 50 8 38 20 38 C26 38 32 40 38 44 C36 42 32 38 30 30 C28 18 36 6 50 6 Z",
};

export function SuitIcon({ suit, className = "", title }: { suit: Suit; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 110" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <path d={PATHS[suit]} fill="currentColor" />
    </svg>
  );
}

/** Rosace Art déco réutilisable (motif « La Dame »). */
export function Rosette({ className = "" }: { className?: string }) {
  const petals = Array.from({ length: 16 });
  return (
    <svg viewBox="-50 -50 100 100" className={className} aria-hidden>
      <g fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle r="46" />
        <circle r="40" />
        <circle r="12" />
        {petals.map((_, i) => (
          <path key={i} d="M0 -12 C6 -24 4 -34 0 -40 C-4 -34 -6 -24 0 -12 Z" transform={`rotate(${(i * 360) / 16})`} />
        ))}
      </g>
    </svg>
  );
}

/** Le Gentleman de Pique — silhouette simplifiée originale (tête pique, haut-de-forme). */
export function Gentleman({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 260" className={className} role="img" aria-label="Le Gentleman de Pique, mascotte de la maison">
      <rect x="34" y="4" width="52" height="40" rx="3" fill="#0a0a0a" />
      <rect x="34" y="32" width="52" height="7" fill="#142B20" />
      <rect x="22" y="42" width="76" height="6" rx="3" fill="#0a0a0a" />
      <g transform="translate(22 46) scale(.76 .62)">
        <path d={SPADE_PATH} fill="#0a0a0a" />
      </g>
      <ellipse cx="50" cy="78" rx="5" ry="2.4" fill="#C5A059" />
      <ellipse cx="70" cy="78" rx="5" ry="2.4" fill="#C5A059" />
      <path d="M24 118 L96 118 L104 210 L86 214 L80 160 L74 250 L62 250 L60 176 L58 250 L46 250 L40 160 L34 214 L16 210 Z" fill="#0a0a0a" />
      <path d="M48 118 L60 150 L72 118 Z" fill="#142B20" />
      <path d="M55 120 L60 132 L65 120 Z" fill="#F2EEE5" />
      <circle cx="60" cy="158" r="2" fill="#C5A059" />
      <circle cx="60" cy="168" r="2" fill="#C5A059" />
      <rect x="98" y="150" width="4" height="96" rx="2" fill="#C5A059" />
      <circle cx="100" cy="150" r="5" fill="#C5A059" />
    </svg>
  );
}
