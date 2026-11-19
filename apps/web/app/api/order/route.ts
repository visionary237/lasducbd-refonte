import { NextResponse } from "next/server";
import { validateOrder } from "@/lib/validation";
import { findById } from "@/lib/catalog/products";
import { STORES } from "@/lib/stores";
import { forwardEvent } from "@/lib/server/forward";

/**
 * Prise de commande (prototype) : validation + recalcul serveur + transmission à l'orchestrateur.
 * AUCUN paiement n'est encaissé : l'intégration d'un prestataire de paiement acceptant le CBD
 * est à brancher ici (création de session de paiement puis redirection). Cf. docs/COMMERCE.md.
 */
export async function POST(req: Request) {
  const v = validateOrder(await req.json().catch(() => ({})), findById, STORES.map((s) => s.slug));
  if (!v.ok) return NextResponse.json({ error: v.error }, { status: 400 });
  const ref = `LADC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  await forwardEvent("order.created", { ref, ...v.data }).catch(() => null);
  return NextResponse.json({ ref, totals: v.data.totals, mode: v.data.mode, paymentRequired: v.data.mode === "delivery" });
}
