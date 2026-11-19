import { NextResponse } from "next/server";
/**
 * CONTRAT (non implémenté) — émission d'une carte Wallet pour le membre authentifié.
 * GET /api/loyalty/pass/apple  → 302 vers le .pkpass signé (PassKit / certificat Apple Pass Type ID)
 * GET /api/loyalty/pass/google → 302 vers https://pay.google.com/gp/v/save/<jwt> (Google Wallet API, classe LoyaltyClass)
 * Voir docs/CRM_ARCHITECTURE.md §Wallet.
 */
export async function GET(_: Request, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  if (!["apple", "google"].includes(platform)) return NextResponse.json({ error: "Plateforme inconnue" }, { status: 404 });
  return NextResponse.json({ error: "Programme de fidélité non encore activé", platform }, { status: 501 });
}
