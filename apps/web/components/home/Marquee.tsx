import { SuitIcon } from "../Suits";
const ITEMS = ["THC ≤ 0,3 %", "Bulletins d'analyse", "Conseil en boutique", "Vente réservée aux majeurs", "Expédition sous enveloppe neutre", "Sélection botanique"];
/** Bandeau défilant (culture urbaine). Contenu dupliqué masqué aux lecteurs d'écran. */
export default function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((t, i) => (
        <li key={t} className="flex items-center gap-8 px-8 t-label text-sm text-ivoire/85">
          {t}<SuitIcon suit={(["spade", "heart", "diamond", "club"] as const)[i % 4]} className="h-3 w-3 text-or" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden border-y border-or/25 bg-vert py-5">
      <div className="marquee">{row(false)}{row(true)}</div>
    </div>
  );
}
