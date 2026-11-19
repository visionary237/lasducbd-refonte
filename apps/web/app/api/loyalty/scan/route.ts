import { NextResponse } from "next/server";
/**
 * CONTRAT (non implémenté) — scan en caisse (QR / NFC) depuis le dashboard commerçant.
 * POST { serial, storeSlug, type: "visit" | "purchase", amountCents? } + Authorization: Bearer <jeton boutique>
 * → 200 { memberId, points, tier, nextTier } ; met à jour le pass Wallet (push) et le CRM.
 */
export async function POST() {
  return NextResponse.json({ error: "Programme de fidélité non encore activé" }, { status: 501 });
}
