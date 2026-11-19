import type { Metadata } from "next";
import Link from "next/link";
import { euros } from "@/lib/catalog";
import { SuitIcon } from "@/components/Suits";
export const metadata: Metadata = { title: "Merci", robots: { index: false } };
export default async function Merci({ searchParams }: { searchParams: Promise<{ ref?: string; mode?: string; total?: string }> }) {
  const { ref, mode, total } = await searchParams;
  return (
    <section className="mx-auto flex min-h-[80svh] max-w-2xl flex-col items-center justify-center px-6 pt-24 text-center">
      <SuitIcon suit="spade" className="h-14 w-14 text-or" />
      <h1 className="t-display mt-6 text-6xl">Merci.</h1>
      <p className="mt-4 text-lg text-ivoire/80">{mode === "pickup" ? "Votre réservation est enregistrée. La boutique vous confirme la mise de côté par e-mail." : "Votre commande est enregistrée. Vous recevrez un e-mail de confirmation."}</p>
      {ref && <p className="mt-6 rounded-full border border-or/40 px-5 py-2 text-sm">Référence <strong className="text-or-2">{ref}</strong>{total ? ` · ${euros(Number(total))}` : ""}</p>}
      <Link href="/produits" className="mt-10 rounded-full bg-or px-7 py-3 font-bold text-charbon">Continuer mes découvertes</Link>
    </section>
  );
}
