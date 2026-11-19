/** Illustration botanique au trait (feuillage générique, dessin original). Purement décorative. */
export function BotanicalLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 600" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
      <path d="M200 600 C196 470 204 360 186 220 C176 150 190 80 214 10" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 520 - i * 70, s = 1 - i * 0.09, d = i % 2 ? 1 : -1;
        return (
          <g key={i} transform={`translate(${196 + i * 1.5} ${y}) scale(${d * s} ${s})`}>
            <path d="M0 0 C40 -30 110 -40 160 -20 C110 -6 50 0 0 0 Z" />
            <path d="M0 0 C50 -18 100 -22 150 -20" opacity=".6" />
            {[30, 60, 90, 120].map((x) => <path key={x} d={`M${x} ${-x * 0.14} l12 -12`} opacity=".45" />)}
          </g>
        );
      })}
    </svg>
  );
}
