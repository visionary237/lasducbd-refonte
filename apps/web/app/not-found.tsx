import Link from "next/link";
import { SuitIcon } from "@/components/Suits";
export default function NotFound() {
  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 pt-24 text-center">
      <SuitIcon suit="spade" className="h-16 w-16 text-or" />
      <h1 className="t-display mt-6 text-6xl">Carte introuvable.</h1>
      <p className="mt-4 text-ivoire/75">Cette page n'existe pas ou n'est plus disponible.</p>
      <Link href="/" className="mt-8 rounded-full bg-or px-7 py-3 font-bold text-charbon">Retour à l'accueil</Link>
    </section>
  );
}
