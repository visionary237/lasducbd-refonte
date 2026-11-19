import { SuitIcon } from "./Suits";
export default function Footer() {
  return (
    <footer className="border-t border-or/20 px-6 py-16 md:px-14">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1fr_2fr]">
        <div className="flex items-center gap-3">
          <SuitIcon suit="spade" className="h-10 w-10 text-or" />
          <div><p className="t-caps">L'As du CBD</p><p className="text-xs text-ivoire/60">Refonte conceptuelle · DOERZ · 2026</p></div>
        </div>
        <div className="space-y-3 text-sm leading-relaxed text-ivoire/70">
          <p><strong className="text-ivoire">Concept indépendant non commandité.</strong> Ce prototype a été réalisé par DOERZ à titre d'étude de cas et de présentation privée aux fondateurs. Il n'est ni validé ni commandé par L'As du CBD.</p>
          <p>Démonstration éditoriale : aucune vente, aucun paiement, aucune promotion. Les produits réglementés ne sont pas présentés.</p>
          <p>Le logo et la palette fournis restent la propriété de leurs détenteurs.</p>
        </div>
      </div>
    </footer>
  );
}
