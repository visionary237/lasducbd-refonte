import { SuitIcon } from "../Suits";

/** Aperçu de la carte de fidélité digitale (format Wallet ≈ 1,58:1). Données fictives clairement indiquées. */
export default function WalletCard({ tier = "Dame", name = "Prénom N.", points = 320, className = "" }: { tier?: string; name?: string; points?: number; className?: string }) {
  return (
    <div className={`gold-frame texture-grain relative aspect-[1.586/1] w-full max-w-md overflow-hidden bg-gradient-to-br from-vert-3 via-vert to-charbon p-6 shadow-[0_40px_80px_-30px_rgba(0,0,0,.8)] ${className}`} role="img" aria-label={`Exemple de carte de fidélité, palier ${tier}`}>
      <SuitIcon suit="spade" className="absolute -right-10 -top-6 h-56 w-56 text-or/10" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div><p className="t-label text-or-2">L'As du CBD</p><p className="t-display mt-1 text-3xl">Carte {tier}</p></div>
          <SuitIcon suit="spade" className="h-8 w-8 text-or" />
        </div>
        <div className="flex items-end justify-between">
          <div><p className="text-xs text-ivoire/70">Membre</p><p className="font-semibold">{name}</p></div>
          <div className="text-right"><p className="text-xs text-ivoire/70">Points</p><p className="t-num text-3xl text-or-2">{points}</p></div>
          <div className="grid h-16 w-16 grid-cols-5 gap-0.5 rounded-md bg-ivoire p-1.5" aria-hidden>
            {Array.from({ length: 25 }).map((_, i) => <span key={i} className={([0,1,2,4,5,6,10,12,14,18,20,22,23,24,8,16].includes(i)) ? "bg-charbon" : ""} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
